import { z } from "zod";
import { DAMAGE_TYPES, MATERIALS } from "@/constants/artifact/damage";
import { LOCALES } from "@/constants/i18n/locale";

export const analyzeImageSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    /** data URL（JPEG / PNG）。サーバーには保存しない。 */
    imageDataUrl: z.string().startsWith("data:image/"),
    /** Vision が使えないときの手入力（設計書 6.3 のフォールバック導線） */
    declaredDamageType: z.enum(DAMAGE_TYPES).optional(),
    declaredMaterial: z.enum(MATERIALS).optional(),
  })
  .strict();

export type AnalyzeImageRequest = z.infer<typeof analyzeImageSchema>;
