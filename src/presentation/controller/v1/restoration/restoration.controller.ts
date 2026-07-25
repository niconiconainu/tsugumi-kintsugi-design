import { RestorationUseCase } from "@/application/usecase/restoration/restoration.usecase";
import { MAX_IMAGE_DATA_URL_LENGTH } from "@/constants/artifact/image";
import { CustomError } from "@/error/custom.error";
import { ErrorConfig } from "@/error/error.config";
import {
  toRestorationResponse,
  type RestorationResponse,
} from "@/presentation/controller/v1/restoration/dto/restoration.response";
import { restoreImageSchema } from "@/presentation/controller/v1/restoration/dto/restore-image.request";

export class RestorationController {
  constructor(private readonly restorationUseCase: RestorationUseCase) {}

  /**
   * POST /api/restore
   * アップロード写真を編集し、金継ぎされた姿の画像 URL を返す
   */
  async restore(request: Request): Promise<RestorationResponse> {
    const body = restoreImageSchema.parse(await request.json());
    if (body.imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      throw new CustomError(ErrorConfig.IMAGE_TOO_LARGE);
    }
    const result = await this.restorationUseCase.restoreImage(body);
    return toRestorationResponse(result);
  }
}
