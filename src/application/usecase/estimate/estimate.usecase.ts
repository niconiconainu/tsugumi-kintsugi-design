import { toDamageAnalysis } from "@/application/dto/common/damage-analysis.input";
import { toDesignOption } from "@/application/dto/common/design-option.input";
import type { CalculateEstimateInput } from "@/application/dto/estimate/calculate-estimate.input";
import type { EstimateResult } from "@/application/dto/estimate/estimate.result";
import { EstimateService } from "@/domain/service/estimate/estimate.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class EstimateUseCase {
  constructor(private readonly estimateService: EstimateService) {}

  async calculateEstimate(
    input: CalculateEstimateInput
  ): Promise<EstimateResult> {
    try {
      const estimate = await this.estimateService.calculate({
        workshopId: input.workshopId,
        analysis: toDamageAnalysis(input.analysis),
        design: toDesignOption(input.design),
        prefecture: input.prefecture,
      });
      return { estimate };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[EstimateUseCase] Failed to calculate estimate.", error);
      throw new CustomError(ErrorConfig.ESTIMATE_CALCULATION_FAILED);
    }
  }
}
