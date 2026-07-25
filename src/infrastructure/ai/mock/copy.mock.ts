import type { Locale } from "@/constants/i18n/locale";
import type { MatchPriority } from "@/constants/project/priority";
import type {
  MatchCaution,
  MatchReason,
} from "@/domain/entity/workshop/match-note";
import {
  COMPLEXITY_WORD,
  MATERIAL_WORD,
  METAL_WORD,
  PRIORITY_WORD,
  TASTE_WORD,
  money,
} from "@/infrastructure/ai/mock/labels";

export interface CandidateCopyInput {
  workshopName: string;
  workshopType: string;
  rank: number;
  priority: MatchPriority;
  totalFee: number;
  totalDays: number;
  matchReasons: MatchReason[];
  cautions: MatchCaution[];
  locale: Locale;
}

export interface ProjectSummaryInput {
  designTitle: string;
  designConcept: string;
  workshopName: string | null;
  totalFee: number | null;
  totalDays: number | null;
  story: string;
  locale: Locale;
}

const RANK_PHRASE: Record<Locale, Record<number, string>> = {
  ja: {
    1: "今回の条件では最有力です",
    2: "次点の候補です",
    3: "条件を変えると上位に来る候補です",
  },
  en: {
    1: "it comes out strongest under these conditions",
    2: "it is the runner-up",
    3: "it would move up if you changed what you prioritise",
  },
};

const FALLBACK_RANK_PHRASE: Record<Locale, string> = {
  ja: "比較対象の候補です",
  en: "it is included for comparison",
};

/** 事実コードを、その言語の言い回しへ開く。 */
const renderReason = (reason: MatchReason, locale: Locale): string => {
  switch (reason.code) {
    case "tasteMatch": {
      const words = reason.tastes.map((taste) => TASTE_WORD[locale][taste]);
      return locale === "ja"
        ? `希望テイスト「${words.join("・")}」を得意としています`
        : `they work well in the ${words.join(" and ")} direction you asked for`;
    }
    case "materialExperience":
      return locale === "ja"
        ? `${MATERIAL_WORD.ja[reason.material]}の取り扱い実績があります`
        : `they have a track record with ${MATERIAL_WORD.en[reason.material]}`;
    case "metalSupported":
      return locale === "ja"
        ? `${METAL_WORD.ja[reason.metalColor]}に対応しています`
        : `they can carry out ${METAL_WORD.en[reason.metalColor]}`;
    case "urushi":
      return locale === "ja"
        ? "本漆を用いた金継ぎです"
        : "they work in genuine urushi lacquer";
  }
};

const renderCaution = (caution: MatchCaution, locale: Locale): string => {
  switch (caution.code) {
    case "materialNotSupported":
      return locale === "ja"
        ? `${MATERIAL_WORD.ja[caution.material]}は主な取り扱い素材に含まれていません`
        : `${MATERIAL_WORD.en[caution.material]} is not among the materials they usually take on`;
    case "metalNotSupported":
      return locale === "ja"
        ? `${METAL_WORD.ja[caution.metalColor]}は対応外のため相談が必要です`
        : `${METAL_WORD.en[caution.metalColor]} is outside what they offer, so it would need discussing`;
    case "complexityExceeded":
      return locale === "ja"
        ? `${COMPLEXITY_WORD.ja[caution.complexity]}の仕上げは受注範囲を超える可能性があります`
        : `an ${COMPLEXITY_WORD.en[caution.complexity]} finish may be beyond what they accept`;
    case "simpleKintsugi":
      return locale === "ja"
        ? "簡易金継ぎのため、食器としての日常使用は工房確認が必要です"
        : "this is simplified kintsugi, so daily use as tableware needs checking with the studio";
  }
};

/**
 * 候補カードの短い説明文（Copy Agent 相当）。
 * 数値は呼び出し側で計算済みのものをそのまま引用するだけで、ここでは再計算しない。
 */
export const buildMockCandidateCopy = (input: CandidateCopyInput): string => {
  const { locale } = input;
  const rankPhrase =
    RANK_PHRASE[locale][input.rank] ?? FALLBACK_RANK_PHRASE[locale];
  const reason = input.matchReasons[0]
    ? renderReason(input.matchReasons[0], locale)
    : locale === "ja"
      ? `${input.workshopType}の工房です`
      : `a studio working in ${input.workshopType.toLowerCase()}`;
  const caution = input.cautions[0]
    ? renderCaution(input.cautions[0], locale)
    : null;

  if (locale === "ja") {
    return [
      `${reason}。`,
      `${PRIORITY_WORD.ja[input.priority]}を優先した並びで${rankPhrase}。`,
      `総額の目安は${money(input.totalFee, "ja")}、手元に戻るまで約${input.totalDays}日です。`,
      caution ? `ただし${caution}。` : "",
    ].join("");
  }

  return [
    `${reason.charAt(0).toUpperCase()}${reason.slice(1)}.`,
    `Ranked by ${PRIORITY_WORD.en[input.priority]}, ${rankPhrase}.`,
    `Expect around ${money(input.totalFee, "en")} in total, and about ${input.totalDays} days before it is back with you.`,
    caution ? `One thing to note: ${caution}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
};

/** 文の途中で切らずに、最初の 1 文だけを取り出す。 */
const firstSentence = (text: string, locale: Locale): string => {
  const separator = locale === "ja" ? "。" : ". ";
  const [head] = text.split(separator);
  return head.trim();
};

/** 結果画面のまとめ文。 */
export const buildMockProjectSummary = (input: ProjectSummaryInput): string => {
  const { locale } = input;
  const concept = firstSentence(input.designConcept, locale);
  const hasStory = input.story.trim().length > 0;
  const hasWorkshop =
    input.workshopName !== null &&
    input.totalFee !== null &&
    input.totalDays !== null;

  if (locale === "ja") {
    const storyPart = hasStory
      ? "お話にあった記憶を線の意味づけに使いました。"
      : "器の破損の形そのものを手がかりにしました。";
    const workshopPart = hasWorkshop
      ? `依頼先には${input.workshopName}を選びました。総額の目安は${money(input.totalFee!, "ja")}、完成の目安は約${input.totalDays}日です。`
      : "依頼先はまだ選ばれていません。候補を比較して決めてください。";
    // concept の 1 文目が「〜案」で終わるので、語尾は足さずそのまま句点で閉じる。
    return `「${input.designTitle}」は、${concept}。${storyPart}${workshopPart}`;
  }

  const storyPart = hasStory
    ? "What you told us about the piece shaped how the lines were read."
    : "The shape of the break itself was the starting point.";
  const workshopPart = hasWorkshop
    ? `You chose ${input.workshopName} to carry it out. Expect around ${money(input.totalFee!, "en")} in total, and about ${input.totalDays} days until it is finished.`
    : "No studio has been chosen yet — compare the candidates and pick one.";
  return `“${input.designTitle}” ${concept.charAt(0).toLowerCase()}${concept.slice(1)}. ${storyPart} ${workshopPart}`;
};
