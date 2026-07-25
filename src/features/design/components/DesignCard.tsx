"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/features/common/components/ui/Chip";
import { cn } from "@/features/common/utils/cn";
import { KintsugiPreview } from "@/features/design/components/KintsugiPreview";
import type { DesignOptionResponse } from "@/presentation/dto/common/design-option.schema";

interface DesignCardProps {
  design: DesignOptionResponse;
  imageDataUrl: string | null;
  selected: boolean;
  onSelect: () => void;
}

/** 濃地（Reveal セクション）の上に置くカード。 */
export const DesignCard = ({
  design,
  imageDataUrl,
  selected,
  onSelect,
}: DesignCardProps): React.JSX.Element => {
  const tMetal = useTranslations("metalColor");
  const tLine = useTranslations("lineStyle");
  const tComplexity = useTranslations("complexity");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "animate-rise focus-visible:ring-gold-light flex h-full flex-col overflow-hidden rounded-lg border text-left transition focus-visible:ring-2 focus-visible:outline-none",
        selected
          ? "border-gold-light bg-night-soft shadow-[0_0_0_1px_var(--color-gold-light)]"
          : "border-night-line bg-night-soft/60 hover:border-gold-light/60"
      )}
    >
      <KintsugiPreview
        imageDataUrl={imageDataUrl}
        linePaths={design.linePaths}
        lineStyle={design.lineStyle}
        metalColor={design.metalColor}
        animate
        className="aspect-[4/3]"
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3
          className={cn(
            "font-display text-[24px] font-medium",
            selected ? "text-gold-light" : "text-cream"
          )}
        >
          {design.title}
        </h3>

        <p className="text-night-text text-[13px] leading-[1.75]">
          {design.concept}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <Chip tone="night">{tMetal(design.metalColor)}</Chip>
          <Chip tone="night">{tLine(design.lineStyle)}</Chip>
          <Chip tone="night">{tComplexity(design.complexity)}</Chip>
        </div>

        <p className="border-night-line text-night-text mt-auto border-t pt-4 text-[13px] leading-[1.75]">
          {design.rationale}
        </p>
      </div>
    </button>
  );
};
