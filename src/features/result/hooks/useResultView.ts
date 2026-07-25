"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { prefectureLabel } from "@/constants/region/prefecture";
import { ApiError } from "@/features/common/utils/api-client";
import { useProjectStore } from "@/features/project/store/project-store";
import { fetchProject } from "@/features/result/api/projects";
import type { DamageAnalysisResponse } from "@/presentation/dto/common/damage-analysis.schema";
import type { DesignOptionResponse } from "@/presentation/dto/common/design-option.schema";
import type { WorkshopCandidateResponse } from "@/presentation/dto/common/workshop-candidate.schema";

export interface ResultView {
  projectId: string | null;
  summary: string;
  analysis: DamageAnalysisResponse;
  designs: DesignOptionResponse[];
  selectedDesignId: string | null;
  candidates: WorkshopCandidateResponse[];
  selectedWorkshopId: string | null;
  prefectureLabel: string;
  /** 共有 URL から開いた場合は写真が無い（サーバーに保存していないため）。 */
  imageDataUrl: string | null;
}

interface ResultViewState {
  view: ResultView | null;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * 結果画面の表示データ。
 * 自分で作った流れは store から、共有 URL（`?id=`）で開いた場合は API から組み立てる。
 */
export const useResultView = (enabled: boolean): ResultViewState => {
  const searchParams = useSearchParams();
  const sharedId = searchParams.get("id");

  const savedProjectId = useProjectStore((state) => state.savedProjectId);
  const analysis = useProjectStore((state) => state.analysis);
  const designs = useProjectStore((state) => state.designs);
  const selectedDesignId = useProjectStore((state) => state.selectedDesignId);
  const candidates = useProjectStore((state) => state.candidates);
  const selectedWorkshopId = useProjectStore(
    (state) => state.selectedWorkshopId
  );
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const summary = useProjectStore((state) => state.summary);
  const storePrefecture = useProjectStore((state) => state.prefecture);

  const isShared = Boolean(sharedId && sharedId !== savedProjectId);
  const [shared, setShared] = useState<ResultView | null>(null);
  const [isLoading, setIsLoading] = useState(isShared);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !isShared || !sharedId) return;
    let cancelled = false;

    const run = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const project = await fetchProject(sharedId);
        if (cancelled) return;
        setShared({
          projectId: project.id,
          summary: project.summary,
          analysis: project.analysis,
          designs: project.designs,
          selectedDesignId: project.selectedDesignId,
          candidates: project.candidates,
          selectedWorkshopId: project.selectedWorkshopId,
          prefectureLabel: project.preference.prefectureLabel,
          imageDataUrl: null,
        });
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiError
              ? error.message
              : "共有されたプロジェクトを読み込めませんでした。"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, isShared, sharedId]);

  if (isShared) return { view: shared, isLoading, errorMessage };

  if (!analysis || designs.length === 0 || !storePrefecture) {
    return { view: null, isLoading: false, errorMessage: null };
  }

  return {
    view: {
      projectId: savedProjectId,
      summary,
      analysis,
      designs,
      selectedDesignId,
      candidates,
      selectedWorkshopId,
      prefectureLabel: prefectureLabel(storePrefecture),
      imageDataUrl,
    },
    isLoading: false,
    errorMessage: null,
  };
};
