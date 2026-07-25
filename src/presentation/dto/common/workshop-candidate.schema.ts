import type { DesignTaste } from "@/constants/design/taste";
import type { Locale } from "@/constants/i18n/locale";
import type { Prefecture } from "@/constants/region/prefecture";
import type { Region } from "@/constants/region/region";
import { pickText } from "@/domain/entity/common/localized-text";
import type {
  MatchCaution,
  MatchReason,
} from "@/domain/entity/workshop/match-note";
import type { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";
import {
  toEstimateResponse,
  type EstimateResponse,
} from "@/presentation/dto/common/estimate.schema";

/**
 * 工房候補の wire 形。
 * 都道府県・地方は表示名ではなくコードで返し、画面側で翻訳する。
 * 工房名・看板・紹介文は言語ごとの原稿なので、ここで選んだ 1 言語ぶんを返す。
 */
export interface WorkshopCandidateResponse {
  workshop: {
    id: string;
    name: string;
    prefecture: Prefecture;
    region: Region;
    type: string;
    description: string;
    styleTags: DesignTaste[];
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
  matchReasons: MatchReason[];
  cautions: MatchCaution[];
  explanation: string;
}

export const toWorkshopCandidateResponse = (
  candidate: WorkshopCandidate,
  locale: Locale
): WorkshopCandidateResponse => ({
  workshop: {
    id: candidate.workshop.id,
    name: pickText(candidate.workshop.name, locale),
    prefecture: candidate.workshop.prefecture,
    region: candidate.workshop.region,
    type: pickText(candidate.workshop.type, locale),
    description: pickText(candidate.workshop.description, locale),
    styleTags: [...candidate.workshop.styleTags],
    usesUrushi: candidate.workshop.usesUrushi,
  },
  estimate: toEstimateResponse(candidate.estimate),
  score: candidate.score,
  matchReasons: candidate.matchReasons,
  cautions: candidate.cautions,
  explanation: candidate.explanation,
});
