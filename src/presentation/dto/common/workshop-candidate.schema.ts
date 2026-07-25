import { prefectureLabel } from "@/constants/region/prefecture";
import { REGION_LABEL } from "@/constants/region/region";
import type { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";
import {
  toEstimateResponse,
  type EstimateResponse,
} from "@/presentation/dto/common/estimate.schema";

export interface WorkshopCandidateResponse {
  workshop: {
    id: string;
    name: string;
    prefectureLabel: string;
    regionLabel: string;
    type: string;
    description: string;
    styleTags: string[];
    usesUrushi: boolean;
  };
  estimate: EstimateResponse;
  score: {
    design: number;
    price: number;
    speed: number;
    distance: number;
    total: number;
  };
  matchReasons: string[];
  cautions: string[];
  explanation: string;
}

export const toWorkshopCandidateResponse = (
  candidate: WorkshopCandidate
): WorkshopCandidateResponse => ({
  workshop: {
    id: candidate.workshop.id,
    name: candidate.workshop.name,
    prefectureLabel: prefectureLabel(candidate.workshop.prefecture),
    regionLabel: REGION_LABEL[candidate.workshop.region],
    type: candidate.workshop.type,
    description: candidate.workshop.description,
    styleTags: [...candidate.workshop.styleTags],
    usesUrushi: candidate.workshop.usesUrushi,
  },
  estimate: toEstimateResponse(candidate.estimate),
  score: candidate.score,
  matchReasons: candidate.matchReasons,
  cautions: candidate.cautions,
  explanation: candidate.explanation,
});
