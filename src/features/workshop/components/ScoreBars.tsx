"use client";

import { formatScore } from "@/features/common/utils/format";
import type { WorkshopCandidateResponse } from "@/presentation/dto/common/workshop-candidate.schema";

interface ScoreBarsProps {
  score: WorkshopCandidateResponse["score"];
}

const ROWS = [
  { key: "design", label: "デザイン相性" },
  { key: "price", label: "価格" },
  { key: "speed", label: "納期" },
  { key: "distance", label: "距離" },
] as const;

export const ScoreBars = ({ score }: ScoreBarsProps): React.JSX.Element => (
  <div className="space-y-2.5">
    {ROWS.map((row) => (
      <div key={row.key} className="flex items-center gap-3">
        <span className="text-ink-soft w-[86px] shrink-0 text-[12px]">
          {row.label}
        </span>
        <span className="bg-line h-1 flex-1 overflow-hidden rounded-full">
          <span
            className="bg-gold block h-full transition-[width] duration-500"
            style={{ width: `${Math.round(score[row.key] * 100)}%` }}
          />
        </span>
        <span className="text-ink-muted w-7 shrink-0 text-right text-[12px] tabular-nums">
          {formatScore(score[row.key])}
        </span>
      </div>
    ))}
  </div>
);
