"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DamageType } from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";
import { analyzeImage } from "@/features/analysis/api/analyzeImage";
import { ApiError } from "@/features/common/utils/api-client";
import { generateDesigns } from "@/features/design/api/generateDesigns";
import { useProjectStore } from "@/features/project/store/project-store";
import { useRouter } from "@/i18n/navigation";

/** 進行状況の段階表示（設計書 8「解析中は段階表示する」）。 */
export const ANALYSIS_STAGES = [
  { latin: "Vision", key: "vision" },
  { latin: "Structure", key: "structure" },
  { latin: "Design", key: "design" },
  { latin: "Lines", key: "lines" },
] as const;

/** 段階が切り替わったことが目で追えるだけの最小の間。 */
const STAGE_INTERVAL_MS = 650;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface AnalysisFallbackHints {
  damageType: DamageType;
}

interface AnalysisFlowState {
  stageIndex: number;
  errorMessage: string | null;
  /** Vision 側の失敗。破損タイプの手入力を促す（設計書 6.3）。 */
  needsFallbackInput: boolean;
  retry: (hints?: AnalysisFallbackHints) => void;
}

/**
 * 解析 → デザイン生成を順に走らせ、終わったらデザイン画面へ送る。
 * 失敗したらその場で理由を出し、手入力からのやり直しを受け付ける。
 */
export const useAnalysisFlow = (
  enabled: boolean,
  networkErrorMessage: string
): AnalysisFlowState => {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [stageIndex, setStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsFallbackInput, setNeedsFallbackInput] = useState(false);
  const hasStarted = useRef(false);

  const run = useCallback(
    async (hints?: AnalysisFallbackHints): Promise<void> => {
      const store = useProjectStore.getState();
      if (!store.imageDataUrl || !store.prefecture) return;

      setErrorMessage(null);
      setNeedsFallbackInput(false);
      setStageIndex(0);

      try {
        const { analysis } = await analyzeImage({
          locale,
          imageDataUrl: store.imageDataUrl,
          declaredArtifactType: store.artifactType,
          declaredMaterial: store.material,
          declaredDamageType: hints?.damageType,
        });
        useProjectStore.getState().setAnalysis(analysis);

        setStageIndex(1);
        await wait(STAGE_INTERVAL_MS);
        setStageIndex(2);

        const { designs } = await generateDesigns({ locale, analysis });
        useProjectStore.getState().setDesigns(designs);

        setStageIndex(3);
        await wait(STAGE_INTERVAL_MS);
        router.replace("/designs");
      } catch (error) {
        const isVisionFailure =
          error instanceof ApiError && error.code.startsWith("A");
        setNeedsFallbackInput(isVisionFailure);
        setErrorMessage(
          error instanceof ApiError ? error.message : networkErrorMessage
        );
      }
    },
    [locale, networkErrorMessage, router]
  );

  useEffect(() => {
    if (!enabled || hasStarted.current) return;
    hasStarted.current = true;
    void run();
  }, [enabled, run]);

  return {
    stageIndex,
    errorMessage,
    needsFallbackInput,
    retry: (hints) => void run(hints),
  };
};
