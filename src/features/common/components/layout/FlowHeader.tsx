import { FlowSteps } from "@/features/common/components/layout/FlowSteps";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";

interface FlowHeaderProps {
  label: string;
  title: string;
  lead?: string;
  tone?: "light" | "night";
}

/** 各工程の見出し。ステッパー → ラベル → 見出し → 補足、の並びは原本と同じ。 */
export const FlowHeader = ({
  label,
  title,
  lead,
  tone = "light",
}: FlowHeaderProps): React.JSX.Element => (
  <div>
    {tone === "light" && <FlowSteps />}
    <div className="mt-10 text-center">
      <SectionLabel tone={tone === "night" ? "light" : "gold"}>
        {label}
      </SectionLabel>
      <h1
        className={`font-display mt-3 text-[34px] leading-tight font-medium sm:text-[38px] ${
          tone === "night" ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h1>
      {lead && (
        <p
          className={`mx-auto mt-4 max-w-xl text-[16px] leading-relaxed ${
            tone === "night" ? "text-night-text" : "text-ink-soft"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  </div>
);
