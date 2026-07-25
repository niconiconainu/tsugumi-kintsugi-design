import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignOptionInput } from "@/application/dto/common/design-option.input";
import type { DesignTaste } from "@/constants/design/taste";
import type { MatchPriority } from "@/constants/project/priority";
import type { Prefecture } from "@/constants/region/prefecture";

export interface RecommendWorkshopsInput {
  analysis: DamageAnalysisInput;
  design: DesignOptionInput;
  tastes: DesignTaste[];
  prefecture: Prefecture;
  priority: MatchPriority;
}
