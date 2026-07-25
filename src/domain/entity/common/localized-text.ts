import type { Locale } from "@/constants/i18n/locale";

/**
 * 言語ごとに用意された文字列。
 * 工房名や紹介文のように「翻訳ではなく、それぞれの言語で書かれた原稿」を持つものに使う。
 */
export type LocalizedText = Record<Locale, string>;

export const pickText = (text: LocalizedText, locale: Locale): string =>
  text[locale];
