import { SHIPPING_RATE_TABLE } from "@/constants/logistics/shipping";
import type { Estimate } from "@/domain/entity/estimate/estimate.entity";

/**
 * 見積の wire 形。金額はすべて円の整数。
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
    zone: string;
    zoneLabel: string;
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
  shippingBreakdown: {
    zone: estimate.shippingBreakdown.zone,
    zoneLabel: SHIPPING_RATE_TABLE[estimate.shippingBreakdown.zone].label,
    oneWayFee: estimate.shippingBreakdown.oneWayFee,
    packagingFee: estimate.shippingBreakdown.packagingFee,
    oneWayDays: estimate.shippingBreakdown.oneWayDays,
  },
  scheduleBreakdown: estimate.scheduleBreakdown,
});
