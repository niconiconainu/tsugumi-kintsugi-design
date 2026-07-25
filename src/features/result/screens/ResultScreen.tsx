"use client";

import { useLocale, useTranslations } from "next-intl";
import { AnalysisSummary } from "@/features/analysis/components/AnalysisSummary";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { FlowSteps } from "@/features/common/components/layout/FlowSteps";
import { Button } from "@/features/common/components/ui/Button";
import { Callout } from "@/features/common/components/ui/Callout";
import { Chip } from "@/features/common/components/ui/Chip";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { formatMoney } from "@/features/common/utils/format";
import { KintsugiPreview } from "@/features/design/components/KintsugiPreview";
import { useProjectStore } from "@/features/project/store/project-store";
import { ShareButton } from "@/features/result/components/ShareButton";
import { useResultView } from "@/features/result/hooks/useResultView";
import { EstimateBreakdown } from "@/features/workshop/components/EstimateBreakdown";
import { useRouter } from "@/i18n/navigation";

export const ResultScreen = (): React.JSX.Element => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("result");
  const tUnits = useTranslations("units");
  const tMetal = useTranslations("metalColor");
  const tLine = useTranslations("lineStyle");
  const tComplexity = useTranslations("complexity");
  const tPrefecture = useTranslations("prefecture");
  const tDesign = useTranslations("design");
  const tRegion = useTranslations("region");
  const reset = useProjectStore((state) => state.reset);
  const { view, isLoading, errorMessage } = useResultView(
    true,
    t("shareLoadError")
  );

  if (isLoading) {
    return (
      <p className="text-ink-soft mx-auto max-w-3xl px-6 py-24 text-[15px]">
        {t("loading")}
      </p>
    );
  }

  if (errorMessage || !view) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-24 text-center">
        <p className="text-alert text-[15px]">{errorMessage ?? t("notFound")}</p>
        <Button onClick={() => router.push("/")}>{t("startOver")}</Button>
      </div>
    );
  }

  const design =
    view.designs.find((item) => item.id === view.selectedDesignId) ??
    view.designs[0];
  const selected = view.candidates.find(
    (candidate) => candidate.workshop.id === view.selectedWorkshopId
  );

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <FlowSteps />
      </div>

      {/* 完成イメージ */}
      <section className="bg-night mt-12 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FlowHeader tone="night" label={t("label")} title={t("title")} />

          <div className="animate-rise mt-14 grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-center">
            <div className="border-night-line overflow-hidden rounded-lg border">
              <KintsugiPreview
                imageDataUrl={view.imageDataUrl}
                linePaths={design.linePaths}
                lineStyle={design.lineStyle}
                metalColor={design.metalColor}
                animate
                className="aspect-square"
              />
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-cream text-[34px] font-medium">
                {design.title}
              </h2>

              <p className="text-night-text text-[16px] leading-[1.8]">
                {view.summary}
              </p>

              <div className="flex flex-wrap gap-1.5">
                <Chip tone="night">{tMetal(design.metalColor)}</Chip>
                <Chip tone="night">{tLine(design.lineStyle)}</Chip>
                <Chip tone="night">{tComplexity(design.complexity)}</Chip>
                <Chip tone="night">
                  {t("sentFrom", { prefecture: tPrefecture(view.prefecture) })}
                </Chip>
              </div>

              <p className="text-night-text text-[14px] leading-[1.8] opacity-80">
                {design.rationale}
              </p>

              {view.imageDataUrl === null && (
                <p className="text-gold-light text-[13px]">
                  {t("sharedNote")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 依頼先と概算 */}
      {selected && (
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionLabel>{t("workshopLabel")}</SectionLabel>
            <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
              {t("workshopTitle")}
            </h2>

            <div className="border-gold bg-paper rounded-lg border p-8 shadow-[0_0_0_1px_var(--color-gold)]">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <div>
                  <h3 className="font-display text-ink text-[28px] font-medium">
                    {selected.workshop.name}
                  </h3>
                  <p className="text-ink-soft mt-1 text-[13px]">
                    {tPrefecture(selected.workshop.prefecture)} (
                    {tRegion(selected.workshop.region)}) ·{" "}
                    {selected.workshop.type}
                  </p>
                  <p className="text-ink-muted mt-4 max-w-md text-[15px] leading-[1.75]">
                    {selected.workshop.description}
                  </p>
                </div>

                <dl className="space-y-4 text-right">
                  <div>
                    <dt className="text-ink-soft text-[12px] font-medium">
                      {t("estimatedTotal")}
                    </dt>
                    <dd className="font-display text-gold text-[38px] font-medium tabular-nums">
                      {formatMoney(selected.estimate.totalFee, locale)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft text-[12px] font-medium">
                      {t("estimatedFinish")}
                    </dt>
                    <dd className="font-display text-ink text-[24px] font-medium tabular-nums">
                      {tUnits("days", { count: selected.estimate.totalDays })}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-line mt-7 border-t pt-7">
                <EstimateBreakdown estimate={selected.estimate} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 比較した工房 */}
      <section className="bg-shell py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionLabel>{t("comparedLabel")}</SectionLabel>
          <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
            {t("comparedTitle")}
          </h2>

          <div className="border-line bg-paper overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="border-line text-ink-soft border-b">
                <tr>
                  <th className="px-5 py-4 font-medium">
                    {t("table.workshop")}
                  </th>
                  <th className="px-5 py-4 font-medium">{t("table.total")}</th>
                  <th className="px-5 py-4 font-medium">{t("table.finish")}</th>
                  <th className="px-5 py-4 font-medium">{t("table.score")}</th>
                </tr>
              </thead>
              <tbody>
                {view.candidates.map((candidate) => (
                  <tr
                    key={candidate.workshop.id}
                    className="border-line border-t"
                  >
                    <td className="text-ink px-5 py-4">
                      {candidate.workshop.name}
                      {candidate.workshop.id === view.selectedWorkshopId && (
                        <span className="bg-gold-pale text-gold-deep ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                          {t("table.selected")}
                        </span>
                      )}
                    </td>
                    <td className="text-ink-muted px-5 py-4 tabular-nums">
                      {formatMoney(candidate.estimate.totalFee, locale)}
                    </td>
                    <td className="text-ink-muted px-5 py-4 tabular-nums">
                      {tUnits("days", { count: candidate.estimate.totalDays })}
                    </td>
                    <td className="text-ink-muted px-5 py-4 tabular-nums">
                      {Math.round(candidate.score.total * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 読み取り結果 */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionLabel>{tDesign("analysisLabel")}</SectionLabel>
          <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
            {tDesign("analysisTitle")}
          </h2>
          <AnalysisSummary analysis={view.analysis} />

          <div className="mt-10">
            <Callout title={t("cautionTitle")} tone="caution">
              {t("cautionBody")}
            </Callout>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {view.projectId && <ShareButton projectId={view.projectId} />}
            <Button
              variant="outline"
              onClick={() => {
                reset();
                router.push("/");
              }}
            >
              {t("restart")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
