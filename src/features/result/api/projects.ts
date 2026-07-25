import { getJson, postJson } from "@/features/common/utils/api-client";
import type { ProjectResponse } from "@/presentation/controller/v1/project/dto/project.response";
import type { SaveProjectRequest } from "@/presentation/controller/v1/project/dto/save-project.request";

export const saveProject = (
  body: SaveProjectRequest
): Promise<ProjectResponse> => postJson<ProjectResponse>("/api/projects", body);

export const fetchProject = (id: string): Promise<ProjectResponse> =>
  getJson<ProjectResponse>(`/api/projects/${id}`);
