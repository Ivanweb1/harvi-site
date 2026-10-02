"""
HARVI — подготовка оптимизированных копий Hero-ассетов.

Читает ОРИГИНАЛЫ из HARVI_Website_Assets/04_HERO (не изменяя их) и собирает
в public/harvi/ слои для интерактивного Hero:

  figure-base.*   — тело HARVI (голова вырезана мягким растворением на шее)
  head-<state>.*  — 4 состояния головы в одной системе координат
  hero-main.*     — утверждённый Key Visual (fallback / OG)

Геометрия слоёв уезжает в src/data/harvi-layers.json, чтобы фронтенд не хранил
магические числа.

Запуск:  python scripts/prepare_assets.py
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent / "HARVI_Website_Assets" / "04_HERO"
OUT = ROOT / "public" / "harvi"

CANVAS = (1024, 1536)          # размер исходных state-рендеров
HEAD_BOX = (316, 0, 684, 384)  # crop головы: left, top, right, bottom
SEAM_TOP = 330                 # начало мягкого стыка голова/тело (шея)
SEAM_BOTTOM = 375              # конец стыка

STATES = {
    "sleeping": "Hero_States/harvi_hero_eyes_closed.png",
    "live": "Hero_States/harvi_hero_neutral_live.png",
    "url": "Hero_States/harvi_hero_look_url.png",
    "focused": "Hero_States/harvi_hero_focused.png",
}
BASE_STATE = "Hero_States/harvi_hero_neutral_live.png"
KEY_VISUAL = "Hero_Key_Visual/harvi_hero_main.png"


def seam_ramp(height: int) -> np.ndarray:
    """1.0 выше шва, 0.0 ниже — линейный переход между SEAM_TOP и SEAM_BOTTOM."""
    y = np.arange(height, dtype=np.float32)
    ramp = (SEAM_BOTTOM - y) / float(SEAM_BOTTOM - SEAM_TOP)
    return np.clip(ramp, 0.0, 1.0)


def save(img: Image.Image, stem: str, *, webp_q: int = 86, avif_q: int = 62) -> dict:
    paths = {}
    png = OUT / f"{stem}.png"
    img.save(png, optimize=True)
    img.save(OUT / f"{stem}.webp", quality=webp_q, method=6)
    img.save(OUT / f"{stem}.avif", quality=avif_q)
    for ext in ("avif", "webp", "png"):
        p = OUT / f"{stem}.{ext}"
        paths[ext] = round(p.stat().st_size / 1024)
    return paths


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    report = {}

    # --- тело: голова растворяется к шву, ниже шва остаётся исходный рендер ---
    base = Image.open(SRC / BASE_STATE).convert("RGBA")
    assert base.size == CANVAS, base.size
    arr = np.array(base).astype(np.float32)
    ramp = seam_ramp(CANVAS[1])[:, None]
    arr[:, :, 3] *= 1.0 - ramp
    body = Image.fromarray(arr.round().astype(np.uint8), "RGBA")
    report["figure-base"] = save(body, "figure-base")

    # --- головы: один и тот же crop, альфа гаснет к шву ---
    head_ramp = seam_ramp(CANVAS[1])[HEAD_BOX[1]:HEAD_BOX[3], None]
    for name, rel in STATES.items():
        src = Image.open(SRC / rel).convert("RGBA").crop(HEAD_BOX)
        a = np.array(src).astype(np.float32)
        a[:, :, 3] *= head_ramp
        head = Image.fromarray(a.round().astype(np.uint8), "RGBA")
        report[f"head-{name}"] = save(head, f"head-{name}")

    # --- утверждённый Key Visual: fallback и OG ---
    kv = Image.open(SRC / KEY_VISUAL).convert("RGB")
    report["hero-main"] = save(kv, "hero-main", webp_q=82)

    og = kv.resize((1200, int(1200 * kv.height / kv.width)), Image.LANCZOS)
    canvas = Image.new("RGB", (1200, 630), (244, 239, 233))
    canvas.paste(og, (0, (630 - og.height) // 2))
    canvas.save(OUT / "og.jpg", quality=88, optimize=True)
    report["og.jpg"] = round((OUT / "og.jpg").stat().st_size / 1024)

    layers = {
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "head": {
            "left": HEAD_BOX[0],
            "top": HEAD_BOX[1],
            "width": HEAD_BOX[2] - HEAD_BOX[0],
            "height": HEAD_BOX[3] - HEAD_BOX[1],
        },
        "seam": {"top": SEAM_TOP, "bottom": SEAM_BOTTOM},
        "states": list(STATES),
    }
    layers_file = ROOT / "src" / "data" / "harvi-layers.json"
    layers_file.parent.mkdir(parents=True, exist_ok=True)
    layers_file.write_text(json.dumps(layers, indent=2), encoding="utf-8")

    print(json.dumps({"layers": layers, "sizes_kb": report}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
