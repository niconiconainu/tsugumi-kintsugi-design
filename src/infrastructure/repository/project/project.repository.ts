import type { Project } from "@/domain/entity/project/project.entity";
import { logger } from "@/utils/logger";

/**
 * プロジェクト保存の Mock 実装（設計書 6.2 の `/api/projects` は「任意」扱い）。
 *
 * ⚠️ プロセス内メモリのみ。サーバーが再起動すると消え、複数インスタンスでは共有されない。
 * ハッカソンの共有 URL デモに必要な最小限として割り切っている。
 * 永続化するときはこのクラスの中だけを DB / KV に差し替える。
 */
const store = new Map<string, Project>();

/** 溜め込みすぎないよう、保持する件数に上限を設ける。 */
const MAX_ENTRIES = 200;

export class ProjectRepository {
  async save(project: Project): Promise<void> {
    try {
      if (store.size >= MAX_ENTRIES) {
        const oldestKey = store.keys().next().value;
        if (oldestKey !== undefined) store.delete(oldestKey);
      }
      store.set(project.id, project);
    } catch (error) {
      logger.error(
        `[ProjectRepository] Failed to save project. projectId=${project.id}`,
        error
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Project | null> {
    return store.get(id) ?? null;
  }
}
