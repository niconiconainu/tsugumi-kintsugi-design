import type { Locale } from "@/constants/i18n/locale";
import { pickText } from "@/domain/entity/common/localized-text";
import { Project } from "@/domain/entity/project/project.entity";
import type { ProjectPreference } from "@/domain/entity/project/project.entity";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { GmiCopyGateway } from "@/infrastructure/ai/gmi-copy.gateway";
import { ProjectRepository } from "@/infrastructure/repository/project/project.repository";
import { logger } from "@/utils/logger";

export interface SaveProjectParams {
  preference: ProjectPreference;
  analysis: DamageAnalysis;
  designs: DesignOption[];
  selectedDesignId: string;
  candidates: WorkshopCandidate[];
  selectedWorkshopId: string | null;
  /** まとめ文を書く言語 */
  locale: Locale;
}

/**
 * プロジェクトの保存・取得（設計書 6.2 の `/api/projects`）。
 * まとめ文だけ Copy Agent に書かせ、数値はすべて計算済みの値を引用する。
 */
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly gmiCopyGateway: GmiCopyGateway
  ) {}

  async save(params: SaveProjectParams): Promise<Project> {
    try {
      const design =
        params.designs.find((item) => item.id === params.selectedDesignId) ??
        params.designs[0];
      const selected = params.candidates.find(
        (candidate) => candidate.workshop.id === params.selectedWorkshopId
      );

      const summary = await this.gmiCopyGateway.writeProjectSummary({
        designTitle: design.title,
        designConcept: design.concept,
        workshopName: selected
          ? pickText(selected.workshop.name, params.locale)
          : null,
        totalFee: selected?.estimate.totalFee ?? null,
        totalDays: selected?.estimate.totalDays ?? null,
        story: params.preference.story,
        locale: params.locale,
      });

      const project = Project.complete({
        id: crypto.randomUUID(),
        preference: params.preference,
        analysis: params.analysis,
        designs: params.designs,
        selectedDesignId: design.id,
        candidates: params.candidates,
        selectedWorkshopId: params.selectedWorkshopId,
        summary,
        locale: params.locale,
        createdAt: new Date(),
      });

      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      logger.error("[ProjectService] Failed to save project.", error);
      throw new CustomError(ErrorConfig.PROJECT_SAVE_FAILED);
    }
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new CustomError(ErrorConfig.PROJECT_NOT_FOUND);
    return project;
  }
}
