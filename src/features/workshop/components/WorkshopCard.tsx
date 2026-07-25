"use client";

import { DESIGN_TASTE_LABEL, type DesignTaste } from "@/constants/design/taste";
import { Chip } from "@/features/common/components/ui/Chip";
import { cn } from "@/features/common/utils/cn";
import {
  formatDays,
  formatScore,
  formatYen,
} from "@/features/common/utils/format";
import { EstimateBreakdown } from "@/features/workshop/components/EstimateBreakdown";
import { ScoreBars } from "@/features/workshop/components/ScoreBars";
import type { WorkshopCandidateResponse } from "@/presentation/dto/common/workshop-candidate.schema";

interface WorkshopCardProps {
  candidate: WorkshopCandidateResponse;
  rank: number;
  selected: boolean;
  onSelect: () => void;
}

export const WorkshopCard = ({
  candidate,
  rank,
  selected,
  onSelect,
}: WorkshopCardProps): React.JSX.Element => {
  const { workshop, estimate, score } = candidate;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "animate-rise bg-paper focus-visible:ring-gold w-full rounded-lg border p-7 text-left transition focus-visible:ring-2 focus-visible:outline-none",
        selected
          ? "border-gold shadow-[0_0_0_1px_var(--color-gold)]"
          : "border-line hover:border-line-warm"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
              rank === 1 ? "bg-gold text-ink" : "bg-gold-pale text-gold-deep"
            )}
          >
            {rank}
          </span>
          <div>
            <h3 className="font-display text-ink text-[24px] font-medium">
              {workshop.name}
            </h3>
            <p className="text-ink-soft mt-1 text-[13px]">
              {workshop.prefectureLabel}（{workshop.regionLabel}） ·{" "}
              {workshop.type}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-ink text-[30px] font-medium tabular-nums">
            {formatYen(estimate.totalFee)}
          </p>
          <p className="text-ink-muted mt-0.5 text-[13px] tabular-nums">
            完成まで {formatDays(estimate.totalDays)}
          </p>
          <p className="text-gold mt-1 text-[12px] font-medium">
            総合スコア {formatScore(score.total)}
          </p>
        </div>
      </div>

      <p className="text-ink-muted mt-5 text-[14px] leading-[1.75]">
        {candidate.explanation}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {workshop.styleTags.map((tag) => (
          <Chip key={tag} tone="gold">
            {DESIGN_TASTE_LABEL[tag as DesignTaste]}
          </Chip>
        ))}
        <Chip tone={workshop.usesUrushi ? "gold" : "neutral"}>
          {workshop.usesUrushi ? "本漆" : "簡易金継ぎ"}
        </Chip>
      </div>

      <div className="border-line mt-6 border-t pt-6">
        <ScoreBars score={score} />
      </div>

      <div className="border-line mt-6 border-t pt-6">
        <EstimateBreakdown estimate={estimate} />
      </div>

      {candidate.cautions.length > 0 && (
        <ul className="bg-alert-bg mt-6 space-y-1 rounded-lg px-4 py-3">
          {candidate.cautions.map((caution) => (
            <li key={caution} className="text-alert text-[13px] leading-relaxed">
              ・{caution}
            </li>
          ))}
        </ul>
      )}
    </button>
  );
};
