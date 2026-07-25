import type {
  DesignComplexity,
  LineStyle,
  MetalColor,
} from "@/constants/design/taste";

/** デザイン案の出所。GMI 失敗時は事前定義テンプレート（設計書 6.3）。 */
export type DesignSource = "llm" | "template";

/**
 * 金継ぎデザイン案（設計書 7 の DesignOption）。
 * `linePaths` は破損線を重ねて見せる簡易プレビュー用の SVG path（viewBox 0 0 100 100）。
 * 画像生成は使わず、コードで描画する（設計書 11「画像編集の品質」の代替案）。
 */
export class DesignOption {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly concept: string,
    readonly lineStyle: LineStyle,
    readonly metalColor: MetalColor,
    readonly complexity: DesignComplexity,
    readonly rationale: string,
    readonly motifKeywords: string[],
    readonly linePaths: string[],
    readonly source: DesignSource
  ) {}
}
