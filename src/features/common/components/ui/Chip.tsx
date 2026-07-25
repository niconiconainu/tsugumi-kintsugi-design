import { cn } from "@/features/common/utils/cn";

interface ChipProps {
  children: React.ReactNode;
  tone?: "gold" | "neutral" | "night";
}

const TONE_CLASS = {
  gold: "bg-gold-pale text-gold-deep",
  neutral: "bg-shell text-ink-soft border border-line",
  night: "bg-night-soft text-gold-light",
} as const;

export const Chip = ({
  children,
  tone = "neutral",
}: ChipProps): React.JSX.Element => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
      TONE_CLASS[tone]
    )}
  >
    {children}
  </span>
);
