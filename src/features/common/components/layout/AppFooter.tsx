import { getTranslations } from "next-intl/server";
import { TsugumiMark } from "@/features/common/components/ui/TsugumiMark";

export const AppFooter = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations();

  return (
    <footer className="border-line bg-shell mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <TsugumiMark size={32} />
          <span className="font-display text-ink-strong text-lg font-semibold tracking-[0.03em]">
            {t("brand.name")}
          </span>
        </div>
        <p className="text-ink-soft max-w-2xl text-[13px] leading-relaxed">
          {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
};
