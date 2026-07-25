import type { RestoreImageInput } from "@/application/dto/restoration/restore-image.input";
import type { RestorationResult } from "@/application/dto/restoration/restoration.result";
import { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import { RestorationService } from "@/domain/service/restoration/restoration.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class RestorationUseCase {
  constructor(private readonly restorationService: RestorationService) {}

  async restoreImage(input: RestoreImageInput): Promise<RestorationResult> {
    try {
      const restoredImageUrl = await this.restorationService.restore({
        imageDataUrl: input.imageDataUrl,
        artifactType: input.artifactType,
        material: input.material,
        metalColor: input.metalColor,
        brief: new RestorationBrief(
          input.brief.damageDescription,
          input.brief.designDescription,
          input.brief.framing
        ),
      });
      return { restoredImageUrl };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[RestorationUseCase] Failed to restore image.", error);
      throw new CustomError(ErrorConfig.IMAGE_RESTORE_FAILED);
    }
  }
}
