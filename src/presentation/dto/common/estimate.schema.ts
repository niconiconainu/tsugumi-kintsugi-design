import type { ShippingZone } from "@/constants/logistics/shipping";
import type { Estimate } from "@/domain/entity/estimate/estimate.entity";

/**
 * 見積の wire 形。金額はすべて円の整数。
 * 送料区分は表示名ではなくコードで返し、画面側で翻訳する。
 * 概算であることは画面側の免責表示で明示する（設計書 8）。
 */
export interface EstimateResponse {
  repairFee: number;
  shippingFee: number;
  totalFee: number;
  totalDays: number;
  repairFeeBreakdown: {
    basePrice: number;
    damageSurcharge: number;
    designSurcharge: number;
  };
  shippingBreakdown: {
    zone: ShippingZone;
    oneWayFee: number;
    packagingFee: number;
    oneWayDays: number;
  };
  scheduleBreakdown: {
    outboundDays: number;
    queueDays: number;
    repairDays: number;
    returnDays: number;
  };
}

export const toEstimateResponse = (estimate: Estimate): EstimateResponse => ({
  repairFee: estimate.repairFee,
  shippingFee: estimate.shippingFee,
  totalFee: estimate.totalFee,
  totalDays: estimate.totalDays,
  repairFeeBreakdown: estimate.repairFeeBreakdown,
  shippingBreakdown: estimate.shippingBreakdown,
  scheduleBreakdown: estimate.scheduleBreakdown,
});
