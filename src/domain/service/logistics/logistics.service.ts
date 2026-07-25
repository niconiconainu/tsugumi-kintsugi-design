import {
  CRACK_SURCHARGE_PER_LINE,
  DAMAGE_SEVERITY_SURCHARGE,
  MISSING_AREA_SURCHARGE,
  MISSING_AREA_THRESHOLD,
} from "@/constants/artifact/damage";
import { DESIGN_COMPLEXITY_SURCHARGE } from "@/constants/design/expression";
import {
  PACKAGING_FEE,
  SHIPPING_RATE_TABLE,
  type ShippingZone,
} from "@/constants/logistics/shipping";
import {
  ADJACENT_REGIONS,
  isRemoteRegion,
  type Region,
} from "@/constants/region/region";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import { Estimate } from "@/domain/entity/estimate/estimate.entity";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";

/**
 * 送料・修理費・完成目安の決定論的な計算（設計書 4.4 / 5.3）。
 * infra 非依存の純粋サービス。LLM はここに一切関与しない。
 */
export class LogisticsService {
  /** 発送元と工房所在地の地方から送料区分を決める。 */
  resolveShippingZone(from: Region, to: Region): ShippingZone {
    if (from === to) return "SAME";
    if (isRemoteRegion(from) || isRemoteRegion(to)) return "REMOTE";
    if (ADJACENT_REGIONS[from].includes(to)) return "ADJACENT";
    return "OTHER";
  }

  /**
   * 概算見積を組み立てる。
   * 往復送料 = 片道送料 × 2 + 梱包オプション
   * 修理料金 = 基本料金 + 破損度加算 + デザイン加算
   * 完成目安 = 往路 + 工房待機 + 修理 + 復路
   */
  buildEstimate(params: {
    workshop: Workshop;
    analysis: DamageAnalysis;
    design: DesignOption;
    from: Region;
  }): Estimate {
    const { workshop, analysis, design, from } = params;

    const zone = this.resolveShippingZone(from, workshop.region);
    const rate = SHIPPING_RATE_TABLE[zone];

    const damageSurcharge = this.calcDamageSurcharge(analysis);
    const designSurcharge = DESIGN_COMPLEXITY_SURCHARGE[design.complexity].fee;
    const repairFee = workshop.basePrice + damageSurcharge + designSurcharge;

    const shippingFee = rate.oneWayFee * 2 + PACKAGING_FEE;

    const repairDays =
      workshop.repairDays +
      DAMAGE_SEVERITY_SURCHARGE[analysis.damageSeverity].days +
      DESIGN_COMPLEXITY_SURCHARGE[design.complexity].days;
    const totalDays =
      rate.oneWayDays + workshop.queueDays + repairDays + rate.oneWayDays;

    return new Estimate(
      repairFee,
      shippingFee,
      repairFee + shippingFee,
      totalDays,
      {
        basePrice: workshop.basePrice,
        damageSurcharge,
        designSurcharge,
      },
      {
        zone,
        oneWayFee: rate.oneWayFee,
        packagingFee: PACKAGING_FEE,
        oneWayDays: rate.oneWayDays,
      },
      {
        outboundDays: rate.oneWayDays,
        queueDays: workshop.queueDays,
        repairDays,
        returnDays: rate.oneWayDays,
      }
    );
  }

  /** 距離スコア（0〜1）。総合スコアの距離項に使う。 */
  proximityScore(from: Region, to: Region): number {
    return SHIPPING_RATE_TABLE[this.resolveShippingZone(from, to)]
      .proximityScore;
  }

  /** 破損度加算 = severity 加算 + ひび本数加算 + 欠損補填。 */
  private calcDamageSurcharge(analysis: DamageAnalysis): number {
    const severity = DAMAGE_SEVERITY_SURCHARGE[analysis.damageSeverity].fee;
    // 1 本目は基本料金に含むため 2 本目から加算する。
    const cracks =
      Math.max(0, analysis.crackCount - 1) * CRACK_SURCHARGE_PER_LINE;
    const missing =
      analysis.missingAreaRatio > MISSING_AREA_THRESHOLD
        ? MISSING_AREA_SURCHARGE
        : 0;
    return severity + cracks + missing;
  }
}
