/**
 * 金額は円の整数で持っているので、表示だけロケールに合わせる。
 * ja は「1,000円」、en は「¥1,000」。
 */
export const formatMoney = (value: number, locale: string): string =>
  locale === "ja"
    ? `${value.toLocaleString("ja-JP")}円`
    : `¥${value.toLocaleString("en-US")}`;

/** 0〜1 のスコアを百分率の整数へ。 */
export const formatScore = (value: number): string =>
  `${Math.round(value * 100)}`;
