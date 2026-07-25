import { toDamageAnalysis } from "@/application/dto/common/damage-analysis.input";
import { toDesignOption } from "@/application/dto/common/design-option.input";
import type { ProjectResult } from "@/application/dto/project/project.result";
import type { SaveProjectInput } from "@/application/dto/project/save-project.input";
import { RECOMMENDED_WORKSHOP_LIMIT } from "@/constants/workshop/matching";
import { ProjectService } from "@/domain/service/project/project.service";
import { WorkshopMatcherService } from "@/domain/service/workshop/workshop-matcher.service";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import { logger } from "@/utils/logger";

export class ProjectUseCase {
  constructor(
    private readonly projectService: ProjectService,
    private readonly workshopMatcherService: WorkshopMatcherService
  ) {}

  /**
   * 結果を保存する。
   * 候補と見積はクライアントから受け取らず、保存時にサーバー側で作り直す
   * （共有 URL で開いた人にも同じ計算結果を見せるため）。
   */
  async saveProject(input: SaveProjectInput): Promise<ProjectResult> {
    try {
      const analysis = toDamageAnalysis(input.analysis);
      const designs = input.designs.map(toDesignOption);
      const selectedDesign =
        designs.find((design) => design.id === input.selectedDesignId) ??
        designs[0];

      const candidates = await this.workshopMatcherService.match({
        analysis,
        design: selectedDesign,
        prefecture: input.prefecture,
        priority: input.priority,
        locale: input.locale,
        limit: RECOMMENDED_WORKSHOP_LIMIT,
      });

      const project = await this.projectService.save({
        preference: {
          prefecture: input.prefecture,
          priority: input.priority,
        },
        analysis,
        designs,
        selectedDesignId: selectedDesign.id,
        candidates,
        selectedWorkshopId: input.selectedWorkshopId,
        locale: input.locale,
      });
      return { project };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      logger.error("[ProjectUseCase] Failed to save project.", error);
      throw new CustomError(ErrorConfig.PROJECT_SAVE_FAILED);
    }
  }

  async getProject(id: string): Promise<ProjectResult> {
    const project = await this.projectService.findById(id);
    return { project };
  }
}
