import { z } from "zod";
import { ARTIFACT_TYPES } from "@/constants/artifact/artifact-type";
import { DAMAGE_TYPES, MATERIALS } from "@/constants/artifact/damage";
import { LOCALES } from "@/constants/i18n/locale";

export const analyzeImageSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    /** data URL（JPEG / PNG）。サーバーには保存しない。 */
    imageDataUrl: z.string().startsWith("data:image/"),
    /** 写真と一緒にユーザーが選んだ器の種類・素材。解析より優先する。 */
    declaredArtifactType: z.enum(ARTIFACT_TYPES),
    declaredMaterial: z.enum(MATERIALS),
    /** Vision が使えないときの手入力（設計書 6.3 のフォールバック導線） */
    declaredDamageType: z.enum(DAMAGE_TYPES).optional(),
  })
  .strict();

export type AnalyzeImageRequest = z.infer<typeof analyzeImageSchema>;
