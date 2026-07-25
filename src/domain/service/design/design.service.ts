import {
  DesignOption,
  type DesignSource,
} from "@/domain/entity/design/design-option.entity";
import type { DesignDraft } from "@/domain/entity/design/design-draft";
import { buildLinePaths } from "@/domain/service/design/helpers/build-line-paths";
import type { GenerateDesignParams } from "@/infrastructure/ai/gmi-design.gateway";
import { GmiDesignGateway } from "@/infrastructure/ai/gmi-design.gateway";
import { logger } from "@/utils/logger";

/**
 * デザイン案の生成 orchestration（設計書 4.1 の Design Agent）。
 * 創作部分は LLM、継ぎ線の形はコードで描く（設計書 4.4 の境界）。
 */
export class DesignService {
  constructor(private readonly gmiDesignGateway: GmiDesignGateway) {}

  async generate(params: GenerateDesignParams): Promise<DesignOption[]> {
    const { drafts, source } = await this.fetchDrafts(params);
    return drafts.map((draft) => this.toDesignOption(draft, params, source));
  }

  /** GMI 失敗時は事前定義テンプレートへ落とす（設計書 6.3）。 */
  private async fetchDrafts(
    params: GenerateDesignParams
  ): Promise<{ drafts: DesignDraft[]; source: DesignSource }> {
    try {
      const result = await this.gmiDesignGateway.generate(params);
      if (result.drafts.length > 0) return result;
      logger.warn("[DesignService] Design model returned no draft. Using templates.");
    } catch (error) {
      logger.error(
        "[DesignService] Design generation failed. Using templates.",
        error
      );
    }
    return {
      drafts: this.gmiDesignGateway.buildFallback(params),
      source: "template",
    };
  }

  private toDesignOption(
    draft: DesignDraft,
    params: GenerateDesignParams,
    source: DesignSource
  ): DesignOption {
    const linePaths = buildLinePaths({
      lineStyle: draft.lineStyle,
      crackCount: Math.max(1, params.analysis.crackCount),
      seed: `${params.seed}:${draft.id}`,
    });
    return new DesignOption(
      draft.id,
      draft.title,
      draft.concept,
      draft.lineStyle,
      draft.metalColor,
      draft.complexity,
      draft.rationale,
      draft.motifKeywords,
      linePaths,
      source
    );
  }
}
