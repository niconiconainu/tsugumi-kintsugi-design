/** 希望テイスト（設計書 2.1）。デザイン案の方向づけと工房の相性判定に使う。 */
export const DESIGN_TASTES = [
  "traditional",
  "minimal",
  "bold",
  "botanical",
] as const;

export type DesignTaste = (typeof DESIGN_TASTES)[number];



/** 金属表現。本漆金継ぎ以外の選択肢も明示する（設計書 8「文化的配慮」）。 */
export const METAL_COLORS = ["gold", "silver", "red_gold"] as const;

export type MetalColor = (typeof METAL_COLORS)[number];


export const METAL_COLOR_HEX: Record<MetalColor, string> = {
  gold: "#d4a537",
  silver: "#b9bdc4",
  red_gold: "#c2703c",
};

/** 継ぎ線の描き方。プレビュー SVG の生成パラメータでもある。 */
export const LINE_STYLES = ["quiet", "flowing", "branching", "dramatic"] as const;

export type LineStyle = (typeof LINE_STYLES)[number];


/**
 * デザインの手間。修理料金・修理日数の「デザイン加算」を決める（設計書 5.3）。
 * 種類ごとに処理が変わるわけではないので表で持つ。
 */
export const DESIGN_COMPLEXITIES = ["simple", "standard", "elaborate"] as const;

export type DesignComplexity = (typeof DESIGN_COMPLEXITIES)[number];


export const DESIGN_COMPLEXITY_SURCHARGE: Record<
  DesignComplexity,
  { fee: number; days: number }
> = {
  simple: { fee: 0, days: 0 },
  standard: { fee: 2500, days: 2 },
  elaborate: { fee: 6000, days: 5 },
};
