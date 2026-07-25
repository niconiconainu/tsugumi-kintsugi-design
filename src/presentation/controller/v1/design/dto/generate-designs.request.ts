import { z } from "zod";
import { DESIGN_TASTES } from "@/constants/design/taste";
import { LOCALES } from "@/constants/i18n/locale";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";

export const generateDesignsSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    story: z.string().max(2000).default(""),
    tastes: z.array(z.enum(DESIGN_TASTES)).max(4).default([]),
    analysis: damageAnalysisSchema,
  })
  .strict();

export type GenerateDesignsRequest = z.infer<typeof generateDesignsSchema>;
