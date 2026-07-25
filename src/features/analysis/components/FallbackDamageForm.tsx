"use client";

import { useState } from "react";
import {
  DAMAGE_TYPES,
  DAMAGE_TYPE_LABEL,
  MATERIALS,
  MATERIAL_LABEL,
  type DamageType,
  type Material,
} from "@/constants/artifact/damage";
import { Button } from "@/features/common/components/ui/Button";
import type { AnalysisFallbackHints } from "@/features/analysis/hooks/useAnalysisFlow";

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
  const [damageType, setDamageType] = useState<DamageType>("crack_and_chip");
  const [material, setMaterial] = useState<Material>("ceramic");

  return (
    <div className="border-line bg-paper space-y-6 rounded-lg border p-7">
      <p className="text-ink-muted text-[15px] leading-relaxed">
        写真からの読み取りができませんでした。破損の状態を選んでいただければ、そのまま提案を続けます。
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink text-[14px] font-semibold">
            破損の種類
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
                {DAMAGE_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-ink text-[14px] font-semibold">素材</span>
          <select
            value={material}
            onChange={(event) => setMaterial(event.target.value as Material)}
            className={FIELD_CLASS}
          >
            {MATERIALS.map((item) => (
              <option key={item} value={item}>
                {MATERIAL_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Button onClick={() => onSubmit({ damageType, material })}>
        この内容で続ける
      </Button>
    </div>
  );
};
