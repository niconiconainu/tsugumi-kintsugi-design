import type { DesignTaste } from "@/constants/design/taste";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignDraft } from "@/domain/entity/design/design-draft";
import { createRandomFromString } from "@/utils/seeded-random";

/** デザインテンプレート。GMI 失敗時のフォールバックも同じ表から返す（設計書 6.3）。 */
interface DesignTemplate extends Omit<DesignDraft, "id" | "rationale"> {
  /** 相性の良いテイスト */
  tastes: readonly DesignTaste[];
  /** ストーリー中にこの語があれば加点する */
  storyKeywords: readonly string[];
  /** 提案理由の骨子。ストーリー要約を差し込んで文にする。 */
  rationaleTemplate: string;
}

const DESIGN_TEMPLATES: readonly DesignTemplate[] = [
  {
    title: "静かな継承",
    concept:
      "割れた線をそのまま辿り、細く均一な金線で結び直す案。器の元の輪郭を邪魔せず、直したこと自体を主張しない仕上げ。",
    lineStyle: "quiet",
    metalColor: "gold",
    complexity: "simple",
    motifKeywords: ["継承", "静けさ", "余白"],
    tastes: ["traditional", "minimal"],
    storyKeywords: ["祖母", "祖父", "母", "父", "family", "受け継", "形見", "家族"],
    rationaleTemplate:
      "{context}。受け継いだ器そのものの姿を残すため、線を足さず破損線だけを金で辿ります。",
  },
  {
    title: "桜の記憶",
    concept:
      "破損線を枝に見立て、分岐点に細かな金の点を散らして花のように置く案。季節の記憶を器の上に留める。",
    lineStyle: "branching",
    metalColor: "red_gold",
    complexity: "elaborate",
    motifKeywords: ["桜", "枝", "春"],
    tastes: ["botanical", "traditional"],
    storyKeywords: ["桜", "花", "春", "庭", "木", "枝"],
    rationaleTemplate:
      "{context}。ひびの分岐をそのまま枝として使い、弁柄漆の下地で金をやわらげます。",
  },
  {
    title: "大胆な景色",
    concept:
      "継ぎ目を隠さず、太い金線と大きな面で見せる案。器を「直したもの」ではなく「変わったもの」として提示する。",
    lineStyle: "dramatic",
    metalColor: "gold",
    complexity: "elaborate",
    motifKeywords: ["景色", "対比", "大胆"],
    tastes: ["bold"],
    storyKeywords: ["大胆", "派手", "力強", "変化", "新しい"],
    rationaleTemplate:
      "{context}。破損の大きさを弱点ではなく見どころとして扱い、面で金を置きます。",
  },
  {
    title: "余白の線",
    concept:
      "継ぐ範囲を最小限に絞り、銀で低い光沢に留める案。器の余白と静けさを損なわない。",
    lineStyle: "quiet",
    metalColor: "silver",
    complexity: "simple",
    motifKeywords: ["余白", "静寂", "簡素"],
    tastes: ["minimal"],
    storyKeywords: ["静か", "シンプル", "毎日", "日常", "普段"],
    rationaleTemplate:
      "{context}。日常で使い続けることを前提に、光りすぎない銀で控えめに留めます。",
  },
  {
    title: "水脈",
    concept:
      "ひびを水の流れに読み替え、幅を変えながら一本の線として通す案。線の太さの変化で流速を表す。",
    lineStyle: "flowing",
    metalColor: "silver",
    complexity: "standard",
    motifKeywords: ["水", "流れ", "旅"],
    tastes: ["botanical", "minimal"],
    storyKeywords: ["海", "川", "水", "旅", "波", "雨"],
    rationaleTemplate:
      "{context}。器を横切る線を水脈として扱い、始点と終点に向かって細めます。",
  },
  {
    title: "金の稜線",
    concept:
      "破損線を稜線に見立て、片側だけ金を厚く盛って陰影を作る案。光の当たり方で表情が変わる。",
    lineStyle: "dramatic",
    metalColor: "red_gold",
    complexity: "standard",
    motifKeywords: ["山", "稜線", "陰影"],
    tastes: ["bold", "traditional"],
    storyKeywords: ["山", "旅行", "登", "景色", "思い出"],
    rationaleTemplate:
      "{context}。線の片側にだけ金を寄せ、器を回したときに景色が変わるようにします。",
  },
  {
    title: "枝ぶり",
    concept:
      "主となる継ぎ線から細い枝を伸ばし、器の余白へ抜けさせる案。植物の伸び方を借りる。",
    lineStyle: "branching",
    metalColor: "gold",
    complexity: "standard",
    motifKeywords: ["植物", "枝", "生長"],
    tastes: ["botanical"],
    storyKeywords: ["植物", "庭", "草", "葉", "育", "緑"],
    rationaleTemplate:
      "{context}。破損の外へ枝を一本だけ伸ばし、修復の跡を生長の線に変えます。",
  },
  {
    title: "星宿り",
    concept:
      "欠けの充填部を金の面として残し、周囲に小さな点を散らす案。夜空の粒のような見え方になる。",
    lineStyle: "flowing",
    metalColor: "gold",
    complexity: "standard",
    motifKeywords: ["夜", "星", "点描"],
    tastes: ["minimal", "bold"],
    storyKeywords: ["夜", "星", "空", "誕生", "記念"],
    rationaleTemplate:
      "{context}。欠損の充填面を隠さず金の島として見せ、周囲に点を散らします。",
  },
];

/** ストーリーの要点を 1 文にまとめる（Mock なので語の抽出だけ）。 */
const buildContext = (story: string, tastes: readonly DesignTaste[]): string => {
  const trimmed = story.trim();
  if (trimmed.length > 0) {
    const head = trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
    return `「${head}」というお話をふまえました`;
  }
  if (tastes.length > 0) return "ご指定のテイストをふまえました";
  return "器の破損の形をそのまま手がかりにしました";
};

const scoreTemplate = (
  template: DesignTemplate,
  story: string,
  tastes: readonly DesignTaste[]
): number => {
  const tasteHits = template.tastes.filter((taste) =>
    tastes.includes(taste)
  ).length;
  const keywordHits = template.storyKeywords.filter((keyword) =>
    story.includes(keyword)
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
  analysis: DamageAnalysis;
  seed: string;
}): DesignDraft[] => {
  const random = createRandomFromString(params.seed);
  const context = buildContext(params.story, params.tastes);

  const ranked = DESIGN_TEMPLATES.map((template) => ({
    template,
    score: scoreTemplate(template, params.story, params.tastes) + random(),
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

  return selected.map((template, index) => ({
    id: `design-${index + 1}`,
    title: template.title,
    concept: template.concept,
    lineStyle: template.lineStyle,
    metalColor: template.metalColor,
    complexity: template.complexity,
    motifKeywords: template.motifKeywords,
    rationale: template.rationaleTemplate.replace("{context}", context),
  }));
};
