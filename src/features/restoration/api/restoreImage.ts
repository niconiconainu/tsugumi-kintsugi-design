import { postJson } from "@/features/common/utils/api-client";
import type { RestorationResponse } from "@/presentation/controller/v1/restoration/dto/restoration.response";
import type { RestoreImageRequest } from "@/presentation/controller/v1/restoration/dto/restore-image.request";

export const restoreImage = (
  body: RestoreImageRequest
): Promise<RestorationResponse> =>
  postJson<RestorationResponse>("/api/restore", body);
