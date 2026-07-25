import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignOptionInput } from "@/application/dto/common/design-option.input";
import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";
import type { Prefecture } from "@/constants/region/prefecture";

export interface SaveProjectInput {
  prefecture: Prefecture;
  priority: MatchPriority;
  analysis: DamageAnalysisInput;
  designs: DesignOptionInput[];
  selectedDesignId: string;
  selectedWorkshopId: string | null;
  /** まとめ文を書く言語 */
  locale: Locale;
}
