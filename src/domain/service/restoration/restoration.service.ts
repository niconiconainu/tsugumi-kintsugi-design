import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { Material } from "@/constants/artifact/damage";
import type { MetalColor } from "@/constants/design/expression";
import type { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import { QwenImageRestoreGateway } from "@/infrastructure/ai/qwen-image-restore.gateway";
import { logger } from "@/utils/logger";

export interface RestoreParams {
  imageDataUrl: string;
  artifactType: ArtifactType;
  material: Material;
  metalColor: MetalColor;
  brief: RestorationBrief;
}

/**
 * 金継ぎ復元画像の取得 orchestration。
 * 画像生成が落ちても相談の流れは続けられるので、失敗は null に倒して上へ返す
 * （画面はアップロード写真のまま次へ進む）。
 */
export class RestorationService {
  constructor(
    private readonly qwenImageRestoreGateway: QwenImageRestoreGateway
  ) {}

  async restore(params: RestoreParams): Promise<string | null> {
    try {
      return await this.qwenImageRestoreGateway.restore(params);
    } catch (error) {
      logger.error(
        "[RestorationService] Image restoration failed. Continuing without the image.",
        error
      );
      return null;
    }
  }
}
