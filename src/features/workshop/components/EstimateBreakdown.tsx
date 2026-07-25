"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatMoney } from "@/features/common/utils/format";
import type { EstimateResponse } from "@/presentation/dto/common/estimate.schema";

interface EstimateBreakdownProps {
  estimate: EstimateResponse;
}

/** 金額と日数の内訳。すべてコード側の決定論的な計算結果（設計書 4.4）。 */
export const EstimateBreakdown = ({
  estimate,
}: EstimateBreakdownProps): React.JSX.Element => {
  const locale = useLocale();
  const tFee = useTranslations("workshop.fee");
  const tSchedule = useTranslations("workshop.schedule");
  const tZone = useTranslations("shippingZone");
  const { repairFeeBreakdown, shippingBreakdown, scheduleBreakdown } = estimate;

  const feeRows = [
    {
      label: tFee("basePrice"),
      value: formatMoney(repairFeeBreakdown.basePrice, locale),
    },
    {
      label: tFee("damageSurcharge"),
      value: formatMoney(repairFeeBreakdown.damageSurcharge, locale),
    },
    {
      label: tFee("designSurcharge"),
      value: formatMoney(repairFeeBreakdown.designSurcharge, locale),
    },
    {
      label: tFee("shipping", { zone: tZone(shippingBreakdown.zone) }),
      value: tFee("shippingValue", {
        oneWay: formatMoney(shippingBreakdown.oneWayFee, locale),
        packaging: formatMoney(shippingBreakdown.packagingFee, locale),
      }),
    },
  ];

  const dayRows = [
    {
      label: tSchedule("outbound"),
      value: tSchedule("days", { count: scheduleBreakdown.outboundDays }),
    },
    {
      label: tSchedule("queue"),
      value: tSchedule("days", { count: scheduleBreakdown.queueDays }),
    },
    {
      label: tSchedule("repair"),
      value: tSchedule("days", { count: scheduleBreakdown.repairDays }),
    },
    {
      label: tSchedule("return"),
      value: tSchedule("days", { count: scheduleBreakdown.returnDays }),
    },
  ];

  return (
    <div className="grid gap-7 sm:grid-cols-2">
      <dl>
        <p className="text-gold mb-3 text-[11px] font-medium tracking-[0.1em] uppercase">
          {tFee("title")}
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
          {tSchedule("title")}
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
