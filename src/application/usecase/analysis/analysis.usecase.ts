import type { AnalysisResult } from "@/application/dto/analysis/analysis.result";
import type { AnalyzeImageInput } from "@/application/dto/analysis/analyze-image.input";
import { ImageRejectedError } from "@/domain/entity/artifact/image-rejected.error";
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
        locale: input.locale,
        declared: {
          artifactType: input.declaredArtifactType,
          material: input.declaredMaterial,
          damageType: input.declaredDamageType,
        },
      });
      return { analysis };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      // 検品で弾かれた場合は、Vision が書いた理由をそのままユーザーへ返す。
      if (error instanceof ImageRejectedError) {
        throw new CustomError({
          ...ErrorConfig.IMAGE_NOT_REPAIRABLE,
          message: error.userMessage,
        });
      }
      logger.error("[AnalysisUseCase] Failed to analyze image.", error);
      throw new CustomError(ErrorConfig.IMAGE_ANALYSIS_FAILED);
    }
  }
}
