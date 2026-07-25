import { toDamageAnalysis } from "@/application/dto/common/damage-analysis.input";
import type { DesignsResult } from "@/application/dto/design/designs.result";
import type { GenerateDesignsInput } from "@/application/dto/design/generate-designs.input";
import { DesignService } from "@/domain/service/design/design.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class DesignUseCase {
  constructor(private readonly designService: DesignService) {}

  async generateDesigns(input: GenerateDesignsInput): Promise<DesignsResult> {
    try {
      const analysis = toDamageAnalysis(input.analysis);
      const designs = await this.designService.generate({
        analysis,
        locale: input.locale,
        // 同じ入力なら同じ 3 案・同じ継ぎ線になるよう、入力から seed を作る。
        seed: [
          analysis.objectType,
          analysis.material,
          analysis.damageType,
          analysis.crackCount,
        ].join(":"),
      });
      return { designs };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[DesignUseCase] Failed to generate designs.", error);
      throw new CustomError(ErrorConfig.DESIGN_GENERATION_FAILED);
    }
  }
}
