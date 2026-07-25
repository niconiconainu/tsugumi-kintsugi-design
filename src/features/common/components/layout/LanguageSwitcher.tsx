"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES, type Locale } from "@/constants/i18n/locale";
import { cn } from "@/features/common/utils/cn";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * 言語切り替え。原本ヘッダーの丸い地球アイコンの位置にあたる。
 * 同じ画面のまま言語だけ差し替えたいので、現在のパスを保ったまま locale を変える。
 */
export const LanguageSwitcher = (): React.JSX.Element => {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations("language");

  return (
    <div
      className="border-line-cool flex items-center gap-1 rounded-full border p-0.5"
      role="group"
      aria-label={t("label")}
    >
      {LOCALES.map((locale: Locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "rounded-full px-3 py-1 text-[12px] font-medium transition",
            locale === active
              ? "bg-ink-strong text-cream"
              : "text-ink-soft hover:text-ink"
          )}
        >
          {t(locale)}
        </Link>
      ))}
    </div>
  );
};
