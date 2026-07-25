import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { DamageType, Material } from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";
import { isDemoMode } from "@/config/env";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import { buildMockAnalysis } from "@/infrastructure/ai/mock/analysis.mock";
import { hashString } from "@/utils/seeded-random";
import { logger } from "@/utils/logger";

export interface AnalyzeImageParams {
  /** data URL 形式の画像。サーバーには保存しない（設計書 8 プライバシー）。 */
  imageDataUrl: string;
  /** 所見（repairNotes 等）を書く言語。実 API ではプロンプトに載せる。 */
  locale: Locale;
  /**
   * ユーザーの申告値。器の種類と素材は写真と一緒に選ばせるので必ず入る。
   * `damageType` だけは Vision 失敗時の手入力（設計書 6.3 のフォールバック導線）。
   */
  declared: {
    artifactType: ArtifactType;
    material: Material;
    damageType?: DamageType;
  };
}

/**
 * Qwen Cloud（Vision）への画像理解ゲートウェイ。
 *
 * ⚠️ 現状は **MOCK 実装**。当日確認するモデル名 / 画像入力形式 / レート制限が未確定のため、
 * DEMO_MODE=true の間は画像のダイジェストから決定論的なそれらしい JSON を返す。
 * 実 API へ差し替えるときは `callVisionModel()` の中だけを書き換える。
 */
export class QwenImageAnalysisGateway {
  async analyze(params: AnalyzeImageParams): Promise<DamageAnalysis> {
    // 画像そのものは保持せず、ダイジェストだけを Mock の seed に使う。
    const imageDigest = String(hashString(params.imageDataUrl));

    if (isDemoMode()) {
      logger.info("[QwenImageAnalysisGateway] DEMO_MODE: returning mock analysis.");
      return buildMockAnalysis({
        imageDigest,
        locale: params.locale,
        declared: params.declared,
        source: "vision_model",
      });
    }

    return this.callVisionModel(params, imageDigest);
  }

  /** ユーザー入力から Mock 解析を組み立てる（Vision 失敗時のフォールバック）。 */
  buildFallback(params: AnalyzeImageParams): DamageAnalysis {
    return buildMockAnalysis({
      imageDigest: String(hashString(params.imageDataUrl)),
      locale: params.locale,
      declared: params.declared,
      source: "fallback",
    });
  }

  /**
   * TODO(AI): Qwen Cloud の OpenAI 互換 Vision エンドポイントを呼ぶ。
   * - `QWEN_BASE_URL` / `QWEN_API_KEY` / `QWEN_VISION_MODEL` は env に定義済み。
   * - 期待する応答は設計書 4.2 の JSON スキーマ。パースして DamageAnalysis へ変換する。
   * 実装が入るまでは Mock と同じ結果を返し、デモを止めない。
   */
  private async callVisionModel(
    params: AnalyzeImageParams,
    imageDigest: string
  ): Promise<DamageAnalysis> {
    logger.warn(
      "[QwenImageAnalysisGateway] Vision API is not wired yet. Falling back to mock analysis."
    );
    return buildMockAnalysis({
      imageDigest,
      locale: params.locale,
      declared: params.declared,
      source: "vision_model",
    });
  }
}
