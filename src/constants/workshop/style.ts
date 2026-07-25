/**
 * 工房の作風タグ。
 *
 * 工房プロフィール側の属性であり、ユーザーは選ばない
 * （希望テイストの入力は廃止し、器の種類と素材だけを受け取る）。
 * 候補カードで工房の得意分野を示すためだけに使う。
 */
export const WORKSHOP_STYLES = [
  "traditional",
  "minimal",
  "bold",
  "botanical",
] as const;

export type WorkshopStyle = (typeof WORKSHOP_STYLES)[number];
