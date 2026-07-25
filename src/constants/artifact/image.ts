/** 受け付ける画像形式（設計書 AC-01）。 */
export const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

/** data URL の最大長。おおよそ 6MB のバイナリに相当する。 */
export const MAX_IMAGE_DATA_URL_LENGTH = 8_500_000;

/** ブラウザ側でリサイズするときの最大辺（px）。解析に十分で、転送量を抑えられる大きさ。 */
export const MAX_IMAGE_EDGE_PX = 1280;
