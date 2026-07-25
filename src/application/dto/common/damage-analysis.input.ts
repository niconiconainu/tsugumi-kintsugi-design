import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type {
  DamageSeverity,
  DamageType,
  Material,
} from "@/constants/artifact/damage";
import { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import {
  DamageAnalysis,
  type AnalysisSource,
} from "@/domain/entity/artifact/damage-analysis.entity";

/**
 * 解析結果の転送形。
 *
 * 解析結果はサーバーに保存せずクライアントが持ち回るため（設計書 8 プライバシー）、
 * 後続の API では毎回この形で送り返してもらい、ここで domain entity へ復元する。
 */
export interface DamageAnalysisInput {
  objectType: ArtifactType;
  material: Material;
  dominantColors: string[];
  damageType: DamageType;
  damageSeverity: DamageSeverity;
  crackCount: number;
  missingAreaRatio: number;
  visualMotifs: string[];
  repairNotes: string[];
  confidence: number;
  source: AnalysisSource;
  brief: {
    damageDescription: string;
    designDescription: string;
    framing: string;
  };
}

export const toDamageAnalysis = (input: DamageAnalysisInput): DamageAnalysis =>
  new DamageAnalysis(
    input.objectType,
    input.material,
    input.dominantColors,
    input.damageType,
    input.damageSeverity,
    input.crackCount,
    input.missingAreaRatio,
    input.visualMotifs,
    input.repairNotes,
    input.confidence,
    input.source,
    new RestorationBrief(
      input.brief.damageDescription,
      input.brief.designDescription,
      input.brief.framing
    )
  );
