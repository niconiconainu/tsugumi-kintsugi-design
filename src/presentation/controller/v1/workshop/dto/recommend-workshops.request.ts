import { z } from "zod";
import { DESIGN_TASTES } from "@/constants/design/taste";
import { MATCH_PRIORITIES } from "@/constants/project/priority";
import { PREFECTURES } from "@/constants/region/prefecture";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";
import { designOptionSchema } from "@/presentation/dto/common/design-option.schema";

export const recommendWorkshopsSchema = z
  .object({
    analysis: damageAnalysisSchema,
    design: designOptionSchema,
    tastes: z.array(z.enum(DESIGN_TASTES)).max(4).default([]),
    prefecture: z.enum(PREFECTURES),
    priority: z.enum(MATCH_PRIORITIES),
  })
  .strict();

export type RecommendWorkshopsRequest = z.infer<
  typeof recommendWorkshopsSchema
>;
