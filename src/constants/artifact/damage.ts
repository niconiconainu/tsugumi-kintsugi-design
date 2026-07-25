/** 素材。Qwen の画像解析結果と、解析失敗時のユーザー手入力の両方で使う。 */
export const MATERIALS = [
  "ceramic",
  "porcelain",
  "glass",
  "lacquerware",
  "stoneware",
  "unknown",
] as const;

export type Material = (typeof MATERIALS)[number];

export const MATERIAL_LABEL: Record<Material, string> = {
  ceramic: "陶器",
  porcelain: "磁器",
  glass: "ガラス",
  lacquerware: "漆器",
  stoneware: "炻器",
  unknown: "不明",
};

export const DAMAGE_TYPES = [
  "chip",
  "crack",
  "crack_and_chip",
  "break",
  "missing_piece",
] as const;

export type DamageType = (typeof DAMAGE_TYPES)[number];

export const DAMAGE_TYPE_LABEL: Record<DamageType, string> = {
  chip: "欠け",
  crack: "ひび",
  crack_and_chip: "ひび＋欠け",
  break: "割れ（分断）",
  missing_piece: "欠損（破片なし）",
};

export const DAMAGE_SEVERITIES = ["light", "medium", "heavy"] as const;

export type DamageSeverity = (typeof DAMAGE_SEVERITIES)[number];

export const DAMAGE_SEVERITY_LABEL: Record<DamageSeverity, string> = {
  light: "軽度",
  medium: "中度",
  heavy: "重度",
};

/**
 * 破損度による修理料金の加算（円）と修理日数の加算（日）。
 * 設計書 5.3「修理料金 = 基本料金 + 破損度加算 + デザイン加算」の破損度加算にあたる。
 */
export const DAMAGE_SEVERITY_SURCHARGE: Record<
  DamageSeverity,
  { fee: number; days: number }
> = {
  light: { fee: 0, days: 0 },
  medium: { fee: 3000, days: 3 },
  heavy: { fee: 8000, days: 7 },
};

/** ひび 1 本あたりの加算（1 本目は基本料金に含む）。 */
export const CRACK_SURCHARGE_PER_LINE = 1500;

/** 欠損の補填が必要になる面積比の閾値と、その加算。 */
export const MISSING_AREA_THRESHOLD = 0.02;
export const MISSING_AREA_SURCHARGE = 4000;
