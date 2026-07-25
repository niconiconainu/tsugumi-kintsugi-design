/** 地方区分。住所は都道府県までしか受け取らないため、送料・距離はこの粒度で扱う。 */
export const REGIONS = [
  "HOKKAIDO",
  "TOHOKU",
  "KANTO",
  "CHUBU",
  "KANSAI",
  "CHUGOKU",
  "SHIKOKU",
  "KYUSHU",
  "OKINAWA",
] as const;

export type Region = (typeof REGIONS)[number];


/** 隣接地方。送料区分（同一 / 隣接 / その他）の判定にだけ使う簡易グラフ。 */
export const ADJACENT_REGIONS: Record<Region, readonly Region[]> = {
  HOKKAIDO: ["TOHOKU"],
  TOHOKU: ["HOKKAIDO", "KANTO"],
  KANTO: ["TOHOKU", "CHUBU"],
  CHUBU: ["KANTO", "KANSAI"],
  KANSAI: ["CHUBU", "CHUGOKU", "SHIKOKU"],
  CHUGOKU: ["KANSAI", "SHIKOKU", "KYUSHU"],
  SHIKOKU: ["KANSAI", "CHUGOKU", "KYUSHU"],
  KYUSHU: ["CHUGOKU", "SHIKOKU", "OKINAWA"],
  OKINAWA: ["KYUSHU"],
};

/** 離島扱い（送料区分 REMOTE）になる地方。 */
export const REMOTE_REGIONS: readonly Region[] = ["HOKKAIDO", "OKINAWA"];

export const isRemoteRegion = (region: Region): boolean =>
  REMOTE_REGIONS.includes(region);
