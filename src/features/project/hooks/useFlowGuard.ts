"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useProjectStore } from "@/features/project/store/project-store";

/**
 * sessionStorage からの復元が終わったか。
 * 終わる前に判定すると、まだ空の状態を見て前の画面へ戻してしまう。
 */
const useStoreHydrated = (): boolean =>
  useSyncExternalStore(
    (onStoreChange) => useProjectStore.persist.onFinishHydration(onStoreChange),
    () => useProjectStore.persist.hasHydrated(),
    // サーバー側では復元前として扱う。
    () => false
  );

/**
 * 途中の画面へ直接来たときに前の工程へ戻す。
 * 復元完了までは `false` を返すので、呼び出し側はその間 null を描画する。
 */
export const useFlowGuard = (isReady: boolean, redirectTo: string): boolean => {
  const router = useRouter();
  const hydrated = useStoreHydrated();

  useEffect(() => {
    if (hydrated && !isReady) router.replace(redirectTo);
  }, [hydrated, isReady, redirectTo, router]);

  return hydrated && isReady;
};
