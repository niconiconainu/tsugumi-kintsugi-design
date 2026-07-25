"use client";

import { useTranslations } from "next-intl";
import {
  MATCH_PRIORITIES,
  SCORE_WEIGHTS,
  type MatchPriority,
} from "@/constants/project/priority";
import { cn } from "@/features/common/utils/cn";

interface PrioritySwitchProps {
  value: MatchPriority;
  onChange: (priority: MatchPriority) => void;
  disabled?: boolean;
}

export const PrioritySwitch = ({
  value,
  onChange,
  disabled = false,
}: PrioritySwitchProps): React.JSX.Element => {
  const t = useTranslations("workshop");
  const tPriority = useTranslations("priority");
  const weights = SCORE_WEIGHTS[value];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="border-line bg-paper inline-flex rounded-full border p-1"
        role="group"
        aria-label={t("priorityGroup")}
      >
        {MATCH_PRIORITIES.map((priority) => (
          <button
            key={priority}
            type="button"
            disabled={disabled}
            onClick={() => onChange(priority)}
            aria-pressed={value === priority}
            className={cn(
              "rounded-full px-5 py-2 text-[14px] font-medium transition disabled:opacity-50",
              value === priority
                ? "bg-gold text-ink"
                : "text-ink-soft hover:text-ink"
            )}
          >
            {t("prioritySuffix", { label: tPriority(priority) })}
          </button>
        ))}
      </div>
      <p className="text-ink-soft text-[13px]">
        {t("weights", {
          design: Math.round(weights.design * 100),
          price: Math.round(weights.price * 100),
          speed: Math.round(weights.speed * 100),
          distance: Math.round(weights.distance * 100),
        })}
      </p>
    </div>
  );
};
