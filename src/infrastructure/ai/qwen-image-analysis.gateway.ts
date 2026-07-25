import type { ArtifactType } from "@/constants/artifact/artifact-type";
import {
  DAMAGE_SEVERITIES,
  DAMAGE_TYPES,
  type DamageSeverity,
  type DamageType,
  type Material,
} from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";
import { isDemoMode } from "@/config/env";
import { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import { ImageRejectedError } from "@/domain/entity/artifact/image-rejected.error";
import { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import { buildMockAnalysis } from "@/infrastructure/ai/mock/analysis.mock";
import { buildImageAnalysisPrompt } from "@/infrastructure/ai/prompt/image-analysis.prompt";
import { callQwenVisionJson } from "@/infrastructure/ai/qwen.client";
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

/** Vision が返す JSON。値の妥当性はここで詰める。 */
interface VisionPayload {
  isVessel?: boolean;
  isBroken?: boolean;
  materialCompatible?: boolean;
  identifiable?: boolean;
  reason?: string;
  damageType?: string;
  damageSeverity?: string;
  crackCount?: number;
  missingAreaRatio?: number;
  dominantColors?: string[];
  visualMotifs?: string[];
  repairNotes?: string[];
  damageDescription?: string;
  designDescription?: string;
  framing?: string;
  confidence?: number;
}

const REJECTION_FALLBACK: Record<Locale, string> = {
  ja: "この写真からは金継ぎできる器を読み取れませんでした。",
  en: "We couldn't make out a piece we could repair with kintsugi in this photo.",
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const pickEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T => (allowed.includes(value as T) ? (value as T) : fallback);

const toStringList = (value: unknown, limit: number): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, limit)
    : [];

/**
 * Qwen Cloud（Vision）への画像理解ゲートウェイ。
 *
 * `DEMO_MODE=true` の間は画像のダイジェストから決定論的な Mock を返す。
 * `false` のときは実 API を呼び、金継ぎが成り立たない写真は `ImageRejectedError` で弾く。
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

    return this.callVisionModel(params);
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

  private async callVisionModel(
    params: AnalyzeImageParams
  ): Promise<DamageAnalysis> {
    const { system, user } = buildImageAnalysisPrompt({
      artifactType: params.declared.artifactType,
      material: params.declared.material,
      locale: params.locale,
    });

    const payload = (await callQwenVisionJson({
      systemPrompt: system,
      userPrompt: user,
      imageDataUrl: params.imageDataUrl,
    })) as VisionPayload;

    // 合否はモデルに AND を取らせず、ここで組み立てる。閾値を変えてもプロンプトは触らない。
    const failed = [
      payload.isVessel,
      payload.isBroken,
      payload.materialCompatible,
      payload.identifiable,
    ].some((check) => check === false);
    if (failed) {
      const reason = payload.reason?.trim();
      logger.info(
        `[QwenImageAnalysisGateway] Image rejected by inspection. reason=${reason ?? "(none)"}`
      );
      throw new ImageRejectedError(
        reason && reason.length > 0 ? reason : REJECTION_FALLBACK[params.locale]
      );
    }

    return new DamageAnalysis(
      params.declared.artifactType,
      params.declared.material,
      toStringList(payload.dominantColors, 4),
      params.declared.damageType ??
        pickEnum<DamageType>(payload.damageType, DAMAGE_TYPES, "crack_and_chip"),
      pickEnum<DamageSeverity>(payload.damageSeverity, DAMAGE_SEVERITIES, "medium"),
      clamp(Math.round(Number(payload.crackCount) || 0), 0, 20),
      clamp(Number(payload.missingAreaRatio) || 0, 0, 1),
      toStringList(payload.visualMotifs, 3),
      toStringList(payload.repairNotes, 3),
      clamp(Number(payload.confidence) || 0, 0, 1),
      "vision_model",
      new RestorationBrief(
        payload.damageDescription ?? "",
        payload.designDescription ?? "",
        payload.framing ?? ""
      )
    );
  }
}
