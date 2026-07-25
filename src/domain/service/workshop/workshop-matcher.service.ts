import { SCORE_WEIGHTS, type MatchPriority } from "@/constants/project/priority";
import { toRegion, type Prefecture } from "@/constants/region/prefecture";
import type { DesignTaste } from "@/constants/design/taste";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type { Estimate } from "@/domain/entity/estimate/estimate.entity";
import { WorkshopCandidate } from "@/domain/entity/workshop/workshop-candidate.entity";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";
import { LogisticsService } from "@/domain/service/logistics/logistics.service";
import {
  calcDesignAffinity,
  normalizeLowerIsBetter,
} from "@/domain/service/workshop/helpers/score-workshop";
import { GmiCopyGateway } from "@/infrastructure/ai/gmi-copy.gateway";
import { WorkshopRepository } from "@/infrastructure/repository/workshop/workshop.repository";
import { logger } from "@/utils/logger";

export interface MatchWorkshopsParams {
  analysis: DamageAnalysis;
  design: DesignOption;
  tastes: readonly DesignTaste[];
  prefecture: Prefecture;
  priority: MatchPriority;
  /** 返す候補の件数（設計書 AC-04 は 3 件） */
  limit: number;
}

/** スコア計算の中間状態。正規化に全候補ぶんの金額・日数が要るので一度溜める。 */
interface ScoredWorkshop {
  workshop: Workshop;
  estimate: Estimate;
  affinity: ReturnType<typeof calcDesignAffinity>;
  distance: number;
}

/**
 * 工房マッチング（設計書 4.1 の Workshop Matcher / 5.4 の総合スコア）。
 * スコアと金額はすべてコードで算出し、LLM には理由の言い換えだけを任せる。
 */
export class WorkshopMatcherService {
  constructor(
    private readonly workshopRepository: WorkshopRepository,
    private readonly gmiCopyGateway: GmiCopyGateway,
    private readonly logisticsService: LogisticsService
  ) {}

  async match(params: MatchWorkshopsParams): Promise<WorkshopCandidate[]> {
    try {
      const workshops = await this.workshopRepository.findAll();
      const scored = this.scoreAll(workshops, params);
      const ranked = this.rank(scored, params.priority).slice(0, params.limit);
      return await this.attachCopy(ranked, params.priority);
    } catch (error) {
      logger.error("[WorkshopMatcherService] Failed to match workshops.", error);
      throw error;
    }
  }

  private scoreAll(
    workshops: Workshop[],
    params: MatchWorkshopsParams
  ): ScoredWorkshop[] {
    const from = toRegion(params.prefecture);
    return workshops.map((workshop) => ({
      workshop,
      estimate: this.logisticsService.buildEstimate({
        workshop,
        analysis: params.analysis,
        design: params.design,
        from,
      }),
      affinity: calcDesignAffinity({
        workshop,
        design: params.design,
        analysis: params.analysis,
        tastes: params.tastes,
      }),
      distance: this.logisticsService.proximityScore(from, workshop.region),
    }));
  }

  /** 価格・納期は候補群の中での相対評価なので、全件そろってから正規化する。 */
  private rank(
    scored: ScoredWorkshop[],
    priority: MatchPriority
  ): Omit<WorkshopCandidate, "explanation">[] {
    const weights = SCORE_WEIGHTS[priority];
    const fees = scored.map((item) => item.estimate.totalFee);
    const days = scored.map((item) => item.estimate.totalDays);

    return scored
      .map((item) => {
        const price = normalizeLowerIsBetter(item.estimate.totalFee, fees);
        const speed = normalizeLowerIsBetter(item.estimate.totalDays, days);
        const total =
          item.affinity.score * weights.design +
          price * weights.price +
          speed * weights.speed +
          item.distance * weights.distance;
        return {
          workshop: item.workshop,
          estimate: item.estimate,
          score: {
            design: item.affinity.score,
            price,
            speed,
            distance: item.distance,
            total,
          },
          matchReasons: item.affinity.reasons,
          cautions: item.affinity.cautions,
        };
      })
      .sort((a, b) => b.score.total - a.score.total);
  }

  /** Copy Agent の説明文を付ける。失敗しても比較表は出せるよう、空文字で続行する。 */
  private async attachCopy(
    ranked: Omit<WorkshopCandidate, "explanation">[],
    priority: MatchPriority
  ): Promise<WorkshopCandidate[]> {
    return Promise.all(
      ranked.map(async (item, index) => {
        let explanation = "";
        try {
          explanation = await this.gmiCopyGateway.writeCandidateCopy({
            workshopName: item.workshop.name,
            workshopType: item.workshop.type,
            rank: index + 1,
            priority,
            totalFee: item.estimate.totalFee,
            totalDays: item.estimate.totalDays,
            matchReasons: item.matchReasons,
            cautions: item.cautions,
          });
        } catch (error) {
          logger.warn(
            `[WorkshopMatcherService] Copy generation failed. workshopId=${item.workshop.id}`,
            error
          );
        }
        return new WorkshopCandidate(
          item.workshop,
          item.estimate,
          item.score,
          item.matchReasons,
          item.cautions,
          explanation
        );
      })
    );
  }
}
