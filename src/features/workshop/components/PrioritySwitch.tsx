"use client";

import {
  MATCH_PRIORITIES,
  MATCH_PRIORITY_LABEL,
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
}: PrioritySwitchProps): React.JSX.Element => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="border-line bg-paper inline-flex rounded-full border p-1"
      role="group"
      aria-label="優先条件"
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
          {MATCH_PRIORITY_LABEL[priority]}優先
        </button>
      ))}
    </div>
    <p className="text-ink-soft text-[13px]">
      重み — デザイン相性 {Math.round(SCORE_WEIGHTS[value].design * 100)}% ／ 価格{" "}
      {Math.round(SCORE_WEIGHTS[value].price * 100)}% ／ 納期{" "}
      {Math.round(SCORE_WEIGHTS[value].speed * 100)}% ／ 距離{" "}
      {Math.round(SCORE_WEIGHTS[value].distance * 100)}%
    </p>
  </div>
);
