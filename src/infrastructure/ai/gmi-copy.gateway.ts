import { isDemoMode } from "@/config/env";
import {
  buildMockCandidateCopy,
  buildMockProjectSummary,
  type CandidateCopyInput,
  type ProjectSummaryInput,
} from "@/infrastructure/ai/mock/copy.mock";
import { logger } from "@/utils/logger";

/**
 * GMI Cloud の Copy Agent（軽量・高速モデル）へのゲートウェイ。
 *
 * ⚠️ 現状は **MOCK 実装**。渡された事実（スコア・金額・日数）を言い換えるだけで、
 * 数値の生成や再計算は一切しない（設計書 4.4）。
 * 実 API へ差し替えるときは `callCopyModel()` の中だけを書き換える。
 */
export class GmiCopyGateway {
  async writeCandidateCopy(input: CandidateCopyInput): Promise<string> {
    if (isDemoMode()) return buildMockCandidateCopy(input);
    return this.callCopyModel(() => buildMockCandidateCopy(input));
  }

  async writeProjectSummary(input: ProjectSummaryInput): Promise<string> {
    if (isDemoMode()) return buildMockProjectSummary(input);
    return this.callCopyModel(() => buildMockProjectSummary(input));
  }

  /**
   * TODO(AI): GMI Cloud の OpenAI 互換 Chat Completions（`GMI_COPY_MODEL`）を呼ぶ。
   * 失敗時は Mock 文面へ落として、説明文が無くてもデモが止まらないようにする。
   */
  private async callCopyModel(fallback: () => string): Promise<string> {
    logger.warn(
      "[GmiCopyGateway] Copy model is not wired yet. Falling back to mock copy."
    );
    return fallback();
  }
}
