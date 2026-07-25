import type { AnalysisResult } from "@/application/dto/analysis/analysis.result";
import {
  toDamageAnalysisResponse,
  type DamageAnalysisResponse,
} from "@/presentation/dto/common/damage-analysis.schema";

export interface AnalysisResponse {
  analysis: DamageAnalysisResponse;
}

export const toAnalysisResponse = (result: AnalysisResult): AnalysisResponse => ({
  analysis: toDamageAnalysisResponse(result.analysis),
});
