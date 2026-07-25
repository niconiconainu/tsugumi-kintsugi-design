import type { ShippingZone } from "@/constants/logistics/shipping";

/** 修理料金の内訳（設計書 5.3）。 */
export interface RepairFeeBreakdown {
  /** 工房の基本料金 */
  basePrice: number;
  /** 破損度加算（severity + ひび本数 + 欠損補填） */
  damageSurcharge: number;
  /** デザイン加算 */
  designSurcharge: number;
}

/** 送料の内訳。 */
export interface ShippingBreakdown {
  zone: ShippingZone;
  /** 片道送料 */
  oneWayFee: number;
  /** 梱包資材費（往復で 1 回） */
  packagingFee: number;
  /** 片道の配送日数 */
  oneWayDays: number;
}

/** 完成目安の内訳（往路 + 待機 + 修理 + 復路）。 */
export interface ScheduleBreakdown {
  outboundDays: number;
  queueDays: number;
  repairDays: number;
  returnDays: number;
}

/**
 * 概算見積（設計書 7 の Estimate）。
 * すべてコード側の決定論的計算で作る。LLM は数値を生成しない（設計書 4.4）。
 * 金額は円の整数。
 */
export class Estimate {
  constructor(
    readonly repairFee: number,
    readonly shippingFee: number,
    readonly totalFee: number,
    readonly totalDays: number,
    readonly repairFeeBreakdown: RepairFeeBreakdown,
    readonly shippingBreakdown: ShippingBreakdown,
    readonly scheduleBreakdown: ScheduleBreakdown
  ) {}
}
