import type { RestorationResult } from "@/application/dto/restoration/restoration.result";

export interface RestorationResponse {
  restoredImageUrl: string | null;
}

export const toRestorationResponse = (
  result: RestorationResult
): RestorationResponse => ({
  restoredImageUrl: result.restoredImageUrl,
});
