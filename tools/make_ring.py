#!/usr/bin/env python3
"""
건물 이미지 → '선택 테두리(흰 스티커 윤곽)' 이미지 자동 생성

새 건물을 추가할 때, 건물 PNG/WebP(투명 배경)만 있으면 이 도구로 테두리를 만들 수 있어요.

사용법
  pip install pillow numpy scipy
  python tools/make_ring.py assets/buildings/bank.webp --map-w 280
  (→ assets/rings/bank.webp 생성)

옵션
  --map-w   js/config.js 에 적은 그 건물의 w 값(지도 폭 864 기준). 클수록 화면에서 크게 보이는 건물이라
            이미지 픽셀 기준 테두리를 알아서 얇게 맞춰줘요. (필수)
  --stroke  화면 폭 대비 테두리 두께(%) — 기본 0.55. 더 굵게/얇게 하고 싶으면 바꾸세요.
  --out     저장 경로 — 기본 assets/rings/<파일이름>.webp

약속(중요): 테두리 이미지는 '건물 이미지 + 사방 같은 여백(pad)' 크기여야 해요.
이 도구가 그렇게 만들어 주고, 화면에서는 두 이미지 크기 차이로 위치를 자동 계산해요.
"""
import argparse
import os

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

MAP_W = 864  # js/config.js 의 map.width 와 같아야 해요


def make_ring(src, map_w, stroke_pct=0.55):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    stroke = max(3, round(stroke_pct / 100 * w * MAP_W / map_w))
    smooth = round(0.05 * w)  # 뾰족한 부분을 메워 둥글게 만드는 정도
    pad = stroke + 4
    P = pad + smooth
    alpha = np.array(im.split()[-1]) > 40
    big = np.zeros((h + 2 * P, w + 2 * P), bool)
    big[P:P + h, P:P + w] = alpha
    grown = ndi.distance_transform_edt(~big) <= (stroke + smooth)  # 부풀렸다가
    shrunk = ndi.distance_transform_edt(grown) > smooth            # 다시 깎으면 매끈한 윤곽
    shrunk |= big
    soft = ndi.gaussian_filter(shrunk.astype(float), 1.4)          # 안티앨리어싱
    a = np.clip((soft - 0.5) * 3.2 + 0.5, 0, 1)
    a = a[smooth:smooth + h + 2 * pad, smooth:smooth + w + 2 * pad]
    out = np.zeros(a.shape + (4,), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (a * 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA"), pad


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="건물 선택 테두리 이미지 생성")
    ap.add_argument("src")
    ap.add_argument("--map-w", type=float, required=True)
    ap.add_argument("--stroke", type=float, default=0.55)
    ap.add_argument("--out")
    a = ap.parse_args()
    ring, pad = make_ring(a.src, a.map_w, a.stroke)
    out = a.out or os.path.join(
        os.path.dirname(os.path.dirname(a.src)), "rings",
        os.path.splitext(os.path.basename(a.src))[0] + ".webp")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    ring.save(out, "WEBP", quality=92, method=6)
    print(f"저장: {out}  (여백 pad={pad}px, 크기 {ring.size})")
