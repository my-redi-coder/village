/* ─────────────────────────────────────────
   config · 마을 설정 — 건물·빈터 목록 (가장 자주 고치는 파일)

   좌표는 배경 지도 그림(864 x 1821) 위의 픽셀 위치예요.
     x, y : 건물 '바닥 중앙' 위치  (왼쪽 위가 0,0)
     w    : 건물 폭 (클수록 크게 보여요. 집이 270이에요)

   건물 그림 : assets/buildings/<id>.webp   (투명 배경)
   선택 테두리: assets/rings/<id>.webp      (없으면 임시 윤곽이 보여요)
               → python tools/make_ring.py assets/buildings/<id>.webp --map-w <w>

   ★ 새 건물 추가 순서
     1) 건물 그림을 assets/buildings/ 에 넣기
     2) 아래 buildings 에 한 줄 추가
     3) 빈터에 지었다면 lots 에서 그 자리 한 줄 지우기
     4) 테두리 만들기(위 명령어)
   ───────────────────────────────────────── */
window.VILLAGE = {
  map: { width: 864, height: 1821 },

  buildings: [
    { id: "bank",    label: "나의 자산 관리",         href: "https://claude.ai/artifact/NhwWdSEhFkMRyLG87PGkzn", x: 690, y: 752,  w: 280 },
    { id: "house",   label: "이사 준비 대시보드",     href: "https://claude.ai/artifact/8ezKX3vRFPJjKpmcS5KNDU", x: 715, y: 1135, w: 270 },
    { id: "stadium", label: "문학야구장",             href: "https://my-redi-coder.github.io/munhak/",           x: 272, y: 1300, w: 350 },
    { id: "trophy",  label: "26 후반기 승리 감상평",  href: "https://my-redi-coder.github.io/baseball/",         x: 660, y: 1455, w: 165 },
    { id: "turtle",  label: "사주 · 오늘의 운세",     href: "https://claude.ai/artifact/9sdT6HysSyGjHABLCP6CAf", x: 147, y: 607,  w: 88 }
  ],

  // 아직 건물이 없는 빈터 ("공사 예정" 표지판이 서요)
  lots: [
    { x: 265, y: 760 }
  ]
};
