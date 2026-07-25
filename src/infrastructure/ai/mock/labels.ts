import type { Material } from "@/constants/artifact/damage";
import type {
  DesignComplexity,
  DesignTaste,
  MetalColor,
} from "@/constants/design/taste";
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

export const TASTE_WORD: Record<Locale, Record<DesignTaste, string>> = {
  ja: {
    traditional: "伝統的",
    minimal: "ミニマル",
    bold: "大胆",
    botanical: "植物・風景モチーフ",
  },
  en: {
    traditional: "traditional",
    minimal: "minimal",
    bold: "bold",
    botanical: "botanical",
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
