import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /**
   * true の間は AI Gateway が Mock 実装で応答する。
   * Qwen / GMI のモデル名・Base URL が未確定なので MVP の既定値は true。
   */
  DEMO_MODE: z.enum(["true", "false"]).default("true"),

  // Qwen Cloud（画像理解 + 画像編集）。DEMO_MODE=false のときだけ必要。
  QWEN_API_KEY: z.string().optional(),
  QWEN_BASE_URL: z.string().optional(),
  QWEN_VISION_MODEL: z.string().optional(),
  /**
   * 金継ぎ復元画像を作る画像編集モデル。
   * GMI Cloud に画像モデルが無いため、画像は Qwen 側で完結させる。
   * OpenAI 互換ではなく DashScope のネイティブ endpoint を使う点に注意
   * （`/api/v1/services/aigc/multimodal-generation/generation`）。
   */
  QWEN_IMAGE_EDIT_MODEL: z.string().optional(),

  // GMI Cloud（OpenAI 互換推論 API）。DEMO_MODE=false のときだけ必要。
  GMI_API_KEY: z.string().optional(),
  GMI_BASE_URL: z.string().optional(),
  GMI_DESIGN_MODEL: z.string().optional(),
  GMI_MATCHER_MODEL: z.string().optional(),
  GMI_COPY_MODEL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
