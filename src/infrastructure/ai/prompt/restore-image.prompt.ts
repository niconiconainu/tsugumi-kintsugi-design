import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { Material } from "@/constants/artifact/damage";
import type { MetalColor } from "@/constants/design/expression";
import type { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";

const METAL_PHRASE: Record<MetalColor, string> = {
  gold: "lustrous gold",
  silver: "lustrous silver",
  red_gold: "red-gold (bengara lacquer under gold)",
};

/** `other` のまま差し込むと「Show this exact other」になるので言い換える。 */
const OBJECT_WORD: Partial<Record<ArtifactType, string>> = { other: "vessel" };

export const RESTORE_NEGATIVE_PROMPT =
  "still broken, separate fragments, gaps between pieces, missing pieces, " +
  "new object, extra decoration, text, watermark, changed background";

/**
 * 金継ぎ復元（step2）。
 *
 * **命令を先頭に置くこと。** 禁止事項を先に書くと「変えるな」が「直せ」に勝ち、
 * 割れたままの画像が返ってくる（実測で確認済み）。
 */
export const buildRestoreImagePrompt = (params: {
  artifactType: ArtifactType;
  material: Material;
  metalColor: MetalColor;
  brief: RestorationBrief;
}): string => {
  const piece = OBJECT_WORD[params.artifactType] ?? params.artifactType.replace("_", " ");

  return `Reassemble this broken ${piece} into ONE whole, intact ${piece}, repaired with
traditional Japanese kintsugi.

The fragments in the photo must be joined back together so the ${piece} is complete: no gaps
between pieces, no separate shards lying apart, no holes. Missing chips are filled. Every
fracture line where the pieces meet is sealed with ${METAL_PHRASE[params.metalColor]} lacquer,
forming thin organic seams that follow the real cracks: ${params.brief.damageDescription}

Keep the same ${piece}: ${params.brief.designDescription} Keep the same ${params.material}
glaze, pattern and colours, the same lighting, camera angle and background:
${params.brief.framing}

Do not add decoration beyond the seams. Do not change the pattern, colour or shape. Do not add
text or extra objects. Photorealistic, same aspect ratio as the input.`;
};
