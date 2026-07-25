import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignOptionInput } from "@/application/dto/common/design-option.input";
import type { DesignTaste } from "@/constants/design/taste";
import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";
import type { Prefecture } from "@/constants/region/prefecture";

export interface RecommendWorkshopsInput {
  analysis: DamageAnalysisInput;
  design: DesignOptionInput;
  tastes: DesignTaste[];
  prefecture: Prefecture;
  priority: MatchPriority;
  /** 説明文を書く言語 */
  locale: Locale;
}
