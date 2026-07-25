import type {
  DesignComplexity,
  LineStyle,
  MetalColor,
} from "@/constants/design/taste";
import {
  DesignOption,
  type DesignSource,
} from "@/domain/entity/design/design-option.entity";

/** デザイン案の転送形。クライアントが選んだ案を後続 API へ送り返すときに使う。 */
export interface DesignOptionInput {
  id: string;
  title: string;
  concept: string;
  lineStyle: LineStyle;
  metalColor: MetalColor;
  complexity: DesignComplexity;
  rationale: string;
  motifKeywords: string[];
  linePaths: string[];
  source: DesignSource;
}

export const toDesignOption = (input: DesignOptionInput): DesignOption =>
  new DesignOption(
    input.id,
    input.title,
    input.concept,
    input.lineStyle,
    input.metalColor,
    input.complexity,
    input.rationale,
    input.motifKeywords,
    input.linePaths,
    input.source
  );
