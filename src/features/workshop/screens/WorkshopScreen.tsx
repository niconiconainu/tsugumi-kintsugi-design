"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { Locale } from "@/constants/i18n/locale";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { Button } from "@/features/common/components/ui/Button";
import { Callout } from "@/features/common/components/ui/Callout";
import { ApiError } from "@/features/common/utils/api-client";
import { cn } from "@/features/common/utils/cn";
import { KintsugiPreview } from "@/features/design/components/KintsugiPreview";
import { useFlowGuard } from "@/features/project/hooks/useFlowGuard";
import { useProjectStore } from "@/features/project/store/project-store";
import { saveProject } from "@/features/result/api/projects";
import { PrioritySwitch } from "@/features/workshop/components/PrioritySwitch";
import { WorkshopCard } from "@/features/workshop/components/WorkshopCard";
import { useWorkshopRecommendations } from "@/features/workshop/hooks/useWorkshopRecommendations";
import { useRouter } from "@/i18n/navigation";

export const WorkshopScreen = (): React.JSX.Element | null => {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("workshop");
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const designs = useProjectStore((state) => state.designs);
  const selectedDesignId = useProjectStore((state) => state.selectedDesignId);
  const candidates = useProjectStore((state) => state.candidates);
  const selectedWorkshopId = useProjectStore(
    (state) => state.selectedWorkshopId
  );
  const priority = useProjectStore((state) => state.priority);
  const setPriority = useProjectStore((state) => state.setPriority);
  const selectWorkshop = useProjectStore((state) => state.selectWorkshop);
  const setSaved = useProjectStore((state) => state.setSaved);

  const isReady = useFlowGuard(Boolean(selectedDesignId), "/designs");
  const { isLoading, errorMessage } = useWorkshopRecommendations(
    isReady,
    t("loadError")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isReady) return null;

  const design = designs.find((item) => item.id === selectedDesignId);

  const complete = async (): Promise<void> => {
    const store = useProjectStore.getState();
    if (!store.analysis || !store.prefecture || !store.selectedDesignId) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const project = await saveProject({
        locale,
        prefecture: store.prefecture,
        priority: store.priority,
        analysis: store.analysis,
        designs: store.designs,
        selectedDesignId: store.selectedDesignId,
        selectedWorkshopId: store.selectedWorkshopId,
      });
      setSaved({ projectId: project.id, summary: project.summary });
      router.push("/result");
    } catch (error) {
      setSaveError(
        error instanceof ApiError ? error.message : t("saveError")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <FlowHeader label={t("label")} title={t("title")} lead={t("lead")} />

      <div className="mt-12 flex justify-center">
        <PrioritySwitch
          value={priority}
          onChange={setPriority}
          disabled={isLoading}
        />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {design && (
            <>
              <p className="text-gold text-[12px] font-medium tracking-[0.1em] uppercase">
                {t("selectedDesign")}
              </p>
              <div className="border-line overflow-hidden rounded-lg border">
                <KintsugiPreview
                  imageDataUrl={imageDataUrl}
                  linePaths={design.linePaths}
                  lineStyle={design.lineStyle}
                  metalColor={design.metalColor}
                  className="aspect-square"
                />
              </div>
              <div>
                <p className="font-display text-ink text-[22px] font-medium">
                  {design.title}
                </p>
                <p className="text-ink-soft mt-2 text-[13px] leading-relaxed">
                  {design.concept}
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/designs")}
                className="text-ink-soft hover:text-ink text-[13px] underline underline-offset-4"
              >
                {t("reselect")}
              </button>
            </>
          )}
        </aside>

        <div className="space-y-8">
          {errorMessage && (
            <p className="text-alert text-[15px]">{errorMessage}</p>
          )}

          {/* 再取得中は一覧を薄くして、並びが入れ替わることを分かるようにする。 */}
          <div
            className={cn(
              "space-y-5 transition-opacity",
              isLoading && "opacity-40"
            )}
            aria-busy={isLoading}
          >
            {candidates.map((candidate, index) => (
              <WorkshopCard
                key={candidate.workshop.id}
                candidate={candidate}
                rank={index + 1}
                selected={candidate.workshop.id === selectedWorkshopId}
                onSelect={() => selectWorkshop(candidate.workshop.id)}
              />
            ))}
          </div>

          {isLoading && candidates.length === 0 && (
            <p className="text-ink-soft text-[15px]">{t("loading")}</p>
          )}

          <Callout title={t("cautionTitle")} tone="caution">
            {t("cautionBody")}
          </Callout>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={() => void complete()}
              disabled={!selectedWorkshopId || isSaving}
            >
              {isSaving ? t("completing") : t("complete")}
            </Button>
            {saveError && <p className="text-alert text-[13px]">{saveError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
