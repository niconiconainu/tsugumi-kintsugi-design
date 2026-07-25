import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/presentation/dto/base/base.response";

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const unwrap = async <T>(response: Response): Promise<T> => {
  const body = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;
  if ("error" in body) {
    throw new ApiError(body.error.code, body.error.message);
  }
  return body.data;
};

export const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<T>(response);
};

export const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { method: "GET" });
  return unwrap<T>(response);
};
