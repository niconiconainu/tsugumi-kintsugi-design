import { z } from "zod";
import { LOCALES } from "@/constants/i18n/locale";
import { MATCH_PRIORITIES } from "@/constants/project/priority";
import { PREFECTURES } from "@/constants/region/prefecture";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";
import { designOptionSchema } from "@/presentation/dto/common/design-option.schema";

export const saveProjectSchema = z
  .object({
    /** 生成される文章の言語 */
    locale: z.enum(LOCALES),
    prefecture: z.enum(PREFECTURES),
    priority: z.enum(MATCH_PRIORITIES),
    analysis: damageAnalysisSchema,
    designs: z.array(designOptionSchema).min(1).max(5),
    selectedDesignId: z.string().min(1),
    selectedWorkshopId: z.string().min(1).nullable(),
  })
  .strict();

export type SaveProjectRequest = z.infer<typeof saveProjectSchema>;
