import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { Material } from "@/constants/artifact/damage";
import type { MetalColor } from "@/constants/design/expression";
import { isDemoMode } from "@/config/env";
import type { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import {
  buildRestoreImagePrompt,
  RESTORE_NEGATIVE_PROMPT,
} from "@/infrastructure/ai/prompt/restore-image.prompt";
import { callQwenImageEdit } from "@/infrastructure/ai/qwen.client";
import { logger } from "@/utils/logger";

export interface RestoreImageParams {
  /** ユーザーがアップロードした写真そのもの。これを編集する（新規生成しない）。 */
  imageDataUrl: string;
  artifactType: ArtifactType;
  material: Material;
  metalColor: MetalColor;
  brief: RestorationBrief;
}

/**
 * Qwen Cloud（画像編集）への復元ゲートウェイ。
 *
 * 新しい器を生成するのではなく、**渡された写真を編集する**。
 * 「あなたの器が直った姿」が売りなので、別の器が出てきたら失敗とみなす。
 */
export class QwenImageRestoreGateway {
  /** 復元画像の URL を返す。DEMO_MODE の間は null（画面は元写真のまま）。 */
  async restore(params: RestoreImageParams): Promise<string | null> {
    if (isDemoMode()) {
      logger.info("[QwenImageRestoreGateway] DEMO_MODE: skipping image edit.");
      return null;
    }

    if (!params.brief.isUsable) {
      logger.warn(
        "[QwenImageRestoreGateway] Restoration brief is empty. Skipping image edit."
      );
      return null;
    }

    const prompt = buildRestoreImagePrompt({
      artifactType: params.artifactType,
      material: params.material,
      metalColor: params.metalColor,
      brief: params.brief,
    });

    return callQwenImageEdit({
      imageDataUrl: params.imageDataUrl,
      prompt,
      negativePrompt: RESTORE_NEGATIVE_PROMPT,
    });
  }
}
