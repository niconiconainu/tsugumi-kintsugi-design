import { postJson } from "@/features/common/utils/api-client";
import type { RecommendWorkshopsRequest } from "@/presentation/controller/v1/workshop/dto/recommend-workshops.request";
import type { RecommendationsResponse } from "@/presentation/controller/v1/workshop/dto/recommendations.response";

export const recommendWorkshops = (
  body: RecommendWorkshopsRequest
): Promise<RecommendationsResponse> =>
  postJson<RecommendationsResponse>("/api/recommendations", body);
