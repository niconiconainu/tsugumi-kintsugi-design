#!/usr/bin/env python3
"""金継ぎ復元の 2 ステップ検証スクリプト。

  python3 kintsugi_verify.py 写真.jpg --piece bowl --material ceramic --locale ja

step1: qwen3-vl-plus  … 金継ぎできる器かを判定し、復元に必要な特徴を書き出す
step2: qwen-image-edit-max … その写真そのものを編集して、金継ぎされた姿にする
"""
import argparse
import base64
import json
import os
import pathlib
import re
import sys
import time
import urllib.request
import urllib.error

CHAT_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions"
EDIT_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation"

VISION_MODEL = os.environ.get("QWEN_VISION_MODEL") or "qwen3-vl-plus"
EDIT_MODEL = os.environ.get("QWEN_IMAGE_EDIT_MODEL") or "qwen-image-edit-max"

# アプリのドロップダウンにある素材は、すべて金継ぎ可能。
# よってモデルの仕事は「素材を当てる」ことではなく「一覧に無いものが写っていたら拒否する」こと。
SELECTABLE_MATERIALS = ["ceramic", "porcelain", "stoneware", "glass", "lacquerware", "unknown"]
LANGUAGE_NAME = {"ja": "Japanese", "en": "English"}

STEP1_SYSTEM = """\
You are a strict inspector for a kintsugi (Japanese gold-repair) app.

You are given ONE user-uploaded photo. The user has already told us what the piece is:
  declared_object   = "{piece}"
  declared_material = "{material}"

TRUST THE USER for what the object is and what it is made of. Those two values are settled;
do not second-guess them. Your job is only to (a) veto cases where the photo makes repair
impossible, and (b) describe what you actually see, precisely enough to redraw it.

Describe only what is visible. Do not assume. If several objects are in frame, describe the
largest, most central one.

Return a single JSON object and nothing else, with exactly these keys:

{{
  "is_vessel": true | false,
  "is_broken": true | false,
  "material_compatible": true | false,
  "identifiable": true | false,
  "blocking_material": "",
  "reason": "",
  "damage_description": "",
  "dominant_colors": [],
  "design_description": "",
  "framing": ""
}}

How to fill them:
- is_vessel — false only if the main object is clearly not a dish or vessel at all.
- is_broken — kintsugi needs damage. false if you see no crack, chip or missing piece.
- material_compatible — false ONLY if the piece is visibly made of something kintsugi cannot
  repair: plastic, silicone, metal, wood, or a piece so crumbled it cannot be rejoined.
  Ceramic, porcelain, stoneware, glass and lacquerware are all acceptable — do not reject those.
- blocking_material — when material_compatible is false, the one word you actually saw
  (e.g. "plastic"). Empty string otherwise.
- identifiable — false if the photo is too blurry, dark or cropped to make out the piece or
  the damage.
- reason — WRITTEN IN {language}. One short sentence a customer can understand, explaining the
  first thing above that failed. Empty string if nothing failed.
- damage_description — where the breaks, chips and cracks run, in plain words tracing the actual
  fracture lines. MAXIMUM 40 WORDS.
- dominant_colors — 2 to 4 plain colour names in English (e.g. "off-white", "indigo").
  No hex codes.
- design_description — glaze, pattern, decoration, texture and shape, precise enough to
  reproduce the piece faithfully. MAXIMUM 40 WORDS.
- framing — camera angle, crop and background, so an after-image can match it.
  MAXIMUM 20 WORDS.

The word limits are hard. Text past them is discarded downstream."""

# 命令を先頭に置く。禁止事項を先に書くと「変えるな」が「直せ」に勝ち、割れたままの画像が返る。
STEP2_TEMPLATE = """\
Reassemble this broken {piece} into ONE whole, intact {piece}, repaired with traditional
Japanese kintsugi.

The fragments in the photo must be joined back together so the {piece} is complete: no gaps
between pieces, no separate shards lying apart, no holes. Missing chips are filled. Every
fracture line where the pieces meet is sealed with {metal} lacquer, forming thin organic
seams that follow the real cracks: {damage_description}

Keep the same {piece}: {design_description} Keep the same colours ({dominant_colors}), the same
{material} glaze and pattern, the same lighting, camera angle and background: {framing}

Do not add decoration beyond the seams. Do not change the pattern, colour or shape. Do not add
text or extra objects. Photorealistic, same aspect ratio as the input."""

