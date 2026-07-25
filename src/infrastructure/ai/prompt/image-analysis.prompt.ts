import type { ArtifactType } from "@/constants/artifact/artifact-type";
import { DAMAGE_TYPES, type Material } from "@/constants/artifact/damage";
import type { Locale } from "@/constants/i18n/locale";

const LANGUAGE_NAME: Record<Locale, string> = {
  ja: "Japanese",
  en: "English",
};

/**
 * 金継ぎ可否の判定と、復元画像を作るための特徴抽出（step1）。
 *
 * 器の種類と素材はユーザーが申告済みなので当てさせない。モデルの仕事は
 * 「修理が成り立たない写真を弾く」ことと「同じ器に見せるための記述を書く」ことの 2 つ。
 * `pass` の判定自体はコード側で組み立てる（閾値をプロンプト無しで変えられるようにするため）。
 */
export const buildImageAnalysisPrompt = (params: {
  artifactType: ArtifactType;
  material: Material;
  locale: Locale;
}): { system: string; user: string } => ({
  system: `You are a strict inspector for a kintsugi (Japanese gold-repair) app.

The user has already told us what the piece is:
  declared_object   = "${params.artifactType}"
  declared_material = "${params.material}"

TRUST THE USER for what the object is and what it is made of. Do not second-guess those.
Your job is only to (a) veto cases where the photo makes repair impossible, and (b) describe
what you actually see, precisely enough to redraw it.

Describe only what is visible. Do not assume. If several objects are in frame, describe the
largest, most central one.

Return a single JSON object and nothing else, with exactly these keys:

{
  "isVessel": true | false,
  "isBroken": true | false,
  "materialCompatible": true | false,
  "identifiable": true | false,
  "blockingMaterial": "",
  "reason": "",
  "damageType": ${DAMAGE_TYPES.map((type) => `"${type}"`).join(" | ")},
  "damageSeverity": "light" | "medium" | "heavy",
  "crackCount": 0,
  "missingAreaRatio": 0.0,
  "dominantColors": [],
  "visualMotifs": [],
  "repairNotes": [],
  "damageDescription": "",
  "designDescription": "",
  "framing": "",
  "confidence": 0.0
}

How to fill them:
- isVessel — false only if the main object is clearly not a dish or vessel at all.
- isBroken — kintsugi needs damage. false if you see no crack, chip or missing piece.
- materialCompatible — false ONLY if the piece is visibly made of something kintsugi cannot
  repair: plastic, silicone, metal, wood, or a piece so crumbled it cannot be rejoined.
  Ceramic, porcelain, stoneware, glass and lacquerware are all acceptable.
- blockingMaterial — when materialCompatible is false, the one word you saw (e.g. "plastic").
- identifiable — false if the photo is too blurry, dark or cropped to make out the damage.
- reason — WRITTEN IN ${LANGUAGE_NAME[params.locale]}. One short sentence a customer can
  understand, explaining the first check above that failed. Empty string if nothing failed.
- crackCount — integer, countable cracks only. 0 if you cannot count them.
- missingAreaRatio — 0.0 to 1.0, missing area against the whole piece. 0 if nothing is missing.
- dominantColors — 2 to 4 plain colour names in English. No hex codes.
- visualMotifs, repairNotes — WRITTEN IN ${LANGUAGE_NAME[params.locale]}, up to 3 each.
  repairNotes are practical cautions only (curved surface, thin walls, glaze type).
- damageDescription — where the breaks, chips and cracks run, in plain English words tracing
  the actual fracture lines. MAXIMUM 40 WORDS.
- designDescription — glaze, pattern, decoration, texture and shape, in English, precise
  enough to reproduce the piece faithfully. MAXIMUM 40 WORDS.
- framing — camera angle, crop and background, in English. MAXIMUM 20 WORDS.
- confidence — 0.0 to 1.0, your honest self-assessment.

Never output prices, repair durations or studio names. The word limits are hard:
text past them is discarded downstream.`,
  user: "Inspect this piece.",
});
