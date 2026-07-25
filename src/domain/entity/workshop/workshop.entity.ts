import type { Material } from "@/constants/artifact/damage";
import type {
  DesignComplexity,
  DesignTaste,
  MetalColor,
} from "@/constants/design/taste";
import type { Prefecture } from "@/constants/region/prefecture";
import type { Region } from "@/constants/region/region";

/**
 * 工房プロフィール（設計書 5.1 の Mock データ）。
 * 架空の工房であり、実在の事業者ではない。
 */
export class Workshop {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly prefecture: Prefecture,
    readonly region: Region,
    /** 「伝統金継ぎ」「意匠性の高い金継ぎ」など、工房の看板 */
    readonly type: string,
    readonly description: string,
    /** 基本料金（円） */
    readonly basePrice: number,
    /** 標準的な修理日数 */
    readonly repairDays: number,
    /** 着手までの工房待機日数 */
    readonly queueDays: number,
    /** 得意なテイスト */
    readonly styleTags: readonly DesignTaste[],
    /** 扱える素材 */
    readonly materialSkills: readonly Material[],
    /** 対応できる金属表現 */
    readonly metalColors: readonly MetalColor[],
    /** 引き受けられるデザインの手間の上限 */
    readonly maxComplexity: DesignComplexity,
    /** 本漆を使うか（簡易金継ぎとの区別。設計書 8「文化的配慮」） */
    readonly usesUrushi: boolean
  ) {}
}
