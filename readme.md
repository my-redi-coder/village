# Redi’s Village 🏡

내가 만든 것들이 사는 마을 지도. 건물을 누르면(첫 탭: 테두리 / 두 번째 탭: 이동) 해당 페이지로 가요.

- 배포 주소: `https://my-redi-coder.github.io/village/`
- 빌드 도구 없이 파일 그대로 올리면 돌아가는 정적 사이트예요 (GitHub Pages).

## 폴더 구조 — 레이어(층)별로 나눠져 있어요

마을은 투명한 판 여러 장이 지도 위에 겹쳐진 구조예요. **바꾸고 싶은 층의 파일만** 교체하면 돼요.

| 층 (아래 → 위) | 하는 일 | 파일 |
|---|---|---|
| 0. 배경 지도 | 언덕·길·호수·분수 | `assets/map/background.webp` · `css/10-map.css` |
| 1. 하늘 | 지나가는 새 | `index.html`(`#layer-sky`) · `css/20-sky.css` |
| 2. 빈터 | "공사 예정" 표지판 | `js/lots.js` · `css/50-lots.css` |
| 3. 건물 | 건물 그림, 선택 테두리, 두 번 탭 이동 | `assets/buildings/` · `assets/rings/` · `js/buildings.js` · `css/40-buildings.css` |
| 4. 로고 | 구름 "Redi’s Village" | `assets/title/logo.webp` · `css/30-title.css` |
| 공통 | 색상 변수, 폰트, 폰 상단 안전영역 | `css/00-base.css` |
| **설정** | **건물·빈터 목록(이름·링크·위치·크기)** | **`js/config.js`** |

```
village/
├─ index.html                # 층들을 조립하는 파일 (보통 안 건드려도 돼요)
├─ css/   00-base · 10-map · 20-sky · 30-title · 40-buildings · 50-lots
├─ js/    config(★) · lots · buildings
├─ assets/
│  ├─ map/background.webp
│  ├─ title/logo.webp
│  ├─ buildings/<id>.webp    # 건물 그림 (투명 배경)
│  └─ rings/<id>.webp        # 선택 테두리 (tools/make_ring.py 로 자동 생성)
└─ tools/make_ring.py
```

## 자주 하는 수정

**새 건물 짓기** (가장 자주 할 일)
1. 건물 그림(투명 배경 PNG/WebP)을 `assets/buildings/새이름.webp` 로 넣기
2. `js/config.js` 의 `buildings` 에 한 줄 추가 (`id`는 파일 이름과 같게, `x·y`는 건물 바닥 중앙 위치, `w`는 폭)
3. 빈터에 지었다면 같은 파일의 `lots` 에서 그 자리 한 줄 삭제
4. 선택 테두리 만들기
   ```
   pip install pillow numpy scipy
   python tools/make_ring.py assets/buildings/새이름.webp --map-w <config의 w 값>
   ```
   (테두리를 안 만들어도 임시 윤곽이 보여서 동작은 해요)

**건물 링크 바꾸기 / 이름 바꾸기 / 위치·크기 조정** → `js/config.js` 한 줄만 수정

**로고 바꾸기** → `assets/title/logo.webp` 를 같은 이름으로 덮어쓰기 (크기·위치는 `css/30-title.css`)

**건물 그림만 바꾸기** → `assets/buildings/<id>.webp` 덮어쓰기. 크기가 달라졌다면 테두리도 다시 생성 (위 4번)

**배경 지도 바꾸기** → `assets/map/background.webp` 덮어쓰기.
단, 새 지도의 가로세로 크기가 864×1821 이 아니면 `js/config.js` 의 `map` 과 `index.html` 의 `<img class="map">` 크기, `tools/make_ring.py` 의 `MAP_W` 를 같이 맞춰 주세요. 하늘·풀 색이 달라지면 `css/00-base.css` 의 `--sky`, `--grass` 도 새 지도 위·아래 색으로 바꿔 주세요.

**표지판 색 바꾸기** → `css/00-base.css`

## 올리는 방법 (GitHub Pages)

1. GitHub 에서 새 저장소 `village` 만들기 (Public)
2. 이 폴더 안의 내용 전체(폴더째로, `index.html` 이 저장소 맨 위에 오도록)를 업로드
3. Settings → Pages → Branch `main` / `/ (root)` → Save
4. 1~2분 뒤 `https://my-redi-coder.github.io/village/` 접속

수정 후 다시 올렸는데 예전 모습이 보이면 캐시 때문이에요. 새로고침(강력 새로고침)하거나 몇 분 기다려 보세요.

## 내 컴퓨터에서 미리보기

```
cd village
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000
```

## 참고

- `은행`(자산 관리)·`집`(이사 대시보드)·`거북이`(사주·오늘의 운세) 링크는 비공개 claude.ai 아티팩트라서 본인 계정으로만 열려요. 마을 주소를 다른 사람에게 줘도 그 셋은 열리지 않아요.
- 글꼴(Jua)은 Google Fonts 에서 불러와요. 오프라인이면 기본 글꼴로 보여요.
