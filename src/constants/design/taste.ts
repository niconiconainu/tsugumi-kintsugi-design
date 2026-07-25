/** 希望テイスト（設計書 2.1）。デザイン案の方向づけと工房の相性判定に使う。 */
export const DESIGN_TASTES = [
  "traditional",
  "minimal",
  "bold",
  "botanical",
] as const;

export type DesignTaste = (typeof DESIGN_TASTES)[number];

export const DESIGN_TASTE_LABEL: Record<DesignTaste, string> = {
  traditional: "伝統的",
  minimal: "ミニマル",
  bold: "大胆",
  botanical: "植物・風景モチーフ",
};

export const DESIGN_TASTE_DESCRIPTION: Record<DesignTaste, string> = {
  traditional: "本漆と金粉の正統な金継ぎ。器の佇まいを崩さない。",
  minimal: "線を最小限に留め、余白と静けさを残す。",
  bold: "破損線を景色として活かし、意匠として見せる。",
  botanical: "枝・葉・水流など、自然のモチーフへ線を寄せる。",
};

/** 金属表現。本漆金継ぎ以外の選択肢も明示する（設計書 8「文化的配慮」）。 */
export const METAL_COLORS = ["gold", "silver", "red_gold"] as const;

export type MetalColor = (typeof METAL_COLORS)[number];

export const METAL_COLOR_LABEL: Record<MetalColor, string> = {
  gold: "金継ぎ（丸粉）",
  silver: "銀継ぎ",
  red_gold: "紅金継ぎ（弁柄漆＋金）",
};

export const METAL_COLOR_HEX: Record<MetalColor, string> = {
  gold: "#d4a537",
  silver: "#b9bdc4",
  red_gold: "#c2703c",
};

/** 継ぎ線の描き方。プレビュー SVG の生成パラメータでもある。 */
export const LINE_STYLES = ["quiet", "flowing", "branching", "dramatic"] as const;

export type LineStyle = (typeof LINE_STYLES)[number];

export const LINE_STYLE_LABEL: Record<LineStyle, string> = {
  quiet: "静かな細線",
  flowing: "流れる曲線",
  branching: "枝分かれ",
  dramatic: "大胆な太線",
};

/**
 * デザインの手間。修理料金・修理日数の「デザイン加算」を決める（設計書 5.3）。
 * 種類ごとに処理が変わるわけではないので表で持つ。
 */
export const DESIGN_COMPLEXITIES = ["simple", "standard", "elaborate"] as const;

export type DesignComplexity = (typeof DESIGN_COMPLEXITIES)[number];

export const DESIGN_COMPLEXITY_LABEL: Record<DesignComplexity, string> = {
  simple: "簡素",
  standard: "標準",
  elaborate: "手の込んだ意匠",
};

export const DESIGN_COMPLEXITY_SURCHARGE: Record<
  DesignComplexity,
  { fee: number; days: number }
> = {
  simple: { fee: 0, days: 0 },
  standard: { fee: 2500, days: 2 },
  elaborate: { fee: 6000, days: 5 },
};
