import type { RecommendationsResult } from "@/application/dto/workshop/recommendations.result";
import type { Locale } from "@/constants/i18n/locale";
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
  result: RecommendationsResult,
  locale: Locale
): RecommendationsResponse => ({
  priority: result.priority,
  candidates: result.candidates.map((candidate) =>
    toWorkshopCandidateResponse(candidate, locale)
  ),
});
