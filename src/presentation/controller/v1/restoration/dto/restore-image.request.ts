import { z } from "zod";
import { ARTIFACT_TYPES } from "@/constants/artifact/artifact-type";
import { MATERIALS } from "@/constants/artifact/damage";
import { METAL_COLORS } from "@/constants/design/expression";

export const restoreImageSchema = z
  .object({
    /** data URL（JPEG / PNG）。サーバーには保存しない。 */
    imageDataUrl: z.string().startsWith("data:image/"),
    artifactType: z.enum(ARTIFACT_TYPES),
    material: z.enum(MATERIALS),
    metalColor: z.enum(METAL_COLORS).default("gold"),
    brief: z.object({
      damageDescription: z.string(),
      designDescription: z.string(),
      framing: z.string(),
    }),
  })
  .strict();

export type RestoreImageRequest = z.infer<typeof restoreImageSchema>;
