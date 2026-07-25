import { z } from "zod";
import { PREFECTURES } from "@/constants/region/prefecture";
import { damageAnalysisSchema } from "@/presentation/dto/common/damage-analysis.schema";
import { designOptionSchema } from "@/presentation/dto/common/design-option.schema";

export const calculateEstimateSchema = z
  .object({
    workshopId: z.string().min(1),
    analysis: damageAnalysisSchema,
    design: designOptionSchema,
    prefecture: z.enum(PREFECTURES),
  })
  .strict();

export type CalculateEstimateRequest = z.infer<typeof calculateEstimateSchema>;
