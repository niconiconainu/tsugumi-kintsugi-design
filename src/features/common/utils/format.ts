/** 金額は円の整数で持っているので、表示だけ 3 桁区切りにする。 */
export const formatYen = (value: number): string =>
  `${value.toLocaleString("ja-JP")}円`;

export const formatDays = (value: number): string => `約${value}日`;

/** 0〜1 のスコアを百分率の整数へ。 */
export const formatScore = (value: number): string =>
  `${Math.round(value * 100)}`;

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
