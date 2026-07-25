import { cn } from "@/features/common/utils/cn";

type Variant = "gold" | "ink" | "outline";
type Size = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** 原本のボタンは全てピル型。金＝主行動、藍＝標準、白抜き＝副次。 */
const VARIANT_CLASS: Record<Variant, string> = {
  gold: "bg-gold text-ink font-semibold hover:brightness-105",
  ink: "bg-ink-strong text-cream font-semibold hover:brightness-125",
  outline:
    "border border-line-cool text-ink-muted font-medium hover:border-ink-soft hover:text-ink",
};

const SIZE_CLASS: Record<Size, string> = {
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

export const Button = ({
  variant = "gold",
  size = "md",
  className,
  ...props
}: ButtonProps): React.JSX.Element => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full transition",
      "focus-visible:ring-gold focus-visible:ring-offset-cream focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100",
      VARIANT_CLASS[variant],
      SIZE_CLASS[size],
      className
    )}
    {...props}
  />
);
