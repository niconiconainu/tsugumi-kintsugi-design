import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { DamageType, Material } from "@/constants/artifact/damage";
import type {
  DesignComplexity,
  MetalColor,
} from "@/constants/design/expression";
import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";

/**
 * Mock の AI が文章を書くときに使う語彙。
 *
 * `messages/*.json`（画面の文言）とは別に持つ。画面のラベルは UI の都合で変わるのに対し、
 * ここは「モデルが返した文章の中の語」であり、実 API に差し替えた瞬間に丸ごと不要になるため。
 */
export const MATERIAL_WORD: Record<Locale, Record<Material, string>> = {
  ja: {
    ceramic: "陶器",
    porcelain: "磁器",
    glass: "ガラス",
    lacquerware: "漆器",
    stoneware: "炻器",
    unknown: "素材不明の器",
  },
  en: {
    ceramic: "earthenware",
    porcelain: "porcelain",
    glass: "glass",
    lacquerware: "lacquerware",
    stoneware: "stoneware",
    unknown: "pieces of unidentified material",
  },
};

export const ARTIFACT_TYPE_WORD: Record<Locale, Record<ArtifactType, string>> = {
  ja: {
    rice_bowl: "茶碗",
    bowl: "鉢",
    small_bowl: "小鉢",
    plate: "皿",
    cup: "湯呑",
    mug: "マグカップ",
    teapot: "急須",
    pitcher: "水差し",
    sake_vessel: "徳利",
    vase: "花瓶",
    other: "器",
  },
  en: {
    rice_bowl: "rice bowl",
    bowl: "bowl",
    small_bowl: "small bowl",
    plate: "plate",
    cup: "cup",
    mug: "mug",
    teapot: "teapot",
    pitcher: "pitcher",
    sake_vessel: "sake vessel",
    vase: "vase",
    other: "piece",
  },
};

export const DAMAGE_WORD: Record<Locale, Record<DamageType, string>> = {
  ja: {
    chip: "欠け",
    crack: "ひび",
    crack_and_chip: "ひびと欠け",
    break: "割れ",
    missing_piece: "欠損",
  },
  en: {
    chip: "chip",
    crack: "crack",
    crack_and_chip: "crack and chip",
    break: "break",
    missing_piece: "missing piece",
  },
};

export const METAL_WORD: Record<Locale, Record<MetalColor, string>> = {
  ja: {
    gold: "金継ぎ（丸粉）",
    silver: "銀継ぎ",
    red_gold: "紅金継ぎ（弁柄漆＋金）",
  },
  en: {
    gold: "gold joinery",
    silver: "silver joinery",
    red_gold: "red-gold joinery (bengara lacquer under gold)",
  },
};

export const COMPLEXITY_WORD: Record<Locale, Record<DesignComplexity, string>> =
  {
    ja: { simple: "簡素", standard: "標準", elaborate: "手の込んだ意匠" },
    en: { simple: "simple", standard: "standard", elaborate: "elaborate" },
  };

export const PRIORITY_WORD: Record<Locale, Record<MatchPriority, string>> = {
  ja: { design: "デザイン相性", price: "価格", speed: "速さ" },
  en: { design: "design fit", price: "price", speed: "speed" },
};

/** 金額の表記。ja は「1,000円」、en は「¥1,000」。 */
export const money = (value: number, locale: Locale): string =>
  locale === "ja"
    ? `${value.toLocaleString("ja-JP")}円`
    : `¥${value.toLocaleString("en-US")}`;

/**
 * 「陶器の茶碗」のような、器を指す一続きの語。
 * 素材が不明のときは素材を言わない（「素材不明の器の茶碗」を避けるため）。
 */
export const artifactPhrase = (params: {
  objectType: ArtifactType;
  material: Material;
  locale: Locale;
}): string => {
  const { objectType, material, locale } = params;
  const artifact = ARTIFACT_TYPE_WORD[locale][objectType];
  if (material === "unknown") return artifact;
  return locale === "ja"
    ? `${MATERIAL_WORD.ja[material]}の${artifact}`
    : `${MATERIAL_WORD.en[material]} ${artifact}`;
};
