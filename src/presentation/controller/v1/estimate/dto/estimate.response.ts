import type { EstimateResult } from "@/application/dto/estimate/estimate.result";
import {
  toEstimateResponse,
  type EstimateResponse,
} from "@/presentation/dto/common/estimate.schema";

export interface CalculateEstimateResponse {
  estimate: EstimateResponse;
}

export const toCalculateEstimateResponse = (
  result: EstimateResult
): CalculateEstimateResponse => ({
  estimate: toEstimateResponse(result.estimate),
});
