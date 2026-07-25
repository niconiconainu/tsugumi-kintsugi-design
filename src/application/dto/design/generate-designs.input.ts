import type { DamageAnalysisInput } from "@/application/dto/common/damage-analysis.input";
import type { DesignTaste } from "@/constants/design/taste";

export interface GenerateDesignsInput {
  story: string;
  tastes: DesignTaste[];
  analysis: DamageAnalysisInput;
}
