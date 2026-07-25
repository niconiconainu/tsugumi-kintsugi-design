import type { DesignTaste } from "@/constants/design/taste";
import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";
import type { ProjectStatus } from "@/constants/project/project-status";
import type { Prefecture } from "@/constants/region/prefecture";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";

/** ユーザーが入力した希望条件（設計書 2.1）。 */
export interface ProjectPreference {
  story: string;
  tastes: DesignTaste[];
  prefecture: Prefecture;
  priority: MatchPriority;
}

/**
 * 1 回の相談の集約（設計書 7 の Project）。
 * 写真そのものは保持しない。プライバシー方針により、画像はブラウザ内に留める（設計書 8）。
 */
export class Project {
  constructor(
    readonly id: string,
    readonly status: ProjectStatus,
    readonly preference: ProjectPreference,
    readonly analysis: DamageAnalysis,
    readonly designs: DesignOption[],
    readonly selectedDesignId: string,
    readonly candidates: WorkshopCandidate[],
    readonly selectedWorkshopId: string | null,
    readonly summary: string,
    /** どの言語で書かれた結果か */
    readonly locale: Locale,
    readonly createdAt: Date
  ) {}

  /**
   * 新規作成。id と createdAt をここで採番し、状態は COMPLETED で確定させる
   * （保存されるのは全工程を終えた結果だけなので）。
   */
  static complete(params: {
    id: string;
    preference: ProjectPreference;
    analysis: DamageAnalysis;
    designs: DesignOption[];
    selectedDesignId: string;
    candidates: WorkshopCandidate[];
    selectedWorkshopId: string | null;
    summary: string;
    locale: Locale;
    createdAt: Date;
  }): Project {
    return new Project(
      params.id,
      "COMPLETED",
      params.preference,
      params.analysis,
      params.designs,
      params.selectedDesignId,
      params.candidates,
      params.selectedWorkshopId,
      params.summary,
      params.locale,
      params.createdAt
    );
  }

  get selectedDesign(): DesignOption | null {
    return this.designs.find((d) => d.id === this.selectedDesignId) ?? null;
  }
}
