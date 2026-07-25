import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type {
  DamageSeverity,
  DamageType,
  Material,
} from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";
import { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import {
  createRandomFromString,
  pickOne,
  randomInt,
  type RandomFn,
} from "@/utils/seeded-random";

/**
 * 素材ごとの見た目カタログ。器の種類と素材はユーザーの申告値で確定するので、
 * Mock が補うのは「Vision なら読み取れたはずの色と装飾」だけになる。
 */
const APPEARANCE_BY_MATERIAL: Record<
  Material,
  { dominantColors: string[]; visualMotifs: Record<Locale, string[]> }
> = {
  ceramic: {
    dominantColors: ["off-white", "indigo"],
    visualMotifs: {
      ja: ["藍の染付", "手描きの草文"],
      en: ["indigo underglaze", "hand-painted grass motif"],
    },
  },
  porcelain: {
    dominantColors: ["white", "blue"],
    visualMotifs: {
      ja: ["青花の唐草", "縁の呉須線"],
      en: ["blue-and-white arabesque", "cobalt rim line"],
    },
  },
  stoneware: {
    dominantColors: ["ash-gray", "brown"],
    visualMotifs: {
      ja: ["灰釉の流れ", "土の粗い肌"],
      en: ["ash glaze runs", "coarse clay surface"],
    },
  },
  glass: {
    dominantColors: ["clear", "pale-green"],
    visualMotifs: { ja: ["気泡の揺らぎ"], en: ["drifting air bubbles"] },
  },
  lacquerware: {
    dominantColors: ["vermilion", "black"],
    visualMotifs: {
      ja: ["朱漆の艶", "縁の摺り"],
      en: ["vermilion lacquer sheen", "worn rim"],
    },
  },
  unknown: {
    dominantColors: ["neutral"],
    visualMotifs: { ja: ["無地の釉"], en: ["a plain glazed surface"] },
  },
};

const DAMAGE_TYPE_POOL: readonly DamageType[] = [
  "chip",
  "crack",
  "crack_and_chip",
  "break",
  "missing_piece",
];

const SEVERITY_BY_DAMAGE: Record<DamageType, DamageSeverity[]> = {
  chip: ["light", "light", "medium"],
  crack: ["light", "medium"],
  crack_and_chip: ["medium", "medium", "heavy"],
  break: ["medium", "heavy"],
  missing_piece: ["medium", "heavy"],
};

const REPAIR_NOTE_POOL: Record<Locale, Record<DamageType, string[]>> = {
  ja: {
    chip: ["欠け際の面取りが必要", "縁の高さを揃える調整が要る"],
    crack: ["ひびの終端を止める処置が必要", "内側まで貫通しているか要確認"],
    crack_and_chip: [
      "曲面のため位置合わせに注意",
      "ひびと欠けで工程を分ける必要がある",
    ],
    break: ["破片の反りを戻す工程が必要", "接合面の清掃に時間がかかる"],
    missing_piece: [
      "欠損部は錆漆で充填してから継ぐ",
      "元の形状の推定に依頼者の記憶が要る",
    ],
  },
  en: {
    chip: [
      "The chipped edge will need chamfering",
      "The rim height has to be levelled back",
    ],
    crack: [
      "The end of the crack must be arrested first",
      "Needs checking whether the crack runs through to the inside",
    ],
    crack_and_chip: [
      "Alignment needs care because the surface is curved",
      "The crack and the chip call for separate stages of work",
    ],
    break: [
      "The fragments must be eased back to shape",
      "Cleaning the joining faces will take time",
    ],
    missing_piece: [
      "The gap has to be filled with sabi-urushi before joining",
      "Reconstructing the original shape will rely on your memory of it",
    ],
  },
};

const buildMissingAreaRatio = (
  random: RandomFn,
  damageType: DamageType
): number => {
  if (damageType === "missing_piece") return randomInt(random, 3, 9) / 100;
  if (damageType === "crack_and_chip" || damageType === "chip") {
    return randomInt(random, 0, 4) / 100;
  }
  return 0;
};

const buildCrackCount = (random: RandomFn, damageType: DamageType): number => {
  if (damageType === "crack" || damageType === "crack_and_chip") {
    return randomInt(random, 1, 3);
  }
  if (damageType === "break") return randomInt(random, 1, 2);
  return 0;
};

/**
 * 画像のダイジェストから、それらしい解析結果を組み立てる。
 * 器の種類と素材はユーザーの申告値をそのまま採用し、Mock は破損の読み取りだけを担う。
 * `declared.damageType` は Vision 失敗時の手入力（設計書 6.3 のフォールバック導線）。
 */
export const buildMockAnalysis = (params: {
  imageDigest: string;
  locale: Locale;
  declared: {
    artifactType: ArtifactType;
    material: Material;
    damageType?: DamageType;
  };
  source: "vision_model" | "fallback";
}): DamageAnalysis => {
  const random = createRandomFromString(params.imageDigest);
  const { artifactType, material } = params.declared;
  const appearance = APPEARANCE_BY_MATERIAL[material];

  const damageType =
    params.declared.damageType ?? pickOne(random, DAMAGE_TYPE_POOL);
  const severity = pickOne(random, SEVERITY_BY_DAMAGE[damageType]);
  const crackCount = buildCrackCount(random, damageType);
  const missingAreaRatio = buildMissingAreaRatio(random, damageType);

  // ユーザーが手入力した場合は信頼度を下げ、画面側で確認を促す。
  const confidence =
    params.source === "fallback" ? 0.4 : randomInt(random, 72, 93) / 100;

  return new DamageAnalysis(
    artifactType,
    material,
    appearance.dominantColors,
    damageType,
    severity,
    crackCount,
    missingAreaRatio,
    appearance.visualMotifs[params.locale],
    REPAIR_NOTE_POOL[params.locale][damageType],
    confidence,
    params.source,
    // Mock では写真を見ていないので、素材から引いた一般的な記述で埋める。
    new RestorationBrief(
      `visible cracks and chips on the ${artifactType.replace("_", " ")}`,
      appearance.dominantColors.join(", "),
      "centered on a plain background"
    )
  );
};
