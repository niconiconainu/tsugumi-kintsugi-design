import type {
  DesignComplexity,
  LineStyle,
  MetalColor,
} from "@/constants/design/taste";

/**
 * Design Agent（LLM）が生み出す創作部分だけを表す型。
 * 継ぎ線のプレビュー形状はコード側で描くため、ここには含めない（設計書 4.4 の境界）。
 */
export interface DesignDraft {
  id: string;
  title: string;
  concept: string;
  lineStyle: LineStyle;
  metalColor: MetalColor;
  complexity: DesignComplexity;
  rationale: string;
  motifKeywords: string[];
}
