/**
 * 器の種類。写真と一緒にユーザーが選び、そのまま解析結果の `objectType` になる。
 *
 * 和食器と洋食器を 1 つの表に混ぜている。種類ごとに処理が変わるわけではなく
 * 表示ラベルが違うだけなので、クラスに割らずカタログ表で持つ。
 */
export const ARTIFACT_TYPES = [
  "rice_bowl",
  "bowl",
  "small_bowl",
  "plate",
  "cup",
  "mug",
  "teapot",
  "pitcher",
  "sake_vessel",
  "vase",
  "other",
] as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];
