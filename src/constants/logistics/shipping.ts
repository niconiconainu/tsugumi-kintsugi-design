/**
 * 送料 Mock（設計書 5.2）。実際の運賃 API は叩かず、地方区分だけで概算する。
 * 金額は円の整数（`number`）。詳細は CLAUDE.md「金額の扱い」を参照。
 */
export const SHIPPING_ZONES = [
  "SAME",
  "ADJACENT",
  "OTHER",
  "REMOTE",
] as const;

export type ShippingZone = (typeof SHIPPING_ZONES)[number];

interface ShippingRate {
  /** 片道送料（円） */
  oneWayFee: number;
  /** 片道の配送日数 */
  oneWayDays: number;
  /** 距離スコア（0〜1）。近いほど高い。総合スコアの距離項に使う。 */
  proximityScore: number;
}

/** 区分の表示名は messages 側で持つ。ここには数値だけを置く。 */
export const SHIPPING_RATE_TABLE: Record<ShippingZone, ShippingRate> = {
  SAME: { oneWayFee: 900, oneWayDays: 1, proximityScore: 1 },
  ADJACENT: { oneWayFee: 1200, oneWayDays: 2, proximityScore: 0.75 },
  OTHER: { oneWayFee: 1600, oneWayDays: 3, proximityScore: 0.45 },
  REMOTE: { oneWayFee: 2200, oneWayDays: 3, proximityScore: 0.2 },
};

/** 割れ物梱包資材費（往復で 1 回のみ加算。設計書 5.3 の「梱包オプション」）。 */
export const PACKAGING_FEE = 600;
