import { z } from "zod";
import {
  DESIGN_COMPLEXITIES,
  LINE_STYLES,
  METAL_COLORS,
} from "@/constants/design/taste";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";

/** デザイン案の wire スキーマ。選択した案を後続 API へ送り返すのに使う。 */
export const designOptionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  concept: z.string(),
  lineStyle: z.enum(LINE_STYLES),
  metalColor: z.enum(METAL_COLORS),
  complexity: z.enum(DESIGN_COMPLEXITIES),
  rationale: z.string(),
  motifKeywords: z.array(z.string()),
  linePaths: z.array(z.string()),
  source: z.enum(["llm", "template"]),
});

export type DesignOptionResponse = z.infer<typeof designOptionSchema>;

export const toDesignOptionResponse = (
  design: DesignOption
): DesignOptionResponse => ({
  id: design.id,
  title: design.title,
  concept: design.concept,
  lineStyle: design.lineStyle,
  metalColor: design.metalColor,
  complexity: design.complexity,
  rationale: design.rationale,
  motifKeywords: design.motifKeywords,
  linePaths: design.linePaths,
  source: design.source,
});
