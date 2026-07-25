"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/features/common/utils/cn";

/**
 * 工程インジケータ（原本の 4 段ステッパーを、設計書 6.1 の 5 工程に合わせたもの）。
 * 「解析中」は通過するだけなのでデザイン工程に含める。
 */
const STEPS = [
  { paths: ["/"], label: "写真" },
  { paths: ["/story"], label: "物語" },
  { paths: ["/analyzing", "/designs"], label: "デザイン" },
  { paths: ["/workshops"], label: "工房" },
  { paths: ["/result"], label: "結果" },
] as const;

export const FlowSteps = (): React.JSX.Element | null => {
  const pathname = usePathname();
  const activeIndex = STEPS.findIndex((step) =>
    (step.paths as readonly string[]).includes(pathname)
  );
  if (activeIndex < 0) return null;

  return (
    <ol className="flex items-center justify-center">
      {STEPS.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;
        const isReached = isDone || isActive;
        return (
          <li key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold",
                  isReached
                    ? "bg-gold text-ink"
                    : "bg-gold-pale text-ink-faint border-line-warm border"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap",
                  isReached ? "text-ink" : "text-ink-faint"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span
                className={cn(
                  "mb-6 h-px w-8 sm:w-14",
                  isDone ? "bg-gold" : "bg-line"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
