import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { Locale } from "@/constants/i18n/locale";

export interface GenerateDesignsInput {
  analysis: DamageAnalysisInput;
  /** 案の文章を書く言語 */
  locale: Locale;
}
