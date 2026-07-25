import type { Estimate } from "@/domain/entity/estimate/estimate.entity";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";

/** 総合スコアの内訳（0〜1 の各項と、重み付け後の合計）。 */
export interface MatchScore {
  /** デザイン相性 */
  design: number;
  /** 価格（候補群の中で安いほど高い） */
  price: number;
  /** 納期（短いほど高い） */
  speed: number;
  /** 距離（近いほど高い） */
  distance: number;
  /** 重み付け後の総合スコア（0〜1） */
  total: number;
}

/**
 * 工房 1 件ぶんの比較結果。
 * `matchReasons` / `cautions` はコードが立てた事実、`explanation` は Copy Agent（LLM）が
 * その事実を言い換えた文章。スコアと金額は LLM が触らない（設計書 4.4）。
 */
export class WorkshopCandidate {
  constructor(
    readonly workshop: Workshop,
    readonly estimate: Estimate,
    readonly score: MatchScore,
    readonly matchReasons: string[],
    readonly cautions: string[],
    readonly explanation: string
  ) {}
}
