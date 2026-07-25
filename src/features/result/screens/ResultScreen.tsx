"use client";

import { useRouter } from "next/navigation";
import {
  DESIGN_COMPLEXITY_LABEL,
  LINE_STYLE_LABEL,
  METAL_COLOR_LABEL,
} from "@/constants/design/taste";
import { AnalysisSummary } from "@/features/analysis/components/AnalysisSummary";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { FlowSteps } from "@/features/common/components/layout/FlowSteps";
import { Button } from "@/features/common/components/ui/Button";
import { Callout } from "@/features/common/components/ui/Callout";
import { Chip } from "@/features/common/components/ui/Chip";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { formatDays, formatYen } from "@/features/common/utils/format";
import { KintsugiPreview } from "@/features/design/components/KintsugiPreview";
import { useProjectStore } from "@/features/project/store/project-store";
import { ShareButton } from "@/features/result/components/ShareButton";
import { useResultView } from "@/features/result/hooks/useResultView";
import { EstimateBreakdown } from "@/features/workshop/components/EstimateBreakdown";

export const ResultScreen = (): React.JSX.Element => {
  const router = useRouter();
  const reset = useProjectStore((state) => state.reset);
  const { view, isLoading, errorMessage } = useResultView(true);

  if (isLoading) {
    return (
      <p className="text-ink-soft mx-auto max-w-3xl px-6 py-24 text-[15px]">
        読み込んでいます…
      </p>
    );
  }

  if (errorMessage || !view) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-24 text-center">
        <p className="text-alert text-[15px]">
          {errorMessage ??
            "表示できる結果がありません。最初からやり直してください。"}
        </p>
        <Button onClick={() => router.push("/")}>最初から始める</Button>
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
          <FlowHeader
            tone="night"
            label="Step 5 · Your project"
            title="この形で、工房へ相談できます。"
          />

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
                <Chip tone="night">
                  {METAL_COLOR_LABEL[design.metalColor]}
                </Chip>
                <Chip tone="night">{LINE_STYLE_LABEL[design.lineStyle]}</Chip>
                <Chip tone="night">
                  {DESIGN_COMPLEXITY_LABEL[design.complexity]}
                </Chip>
                <Chip tone="night">発送元 {view.prefectureLabel}</Chip>
              </div>

              <p className="text-night-text text-[14px] leading-[1.8] opacity-80">
                {design.rationale}
              </p>

              {view.imageDataUrl === null && (
                <p className="text-gold-light text-[13px]">
                  共有リンクで表示しています。写真は保存していないため、継ぎ線のみを表示しています。
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
            <SectionLabel>Workshop</SectionLabel>
            <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
              依頼先と概算
            </h2>

            <div className="border-gold bg-paper rounded-lg border p-8 shadow-[0_0_0_1px_var(--color-gold)]">
              <div className="flex flex-wrap items-start justify-between gap-8">
                <div>
                  <h3 className="font-display text-ink text-[28px] font-medium">
                    {selected.workshop.name}
                  </h3>
                  <p className="text-ink-soft mt-1 text-[13px]">
                    {selected.workshop.prefectureLabel}（
                    {selected.workshop.regionLabel}） · {selected.workshop.type}
                  </p>
                  <p className="text-ink-muted mt-4 max-w-md text-[15px] leading-[1.75]">
                    {selected.workshop.description}
                  </p>
                </div>

                <dl className="space-y-4 text-right">
                  <div>
                    <dt className="text-ink-soft text-[12px] font-medium">
                      総額の目安
                    </dt>
                    <dd className="font-display text-gold text-[38px] font-medium tabular-nums">
                      {formatYen(selected.estimate.totalFee)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft text-[12px] font-medium">
                      完成の目安
                    </dt>
                    <dd className="font-display text-ink text-[24px] font-medium tabular-nums">
                      {formatDays(selected.estimate.totalDays)}
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
          <SectionLabel>Compared</SectionLabel>
          <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
            比較した工房
          </h2>

          <div className="border-line bg-paper overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="border-line text-ink-soft border-b">
                <tr>
                  <th className="px-5 py-4 font-medium">工房</th>
                  <th className="px-5 py-4 font-medium">総額</th>
                  <th className="px-5 py-4 font-medium">完成目安</th>
                  <th className="px-5 py-4 font-medium">総合スコア</th>
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
                          選択
                        </span>
                      )}
                    </td>
                    <td className="text-ink-muted px-5 py-4 tabular-nums">
                      {formatYen(candidate.estimate.totalFee)}
                    </td>
                    <td className="text-ink-muted px-5 py-4 tabular-nums">
                      {formatDays(candidate.estimate.totalDays)}
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
          <SectionLabel>Analysis</SectionLabel>
          <h2 className="font-display text-ink mt-3 mb-10 text-center text-[32px] font-medium">
            写真から読み取れたこと
          </h2>
          <AnalysisSummary analysis={view.analysis} />

          <div className="mt-10">
            <Callout title="ご注意" tone="caution">
              金額・期間は概算です。修理可否、食品としての利用可否、最終的な料金と納期は、工房が現物を確認したうえで決まります。
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
              別の器で試す
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
