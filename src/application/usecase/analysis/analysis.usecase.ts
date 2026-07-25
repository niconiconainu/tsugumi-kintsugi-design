import type { AnalysisResult } from "@/application/dto/analysis/analysis.result";
import type { AnalyzeImageInput } from "@/application/dto/analysis/analyze-image.input";
import { ImageAnalysisService } from "@/domain/service/analysis/image-analysis.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class AnalysisUseCase {
  constructor(private readonly imageAnalysisService: ImageAnalysisService) {}

  async analyzeImage(input: AnalyzeImageInput): Promise<AnalysisResult> {
    try {
      const analysis = await this.imageAnalysisService.analyze({
        imageDataUrl: input.imageDataUrl,
        hints: {
          damageType: input.declaredDamageType,
          material: input.declaredMaterial,
        },
      });
      return { analysis };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[AnalysisUseCase] Failed to analyze image.", error);
      throw new CustomError(ErrorConfig.IMAGE_ANALYSIS_FAILED);
    }
  }
}
