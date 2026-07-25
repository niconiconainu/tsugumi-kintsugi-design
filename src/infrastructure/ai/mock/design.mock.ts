import type { DesignTaste } from "@/constants/design/taste";
import type { Locale } from "@/constants/i18n/locale";
import type { DesignDraft } from "@/domain/entity/design/design-draft";
import { createRandomFromString } from "@/utils/seeded-random";

/** 言語ごとの原稿。翻訳ではなく、それぞれの言語で読ませる文章として書く。 */
interface DesignCopy {
  title: string;
  concept: string;
  motifKeywords: string[];
  /** 提案理由の骨子。`{context}` にストーリー要約が入る。 */
  rationaleTemplate: string;
}

/** デザインテンプレート。GMI 失敗時のフォールバックも同じ表から返す（設計書 6.3）。 */
interface DesignTemplate {
  lineStyle: DesignDraft["lineStyle"];
  metalColor: DesignDraft["metalColor"];
  complexity: DesignDraft["complexity"];
  /** 相性の良いテイスト */
  tastes: readonly DesignTaste[];
  /** ストーリー中にこの語があれば加点する（言語ごとに別の語彙で見る） */
  storyKeywords: Record<Locale, readonly string[]>;
  copy: Record<Locale, DesignCopy>;
}

const DESIGN_TEMPLATES: readonly DesignTemplate[] = [
  {
    lineStyle: "quiet",
    metalColor: "gold",
    complexity: "simple",
    tastes: ["traditional", "minimal"],
    storyKeywords: {
      ja: ["祖母", "祖父", "母", "父", "受け継", "形見", "家族"],
      en: ["grandmother", "grandfather", "mother", "father", "inherit", "family"],
    },
    copy: {
      ja: {
        title: "静かな継承",
        concept:
          "割れた線をそのまま辿り、細く均一な金線で結び直す案。器の元の輪郭を邪魔せず、直したこと自体を主張しない仕上げ。",
        motifKeywords: ["継承", "静けさ", "余白"],
        rationaleTemplate:
          "{context}。受け継いだ器そのものの姿を残すため、線を足さず破損線だけを金で辿ります。",
      },
      en: {
        title: "Quiet Inheritance",
        concept:
          "Follows the break exactly as it fell, rejoining it with a thin, even line of gold. Nothing is added to the vessel's outline, and the repair never announces itself.",
        motifKeywords: ["inheritance", "stillness", "negative space"],
        rationaleTemplate:
          "{context}. To keep the inherited piece as it was, we add no lines of our own and gild only the break itself.",
      },
    },
  },
  {
    lineStyle: "branching",
    metalColor: "red_gold",
    complexity: "elaborate",
    tastes: ["botanical", "traditional"],
    storyKeywords: {
      ja: ["桜", "花", "春", "庭", "木", "枝"],
      en: ["cherry", "blossom", "flower", "spring", "garden", "tree", "branch"],
    },
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
    tastes: ["bold"],
    storyKeywords: {
      ja: ["大胆", "派手", "力強", "変化", "新しい"],
      en: ["bold", "striking", "strong", "change", "new"],
    },
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
    tastes: ["minimal"],
    storyKeywords: {
      ja: ["静か", "シンプル", "毎日", "日常", "普段"],
      en: ["quiet", "simple", "every day", "daily", "everyday"],
    },
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
    tastes: ["botanical", "minimal"],
    storyKeywords: {
      ja: ["海", "川", "水", "旅", "波", "雨"],
      en: ["sea", "river", "water", "travel", "wave", "rain"],
    },
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
    tastes: ["bold", "traditional"],
    storyKeywords: {
      ja: ["山", "旅行", "登", "景色", "思い出"],
      en: ["mountain", "trip", "climb", "view", "memory"],
    },
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
    tastes: ["botanical"],
    storyKeywords: {
      ja: ["植物", "庭", "草", "葉", "育", "緑"],
      en: ["plant", "garden", "grass", "leaf", "grow", "green"],
    },
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
    tastes: ["minimal", "bold"],
    storyKeywords: {
      ja: ["夜", "星", "空", "誕生", "記念"],
      en: ["night", "star", "sky", "birth", "anniversary"],
    },
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

/** ストーリーの要点を 1 文にまとめる（Mock なので語の抽出だけ）。 */
const buildContext = (
  story: string,
  tastes: readonly DesignTaste[],
  locale: Locale
): string => {
  const trimmed = story.trim();
  if (trimmed.length > 0) {
    const limit = locale === "ja" ? 40 : 80;
    const head =
      trimmed.length > limit ? `${trimmed.slice(0, limit)}…` : trimmed;
    return locale === "ja"
      ? `「${head}」というお話をふまえました`
      : `We worked from what you told us — “${head}”`;
  }
  if (tastes.length > 0) {
    return locale === "ja"
      ? "ご指定のテイストをふまえました"
      : "We worked from the style you chose";
  }
  return locale === "ja"
    ? "器の破損の形をそのまま手がかりにしました"
    : "We took the shape of the break itself as the starting point";
};

const scoreTemplate = (
  template: DesignTemplate,
  story: string,
  tastes: readonly DesignTaste[],
  locale: Locale
): number => {
  const tasteHits = template.tastes.filter((taste) =>
    tastes.includes(taste)
  ).length;
  const haystack = story.toLowerCase();
  const keywordHits = template.storyKeywords[locale].filter((keyword) =>
    haystack.includes(keyword.toLowerCase())
  ).length;
  return tasteHits * 2 + keywordHits * 3;
};

/**
 * ストーリーと希望テイストから 3 案を選ぶ。
 * 同点は seed 由来の乱数で崩し、`lineStyle` が重複しないよう散らす。
 */
export const buildMockDesignDrafts = (params: {
  story: string;
  tastes: readonly DesignTaste[];
  locale: Locale;
  seed: string;
}): DesignDraft[] => {
  const random = createRandomFromString(params.seed);
  const context = buildContext(params.story, params.tastes, params.locale);

  const ranked = DESIGN_TEMPLATES.map((template) => ({
    template,
    score:
      scoreTemplate(template, params.story, params.tastes, params.locale) +
      random(),
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
