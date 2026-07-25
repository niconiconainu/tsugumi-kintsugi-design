import type { Material } from "@/constants/artifact/damage";
import type {
  DesignComplexity,
  DesignTaste,
  MetalColor,
} from "@/constants/design/taste";

/**
 * 工房を選ぶ根拠と注意点。
 *
 * 文章ではなく **コードとパラメータ** で持つ。理由は 2 つ:
 * - ドメインが表示言語を知らずに済む（翻訳は presentation / Copy Agent の仕事）
 * - 「どの事実に基づく判断か」が型で表れる
 */
export type MatchReason =
  | { code: "tasteMatch"; tastes: DesignTaste[] }
  | { code: "materialExperience"; material: Material }
  | { code: "metalSupported"; metalColor: MetalColor }
  | { code: "urushi" };

export type MatchCaution =
  | { code: "materialNotSupported"; material: Material }
  | { code: "metalNotSupported"; metalColor: MetalColor }
  | { code: "complexityExceeded"; complexity: DesignComplexity }
  | { code: "simpleKintsugi" };
