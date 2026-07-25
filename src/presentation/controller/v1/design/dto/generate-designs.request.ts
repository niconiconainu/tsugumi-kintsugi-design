import { z } from "zod";
import { LOCALES } from "@/constants/i18n/locale";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";

export const generateDesignsSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    analysis: damageAnalysisSchema,
  })
  .strict();

export type GenerateDesignsRequest = z.infer<typeof generateDesignsSchema>;
