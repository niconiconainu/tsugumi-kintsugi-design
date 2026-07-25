"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DAMAGE_TYPES, type DamageType } from "@/constants/artifact/damage";
import type { AnalysisFallbackHints } from "@/features/analysis/hooks/useAnalysisFlow";
import { Button } from "@/features/common/components/ui/Button";

interface FallbackDamageFormProps {
  onSubmit: (hints: AnalysisFallbackHints) => void;
}

const FIELD_CLASS =
  "border-line-cool bg-paper text-ink focus:border-gold mt-2 w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none";

/**
 * 画像解析が失敗したときの手入力（設計書 6.3）。
 * 破損タイプと素材だけ選んでもらい、そのまま提案を続ける。
 */
export const FallbackDamageForm = ({
  onSubmit,
}: FallbackDamageFormProps): React.JSX.Element => {
  const t = useTranslations("analyzing.fallback");
  const tDamage = useTranslations("damageType");
  const [damageType, setDamageType] = useState<DamageType>("crack_and_chip");

  return (
    <div className="border-line bg-paper space-y-6 rounded-lg border p-7">
      <p className="text-ink-muted text-[15px] leading-relaxed">{t("lead")}</p>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-ink text-[14px] font-semibold">
            {t("damageTypeLabel")}
          </span>
          <select
            value={damageType}
            onChange={(event) =>
              setDamageType(event.target.value as DamageType)
            }
            className={FIELD_CLASS}
          >
            {DAMAGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {tDamage(type)}
              </option>
            ))}
          </select>
        </label>

      </div>

      <Button onClick={() => onSubmit({ damageType })}>
        {t("submit")}
      </Button>
    </div>
  );
};
