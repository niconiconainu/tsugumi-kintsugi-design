import type {
  DamageSeverity,
  DamageType,
  Material,
} from "@/constants/artifact/damage";
import { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import {
  createRandomFromString,
  pickOne,
  randomInt,
  type RandomFn,
} from "@/utils/seeded-random";

/**
 * Mock 用の器カタログ。Vision モデルが返しそうな objectType / 素材 / 色の組を表で持つ。
 * 同じ画像なら常に同じ結果になるよう、選択は画像のダイジェストから作った乱数で行う。
 */
const OBJECT_CATALOG: readonly {
  objectType: string;
  material: Material;
  dominantColors: string[];
  visualMotifs: string[];
}[] = [
  {
    objectType: "ceramic_bowl",
    material: "ceramic",
    dominantColors: ["off-white", "indigo"],
    visualMotifs: ["藍の染付", "手描きの草文"],
  },
  {
    objectType: "porcelain_teacup",
    material: "porcelain",
    dominantColors: ["white", "blue"],
    visualMotifs: ["青花の唐草", "縁の呉須線"],
  },
  {
    objectType: "stoneware_plate",
    material: "stoneware",
    dominantColors: ["ash-gray", "brown"],
    visualMotifs: ["灰釉の流れ", "土の粗い肌"],
  },
  {
    objectType: "glass_tumbler",
    material: "glass",
    dominantColors: ["clear", "pale-green"],
    visualMotifs: ["気泡の揺らぎ"],
  },
  {
    objectType: "lacquer_bowl",
    material: "lacquerware",
    dominantColors: ["vermilion", "black"],
    visualMotifs: ["朱漆の艶", "縁の摺り"],
  },
];

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

const REPAIR_NOTE_POOL: Record<DamageType, string[]> = {
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
 * `hints` はユーザーが手で選んだ値（Vision 失敗時のフォールバック導線。設計書 6.3）。
 */
export const buildMockAnalysis = (params: {
  imageDigest: string;
  hints?: { damageType?: DamageType; material?: Material };
  source: "vision_model" | "fallback";
}): DamageAnalysis => {
  const random = createRandomFromString(params.imageDigest);
  const object = pickOne(random, OBJECT_CATALOG);

  const damageType = params.hints?.damageType ?? pickOne(random, DAMAGE_TYPE_POOL);
  const material = params.hints?.material ?? object.material;
  const severity = pickOne(random, SEVERITY_BY_DAMAGE[damageType]);
  const crackCount = buildCrackCount(random, damageType);
  const missingAreaRatio = buildMissingAreaRatio(random, damageType);

  // ユーザーが手入力した場合は信頼度を下げ、画面側で確認を促す。
  const confidence =
    params.source === "fallback" ? 0.4 : randomInt(random, 72, 93) / 100;

  return new DamageAnalysis(
    object.objectType,
    material,
    object.dominantColors,
    damageType,
    severity,
    crackCount,
    missingAreaRatio,
    object.visualMotifs,
    REPAIR_NOTE_POOL[damageType],
    confidence,
    params.source
  );
};
