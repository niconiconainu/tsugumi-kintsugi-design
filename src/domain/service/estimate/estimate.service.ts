import { toRegion, type Prefecture } from "@/constants/region/prefecture";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type { Estimate } from "@/domain/entity/estimate/estimate.entity";
import { LogisticsService } from "@/domain/service/logistics/logistics.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { WorkshopRepository } from "@/infrastructure/repository/workshop/workshop.repository";
import { logger } from "@/utils/logger";

export interface CalculateEstimateParams {
  workshopId: string;
  analysis: DamageAnalysis;
  design: DesignOption;
  prefecture: Prefecture;
}

/**
 * 単一工房の概算見積（設計書 4.1 の Logistics Tool）。
 * 工房の取得だけ infra に触り、計算は純粋サービスの LogisticsService に委ねる。
 */
export class EstimateService {
  constructor(
    private readonly workshopRepository: WorkshopRepository,
    private readonly logisticsService: LogisticsService
  ) {}

  async calculate(params: CalculateEstimateParams): Promise<Estimate> {
    try {
      const workshop = await this.workshopRepository.findById(params.workshopId);
      if (!workshop) {
        throw new CustomError(ErrorConfig.WORKSHOP_NOT_FOUND);
      }
      return this.logisticsService.buildEstimate({
        workshop,
        analysis: params.analysis,
        design: params.design,
        from: toRegion(params.prefecture),
      });
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error(
        `[EstimateService] Failed to calculate estimate. workshopId=${params.workshopId}`,
        error
      );
      throw error;
    }
  }
}
