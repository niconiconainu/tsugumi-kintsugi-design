import { TsugumiMark } from "@/features/common/components/ui/TsugumiMark";

export const AppFooter = (): React.JSX.Element => (
  <footer className="border-line bg-shell mt-24 border-t">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        <TsugumiMark size={32} />
        <span className="font-display text-ink-strong text-lg font-semibold tracking-[0.03em]">
          Tsugumi
        </span>
      </div>
      <p className="text-ink-soft max-w-2xl text-[13px] leading-relaxed">
        AI
        によるデザインと費用・期間は参考情報です。実際の修理可否、食品利用の安全性、料金、納期は工房による現物確認後に確定します。
        掲載している工房はデモ用の架空データであり、実在の事業者ではありません。
      </p>
    </div>
  </footer>
);
