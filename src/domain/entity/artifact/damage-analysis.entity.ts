import type { ArtifactType } from "@/constants/artifact/artifact-type";
import type { RestorationBrief } from "@/domain/entity/artifact/restoration-brief";
import type {
  DamageSeverity,
  DamageType,
  Material,
} from "@/constants/artifact/damage";

/** 解析の出所。AI 失敗時は `fallback`（ユーザー選択 + Mock 解析）になる（設計書 6.3）。 */
export type AnalysisSource = "vision_model" | "fallback";

/**
 * 画像解析の構造化結果（設計書 4.2）。
 * Qwen の JSON をそのままドメインに持ち上げたもの。
 * `objectType` と `material` はユーザーの申告値で確定させ、解析では上書きしない。
 */
export class DamageAnalysis {
  constructor(
    readonly objectType: ArtifactType,
    readonly material: Material,
    readonly dominantColors: string[],
    readonly damageType: DamageType,
    readonly damageSeverity: DamageSeverity,
    readonly crackCount: number,
    readonly missingAreaRatio: number,
    readonly visualMotifs: string[],
    readonly repairNotes: string[],
    readonly confidence: number,
    readonly source: AnalysisSource,
    /** 復元画像を作るための特徴。Vision が読み取る。 */
    readonly brief: RestorationBrief
  ) {}

  /** 解析結果の信頼度が低く、ユーザーへ確認を促すべきか。 */
  get needsUserConfirmation(): boolean {
    return this.source === "fallback" || this.confidence < 0.6;
  }
}
