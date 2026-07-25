import Link from "next/link";
import { isDemoMode } from "@/config/env";
import { TsugumiMark } from "@/features/common/components/ui/TsugumiMark";

export const AppHeader = (): React.JSX.Element => (
  <header className="border-line bg-cream/90 sticky top-0 z-20 border-b backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <TsugumiMark size={36} />
        <span className="font-display text-ink-strong text-[22px] font-semibold tracking-[0.03em]">
          Tsugumi
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {isDemoMode() && (
          <span
            className="bg-alert-bg text-alert hidden rounded-full px-3 py-1 text-[11px] font-semibold sm:inline"
            title="AI エージェントは未接続です。解析・デザイン案・説明文は Mock 応答です。"
          >
            AI MOCK
          </span>
        )}
        <Link
          href="/"
          className="bg-ink-strong text-cream rounded-full px-5 py-2.5 text-[15px] font-medium transition hover:brightness-125"
        >
          はじめる
        </Link>
      </div>
    </div>
  </header>
);
