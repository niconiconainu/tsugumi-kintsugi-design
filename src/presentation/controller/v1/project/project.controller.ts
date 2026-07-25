import { ProjectUseCase } from "@/application/usecase/project/project.usecase";
import {
  toProjectResponse,
  type ProjectResponse,
} from "@/presentation/controller/v1/project/dto/project.response";
import { saveProjectSchema } from "@/presentation/controller/v1/project/dto/save-project.request";

export class ProjectController {
  constructor(private readonly projectUseCase: ProjectUseCase) {}

  /**
   * POST /api/projects
   * デザイン・工房・見積の選択結果を保存し、共有用の id を返す
   */
  async save(request: Request): Promise<ProjectResponse> {
    const body = saveProjectSchema.parse(await request.json());
    const result = await this.projectUseCase.saveProject(body);
    return toProjectResponse(result);
  }

  /**
   * GET /api/projects/[id]
   * 保存済みのプロジェクトを取得する
   */
  async get(id: string): Promise<ProjectResponse> {
    const result = await this.projectUseCase.getProject(id);
    return toProjectResponse(result);
  }
}
