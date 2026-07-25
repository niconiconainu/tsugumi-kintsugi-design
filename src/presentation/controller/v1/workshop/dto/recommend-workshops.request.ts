import { z } from "zod";
import { LOCALES } from "@/constants/i18n/locale";
import { MATCH_PRIORITIES } from "@/constants/project/priority";
import { PREFECTURES } from "@/constants/region/prefecture";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";
import { designOptionSchema } from "@/presentation/dto/common/design-option.schema";

export const recommendWorkshopsSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    analysis: damageAnalysisSchema,
    design: designOptionSchema,
    prefecture: z.enum(PREFECTURES),
    priority: z.enum(MATCH_PRIORITIES),
  })
  .strict();

export type RecommendWorkshopsRequest = z.infer<
  typeof recommendWorkshopsSchema
>;
