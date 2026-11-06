/* ─────────────────────────────────────────
   buildings · 건물 레이어 동작
   - js/config.js 의 buildings 를 읽어서 #layer-buildings 에 건물을 세워요.
   - 첫 번째 탭: 흰 테두리만 / 두 번째 탭: 해당 링크로 이동
     (첫 탭 전에는 href 자체가 없어서, 한 번에 이동하는 일이 생기지 않아요)
   - 건물 그림 위치·크기는 config 값 → 퍼센트로 변환, 테두리 위치는 이미지 크기 차이로 자동 계산
   ───────────────────────────────────────── */
(function () {
  "use strict";
  var cfg = window.VILLAGE;
  var layer = document.getElementById("layer-buildings");
  var live = document.getElementById("live");
  if (!cfg || !layer) return;

  var current = null;   // 지금 선택(테두리)된 건물
  var selectedAt = 0;   // 선택된 시각 — 더블탭 오작동 방지용

  function pctX(v) { return (v / cfg.map.width * 100) + "%"; }
  function pctY(v) { return (v / cfg.map.height * 100) + "%"; }

  function clearSelection() {
    if (!current) return;
    current.classList.remove("sel");
    current.removeAttribute("href");
    current = null;
  }

  function select(a, label) {
    if (current !== a) clearSelection();
    current = a;
    selectedAt = Date.now();
    a.classList.remove("sel");
    void a.offsetWidth;                         // 애니메이션 다시 시작
    a.classList.add("sel");
    a.setAttribute("href", a.dataset.href);     // 선택된 뒤에만 링크가 됨
    if (live) live.textContent = label + " 선택됨. 한 번 더 누르면 열려요.";
  }

  function build(b) {
    var a = document.createElement("a");
    a.className = "spot";
    a.dataset.href = b.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.tabIndex = 0;
    a.setAttribute("role", "link");
    a.setAttribute("aria-label", b.label);
    a.style.left = pctX(b.x);
    a.style.top = pctY(b.y);
    a.style.width = (b.w / cfg.map.width * 100) + "%";

    var ring = new Image();
    ring.className = "ring";
    ring.alt = "";
    ring.src = "assets/rings/" + b.id + ".webp";

    var img = new Image();
    img.className = "bld";
    img.alt = "";
    img.src = "assets/buildings/" + b.id + ".webp";

    a.appendChild(ring);
    a.appendChild(img);
    layer.appendChild(a);

    // 그림이 다 불러와지면: 테두리 위치 계산 + 나타나기
    var ringOk = ring.decode ? ring.decode().then(function () { return true; }, function () { return false; })
                             : Promise.resolve(true);
    var imgOk = img.decode ? img.decode().then(function () { return true; }, function () { return false; })
                           : Promise.resolve(true);
    Promise.all([ringOk, imgOk]).then(function (r) {
      if (r[0] && r[1] && ring.naturalWidth) {
        var pad = (ring.naturalWidth - img.naturalWidth) / 2;    // 테두리가 건물보다 사방으로 얼마나 큰지
        ring.style.left = (-pad / img.naturalWidth * 100) + "%";
        ring.style.top = (-pad / img.naturalHeight * 100) + "%";
        ring.style.width = (ring.naturalWidth / img.naturalWidth * 100) + "%";
      } else {
        ring.remove();
        a.classList.add("no-ring");             // 테두리 그림이 없으면 임시 윤곽 사용
      }
      a.classList.add("ready");
    });

    a.addEventListener("click", function (e) {
      if (!a.classList.contains("sel")) {                 // 첫 번째 탭: 테두리만
        e.preventDefault();
        select(a, b.label);
      } else if (Date.now() - selectedAt < 350) {         // 너무 빠른 연속 탭은 무시
        e.preventDefault();
      } else {                                            // 두 번째 탭: 이동
        setTimeout(clearSelection, 500);
      }
    });
    a.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); a.click(); }
    });
  }

  cfg.buildings.forEach(build);

  // 건물이 아닌 곳을 누르면 테두리 해제
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".spot")) {
      clearSelection();
      if (live) live.textContent = "";
    }
  });
})();
