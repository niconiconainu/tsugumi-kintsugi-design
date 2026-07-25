import { envSchema, type Env } from "@/config/env.schema";

/**
 * サーバー側でのみ読む環境変数。API キーはブラウザへ露出させない（設計書 8）。
 * 起動時に一度だけ検証し、以降はこの値を使う。
 */
export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DEMO_MODE: process.env.DEMO_MODE,
  QWEN_API_KEY: process.env.QWEN_API_KEY,
  QWEN_BASE_URL: process.env.QWEN_BASE_URL,
  QWEN_VISION_MODEL: process.env.QWEN_VISION_MODEL,
  GMI_API_KEY: process.env.GMI_API_KEY,
  GMI_BASE_URL: process.env.GMI_BASE_URL,
  GMI_DESIGN_MODEL: process.env.GMI_DESIGN_MODEL,
  GMI_MATCHER_MODEL: process.env.GMI_MATCHER_MODEL,
  GMI_COPY_MODEL: process.env.GMI_COPY_MODEL,
});

export const isDemoMode = (): boolean => env.DEMO_MODE === "true";
