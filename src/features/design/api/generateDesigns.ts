import { postJson } from "@/features/common/utils/api-client";
import type { DesignsResponse } from "@/presentation/controller/v1/design/dto/designs.response";
import type { GenerateDesignsRequest } from "@/presentation/controller/v1/design/dto/generate-designs.request";

export const generateDesigns = (
  body: GenerateDesignsRequest
): Promise<DesignsResponse> => postJson<DesignsResponse>("/api/designs", body);
