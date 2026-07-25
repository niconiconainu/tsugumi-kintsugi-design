"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DamageType, Material } from "@/constants/artifact/damage";
import { analyzeImage } from "@/features/analysis/api/analyzeImage";
import { ApiError } from "@/features/common/utils/api-client";
import { generateDesigns } from "@/features/design/api/generateDesigns";
import { useProjectStore } from "@/features/project/store/project-store";

/** 進行状況の段階表示（設計書 8「解析中は段階表示する」）。 */
export const ANALYSIS_STAGES = [
  { latin: "Vision", label: "写真から器の輪郭と破損を読み取っています" },
  { latin: "Structure", label: "素材・色・破損の状態を整理しています" },
  { latin: "Design", label: "物語をふまえて継ぎ方を構想しています" },
  { latin: "Lines", label: "継ぎ線を引いています" },
] as const;

/** 段階が切り替わったことが目で追えるだけの最小の間。 */
const STAGE_INTERVAL_MS = 650;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface AnalysisFallbackHints {
  damageType: DamageType;
  material: Material;
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
export const useAnalysisFlow = (enabled: boolean): AnalysisFlowState => {
  const router = useRouter();
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
          imageDataUrl: store.imageDataUrl,
          declaredDamageType: hints?.damageType,
          declaredMaterial: hints?.material,
        });
        useProjectStore.getState().setAnalysis(analysis);

        setStageIndex(1);
        await wait(STAGE_INTERVAL_MS);
        setStageIndex(2);

        const { designs } = await generateDesigns({
          story: store.story,
          tastes: store.tastes,
          analysis,
        });
        useProjectStore.getState().setDesigns(designs);

        setStageIndex(3);
        await wait(STAGE_INTERVAL_MS);
        router.replace("/designs");
      } catch (error) {
        const isVisionFailure =
          error instanceof ApiError && error.code.startsWith("A");
        setNeedsFallbackInput(isVisionFailure);
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : "通信に失敗しました。もう一度お試しください。"
        );
      }
    },
    [router]
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
