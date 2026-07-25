import { isDemoMode } from "@/config/env";
import type { DesignTaste } from "@/constants/design/taste";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignDraft } from "@/domain/entity/design/design-draft";
import type { DesignSource } from "@/domain/entity/design/design-option.entity";
import { buildMockDesignDrafts } from "@/infrastructure/ai/mock/design.mock";
import { logger } from "@/utils/logger";

export interface GenerateDesignParams {
  story: string;
  tastes: readonly DesignTaste[];
  analysis: DamageAnalysis;
  /** 同じ入力なら同じ案になるようにするための seed */
  seed: string;
}

export interface GenerateDesignResult {
  drafts: DesignDraft[];
  /** 案がどこから来たか。DEMO_MODE の Mock は `template` 扱いにする。 */
  source: DesignSource;
}

/**
 * GMI Cloud の Design Agent（創造性重視モデル）へのゲートウェイ。
 *
 * ⚠️ 現状は **MOCK 実装**。利用可能モデルと Base URL が未確定のため、
 * DEMO_MODE=true の間はテンプレート表からストーリー・テイストに合う 3 案を選んで返す。
 * 実 API へ差し替えるときは `callDesignModel()` の中だけを書き換える。
 */
export class GmiDesignGateway {
  async generate(params: GenerateDesignParams): Promise<GenerateDesignResult> {
    if (isDemoMode()) {
      logger.info("[GmiDesignGateway] DEMO_MODE: returning mock design drafts.");
      return { drafts: buildMockDesignDrafts(params), source: "template" };
    }
    return this.callDesignModel(params);
  }

  /** GMI 失敗時に返す事前定義テンプレート（設計書 6.3）。 */
  buildFallback(params: GenerateDesignParams): DesignDraft[] {
    return buildMockDesignDrafts(params);
  }

  /**
   * TODO(AI): GMI Cloud の OpenAI 互換 Chat Completions を呼ぶ。
   * - `GMI_BASE_URL` / `GMI_API_KEY` / `GMI_DESIGN_MODEL` は env に定義済み。
   * - DesignDraft[] を JSON mode で受け取り、3 件に満たない場合はテンプレートで補う。
   */
  private async callDesignModel(
    params: GenerateDesignParams
  ): Promise<GenerateDesignResult> {
    logger.warn(
      "[GmiDesignGateway] Design model is not wired yet. Falling back to templates."
    );
    return { drafts: buildMockDesignDrafts(params), source: "template" };
  }
}
