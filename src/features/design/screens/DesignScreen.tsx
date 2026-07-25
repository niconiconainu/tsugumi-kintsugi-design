"use client";

import { useRouter } from "next/navigation";
import { AnalysisSummary } from "@/features/analysis/components/AnalysisSummary";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { FlowSteps } from "@/features/common/components/layout/FlowSteps";
import { Button } from "@/features/common/components/ui/Button";
import { SectionLabel } from "@/features/common/components/ui/SectionLabel";
import { DesignCard } from "@/features/design/components/DesignCard";
import { useFlowGuard } from "@/features/project/hooks/useFlowGuard";
import { useProjectStore } from "@/features/project/store/project-store";

export const DesignScreen = (): React.JSX.Element | null => {
  const router = useRouter();
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
            label="Step 3 · Reveal"
            title="この器が、金でよみがえる姿。"
            lead="破損の線とお話をもとにした 3 つの方向性です。継ぎ線はコードで描いた見立てで、実際の仕上がりは工房の手仕事で決まります。"
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-[220px_1fr]">
            <div>
              <p className="text-night-text mb-3 text-center text-[12px] font-medium tracking-[0.08em] uppercase lg:text-left">
                Before
              </p>
              <div className="border-night-line overflow-hidden rounded-lg border">
                {/* ユーザーがアップロードした画像なので next/image の最適化は使わない。 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageDataUrl ?? ""}
                  alt="アップロードした品物"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-gold-light mb-3 text-center text-[12px] font-medium tracking-[0.08em] uppercase lg:text-left">
                Reborn in gold — 案を 1 つ選んでください
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
              この案で工房を探す →
            </Button>
            <button
              type="button"
              onClick={() => router.push("/story")}
              className="text-night-text hover:text-cream text-[15px] font-medium underline underline-offset-4"
            >
              入力を見直す
            </button>
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
          <AnalysisSummary analysis={analysis} />
        </div>
      </section>
    </>
  );
};
