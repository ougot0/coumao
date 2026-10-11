/* ============================================================
   COUMAO — Sac qui flotte en 3D dans le héro
   La photo s'incline selon la souris (ordinateur) ou selon
   l'inclinaison du téléphone (quand le navigateur le permet).
   ============================================================ */
(function () {
  "use strict";
  var box = document.getElementById("hero-float");
  if (!box) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var card = box.querySelector(".float-card");
  var MAX = 12; // degrés

  function tilt(x, y) { // x, y entre -1 et 1
    x = Math.max(-1, Math.min(1, x));
    y = Math.max(-1, Math.min(1, y));
    card.style.setProperty("--ry", (x * MAX).toFixed(2) + "deg");
    card.style.setProperty("--rx", (-y * MAX).toFixed(2) + "deg");
    card.style.setProperty("--sx", (50 + x * 40).toFixed(1) + "%");
    card.style.setProperty("--sy", (50 + y * 40).toFixed(1) + "%");
  }

  var hero = document.querySelector(".hero") || box;
  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var r = box.getBoundingClientRect();
    box.classList.add("is-moving");
    tilt((e.clientX - (r.left + r.width / 2)) / (r.width / 2),
         (e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  });
  hero.addEventListener("pointerleave", function () {
    box.classList.remove("is-moving");
    tilt(0, 0);
  });

  // Téléphone : inclinaison de l'appareil
  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma == null || e.beta == null) return;
    box.classList.add("is-moving");
    tilt(e.gamma / 25, (e.beta - 45) / 25);
  });
})();
