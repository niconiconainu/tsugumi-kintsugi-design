import { z } from "zod";
import { ARTIFACT_TYPES } from "@/constants/artifact/artifact-type";
import {
  DAMAGE_SEVERITIES,
  DAMAGE_TYPES,
  MATERIALS,
} from "@/constants/artifact/damage";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";

/**
 * 解析結果の wire スキーマ。
 * `/api/designs` `/api/recommendations` `/api/estimate` が共通で受け取る。
 */
export const damageAnalysisSchema = z.object({
  objectType: z.enum(ARTIFACT_TYPES),
  material: z.enum(MATERIALS),
  dominantColors: z.array(z.string()),
  damageType: z.enum(DAMAGE_TYPES),
  damageSeverity: z.enum(DAMAGE_SEVERITIES),
  crackCount: z.number().int().min(0).max(20),
  missingAreaRatio: z.number().min(0).max(1),
  visualMotifs: z.array(z.string()),
  repairNotes: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  source: z.enum(["vision_model", "fallback"]),
});

export type DamageAnalysisPayload = z.infer<typeof damageAnalysisSchema>;

export interface DamageAnalysisResponse extends DamageAnalysisPayload {
  /** 信頼度が低く、ユーザーに確認を促すべきか（entity の判定をそのまま出す） */
  needsUserConfirmation: boolean;
}

export const toDamageAnalysisResponse = (
  analysis: DamageAnalysis
): DamageAnalysisResponse => ({
  objectType: analysis.objectType,
  material: analysis.material,
  dominantColors: analysis.dominantColors,
  damageType: analysis.damageType,
  damageSeverity: analysis.damageSeverity,
  crackCount: analysis.crackCount,
  missingAreaRatio: analysis.missingAreaRatio,
  visualMotifs: analysis.visualMotifs,
  repairNotes: analysis.repairNotes,
  confidence: analysis.confidence,
  source: analysis.source,
  needsUserConfirmation: analysis.needsUserConfirmation,
});
