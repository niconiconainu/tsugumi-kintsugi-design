"use client";

import { useTranslations } from "next-intl";
import {
  ARTIFACT_TYPES,
  type ArtifactType,
} from "@/constants/artifact/artifact-type";
import { MATERIALS, type Material } from "@/constants/artifact/damage";
import { PREFECTURES, type Prefecture } from "@/constants/region/prefecture";

interface ArtifactSelectorProps {
  artifactType: ArtifactType;
  material: Material;
  onChange: (params: {
    artifactType: ArtifactType;
    material: Material;
  }) => void;
  prefecture: Prefecture | null;
  onPrefectureChange: (prefecture: Prefecture) => void;
}

const FIELD_CLASS =
  "border-line-cool bg-paper text-ink focus:border-gold mt-2 w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none";

/**
 * 器の種類と素材の申告。
 * 解析で上書きせずユーザーの申告値で確定させるため（`DamageAnalysis` のコメント参照）、
 * ここが唯一の入力箇所になる。
 */
export const ArtifactSelector = ({
  artifactType,
  material,
  onChange,
  prefecture,
  onPrefectureChange,
}: ArtifactSelectorProps): React.JSX.Element => {
  const t = useTranslations("landing.upload");
  const tArtifact = useTranslations("artifactType");
  const tMaterial = useTranslations("material");
  const tPrefecture = useTranslations("prefecture");
  const tStory = useTranslations("story");

  return (
    <div className="mx-auto mt-10 grid max-w-[760px] gap-6 sm:grid-cols-2">
      <label className="block">
        <span className="text-ink text-[15px] font-semibold">
          {t("artifactTypeLabel")}
        </span>
        <select
          value={artifactType}
          onChange={(event) =>
            onChange({
              artifactType: event.target.value as ArtifactType,
              material,
            })
          }
          className={FIELD_CLASS}
        >
          {ARTIFACT_TYPES.map((type) => (
            <option key={type} value={type}>
              {tArtifact(type)}
            </option>
          ))}
        </select>
        <span className="text-ink-soft mt-1.5 block text-[13px]">
          {t("artifactTypeHint")}
        </span>
      </label>

      <label className="block">
        <span className="text-ink text-[15px] font-semibold">
          {t("materialLabel")}
        </span>
        <select
          value={material}
          onChange={(event) =>
            onChange({ artifactType, material: event.target.value as Material })
          }
          className={FIELD_CLASS}
        >
          {MATERIALS.map((item) => (
            <option key={item} value={item}>
              {tMaterial(item)}
            </option>
          ))}
        </select>
        <span className="text-ink-soft mt-1.5 block text-[13px]">
          {t("materialHint")}
        </span>
      </label>

      <label className="block sm:col-span-2">
        <span className="text-ink text-[15px] font-semibold">
          {tStory("prefectureLabel")}
        </span>
        <select
          value={prefecture ?? ""}
          onChange={(event) =>
            onPrefectureChange(event.target.value as Prefecture)
          }
          className={FIELD_CLASS}
        >
          <option value="">{tStory("prefecturePlaceholder")}</option>
          {PREFECTURES.map((code) => (
            <option key={code} value={code}>
              {tPrefecture(code)}
            </option>
          ))}
        </select>
        <span className="text-ink-soft mt-1.5 block text-[13px]">
          {tStory("prefectureNote")}
        </span>
      </label>
    </div>
  );
};
