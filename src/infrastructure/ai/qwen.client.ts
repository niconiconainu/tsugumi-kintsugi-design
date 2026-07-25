import { env } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Qwen Cloud への低レベルアクセス。
 *
 * 2 系統のエンドポイントを使い分ける必要がある:
 * - Vision（画像理解）は OpenAI 互換の `/chat/completions`
 * - 画像編集は DashScope ネイティブの multimodal-generation
 *   （OpenAI 互換側に画像編集の口が無いため）
 */

/** DashScope ネイティブ endpoint。compatible-mode の Base URL とは別系統になる。 */
const NATIVE_GENERATION_URL =
  "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

const REQUEST_TIMEOUT_MS = 180_000;

const authHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${env.QWEN_API_KEY ?? ""}`,
  "Content-Type": "application/json",
});

const postJson = async (
  url: string,
  body: unknown,
  label: string
): Promise<unknown> => {
  const response = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    logger.error(
      `[QwenClient] ${label} failed. status=${response.status} body=${detail}`
    );
    throw new Error(`Qwen ${label} responded ${response.status}`);
  }

  return response.json();
};

/** 応答テキストから JSON 部分だけを取り出す。前後に説明文が付く場合への保険。 */
const extractJson = (text: string): unknown => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in response");
  return JSON.parse(text.slice(start, end + 1));
};

/** OpenAI 互換の Vision チャット。JSON mode で構造化応答を受け取る。 */
export const callQwenVisionJson = async (params: {
  systemPrompt: string;
  userPrompt: string;
  imageDataUrl: string;
}): Promise<unknown> => {
  const body = {
    model: env.QWEN_VISION_MODEL,
    messages: [
      { role: "system", content: params.systemPrompt },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: params.imageDataUrl } },
          { type: "text", text: params.userPrompt },
        ],
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  };

  const result = (await postJson(
    `${env.QWEN_BASE_URL}/chat/completions`,
    body,
    "vision"
  )) as { choices?: { message?: { content?: string } }[] };

  const text = result.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty vision response");
  return extractJson(text);
};

/** 画像編集。入力画像を編集した結果の URL を返す。 */
export const callQwenImageEdit = async (params: {
  imageDataUrl: string;
  prompt: string;
  negativePrompt: string;
}): Promise<string> => {
  const body = {
    model: env.QWEN_IMAGE_EDIT_MODEL,
    input: {
      messages: [
        {
          role: "user",
          content: [
            { image: params.imageDataUrl },
            { text: params.prompt },
          ],
        },
      ],
    },
    parameters: { negative_prompt: params.negativePrompt },
  };

  const result = (await postJson(NATIVE_GENERATION_URL, body, "image-edit")) as {
    output?: {
      choices?: { message?: { content?: { image?: string }[] } }[];
    };
  };

  const url = result.output?.choices?.[0]?.message?.content?.find(
    (item) => typeof item.image === "string"
  )?.image;
  if (!url) throw new Error("No image in edit response");
  return url;
};
