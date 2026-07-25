import { WorkshopUseCase } from "@/application/usecase/workshop/workshop.usecase";
import { recommendWorkshopsSchema } from "@/presentation/controller/v1/workshop/dto/recommend-workshops.request";
import {
  toRecommendationsResponse,
  type RecommendationsResponse,
} from "@/presentation/controller/v1/workshop/dto/recommendations.response";

export class WorkshopController {
  constructor(private readonly workshopUseCase: WorkshopUseCase) {}

  /**
   * POST /api/recommendations
   * 工房候補をスコアリングし、優先条件の順に並べて返す
   */
  async recommend(request: Request): Promise<RecommendationsResponse> {
    const body = recommendWorkshopsSchema.parse(await request.json());
    const result = await this.workshopUseCase.recommendWorkshops(body);
    return toRecommendationsResponse(result, body.locale);
  }
}
