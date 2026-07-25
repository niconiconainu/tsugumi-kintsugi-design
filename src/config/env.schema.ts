import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /**
   * true の間は AI Gateway が Mock 実装で応答する。
   * Qwen / GMI のモデル名・Base URL が未確定なので MVP の既定値は true。
   */
  DEMO_MODE: z.enum(["true", "false"]).default("true"),

  // Qwen Cloud（画像理解）。DEMO_MODE=false のときだけ必要。
  QWEN_API_KEY: z.string().optional(),
  QWEN_BASE_URL: z.string().optional(),
  QWEN_VISION_MODEL: z.string().optional(),

  // GMI Cloud（OpenAI 互換推論 API）。DEMO_MODE=false のときだけ必要。
  GMI_API_KEY: z.string().optional(),
  GMI_BASE_URL: z.string().optional(),
  GMI_DESIGN_MODEL: z.string().optional(),
  GMI_MATCHER_MODEL: z.string().optional(),
  GMI_COPY_MODEL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
