import { cn } from "@/features/common/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** 選択中の強調表示 */
  selected?: boolean;
}

export const Card = ({
  children,
  className,
  selected = false,
}: CardProps): React.JSX.Element => (
  <div
    className={cn(
      "bg-paper rounded-lg border transition",
      selected
        ? "border-gold shadow-[0_0_0_1px_var(--color-gold)]"
        : "border-line hover:border-line-warm",
      className
    )}
  >
    {children}
  </div>
);
