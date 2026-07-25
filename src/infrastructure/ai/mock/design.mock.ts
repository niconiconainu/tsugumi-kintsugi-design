import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { Material } from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignDraft } from "@/domain/entity/design/design-draft";
import {
  DAMAGE_WORD,
  artifactPhrase,
} from "@/infrastructure/ai/mock/labels";
import { createRandomFromString } from "@/utils/seeded-random";

/** 言語ごとの原稿。翻訳ではなく、それぞれの言語で読ませる文章として書く。 */
interface DesignCopy {
  title: string;
  concept: string;
  motifKeywords: string[];
  /** 提案理由の骨子。`{context}` に器と破損の要約が入る。 */
  rationaleTemplate: string;
}

/** デザインテンプレート。GMI 失敗時のフォールバックも同じ表から返す（設計書 6.3）。 */
interface DesignTemplate {
  lineStyle: DesignDraft["lineStyle"];
  metalColor: DesignDraft["metalColor"];
  complexity: DesignDraft["complexity"];
  /** 相性の良い素材 */
  materials: readonly Material[];
  /** 相性の良い器の種類 */
  artifactTypes: readonly ArtifactType[];
  copy: Record<Locale, DesignCopy>;
}

const DESIGN_TEMPLATES: readonly DesignTemplate[] = [
  {
    lineStyle: "quiet",
    metalColor: "gold",
    complexity: "simple",
    materials: ["porcelain", "ceramic"],
    artifactTypes: ["rice_bowl", "cup", "small_bowl"],
    copy: {
      ja: {
        title: "静かな継承",
        concept:
          "割れた線をそのまま辿り、細く均一な金線で結び直す案。器の元の輪郭を邪魔せず、直したこと自体を主張しない仕上げ。",
        motifKeywords: ["継承", "静けさ", "余白"],
        rationaleTemplate:
          "{context}。器そのものの姿を残すため、線を足さず破損線だけを金で辿ります。",
      },
      en: {
        title: "Quiet Inheritance",
        concept:
          "Follows the break exactly as it fell, rejoining it with a thin, even line of gold. Nothing is added to the vessel's outline, and the repair never announces itself.",
        motifKeywords: ["inheritance", "stillness", "negative space"],
        rationaleTemplate:
          "{context}. To keep the piece as it was, we add no lines of our own and gild only the break itself.",
      },
    },
  },
  {
    lineStyle: "branching",
    metalColor: "red_gold",
    complexity: "elaborate",
    materials: ["ceramic", "stoneware"],
    artifactTypes: ["plate", "bowl", "vase"],
    copy: {
      ja: {
        title: "桜の記憶",
        concept:
          "破損線を枝に見立て、分岐点に細かな金の点を散らして花のように置く案。季節の記憶を器の上に留める。",
        motifKeywords: ["桜", "枝", "春"],
        rationaleTemplate:
          "{context}。ひびの分岐をそのまま枝として使い、弁柄漆の下地で金をやわらげます。",
      },
      en: {
        title: "Memory of Blossoms",
        concept:
          "Reads the break as a branch, scattering fine points of gold at each fork so they read as blossom. A season is held on the surface of the vessel.",
        motifKeywords: ["blossom", "branch", "spring"],
        rationaleTemplate:
          "{context}. The forks in the crack become branches, and a bengara lacquer ground softens the gold above them.",
      },
    },
  },
  {
    lineStyle: "dramatic",
    metalColor: "gold",
    complexity: "elaborate",
    materials: ["stoneware", "ceramic"],
    artifactTypes: ["bowl", "plate", "vase"],
    copy: {
      ja: {
        title: "大胆な景色",
        concept:
          "継ぎ目を隠さず、太い金線と大きな面で見せる案。器を「直したもの」ではなく「変わったもの」として提示する。",
        motifKeywords: ["景色", "対比", "大胆"],
        rationaleTemplate:
          "{context}。破損の大きさを弱点ではなく見どころとして扱い、面で金を置きます。",
      },
      en: {
        title: "A Bolder Landscape",
        concept:
          "Makes no attempt to hide the seam, working in broad gold lines and open planes. The vessel is presented not as repaired but as changed.",
        motifKeywords: ["landscape", "contrast", "boldness"],
        rationaleTemplate:
          "{context}. The scale of the damage is treated as the thing worth looking at, so the gold is laid in planes rather than lines.",
      },
    },
  },
  {
    lineStyle: "quiet",
    metalColor: "silver",
    complexity: "simple",
    materials: ["porcelain", "glass"],
    artifactTypes: ["cup", "mug", "small_bowl", "plate"],
    copy: {
      ja: {
        title: "余白の線",
        concept:
          "継ぐ範囲を最小限に絞り、銀で低い光沢に留める案。器の余白と静けさを損なわない。",
        motifKeywords: ["余白", "静寂", "簡素"],
        rationaleTemplate:
          "{context}。日常で使い続けることを前提に、光りすぎない銀で控えめに留めます。",
      },
      en: {
        title: "A Line of Space",
        concept:
          "Keeps the joined area to the strict minimum and holds the finish to a low silver sheen, leaving the vessel's quiet and its empty space intact.",
        motifKeywords: ["negative space", "quiet", "restraint"],
        rationaleTemplate:
          "{context}. Since the piece is meant to stay in daily use, we keep to a silver that never catches too much light.",
      },
    },
  },
  {
    lineStyle: "flowing",
    metalColor: "silver",
    complexity: "standard",
    materials: ["glass", "porcelain"],
    artifactTypes: ["pitcher", "vase", "teapot", "cup"],
    copy: {
      ja: {
        title: "水脈",
        concept:
          "ひびを水の流れに読み替え、幅を変えながら一本の線として通す案。線の太さの変化で流速を表す。",
        motifKeywords: ["水", "流れ", "旅"],
        rationaleTemplate:
          "{context}。器を横切る線を水脈として扱い、始点と終点に向かって細めます。",
      },
      en: {
        title: "Watercourse",
        concept:
          "Reads the crack as moving water, carried through as a single line whose width shifts to suggest the speed of the current.",
        motifKeywords: ["water", "current", "journey"],
        rationaleTemplate:
          "{context}. The line crossing the vessel is treated as a watercourse, tapering towards both ends.",
      },
    },
  },
  {
    lineStyle: "dramatic",
    metalColor: "red_gold",
    complexity: "standard",
    materials: ["stoneware", "lacquerware"],
    artifactTypes: ["rice_bowl", "bowl", "sake_vessel"],
    copy: {
      ja: {
        title: "金の稜線",
        concept:
          "破損線を稜線に見立て、片側だけ金を厚く盛って陰影を作る案。光の当たり方で表情が変わる。",
        motifKeywords: ["山", "稜線", "陰影"],
        rationaleTemplate:
          "{context}。線の片側にだけ金を寄せ、器を回したときに景色が変わるようにします。",
      },
      en: {
        title: "The Gold Ridge",
        concept:
          "Treats the break as a ridgeline, building the gold up on one side only so that light and shadow give the piece a changing face.",
        motifKeywords: ["mountain", "ridge", "shadow"],
        rationaleTemplate:
          "{context}. The gold is weighted to one side of the line, so the view shifts as the vessel is turned.",
      },
    },
  },
  {
    lineStyle: "branching",
    metalColor: "gold",
    complexity: "standard",
    materials: ["ceramic", "porcelain"],
    artifactTypes: ["plate", "teapot", "vase"],
    copy: {
      ja: {
        title: "枝ぶり",
        concept:
          "主となる継ぎ線から細い枝を伸ばし、器の余白へ抜けさせる案。植物の伸び方を借りる。",
        motifKeywords: ["植物", "枝", "生長"],
        rationaleTemplate:
          "{context}。破損の外へ枝を一本だけ伸ばし、修復の跡を生長の線に変えます。",
      },
      en: {
        title: "Habit of Growth",
        concept:
          "Sends slender branches out from the main seam into the vessel's empty ground, borrowing the way a plant extends itself.",
        motifKeywords: ["plant", "branch", "growth"],
        rationaleTemplate:
          "{context}. A single branch is carried beyond the damage, turning the trace of repair into a line of growth.",
      },
    },
  },
  {
    lineStyle: "flowing",
    metalColor: "gold",
    complexity: "standard",
    materials: ["lacquerware", "ceramic"],
    artifactTypes: ["sake_vessel", "bowl", "mug"],
    copy: {
      ja: {
        title: "星宿り",
        concept:
          "欠けの充填部を金の面として残し、周囲に小さな点を散らす案。夜空の粒のような見え方になる。",
        motifKeywords: ["夜", "星", "点描"],
        rationaleTemplate:
          "{context}。欠損の充填面を隠さず金の島として見せ、周囲に点を散らします。",
      },
      en: {
        title: "Where Stars Settle",
        concept:
          "Leaves the filled area as an open plane of gold and scatters small points around it, so the surface reads like grains of a night sky.",
        motifKeywords: ["night", "stars", "stippling"],
        rationaleTemplate:
          "{context}. The filled loss is left visible as an island of gold, with points scattered around it.",
      },
    },
  },
];

