"use client";

import { useTranslations } from "next-intl";
import { Callout } from "@/features/common/components/ui/Callout";
import type { DamageAnalysisResponse } from "@/presentation/dto/common/damage-analysis.schema";

interface AnalysisSummaryProps {
  analysis: DamageAnalysisResponse;
}

export const AnalysisSummary = ({
  analysis,
}: AnalysisSummaryProps): React.JSX.Element => {
  const t = useTranslations("analysis");
  const tMaterial = useTranslations("material");
  const tDamage = useTranslations("damageType");
  const tSeverity = useTranslations("damageSeverity");

  const items = [
    { label: t("material"), value: tMaterial(analysis.material) },
    { label: t("damage"), value: tDamage(analysis.damageType) },
    { label: t("severity"), value: tSeverity(analysis.damageSeverity) },
    {
      label: t("cracks"),
      value: t("crackCount", { count: analysis.crackCount }),
    },
    {
      label: t("missingArea"),
      value: `${Math.round(analysis.missingAreaRatio * 100)}%`,
    },
    {
      label: t("confidence"),
      value: `${Math.round(analysis.confidence * 100)}%`,
    },
  ];

  return (
    <div className="space-y-6">
      <dl className="border-line bg-paper grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="bg-paper px-5 py-4 text-center">
            <dt className="text-ink-soft text-[12px] font-medium">
              {item.label}
            </dt>
            <dd className="font-display text-ink mt-1 text-[22px] font-medium">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-4 md:grid-cols-2">
        {analysis.repairNotes.length > 0 && (
          <Callout title={t("repairNotes")}>
            <ul className="space-y-1">
              {analysis.repairNotes.map((note) => (
                <li key={note}>・{note}</li>
              ))}
            </ul>
          </Callout>
        )}

        {analysis.needsUserConfirmation && (
          <Callout title={t("confirmTitle")} tone="caution">
            {t("confirmBody")}
          </Callout>
        )}
      </div>
    </div>
  );
};
