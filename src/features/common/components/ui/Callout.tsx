import { cn } from "@/features/common/utils/cn";

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  tone?: "note" | "caution";
}

export const Callout = ({
  title,
  children,
  tone = "note",
}: CalloutProps): React.JSX.Element => (
  <div
    className={cn(
      "rounded-lg px-5 py-4 text-[13px] leading-relaxed",
      tone === "caution"
        ? "bg-alert-bg text-alert"
        : "bg-gold-pale text-ink-muted"
    )}
  >
    {title && (
      <p
        className={cn(
          "mb-1.5 font-semibold",
          tone === "caution" ? "text-alert" : "text-ink-strong"
        )}
      >
        {title}
      </p>
    )}
    {children}
  </div>
);
