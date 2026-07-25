import { postJson } from "@/features/common/utils/api-client";
import type { AnalysisResponse } from "@/presentation/controller/v1/analysis/dto/analysis.response";
import type { AnalyzeImageRequest } from "@/presentation/controller/v1/analysis/dto/analyze-image.request";

export const analyzeImage = (
  body: AnalyzeImageRequest
): Promise<AnalysisResponse> => postJson<AnalysisResponse>("/api/analyze", body);
