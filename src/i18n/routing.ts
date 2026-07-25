import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/constants/i18n/locale";

/**
 * URL に必ずロケールを含める（`/en/...` と `/ja/...`）。
 * 共有 URL を開いた人が必ず同じ言語で見られるようにするため、
 * ブラウザ言語での自動判定は行わない。`/` は既定ロケールへリダイレクトする。
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeDetection: false,
});
