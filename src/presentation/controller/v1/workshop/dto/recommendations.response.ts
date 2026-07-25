import type { RecommendationsResult } from "@/application/dto/workshop/recommendations.result";
import type { MatchPriority } from "@/constants/project/priority";
import {
  toWorkshopCandidateResponse,
  type WorkshopCandidateResponse,
} from "@/presentation/dto/common/workshop-candidate.schema";

export interface RecommendationsResponse {
  priority: MatchPriority;
  candidates: WorkshopCandidateResponse[];
}

export const toRecommendationsResponse = (
  result: RecommendationsResult
): RecommendationsResponse => ({
  priority: result.priority,
  candidates: result.candidates.map(toWorkshopCandidateResponse),
});
