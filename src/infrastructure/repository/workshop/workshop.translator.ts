import type { Material } from "@/constants/artifact/damage";
import type {
  DesignComplexity,
  MetalColor,
} from "@/constants/design/expression";
import { toRegion, type Prefecture } from "@/constants/region/prefecture";
import type { WorkshopStyle } from "@/constants/workshop/style";
import type { LocalizedText } from "@/domain/entity/common/localized-text";
import { Workshop } from "@/domain/entity/workshop/workshop.entity";

/** workshops.json の 1 レコード。JSON なので型は手書きで固定する。 */
export interface WorkshopRecord {
  id: string;
  name: LocalizedText;
  prefecture: string;
  type: LocalizedText;
  description: LocalizedText;
  basePrice: number;
  repairDays: number;
  queueDays: number;
  styleTags: string[];
  materialSkills: string[];
  metalColors: string[];
  maxComplexity: string;
  usesUrushi: boolean;
}

/** JSON レコードから domain entity を復元する。地方区分は都道府県から導出する。 */
export const toDomain = (record: WorkshopRecord): Workshop => {
  const prefecture = record.prefecture as Prefecture;
  return new Workshop(
    record.id,
    record.name,
    prefecture,
    toRegion(prefecture),
    record.type,
    record.description,
    record.basePrice,
    record.repairDays,
    record.queueDays,
    record.styleTags as WorkshopStyle[],
    record.materialSkills as Material[],
    record.metalColors as MetalColor[],
    record.maxComplexity as DesignComplexity,
    record.usesUrushi
  );
};
