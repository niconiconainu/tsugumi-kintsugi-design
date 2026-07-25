import { AnalysisUseCase } from "@/application/usecase/analysis/analysis.usecase";
import { MAX_IMAGE_DATA_URL_LENGTH } from "@/constants/artifact/image";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { analyzeImageSchema } from "@/presentation/controller/v1/analysis/dto/analyze-image.request";
import {
  toAnalysisResponse,
  type AnalysisResponse,
} from "@/presentation/controller/v1/analysis/dto/analysis.response";

export class AnalysisController {
  constructor(private readonly analysisUseCase: AnalysisUseCase) {}

  /**
   * POST /api/analyze
   * 画像を解析し、素材・色・破損状態の構造化 JSON を返す
   */
  async analyze(request: Request): Promise<AnalysisResponse> {
    const body = analyzeImageSchema.parse(await request.json());
    if (body.imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      throw new CustomError(ErrorConfig.IMAGE_TOO_LARGE);
    }
    const result = await this.analysisUseCase.analyzeImage(body);
    return toAnalysisResponse(result);
  }
}
