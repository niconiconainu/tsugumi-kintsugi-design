import { DesignUseCase } from "@/application/usecase/design/design.usecase";
import {
  toDesignsResponse,
  type DesignsResponse,
} from "@/presentation/controller/v1/design/dto/designs.response";
import { generateDesignsSchema } from "@/presentation/controller/v1/design/dto/generate-designs.request";

export class DesignController {
  constructor(private readonly designUseCase: DesignUseCase) {}

  /**
   * POST /api/designs
   * 解析結果とストーリーから金継ぎデザイン案を 3 件生成する
   */
  async generate(request: Request): Promise<DesignsResponse> {
    const body = generateDesignsSchema.parse(await request.json());
    const result = await this.designUseCase.generateDesigns(body);
    return toDesignsResponse(result);
  }
}
