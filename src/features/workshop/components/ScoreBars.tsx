"use client";

import { useTranslations } from "next-intl";
import { formatScore } from "@/features/common/utils/format";
import type { WorkshopCandidateResponse } from "@/presentation/dto/common/workshop-candidate.schema";

interface ScoreBarsProps {
  score: WorkshopCandidateResponse["score"];
}

const ROWS = ["design", "price", "speed", "distance"] as const;

export const ScoreBars = ({ score }: ScoreBarsProps): React.JSX.Element => {
  const t = useTranslations("workshop.score");

  return (
    <div className="space-y-2.5">
      {ROWS.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-ink-soft w-[92px] shrink-0 text-[12px]">
            {t(key)}
          </span>
          <span className="bg-line h-1 flex-1 overflow-hidden rounded-full">
            <span
              className="bg-gold block h-full transition-[width] duration-500"
              style={{ width: `${Math.round(score[key] * 100)}%` }}
            />
          </span>
          <span className="text-ink-muted w-7 shrink-0 text-right text-[12px] tabular-nums">
            {formatScore(score[key])}
          </span>
        </div>
      ))}
    </div>
  );
};
