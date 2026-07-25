import { MATCH_PRIORITY_LABEL } from "@/constants/project/priority";
import type { MatchPriority } from "@/constants/project/priority";

export interface CandidateCopyInput {
  workshopName: string;
  workshopType: string;
  rank: number;
  priority: MatchPriority;
  totalFee: number;
  totalDays: number;
  matchReasons: string[];
  cautions: string[];
}

export interface ProjectSummaryInput {
  designTitle: string;
  designConcept: string;
  workshopName: string | null;
  totalFee: number | null;
  totalDays: number | null;
  story: string;
}

const yen = (value: number): string => `${value.toLocaleString("ja-JP")}円`;

const RANK_PHRASE: Record<number, string> = {
  1: "今回の条件では最有力です",
  2: "次点の候補です",
  3: "条件を変えると上位に来る候補です",
};

/**
 * 候補カードの短い説明文（Copy Agent 相当）。
 * 数値は呼び出し側で計算済みのものをそのまま引用するだけで、ここでは再計算しない。
 */
export const buildMockCandidateCopy = (input: CandidateCopyInput): string => {
  const rankPhrase = RANK_PHRASE[input.rank] ?? "比較対象の候補です";
  const reason = input.matchReasons[0] ?? `${input.workshopType}の工房です`;
  const priorityPhrase = `${MATCH_PRIORITY_LABEL[input.priority]}を優先した並びで${rankPhrase}`;
  const numbers = `総額の目安は${yen(input.totalFee)}、手元に戻るまで約${input.totalDays}日です`;
  const caution =
    input.cautions.length > 0 ? `ただし${input.cautions[0]}。` : "";
  return `${reason}。${priorityPhrase}。${numbers}。${caution}`;
};

/** 文の途中で切らずに、最初の 1 文だけを取り出す。 */
const firstSentence = (text: string): string => {
  const [head] = text.split("。");
  return head.trim();
};

/** 結果画面のまとめ文。 */
export const buildMockProjectSummary = (input: ProjectSummaryInput): string => {
  const storyPart =
    input.story.trim().length > 0
      ? "お話にあった記憶を線の意味づけに使いました。"
      : "器の破損の形そのものを手がかりにしました。";
  const workshopPart =
    input.workshopName && input.totalFee !== null && input.totalDays !== null
      ? `依頼先には${input.workshopName}を選びました。総額の目安は${yen(input.totalFee)}、完成の目安は約${input.totalDays}日です。`
      : "依頼先はまだ選ばれていません。候補を比較して決めてください。";
  // concept の 1 文目が「〜案」で終わるので、語尾は足さずそのまま句点で閉じる。
  return `「${input.designTitle}」は、${firstSentence(input.designConcept)}。${storyPart}${workshopPart}`;
};
