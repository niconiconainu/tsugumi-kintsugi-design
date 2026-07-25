import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { Material } from "@/constants/artifact/damage";
import type { MetalColor } from "@/constants/design/expression";

export interface RestoreImageInput {
  /** ユーザーがアップロードした写真。保存はせず、編集のためだけに受け取る。 */
  imageDataUrl: string;
  artifactType: ArtifactType;
  material: Material;
  metalColor: MetalColor;
  brief: {
    damageDescription: string;
    designDescription: string;
    framing: string;
  };
}
