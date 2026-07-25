import type { MatchPriority } from "@/constants/project/priority";
import type { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";

export interface RecommendationsResult {
  candidates: WorkshopCandidate[];
  /** どの優先条件で並べたか。優先条件を切り替えたことが画面で分かるように返す。 */
  priority: MatchPriority;
}
