/** クラス名の結合。条件付きクラスのために falsy を落とすだけの薄いヘルパー。 */
export const cn = (...values: (string | false | null | undefined)[]): string =>
  values.filter(Boolean).join(" ");
