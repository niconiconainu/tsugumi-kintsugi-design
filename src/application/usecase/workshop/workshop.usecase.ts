import { toDamageAnalysis } from "@/application/dto/common/damage-analysis.input";
import { toDesignOption } from "@/application/dto/common/design-option.input";
import type { RecommendWorkshopsInput } from "@/application/dto/workshop/recommend-workshops.input";
import type { RecommendationsResult } from "@/application/dto/workshop/recommendations.result";
import { RECOMMENDED_WORKSHOP_LIMIT } from "@/constants/workshop/matching";
import { WorkshopMatcherService } from "@/domain/service/workshop/workshop-matcher.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class WorkshopUseCase {
  constructor(
    private readonly workshopMatcherService: WorkshopMatcherService
  ) {}

  async recommendWorkshops(
    input: RecommendWorkshopsInput
  ): Promise<RecommendationsResult> {
    try {
      const candidates = await this.workshopMatcherService.match({
        analysis: toDamageAnalysis(input.analysis),
        design: toDesignOption(input.design),
        tastes: input.tastes,
        prefecture: input.prefecture,
        priority: input.priority,
        limit: RECOMMENDED_WORKSHOP_LIMIT,
      });
      if (candidates.length === 0) {
        throw new CustomError(ErrorConfig.WORKSHOP_NOT_FOUND);
      }
      return { candidates, priority: input.priority };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[WorkshopUseCase] Failed to recommend workshops.", error);
      throw new CustomError(ErrorConfig.INTERNAL_SERVER_ERROR);
    }
  }
}
