import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignOptionInput } from "@/application/dto/common/design-option.input";
import type { DesignTaste } from "@/constants/design/taste";
import type { MatchPriority } from "@/constants/project/priority";
import type { Prefecture } from "@/constants/region/prefecture";

export interface SaveProjectInput {
  story: string;
  tastes: DesignTaste[];
  prefecture: Prefecture;
  priority: MatchPriority;
  analysis: DamageAnalysisInput;
  designs: DesignOptionInput[];
  selectedDesignId: string;
  selectedWorkshopId: string | null;
}
