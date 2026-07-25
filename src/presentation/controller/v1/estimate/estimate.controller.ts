import { EstimateUseCase } from "@/application/usecase/estimate/estimate.usecase";
import { calculateEstimateSchema } from "@/presentation/controller/v1/estimate/dto/calculate-estimate.request";
import {
  toCalculateEstimateResponse,
  type CalculateEstimateResponse,
} from "@/presentation/controller/v1/estimate/dto/estimate.response";

export class EstimateController {
  constructor(private readonly estimateUseCase: EstimateUseCase) {}

  /**
   * POST /api/estimate
   * 指定した工房について、往復送料・修理費・総額・完成目安を計算する
   */
  async calculate(request: Request): Promise<CalculateEstimateResponse> {
    const body = calculateEstimateSchema.parse(await request.json());
    const result = await this.estimateUseCase.calculateEstimate(body);
    return toCalculateEstimateResponse(result);
  }
}
