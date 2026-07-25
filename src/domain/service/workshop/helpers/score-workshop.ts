import {
  DESIGN_COMPLEXITIES,
  type DesignComplexity,
} from "@/constants/design/expression";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type {
  MatchCaution,
  MatchReason,
} from "@/domain/entity/workshop/match-note";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";

/** デザイン相性の算出結果。理由・注意点は文章ではなくコードで返す。 */
interface DesignAffinity {
  score: number;
  reasons: MatchReason[];
  cautions: MatchCaution[];
}

/**
 * 希望テイストの入力を廃止したため、その配分（旧 0.35）は
 * 素材・金属表現・手間の 3 項目へ振り直している。
 */
const AFFINITY_WEIGHTS = {
  material: 0.4,
  metal: 0.3,
  complexity: 0.3,
} as const;

/** 素材が「不明」のときの中立値。相性が高くも低くもない扱いにする。 */
const NEUTRAL_MATERIAL_SCORE = 0.6;

const complexityRank = (complexity: DesignComplexity): number =>
  DESIGN_COMPLEXITIES.indexOf(complexity);

/**
 * 工房 1 件のデザイン相性を算出する。
 * ここで作るのは「事実ベースの根拠」だけ。読ませる文章は Copy Agent 側の責務。
 */
export const calcDesignAffinity = (params: {
  workshop: Workshop;
  design: DesignOption;
  analysis: DamageAnalysis;
}): DesignAffinity => {
  const { workshop, design, analysis } = params;
  const reasons: MatchReason[] = [];
  const cautions: MatchCaution[] = [];

  const materialSupported = workshop.materialSkills.includes(analysis.material);
  const materialScore = materialSupported
    ? 1
    : analysis.material === "unknown"
      ? NEUTRAL_MATERIAL_SCORE
      : 0.2;
  if (materialSupported) {
    reasons.push({ code: "materialExperience", material: analysis.material });
  } else if (analysis.material !== "unknown") {
    cautions.push({ code: "materialNotSupported", material: analysis.material });
  }

  const metalSupported = workshop.metalColors.includes(design.metalColor);
  if (metalSupported) {
    reasons.push({ code: "metalSupported", metalColor: design.metalColor });
  } else {
    cautions.push({ code: "metalNotSupported", metalColor: design.metalColor });
  }

  const complexityFits =
    complexityRank(workshop.maxComplexity) >= complexityRank(design.complexity);
  if (!complexityFits) {
    cautions.push({ code: "complexityExceeded", complexity: design.complexity });
  }

  const score =
    materialScore * AFFINITY_WEIGHTS.material +
    (metalSupported ? 1 : 0) * AFFINITY_WEIGHTS.metal +
    (complexityFits ? 1 : 0.2) * AFFINITY_WEIGHTS.complexity;

  if (workshop.usesUrushi) {
    reasons.push({ code: "urushi" });
  } else {
    cautions.push({ code: "simpleKintsugi" });
  }

  return { score, reasons, cautions };
};

/**
 * 候補群の中での相対スコア（0〜1、小さい値ほど良い指標を反転して正規化）。
 * 全候補が同値のときは 1（差がないので減点しない）。
 */
export const normalizeLowerIsBetter = (
  value: number,
  values: readonly number[]
): number => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 1;
  return 1 - (value - min) / (max - min);
};