/** 何を手がかりに案を立てたかを 1 文にまとめる。 */
const buildContext = (analysis: DamageAnalysis, locale: Locale): string => {
  const artifact = artifactPhrase({
    objectType: analysis.objectType,
    material: analysis.material,
    locale,
  });
  const damage = DAMAGE_WORD[locale][analysis.damageType];
  return locale === "ja"
    ? `${artifact}に生じた${damage}の形をそのまま手がかりにしました`
    : `We took the shape of the ${damage} in your ${artifact} as the starting point`;
};

/** 器の種類のほうが素材より仕上がりを左右するので、重みを厚くする。 */
const scoreTemplate = (
  template: DesignTemplate,
  analysis: DamageAnalysis
): number => {
  const materialHit = template.materials.includes(analysis.material) ? 1 : 0;
  const artifactHit = template.artifactTypes.includes(analysis.objectType)
    ? 1
    : 0;
  return materialHit * 2 + artifactHit * 3;
};

/**
 * 器の種類・素材・破損の状態から 3 案を選ぶ。
 * 同点は seed 由来の乱数で崩し、`lineStyle` が重複しないよう散らす。
 */
export const buildMockDesignDrafts = (params: {
  analysis: DamageAnalysis;
  locale: Locale;
  seed: string;
}): DesignDraft[] => {
  const random = createRandomFromString(params.seed);
  const context = buildContext(params.analysis, params.locale);

  const ranked = DESIGN_TEMPLATES.map((template) => ({
    template,
    score: scoreTemplate(template, params.analysis) + random(),
  })).sort((a, b) => b.score - a.score);

  const selected: DesignTemplate[] = [];
  const usedLineStyles = new Set<string>();
  for (const { template } of ranked) {
    if (selected.length >= 3) break;
    if (usedLineStyles.has(template.lineStyle)) continue;
    selected.push(template);
    usedLineStyles.add(template.lineStyle);
  }
  // lineStyle の種類が足りない場合はスコア順で埋める。
  for (const { template } of ranked) {
    if (selected.length >= 3) break;
    if (!selected.includes(template)) selected.push(template);
  }

  return selected.map((template, index) => {
    const copy = template.copy[params.locale];
    return {
      id: `design-${index + 1}`,
      title: copy.title,
      concept: copy.concept,
      lineStyle: template.lineStyle,
      metalColor: template.metalColor,
      complexity: template.complexity,
      motifKeywords: copy.motifKeywords,
      rationale: copy.rationaleTemplate.replace("{context}", context),
    };
  });
};
