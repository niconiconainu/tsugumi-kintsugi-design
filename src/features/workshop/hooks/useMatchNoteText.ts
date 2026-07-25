"use client";

import { useTranslations } from "next-intl";
import type {
  MatchCaution,
  MatchReason,
} from "@/domain/entity/workshop/match-note";

interface MatchNoteText {
  reason: (reason: MatchReason) => string;
  caution: (caution: MatchCaution) => string;
}

/**
 * ドメインが返すコード + パラメータを、表示言語の文へ開く。
 * 文章はここ（presentation 側）にしか無く、ドメインは表示言語を知らない。
 */
export const useMatchNoteText = (): MatchNoteText => {
  const tReason = useTranslations("matchReason");
  const tCaution = useTranslations("matchCaution");
  const tMaterial = useTranslations("material");
  const tMetal = useTranslations("metalColor");
  const tComplexity = useTranslations("complexity");

  const reason = (item: MatchReason): string => {
    switch (item.code) {
      case "materialExperience":
        return tReason("materialExperience", {
          material: tMaterial(item.material),
        });
      case "metalSupported":
        return tReason("metalSupported", {
          metalColor: tMetal(item.metalColor),
        });
      case "urushi":
        return tReason("urushi");
    }
  };

  const caution = (item: MatchCaution): string => {
    switch (item.code) {
      case "materialNotSupported":
        return tCaution("materialNotSupported", {
          material: tMaterial(item.material),
        });
      case "metalNotSupported":
        return tCaution("metalNotSupported", {
          metalColor: tMetal(item.metalColor),
        });
      case "complexityExceeded":
        return tCaution("complexityExceeded", {
          complexity: tComplexity(item.complexity),
        });
      case "simpleKintsugi":
        return tCaution("simpleKintsugi");
    }
  };

  return { reason, caution };
};
