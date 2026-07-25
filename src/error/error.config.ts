import type { ErrorDetails } from "@/error/custom.error";

/**
 * エラーコード規則:
 *   - 5 文字 = [ドメイン 1 文字][連番 4 桁]
 *   - `X` = 共通 / システム全体
 *   - `A` = analysis（画像解析）
 *   - `D` = design（デザイン生成）
 *   - `W` = workshop（工房マッチング）
 *   - `E` = estimate（送料・総額・期間）
 *   - `P` = project（保存・共有）
 */
export const ErrorConfig = {
  INTERNAL_SERVER_ERROR: {
    code: "X0001",
    message: "Internal server error.",
    defaultHttpStatusCode: 500,
  },
  VALIDATION_ERROR: {
    code: "X0002",
    message: "Request is invalid.",
    defaultHttpStatusCode: 400,
  },

  IMAGE_ANALYSIS_FAILED: {
    code: "A0001",
    message: "Failed to analyze the uploaded image.",
    defaultHttpStatusCode: 502,
  },
  IMAGE_TOO_LARGE: {
    code: "A0002",
    message: "Uploaded image exceeds the allowed size.",
    defaultHttpStatusCode: 413,
  },

  DESIGN_GENERATION_FAILED: {
    code: "D0001",
    message: "Failed to generate kintsugi design options.",
    defaultHttpStatusCode: 502,
  },

  WORKSHOP_NOT_FOUND: {
    code: "W0001",
    message: "No workshop matched the given conditions.",
    defaultHttpStatusCode: 404,
  },

  ESTIMATE_CALCULATION_FAILED: {
    code: "E0001",
    message: "Failed to calculate the estimate.",
    defaultHttpStatusCode: 500,
  },

  PROJECT_NOT_FOUND: {
    code: "P0001",
    message: "Project not found.",
    defaultHttpStatusCode: 404,
  },
  PROJECT_SAVE_FAILED: {
    code: "P0002",
    message: "Failed to save the project.",
    defaultHttpStatusCode: 500,
  },
} as const satisfies Record<string, ErrorDetails>;
