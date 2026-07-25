import type { ProjectResult } from "@/application/dto/project/project.result";
import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";
import type { ProjectStatus } from "@/constants/project/project-status";
import type { Prefecture } from "@/constants/region/prefecture";
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
  /** どの言語で書かれた結果か（共有 URL を開いた側で表示言語を合わせるため） */
  locale: Locale;
  summary: string;
  preference: {
    prefecture: Prefecture;
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
  const { locale } = project;
  return {
    id: project.id,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    locale,
    summary: project.summary,
    preference: {
      prefecture: project.preference.prefecture,
      priority: project.preference.priority,
    },
    analysis: toDamageAnalysisResponse(project.analysis),
    designs: project.designs.map(toDesignOptionResponse),
    selectedDesignId: project.selectedDesignId,
    candidates: project.candidates.map((candidate) =>
      toWorkshopCandidateResponse(candidate, locale)
    ),
    selectedWorkshopId: project.selectedWorkshopId,
  };
};