METAL_PHRASE = {
    "gold": "lustrous gold",
    "silver": "lustrous silver",
    "red_gold": "red-gold (bengara lacquer under gold)",
}


def post(url: str, payload: dict, timeout: int = 180) -> dict:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {os.environ['QWEN_API_KEY']}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return json.loads(res.read().decode())
    except urllib.error.HTTPError as err:
        sys.exit(f"HTTP {err.code}: {err.read()[:600].decode()}")


def data_url(path: pathlib.Path) -> str:
    suffix = "png" if path.suffix.lower() == ".png" else "jpeg"
    return f"data:image/{suffix};base64,{base64.b64encode(path.read_bytes()).decode()}"


def inspect(image: str, piece: str, material: str, locale: str) -> tuple[dict, float]:
    system = STEP1_SYSTEM.format(
        piece=piece, material=material, language=LANGUAGE_NAME[locale]
    )
    started = time.time()
    result = post(
        CHAT_URL,
        {
            "model": VISION_MODEL,
            "messages": [
                {"role": "system", "content": system},
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": image}},
                        {"type": "text", "text": "Inspect this piece."},
                    ],
                },
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0,
        },
    )
    text = result["choices"][0]["message"]["content"]
    match = re.search(r"\{.*\}", text, re.S)
    return json.loads(match.group(0) if match else text), time.time() - started


def restore(
    image: str, report: dict, piece: str, material: str, metal: str
) -> tuple[str, float]:
    prompt = STEP2_TEMPLATE.format(
        piece="vessel" if piece == "other" else piece,
        material=material,
        metal=METAL_PHRASE[metal],
        design_description=report["design_description"],
        dominant_colors=", ".join(report["dominant_colors"]),
        framing=report["framing"],
        damage_description=report["damage_description"],
    )
    started = time.time()
    result = post(
        EDIT_URL,
        {
            "model": EDIT_MODEL,
            "input": {
                "messages": [
                    {
                        "role": "user",
                        "content": [{"image": image}, {"text": prompt}],
                    }
                ]
            },
            "parameters": {
                "negative_prompt": "still broken, separate fragments, gaps between pieces, "
                "missing pieces, new object, extra decoration, text, watermark, changed background"
            },
        },
    )
    url = result["output"]["choices"][0]["message"]["content"][0]["image"]
    return url, time.time() - started


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("photo")
    parser.add_argument("--piece", default="bowl")
    parser.add_argument("--material", default="ceramic", choices=SELECTABLE_MATERIALS)
    parser.add_argument("--locale", default="ja", choices=["ja", "en"])
    parser.add_argument("--metal", default="gold", choices=list(METAL_PHRASE))
    parser.add_argument("-n", type=int, default=1, help="同じ写真で何回生成するか")
    args = parser.parse_args()

    path = pathlib.Path(args.photo)
    image = data_url(path)

    report, elapsed = inspect(image, args.piece, args.material, args.locale)
    print(f"--- step1 ({VISION_MODEL}, {elapsed:.1f}s) ---")
    print(json.dumps(report, ensure_ascii=False, indent=2))

    # pass はモデルではなくここで組み立てる。閾値を変えるのにプロンプトを触らなくて済む。
    checks = ["is_vessel", "is_broken", "material_compatible", "identifiable"]
    failed = [key for key in checks if not report.get(key)]
    if failed:
        print(f"\n[REJECTED] {failed} -> {report.get('reason')}")
        return
    print("\n[PASS]")

    outdir = path.parent / "kintsugi_out"
    outdir.mkdir(exist_ok=True)
    for index in range(args.n):
        url, elapsed = restore(image, report, args.piece, args.material, args.metal)
        dest = outdir / f"{path.stem}_{args.metal}_{index + 1}.png"
        with urllib.request.urlopen(url, timeout=180) as res:
            dest.write_bytes(res.read())
        print(f"--- step2 #{index + 1} ({EDIT_MODEL}, {elapsed:.1f}s) -> {dest}")


if __name__ == "__main__":
    main()
