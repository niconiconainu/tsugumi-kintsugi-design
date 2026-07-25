import type { ProjectResult } from "@/application/dto/project/project.result";
import type { DesignTaste } from "@/constants/design/taste";
import type { MatchPriority } from "@/constants/project/priority";
import type { ProjectStatus } from "@/constants/project/project-status";
import { prefectureLabel } from "@/constants/region/prefecture";
import {
  toDamageAnalysisResponse,
  type DamageAnalysisResponse,
} from "@/presentation/dto/common/damage-analysis.schema";
import {
  toDesignOptionResponse,
  type DesignOptionResponse,
} from "@/presentation/dto/common/design-option.schema";
import {
  toWorkshopCandidateResponse,
  type WorkshopCandidateResponse,
} from "@/presentation/dto/common/workshop-candidate.schema";

export interface ProjectResponse {
  id: string;
  status: ProjectStatus;
  createdAt: string;
  summary: string;
  preference: {
    story: string;
    tastes: DesignTaste[];
    prefectureLabel: string;
    priority: MatchPriority;
  };
  analysis: DamageAnalysisResponse;
  designs: DesignOptionResponse[];
  selectedDesignId: string;
  candidates: WorkshopCandidateResponse[];
  selectedWorkshopId: string | null;
}

export const toProjectResponse = (result: ProjectResult): ProjectResponse => {
  const { project } = result;
  return {
    id: project.id,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    summary: project.summary,
    preference: {
      story: project.preference.story,
      tastes: project.preference.tastes,
      prefectureLabel: prefectureLabel(project.preference.prefecture),
      priority: project.preference.priority,
    },
    analysis: toDamageAnalysisResponse(project.analysis),
    designs: project.designs.map(toDesignOptionResponse),
    selectedDesignId: project.selectedDesignId,
    candidates: project.candidates.map(toWorkshopCandidateResponse),
    selectedWorkshopId: project.selectedWorkshopId,
  };
};
