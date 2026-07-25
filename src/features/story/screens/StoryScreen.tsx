"use client";

import { FlowHeader } from "@/features/common/components/layout/FlowHeader";
import { useFlowGuard } from "@/features/project/hooks/useFlowGuard";
import { useProjectStore } from "@/features/project/store/project-store";
import { StoryForm } from "@/features/story/components/StoryForm";

export const StoryScreen = (): React.JSX.Element | null => {
  const imageDataUrl = useProjectStore((state) => state.imageDataUrl);
  const isReady = useFlowGuard(Boolean(imageDataUrl), "/");

  if (!isReady) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <FlowHeader
        label="Step 2 · Story"
        title="この器の物語を聞かせてください。"
        lead="書かれた言葉は、継ぎ線の意味づけと工房選びに使われます。"
      />

      <div className="animate-rise mt-14 grid gap-12 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <div className="border-line bg-paper overflow-hidden rounded-lg border p-3">
            {/* ユーザーがアップロードした画像なので next/image の最適化は使わない。 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl ?? ""}
              alt="アップロードした品物"
              className="max-h-[260px] w-full rounded-md object-contain"
            />
          </div>
          <p className="text-ink-soft text-[13px] leading-relaxed">
            この写真はサーバーに保存されません。解析のためだけに送信されます。
          </p>
        </aside>

        <StoryForm />
      </div>
    </div>
  );
};
