import type { DamageType, Material } from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";

export interface AnalyzeImageInput {
  /** 所見を書く言語 */
  locale: Locale;
  /** data URL 形式の画像。保存はせず、解析のためだけに受け取る。 */
  imageDataUrl: string;
  /** Vision が使えないときにユーザーが手で選んだ値（設計書 6.3） */
  declaredDamageType?: DamageType;
  declaredMaterial?: Material;
}
