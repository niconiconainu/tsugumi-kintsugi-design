import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { AnalyzeImageParams } from "@/infrastructure/ai/qwen-image-analysis.gateway";
import { ImageRejectedError } from "@/domain/entity/artifact/image-rejected.error";
import { QwenImageAnalysisGateway } from "@/infrastructure/ai/qwen-image-analysis.gateway";
import { logger } from "@/utils/logger";

/**
 * 画像解析の取得 orchestration（設計書 4.1 の Image Analyzer）。
 * Vision が落ちてもデモを止めないため、失敗は Mock 解析へフォールバックする（設計書 6.3）。
 */
export class ImageAnalysisService {
  constructor(
    private readonly qwenImageAnalysisGateway: QwenImageAnalysisGateway
  ) {}

  async analyze(params: AnalyzeImageParams): Promise<DamageAnalysis> {
    try {
      return await this.qwenImageAnalysisGateway.analyze(params);
    } catch (error) {
      // 「金継ぎできない写真」は失敗ではなく判定結果なので、Mock で握りつぶさない。
      if (error instanceof ImageRejectedError) throw error;
      logger.error(
        "[ImageAnalysisService] Vision analysis failed. Falling back to user-declared damage.",
        error
      );
      return this.qwenImageAnalysisGateway.buildFallback(params);
    }
  }
}
