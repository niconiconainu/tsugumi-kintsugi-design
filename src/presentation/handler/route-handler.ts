import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/presentation/dto/base/base.response";
import { logger } from "@/utils/logger";

/**
 * Route Handler の共通ラッパー。
 * NestJS の `ResponseInterceptor` + `CustomErrorFilter` にあたる横断処理をここに閉じる。
 * controller 側では try/catch を書かない。
 */
const timestamp = (): string => new Date().toISOString();

const toErrorResponse = (error: unknown): NextResponse<ApiErrorResponse> => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: ErrorConfig.VALIDATION_ERROR.code,
          message: ErrorConfig.VALIDATION_ERROR.message,
          issues: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        meta: { timestamp: timestamp() },
      },
      { status: ErrorConfig.VALIDATION_ERROR.defaultHttpStatusCode }
    );
  }

  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        error: { code: error.code, message: error.message },
        meta: { timestamp: timestamp() },
      },
      { status: error.defaultHttpStatusCode }
    );
  }

  logger.error("[routeHandler] Unhandled error.", error);
  return NextResponse.json(
    {
      error: {
        code: ErrorConfig.INTERNAL_SERVER_ERROR.code,
        message: ErrorConfig.INTERNAL_SERVER_ERROR.message,
      },
      meta: { timestamp: timestamp() },
    },
    { status: ErrorConfig.INTERNAL_SERVER_ERROR.defaultHttpStatusCode }
  );
};

export const routeHandler =
  <T, C = unknown>(
    handler: (request: Request, context: C) => Promise<T>,
    successStatus = 200
  ) =>
  async (
    request: Request,
    context: C
  ): Promise<NextResponse<ApiSuccessResponse<T> | ApiErrorResponse>> => {
    try {
      const data = await handler(request, context);
      return NextResponse.json(
        { data, meta: { timestamp: timestamp() } },
        { status: successStatus }
      );
    } catch (error) {
      return toErrorResponse(error);
    }
  };
