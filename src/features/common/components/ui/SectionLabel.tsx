import { cn } from "@/features/common/utils/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  align?: "left" | "center";
  tone?: "gold" | "light";
}

/** 原本の小見出し：金色・全角大・字間広め。 */
export const SectionLabel = ({
  children,
  align = "center",
  tone = "gold",
}: SectionLabelProps): React.JSX.Element => (
  <p
    className={cn(
      "text-[13px] font-medium tracking-[0.1em] uppercase",
      tone === "gold" ? "text-gold" : "text-gold-light",
      align === "center" ? "text-center" : "text-left"
    )}
  >
    {children}
  </p>
);
