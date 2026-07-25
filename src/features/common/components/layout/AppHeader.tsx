import { getTranslations } from "next-intl/server";
import { isDemoMode } from "@/config/env";
import { LanguageSwitcher } from "@/features/common/components/layout/LanguageSwitcher";
import { TsugumiMark } from "@/features/common/components/ui/TsugumiMark";
import { Link } from "@/i18n/navigation";

export const AppHeader = async (): Promise<React.JSX.Element> => {
  const t = await getTranslations("brand");

  return (
    <header className="border-line bg-cream/90 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <TsugumiMark size={36} />
          <span className="font-display text-ink-strong text-[22px] font-semibold tracking-[0.03em]">
            {t("name")}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isDemoMode() && (
            <span
              className="bg-alert-bg text-alert hidden rounded-full px-3 py-1 text-[11px] font-semibold sm:inline"
              title={t("aiMockTitle")}
            >
              {t("aiMock")}
            </span>
          )}
          <LanguageSwitcher />
          <Link
            href="/"
            className="bg-ink-strong text-cream hidden rounded-full px-5 py-2.5 text-[15px] font-medium transition hover:brightness-125 sm:inline-block"
          >
            {t("begin")}
          </Link>
        </div>
      </div>
    </header>
  );
};
