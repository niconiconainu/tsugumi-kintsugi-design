"use client";

import {
  DAMAGE_SEVERITY_LABEL,
  DAMAGE_TYPE_LABEL,
  MATERIAL_LABEL,
} from "@/constants/artifact/damage";
import { Callout } from "@/features/common/components/ui/Callout";
import type { DamageAnalysisResponse } from "@/presentation/dto/common/damage-analysis.schema";

interface AnalysisSummaryProps {
  analysis: DamageAnalysisResponse;
}

export const AnalysisSummary = ({
  analysis,
}: AnalysisSummaryProps): React.JSX.Element => {
  const items = [
    { label: "素材", value: MATERIAL_LABEL[analysis.material] },
    { label: "破損", value: DAMAGE_TYPE_LABEL[analysis.damageType] },
    { label: "程度", value: DAMAGE_SEVERITY_LABEL[analysis.damageSeverity] },
    { label: "ひび", value: `${analysis.crackCount} 本` },
    {
      label: "欠損面積",
      value: `${Math.round(analysis.missingAreaRatio * 100)}%`,
    },
    { label: "確信度", value: `${Math.round(analysis.confidence * 100)}%` },
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
          <Callout title="修復上の留意点">
            <ul className="space-y-1">
              {analysis.repairNotes.map((note) => (
                <li key={note}>・{note}</li>
              ))}
            </ul>
          </Callout>
        )}

        {analysis.needsUserConfirmation && (
          <Callout title="確認のお願い" tone="caution">
            読み取りの確信度が高くありません。工房へ相談する際は、実際の破損状態を改めてお伝えください。
          </Callout>
        )}
      </div>
    </div>
  );
};
