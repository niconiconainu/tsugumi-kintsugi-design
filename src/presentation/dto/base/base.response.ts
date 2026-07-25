/** 成功レスポンス。`ResponseInterceptor` 相当のラッパーを routeHandler が付ける。 */
export interface ApiSuccessResponse<T> {
  data: T;
  meta: { timestamp: string };
}

/** 失敗レスポンス。`CustomErrorFilter` 相当の変換を routeHandler が行う。 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    issues?: { path: string; message: string }[];
  };
  meta: { timestamp: string };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
