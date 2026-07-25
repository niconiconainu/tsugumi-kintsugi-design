/** プロジェクトの状態遷移（設計書 7.1）: DRAFT → ANALYZING → DESIGNING → ESTIMATING → COMPLETED */
export const PROJECT_STATUSES = [
  "DRAFT",
  "ANALYZING",
  "DESIGNING",
  "ESTIMATING",
  "COMPLETED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

