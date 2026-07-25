/** 対応ロケール。i18n のルーティングもドメインもここを唯一の出典にする。 */
export const LOCALES = ["en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

/** 既定は英語。URL は必ずロケール接頭辞付き（`/en` / `/ja`）で、`/` は `/en` へ飛ばす。 */
export const DEFAULT_LOCALE: Locale = "en";
