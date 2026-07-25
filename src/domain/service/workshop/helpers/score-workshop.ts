import { MATERIAL_LABEL } from "@/constants/artifact/damage";
import {
  DESIGN_COMPLEXITIES,
  DESIGN_COMPLEXITY_LABEL,
  DESIGN_TASTE_LABEL,
  METAL_COLOR_LABEL,
  type DesignComplexity,
  type DesignTaste,
} from "@/constants/design/taste";
import type { DamageAnalysis } from "@/domain/entity/artifact/damage-analysis.entity";
import type { DesignOption } from "@/domain/entity/design/design-option.entity";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";

/** デザイン相性の内訳（各 0〜1）。合計の重みは下の表で持つ。 */
interface DesignAffinity {
  score: number;
  reasons: string[];
  cautions: string[];
}

const AFFINITY_WEIGHTS = {
  taste: 0.35,
  material: 0.25,
  metal: 0.2,
  complexity: 0.2,
} as const;

/** テイストが未指定のときの中立値。相性が高くも低くもない扱いにする。 */
const NEUTRAL_TASTE_SCORE = 0.6;

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
  tastes: readonly DesignTaste[];
}): DesignAffinity => {
  const { workshop, design, analysis, tastes } = params;
  const reasons: string[] = [];
  const cautions: string[] = [];

  const matchedTastes = tastes.filter((taste) =>
    workshop.styleTags.includes(taste)
  );
  const tasteScore =
    tastes.length === 0
      ? NEUTRAL_TASTE_SCORE
      : matchedTastes.length / tastes.length;
  if (matchedTastes.length > 0) {
    reasons.push(
      `希望テイスト「${matchedTastes
        .map((taste) => DESIGN_TASTE_LABEL[taste])
        .join("・")}」を得意としています`
    );
  }

  const materialSupported = workshop.materialSkills.includes(analysis.material);
  const materialScore = materialSupported
    ? 1
    : analysis.material === "unknown"
      ? NEUTRAL_TASTE_SCORE
      : 0.2;
  if (materialSupported) {
    reasons.push(`${MATERIAL_LABEL[analysis.material]}の取り扱い実績があります`);
  } else if (analysis.material !== "unknown") {
    cautions.push(
      `${MATERIAL_LABEL[analysis.material]}は主な取り扱い素材に含まれていません`
    );
  }

  const metalSupported = workshop.metalColors.includes(design.metalColor);
  if (metalSupported) {
    reasons.push(`${METAL_COLOR_LABEL[design.metalColor]}に対応しています`);
  } else {
    cautions.push(
      `${METAL_COLOR_LABEL[design.metalColor]}は対応外のため相談が必要です`
    );
  }

  const complexityFits =
    complexityRank(workshop.maxComplexity) >= complexityRank(design.complexity);
  if (!complexityFits) {
    cautions.push(
      `${DESIGN_COMPLEXITY_LABEL[design.complexity]}の仕上げは受注範囲を超える可能性があります`
    );
  }

  const score =
    tasteScore * AFFINITY_WEIGHTS.taste +
    materialScore * AFFINITY_WEIGHTS.material +
    (metalSupported ? 1 : 0) * AFFINITY_WEIGHTS.metal +
    (complexityFits ? 1 : 0.2) * AFFINITY_WEIGHTS.complexity;

  if (workshop.usesUrushi) {
    reasons.push("本漆を用いた金継ぎです");
  } else {
    cautions.push("簡易金継ぎのため、食器としての日常使用は工房確認が必要です");
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
