/** 優先条件（設計書 2.1 / 5.4）。総合スコアの重みを切り替える。 */
export const MATCH_PRIORITIES = ["design", "price", "speed"] as const;

export type MatchPriority = (typeof MATCH_PRIORITIES)[number];

export const MATCH_PRIORITY_LABEL: Record<MatchPriority, string> = {
  design: "デザイン相性",
  price: "価格",
  speed: "速さ",
};

export const MATCH_PRIORITY_DESCRIPTION: Record<MatchPriority, string> = {
  design: "物語と器に合う表現を最優先する",
  price: "総額をできるだけ抑える",
  speed: "手元に戻るまでの日数を短くする",
};

export interface ScoreWeights {
  design: number;
  price: number;
  speed: number;
  distance: number;
}

/**
 * 優先条件ごとの重み。design が設計書 5.4 の基準値
 * （デザイン相性 50% + 価格 25% + 納期 20% + 距離 5%）。
 */
export const SCORE_WEIGHTS: Record<MatchPriority, ScoreWeights> = {
  design: { design: 0.5, price: 0.25, speed: 0.2, distance: 0.05 },
  price: { design: 0.25, price: 0.5, speed: 0.2, distance: 0.05 },
  speed: { design: 0.25, price: 0.2, speed: 0.5, distance: 0.05 },
};
