"use client";

import { formatYen } from "@/features/common/utils/format";
import type { EstimateResponse } from "@/presentation/dto/common/estimate.schema";

interface EstimateBreakdownProps {
  estimate: EstimateResponse;
}

/** 金額と日数の内訳。すべてコード側の決定論的な計算結果（設計書 4.4）。 */
export const EstimateBreakdown = ({
  estimate,
}: EstimateBreakdownProps): React.JSX.Element => {
  const { repairFeeBreakdown, shippingBreakdown, scheduleBreakdown } = estimate;

  const feeRows = [
    { label: "基本料金", value: formatYen(repairFeeBreakdown.basePrice) },
    {
      label: "破損度加算",
      value: formatYen(repairFeeBreakdown.damageSurcharge),
    },
    {
      label: "デザイン加算",
      value: formatYen(repairFeeBreakdown.designSurcharge),
    },
    {
      label: `往復送料（${shippingBreakdown.zoneLabel}）`,
      value: `${formatYen(shippingBreakdown.oneWayFee)} × 2 ＋ 梱包 ${formatYen(
        shippingBreakdown.packagingFee
      )}`,
    },
  ];

  const dayRows = [
    { label: "往路", value: `${scheduleBreakdown.outboundDays} 日` },
    { label: "工房待機", value: `${scheduleBreakdown.queueDays} 日` },
    { label: "修理", value: `${scheduleBreakdown.repairDays} 日` },
    { label: "復路", value: `${scheduleBreakdown.returnDays} 日` },
  ];

  return (
    <div className="grid gap-7 sm:grid-cols-2">
      <dl>
        <p className="text-gold mb-3 text-[11px] font-medium tracking-[0.1em] uppercase">
          Fee
        </p>
        <div className="space-y-2">
          {feeRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <dt className="text-ink-soft text-[13px]">{row.label}</dt>
              <dd className="text-ink-muted text-right text-[13px] tabular-nums">
                {row.value}
              </dd>
            </div>
          ))}
        </div>
      </dl>

      <dl>
        <p className="text-gold mb-3 text-[11px] font-medium tracking-[0.1em] uppercase">
          Schedule
        </p>
        <div className="space-y-2">
          {dayRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <dt className="text-ink-soft text-[13px]">{row.label}</dt>
              <dd className="text-ink-muted text-right text-[13px] tabular-nums">
                {row.value}
              </dd>
            </div>
          ))}
        </div>
      </dl>
    </div>
  );
};
