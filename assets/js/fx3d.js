/* ============================================================
   COUMAO — Effets 3D
   - Pelote de trapilho en WebGL (Three.js) dans le héro
   - Parallaxe 3D de la photo du héro selon la souris
   - Inclinaison 3D des cartes produits et des encarts « À propos »
   - Apparition des blocs au défilement
   Tout est optionnel : si WebGL ou Three.js manquent, le site
   reste complet (la pelote ne s'affiche simplement pas).
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- Pelote de laine (Three.js) ---------------- */
  function initYarn() {
    var canvas = document.getElementById("yarn-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { canvas.hidden = true; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    scene.add(new THREE.HemisphereLight(0xfff6ea, 0x6b5a48, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0xffd6c8, 0.5);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // Couleurs reprises de la photo du héro
    var palette = [0xe0716f, 0xf08f8c, 0x6b3fb8, 0x4fc3d9, 0xe6a93a, 0x5f6b2e, 0x3b2f7a];
    var ball = new THREE.Group();
    scene.add(ball);

    var R = 1.35;
    var strands = 46;
    for (var s = 0; s < strands; s++) {
      // Chaque brin = un grand cercle d'orientation aléatoire, légèrement ondulé
      var axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      var u = new THREE.Vector3(1, 0, 0);
      if (Math.abs(axis.x) > 0.9) u.set(0, 1, 0);
      u.cross(axis).normalize();
      var v = new THREE.Vector3().crossVectors(axis, u);
      var pts = [];
      var wob = Math.random() * Math.PI * 2;
      for (var k = 0; k < 64; k++) {
        var a = (k / 64) * Math.PI * 2;
        var r = R * (1 + 0.025 * Math.sin(a * 5 + wob));
        pts.push(new THREE.Vector3()
          .addScaledVector(u, Math.cos(a) * r)
          .addScaledVector(v, Math.sin(a) * r));
      }
      var curve = new THREE.CatmullRomCurve3(pts, true);
      var geo = new THREE.TubeGeometry(curve, 160, 0.075, 8, true);
      var mat = new THREE.MeshStandardMaterial({
        color: palette[s % palette.length],
        roughness: 0.85,
        metalness: 0.0,
      });
      ball.add(new THREE.Mesh(geo, mat));
    }
    // Cœur de la pelote (évite de voir au travers)
    ball.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.95, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xc85e5c, roughness: 1 })
    ));

    // Fil qui s'échappe de la pelote
    var tailPts = [
      new THREE.Vector3(0.9, -1.0, 0.4),
      new THREE.Vector3(1.6, -1.6, 0.6),
      new THREE.Vector3(2.4, -1.4, 0.2),
      new THREE.Vector3(3.0, -2.0, -0.2),
      new THREE.Vector3(3.8, -1.8, 0.0),
    ];
    var tail = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tailPts), 80, 0.075, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xe0716f, roughness: 0.85 })
    );
    scene.add(tail);

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    var target = { x: 0, y: 0 };
    window.addEventListener("pointermove", function (e) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Ne calcule que lorsque le héro est visible
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !reduceMotion) requestAnimationFrame(frame);
      }).observe(canvas);
    }

    var t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000;
      ball.rotation.y = t * 0.35 + target.x * 0.5;
      ball.rotation.x = Math.sin(t * 0.4) * 0.15 + target.y * 0.35;
      ball.position.y = Math.sin(t * 1.1) * 0.08;
      tail.position.y = ball.position.y;
      renderer.render(scene, camera);
      if (visible && !reduceMotion) requestAnimationFrame(frame);
    }
    ball.rotation.set(0.3, 0.6, 0);
    renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  /* ---------------- Parallaxe du héro ---------------- */
  function initHeroParallax() {
    var stage = document.getElementById("hero-stage");
    if (!stage || reduceMotion || !finePointer) return;
    var layers = stage.querySelectorAll("[data-depth]");
    var hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 1;
        if (el.classList.contains("hero-media")) {
          el.style.transform = "rotateY(" + (-14 + x * 16) + "deg) rotateX(" + (6 - y * 12) + "deg) rotateZ(2deg)";
        } else {
          el.style.transform = "translate3d(" + (x * 24 * d) + "px," + (y * 24 * d) + "px,0)";
        }
      });
    });
    hero.addEventListener("pointerleave", function () {
      layers.forEach(function (el) { el.style.transform = ""; });
    });
  }

  /* ---------------- Inclinaison 3D (cartes + encarts) ---------------- */
  function initTilt() {
    if (reduceMotion || !finePointer) return;
    var MAX = 7; // degrés
    var current = null;

    function reset(el) {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }

    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".card, [data-tilt]");
      // Seulement une fois l'animation d'apparition terminée
      if (el && el.classList.contains("reveal") && !el.classList.contains("in")) el = null;
      // Pas d'inclinaison au-dessus des boutons / cases (clic plus confortable)
      if (el && e.target.closest("button, input, label, select")) el = null;
      if (current && current !== el) { reset(current); current = null; }
      if (!el) return;
      current = el;
      var r = el.getBoundingClientRect();
      var max = el.classList.contains("card") ? 4 : MAX;
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      if (current) { reset(current); current = null; }
    });
  }

  /* ---------------- Apparition au défilement ---------------- */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    function watch(el, delay) {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      if (delay) el.style.transitionDelay = delay + "ms";
      io.observe(el);
    }

    document.querySelectorAll(".section-head, .about-text, .feature, .showcase .wrap")
      .forEach(function (el, i) { watch(el, el.classList.contains("feature") ? (i % 3) * 120 : 0); });

    // Les cartes sont recréées à chaque changement d'onglet
    var grid = document.getElementById("grid");
    if (!grid) return;
    function watchCards() {
      grid.querySelectorAll(".card").forEach(function (c, i) {
        watch(c, (i % 3) * 90);
        // le délai ne doit pas ralentir l'inclinaison ensuite
        c.addEventListener("transitionend", function clear() {
          c.style.transitionDelay = "";
          c.removeEventListener("transitionend", clear);
        });
      });
    }
    watchCards();
    new MutationObserver(watchCards).observe(grid, { childList: true });
  }

  function init() {
    initHeroParallax();
    initTilt();
    initReveal();
    initYarn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
