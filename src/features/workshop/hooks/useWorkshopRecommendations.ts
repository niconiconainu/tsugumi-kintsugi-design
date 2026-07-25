"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import type { Locale } from "@/constants/i18n/locale";
import { ApiError } from "@/features/common/utils/api-client";
import { useProjectStore } from "@/features/project/store/project-store";
import { recommendWorkshops } from "@/features/workshop/api/recommendWorkshops";

interface RecommendationsState {
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * 工房候補を取得する。優先条件や表示言語が変わるたびに取り直す。
 * スコアはサーバー側の計算なので、クライアントでは並べ替えない。
 */
export const useWorkshopRecommendations = (
  enabled: boolean,
  fallbackErrorMessage: string
): RecommendationsState => {
  const locale = useLocale() as Locale;
  const priority = useProjectStore((state) => state.priority);
  const selectedDesignId = useProjectStore((state) => state.selectedDesignId);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const run = async (): Promise<void> => {
      const store = useProjectStore.getState();
      const design = store.designs.find(
        (item) => item.id === store.selectedDesignId
      );
      if (!design || !store.analysis || !store.prefecture) return;

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const { candidates } = await recommendWorkshops({
          locale,
          analysis: store.analysis,
          design,
          tastes: store.tastes,
          prefecture: store.prefecture,
          priority,
        });
        if (!cancelled) useProjectStore.getState().setCandidates(candidates);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiError ? error.message : fallbackErrorMessage
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
  }, [enabled, fallbackErrorMessage, locale, priority, selectedDesignId]);

  return { isLoading, errorMessage };
};
