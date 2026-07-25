import type { DesignsResult } from "@/application/dto/design/designs.result";
import {
  toDesignOptionResponse,
  type DesignOptionResponse,
} from "@/presentation/dto/common/design-option.schema";

export interface DesignsResponse {
  designs: DesignOptionResponse[];
}

export const toDesignsResponse = (result: DesignsResult): DesignsResponse => ({
  designs: result.designs.map(toDesignOptionResponse),
});
