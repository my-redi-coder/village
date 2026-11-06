/* ─────────────────────────────────────────
   lots · 빈터 레이어 동작
   js/config.js 의 lots 위치마다 "공사 예정" 표지판을 세워요.
   ───────────────────────────────────────── */
(function () {
  "use strict";
  var cfg = window.VILLAGE;
  var layer = document.getElementById("layer-lots");
  if (!cfg || !layer) return;

  cfg.lots.forEach(function (l) {
    var d = document.createElement("div");
    d.className = "lot";
    d.style.left = (l.x / cfg.map.width * 100) + "%";
    d.style.top = (l.y / cfg.map.height * 100) + "%";
    d.innerHTML =
      '<span class="board">공사 예정</span>' +
      '<span class="post"></span>' +
      '<span class="cone" aria-hidden="true">🚧</span>';
    layer.appendChild(d);
  });
})();
