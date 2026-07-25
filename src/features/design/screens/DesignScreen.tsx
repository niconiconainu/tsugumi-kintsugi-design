"use client";

import { useTranslations } from "next-intl";
import { AnalysisSummary } from "@/features/analysis/components/AnalysisSummary";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { FlowSteps } from "@/features/common/components/layout/FlowSteps";
import { Button } from "@/features/common/components/ui/Button";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { DesignCard } from "@/features/design/components/DesignCard";
import { useFlowGuard } from "@/features/project/hooks/useFlowGuard";
import { useProjectStore } from "@/features/project/store/project-store";
import { useRouter } from "@/i18n/navigation";

export const DesignScreen = (): React.JSX.Element | null => {
  const router = useRouter();
  const t = useTranslations("design");
  const tDropzone = useTranslations("dropzone");
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const analysis = useProjectStore((state) => state.analysis);
  const designs = useProjectStore((state) => state.designs);
  const selectedDesignId = useProjectStore((state) => state.selectedDesignId);
  const selectDesign = useProjectStore((state) => state.selectDesign);
  const isReady = useFlowGuard(
    Boolean(analysis && designs.length > 0),
    "/analyzing"
  );

  if (!isReady || !analysis) return null;

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <FlowSteps />
      </div>

      {/* Reveal：濃地の上で継ぎ線を見せる */}
      <section className="bg-night mt-12 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FlowHeader
            tone="night"
            label={t("label")}
            title={t("title")}
            lead={t("lead")}
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="text-night-text mb-3 text-center text-[12px] font-medium tracking-[0.08em] uppercase lg:text-left">
                {t("before")}
              </p>
              <div className="border-night-line overflow-hidden rounded-lg border">
                {/* ユーザーがアップロードした画像なので next/image の最適化は使わない。 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl ?? ""}
                  alt={tDropzone("photoAlt")}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-gold-light mb-3 text-center text-[12px] font-medium tracking-[0.08em] uppercase lg:text-left">
                {t("after")}
              </p>
              <div className="grid gap-5 md:grid-cols-3">
                {designs.map((design) => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    imageDataUrl={imageDataUrl}
                    selected={design.id === selectedDesignId}
                    onSelect={() => selectDesign(design.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/workshops")}
              disabled={!selectedDesignId}
            >
              {t("cta")}
            </Button>
            <button
              type="button"
              onClick={() => router.push("/story")}
              className="text-night-text hover:text-cream text-[15px] font-medium underline underline-offset-4"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </section>

      {/* 読み取り結果 */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel>{t("analysisLabel")}</SectionLabel>
          <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
            {t("analysisTitle")}
          </h2>
          <AnalysisSummary analysis={analysis} />
        </div>
      </section>
    </>
  );
};
