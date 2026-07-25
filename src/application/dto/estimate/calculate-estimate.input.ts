import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignOptionInput } from "@/application/dto/common/design-option.input";
import type { Prefecture } from "@/constants/region/prefecture";

export interface CalculateEstimateInput {
  workshopId: string;
  analysis: DamageAnalysisInput;
  design: DesignOptionInput;
  prefecture: Prefecture;
}
