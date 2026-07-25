import workshopRecords from "@/data/workshops.json";
import type { Workshop } from "@/domain/entity/workshop/workshop.entity";
import {
  toDomain,
  type WorkshopRecord,
} from "@/infrastructure/repository/workshop/workshop.translator";
import { logger } from "@/utils/logger";

/**
 * Mock 工房 DB（設計書 3.1）。実在の工房ではない架空データ。
 * DB を用意せず JSON をバンドルに含めるだけなので、読み出しは同期で完結する。
 */
export class WorkshopRepository {
  async findAll(): Promise<Workshop[]> {
    try {
      return (workshopRecords as WorkshopRecord[]).map(toDomain);
    } catch (error) {
      logger.error("[WorkshopRepository] Failed to load workshop data.", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Workshop | null> {
    const workshops = await this.findAll();
    return workshops.find((workshop) => workshop.id === id) ?? null;
  }
}
