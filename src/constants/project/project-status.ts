/** プロジェクトの状態遷移（設計書 7.1）: DRAFT → ANALYZING → DESIGNING → ESTIMATING → COMPLETED */
export const PROJECT_STATUSES = [
  "DRAFT",
  "ANALYZING",
  "DESIGNING",
  "ESTIMATING",
  "COMPLETED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  DRAFT: "下書き",
  ANALYZING: "画像を解析中",
  DESIGNING: "デザインを構想中",
  ESTIMATING: "工房と費用を試算中",
  COMPLETED: "完了",
};
