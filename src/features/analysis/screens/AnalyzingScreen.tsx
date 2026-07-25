"use client";

import { useRouter } from "next/navigation";
import { FallbackDamageForm } from "@/features/analysis/components/FallbackDamageForm";
import {
  ANALYSIS_STAGES,
  useAnalysisFlow,
} from "@/features/analysis/hooks/useAnalysisFlow";
import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { Button } from "@/features/common/components/ui/Button";
import { cn } from "@/features/common/utils/cn";
import { useFlowGuard } from "@/features/project/hooks/useFlowGuard";
import { useProjectStore } from "@/features/project/store/project-store";

export const AnalyzingScreen = (): React.JSX.Element | null => {
  const router = useRouter();
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const prefecture = useProjectStore((state) => state.prefecture);
  const isReady = useFlowGuard(
    Boolean(imageDataUrl && prefecture),
    imageDataUrl ? "/story" : "/"
  );
  const { stageIndex, errorMessage, needsFallbackInput, retry } =
    useAnalysisFlow(isReady);

  if (!isReady) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <FlowHeader
        label="Step 3 · Reveal"
        title="継ぎ方を考えています。"
        lead="写真の読み取りから、デザイン案の生成までを順に進めています。"
      />

      <div className="animate-rise mt-14 flex flex-col items-center gap-12">
        <div className="border-line-warm relative h-44 w-44 overflow-hidden rounded-full border">
          {/* ユーザーがアップロードした画像なので next/image の最適化は使わない。 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageDataUrl ?? ""}
            alt=""
            className="h-full w-full object-cover"
          />
          {!errorMessage && (
            <span className="border-t-gold absolute inset-0 animate-spin rounded-full border-2 border-transparent [animation-duration:2.4s]" />
          )}
        </div>

        <ol className="w-full max-w-md space-y-5">
          {ANALYSIS_STAGES.map((stage, index) => {
            const isDone = index < stageIndex;
            const isCurrent = index === stageIndex && !errorMessage;
            return (
              <li key={stage.latin} className="flex items-start gap-4">
                <span
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition",
                    isDone && "bg-gold text-ink",
                    isCurrent && "bg-gold text-ink animate-pulse",
                    !isDone && !isCurrent && "bg-gold-pale text-ink-faint"
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-gold text-[11px] font-medium tracking-[0.1em] uppercase">
                    {stage.latin}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[15px]",
                      isCurrent
                        ? "text-ink font-medium"
                        : isDone
                          ? "text-ink-muted"
                          : "text-ink-faint"
                    )}
                  >
                    {stage.label}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {errorMessage && (
          <div className="w-full max-w-2xl space-y-6">
            <p className="text-alert text-center text-[15px]">{errorMessage}</p>
            {needsFallbackInput ? (
              <FallbackDamageForm onSubmit={(hints) => retry(hints)} />
            ) : (
              <div className="flex justify-center gap-3">
                <Button onClick={() => retry()}>もう一度試す</Button>
                <Button variant="outline" onClick={() => router.push("/story")}>
                  入力に戻る
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
