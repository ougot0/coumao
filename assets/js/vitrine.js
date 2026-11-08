/* ============================================================
   COUMAO — Vitrine d'accueil (« essayage » des sacs)
   Les sacs tournent en arc de cartes en verre dépoli autour de
   la grande photo du centre. Quand l'arc s'arrête sur un sac,
   une ligne lumineuse balaie la grande photo et révèle ce sac.
   On peut glisser, lancer, utiliser la molette, les flèches du
   clavier, les boutons, ou cliquer une carte.
   Aucune bibliothèque. Lit PRODUCTS (products.js) et les onglets
   de main.js (window.Coumao).
   ============================================================ */
(function () {
  "use strict";

  var root = document.querySelector(".vf");
  if (!root || typeof PRODUCTS === "undefined") return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  var EASE = "cubic-bezier(.2,.8,.2,1)";

  var arcEl = document.getElementById("vf-arc");
  var stage = document.getElementById("vf-stage");
  var mCur = document.getElementById("mCur");
  var mNext = document.getElementById("mNext");
  var grid = root.querySelector(".grid-lines");
  var scan = root.querySelector(".scan");
  var ghostLetters = root.querySelectorAll(".ghost span");
  var ghost = root.querySelector(".ghost");
  var room = document.querySelector(".room");

  var ADDONS = PRODUCTS.filter(function (p) { return p.category === "accessoire"; });

  /* ---------- Outils ---------- */
  function mod(a, n) { return ((a % n) + n) % n; }
  function firstImg(p) { return (p.images && p.images[0]) || ""; }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function priceHTML(p) {
    if (p.oldPrice) return '<s>' + esc(p.oldPrice) + '</s> ' + esc(p.price || "");
    return esc(p.price || "");
  }
  // Photo avec repli sur le visuel provisoire de main.js si elle n'existe pas
  function setBg(el, p) {
    var url = firstImg(p);
    var ph = window.Coumao && window.Coumao.placeholder ? window.Coumao.placeholder(p.name, 0) : "";
    el.style.backgroundImage = 'url("' + (url || ph) + '")';
    if (url && ph) {
      var test = new Image();
      test.onerror = function () { el.style.backgroundImage = 'url("' + ph + '")'; };
      test.src = url;
    }
  }

  /* ---------- État ---------- */
  var list = [];        // produits affichés dans l'arc
  var cards = [];       // éléments cartes (liste dupliquée pour boucler)
  var N = 0;
  var pos = 0, target = 0;
  var shown = -1;       // index (dans list) du sac affiché au centre
  var dragging = false, moved = 0;
  var intro = reduce ? 1 : 0;
  var sx = 0, sy = 0, tsx = 0, tsy = 0;
  var W = window.innerWidth, H = window.innerHeight;
  var XS;

  function layoutVars() {
    W = window.innerWidth; H = window.innerHeight;
    var phone = W < 768;
    XS = (phone ? [0, .36, .5, .56, .6, .62] : [0, .215, .345, .432, .49, .52]).map(function (v) { return v * W; });
    var cw = phone ? Math.min(W * .30, 170) : Math.min(W * .148, H * .33);
    root.style.setProperty("--CW", cw + "px");
  }
  function xAt(a) {
    if (a >= 5) return XS[5];
    var i = Math.floor(a), f = a - i;
    return XS[i] + (XS[i + 1] - XS[i]) * f;
  }

  /* ---------- Cartes ---------- */
  function buildArc(items) {
    list = items;
    arcEl.innerHTML = "";
    cards = [];
    if (!list.length) { N = 0; return; }
    var copies = Math.max(2, Math.ceil(10 / list.length));
    N = list.length * copies;
    for (var i = 0; i < N; i++) {
      var p = list[i % list.length];
      var c = document.createElement("button");
      c.type = "button";
      c.className = "card glass";
      c.setAttribute("aria-label", p.name + ", " + (p.price || ""));
      c.innerHTML =
        '<span class="g"></span>' +
        '<span class="c-name">' + esc(p.name) + '</span>' +
        '<span class="c-price">' + priceHTML(p) + '</span>' +
        '<span class="sheen"></span>';
      setBg(c.querySelector(".g"), p);
      c._i = i;
      c._seed = Math.random() * 6.28;
      c.addEventListener("pointerenter", function () {
        if (reduce) return;
        var sh = this.querySelector(".sheen");
        sh.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(100%)" }],
          { duration: 1000, easing: EASE });
      });
      arcEl.appendChild(c);
      cards.push(c);
    }
    pos = target = 0;
    shown = -1;
  }

  /* ---------- Onglets ---------- */
  var tabsEl = document.getElementById("vf-tabs");
  var pill = document.getElementById("vf-pill");
  var tabBtns = [];
  function movePill(btn) {
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)";
  }
  function selectTab(t, btn, scroll) {
    tabBtns.forEach(function (b) { b.classList.toggle("on", b === btn); });
    movePill(btn);
    if (window.Coumao) window.Coumao.activate(t.id); // même onglet dans la grille plus bas
    if (t.id === "personnalisation") {
      if (scroll) document.getElementById("collection").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return;
    }
    var items = PRODUCTS.filter(function (p) { return p.category !== "accessoire" && t.match(p); });
    if (!items.length) items = PRODUCTS.filter(function (p) { return p.category === "sacs"; });
    var same = items.length === list.length && items.every(function (p, i) { return p === list[i]; });
    if (same) { target += list.length; return; } // un tour complet, retombe sur le même sac
    buildArc(items);
    intro = reduce ? 1 : .35;
  }
  function buildTabs() {
    var tabs = (window.Coumao && window.Coumao.tabs) || [];
    tabs.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "vf-tab";
      b.textContent = t.label;
      b.addEventListener("click", function () { selectTab(t, b, true); });
      tabsEl.appendChild(b);
      tabBtns.push(b);
    });
    var start = 0;
    tabs.forEach(function (t, i) { if (t.id === "sacs") start = i; });
    if (tabBtns[start]) {
      tabBtns[start].classList.add("on");
      requestAnimationFrame(function () { movePill(tabBtns[start]); });
    }
    var items = PRODUCTS.filter(function (p) {
      return p.category !== "accessoire" && (!tabs[start] || tabs[start].match(p));
    });
    buildArc(items);
  }

  /* ---------- Carte d'achat ---------- */
  var bName = document.getElementById("b-name");
  var bPrice = document.getElementById("b-price");
  var bThumb = document.getElementById("b-thumb-img");
  var bChips = document.getElementById("b-chips");
  var bAdd = document.getElementById("b-add");
  var current = null;

  ADDONS.forEach(function (a) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.slug = a.slug;
    b.textContent = a.name.replace(/\s*\(.*\)\s*/, "") + " +" + (a.price || "").replace(/\s/g, "");
    b.title = a.name + (a.price ? " — +" + a.price : "");
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      var on = b.classList.toggle("on");
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (!reduce) b.animate([{ transform: "scale(.9)" }, { transform: "scale(1)" }], { duration: 300, easing: EASE });
    });
    bChips.appendChild(b);
  });

  function roll(el, html) {
    if (reduce || !el.parentNode.animate) { el.innerHTML = html; return; }
    var old = el.cloneNode(true);
    old.removeAttribute("id");
    old.classList.add("ln-old");
    el.parentNode.appendChild(old);
    el.innerHTML = html;
    old.animate([{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], { duration: 620, easing: EASE })
      .onfinish = function () { old.remove(); };
    el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], { duration: 620, easing: EASE });
  }

  function updateBuy(p) {
    current = p;
    roll(bName, esc(p.name));
    roll(bPrice, priceHTML(p));
    setBg(bThumb, p);
    if (!reduce) bThumb.animate([{ transform: "translateY(70%) scale(.8)" }, { transform: "none" }], { duration: 650, easing: EASE });
    var closed = window.Coumao && window.Coumao.shopClosed && window.Coumao.shopClosed();
    bAdd.disabled = !!closed;
    bAdd.textContent = closed ? "Fermé" : "Ajouter";
    bChips.parentNode.hidden = !!p.customizable || p.addons === false;
  }

  bAdd.addEventListener("click", function () {
    if (!current || !window.Cart) return;
    window.Cart.add(current.slug);
    bChips.querySelectorAll(".chip.on").forEach(function (c) {
      window.Cart.add(c.dataset.slug);
      c.classList.remove("on");
      c.setAttribute("aria-pressed", "false");
    });
  });
  document.getElementById("b-thumb").addEventListener("click", function () {
    if (current && window.Coumao) window.Coumao.openLightbox(current, PRODUCTS.indexOf(current), 0);
  });

  /* ---------- Essayage : la ligne lumineuse révèle le sac ---------- */
  var running = [];
  function tryOn(idx) {
    shown = idx;
    var p = list[idx];
    updateBuy(p);
    running.forEach(function (a) { a.cancel(); });
    running = [];
    setBg(mNext, p);
    if (reduce || !mNext.animate) {
      setBg(mCur, p);
      mCur.style.visibility = "visible";
      return;
    }
    var D = 950, ez = "cubic-bezier(.65,0,.35,1)";
    var clip = mNext.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
      { duration: D, easing: ez, fill: "forwards" });
    var g = grid.animate([
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0 0)", offset: .5 },
      { clipPath: "inset(100% 0 0 0)" }], { duration: D * 1.15, easing: ez });
    var s = scan.animate([
      { top: "0%", transform: "scaleX(.2)", opacity: 0 },
      { top: "6%", transform: "scaleX(1)", opacity: 1, offset: .08 },
      { top: "94%", transform: "scaleX(1)", opacity: 1, offset: .92 },
      { top: "100%", transform: "scaleX(.2)", opacity: 0 }], { duration: D, easing: ez });
    var settle = mNext.animate([{ transform: "scale(1.012)" }, { transform: "scale(1)" }],
      { duration: 1250, easing: "ease-out" });
    running = [clip, g, s, settle];
    clip.onfinish = function () {
      mCur.style.backgroundImage = mNext.style.backgroundImage;
      mCur.style.visibility = "visible";
      running.forEach(function (a) { a.cancel(); });
      running = [];
    };
  }

  /* ---------- Boucle d'animation ---------- */
  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;
    if (!dragging) pos += reduce ? (target - pos) : (target - pos) * .11;
    if (intro < 1) intro = Math.min(1, intro + .012);
    var ie = 1 - Math.pow(1 - intro, 3);
    sx += (tsx - sx) * .06;
    sy += (tsy - sy) * .06;

    for (var k = 0; k < cards.length; k++) {
      var c = cards[k];
      var u = mod(c._i - pos + N / 2, N) - N / 2;
      var a = Math.abs(u), sg = u < 0 ? -1 : 1;
      var x = sg * xAt(a) * ie;
      var s, z, op = 1, ry, blur = 0, zi;
      if (a < 1) {
        s = .55 + .45 * a; z = -260 * (1 - a); op = a; ry = -sg * 16 * a; zi = 1;
      } else {
        s = 1 / (1 + .3 * Math.pow(a - 1, 1.15)); z = -110 * (a - 1);
        ry = -sg * (16 + 9 * Math.min(2, a - 1));
        blur = Math.max(0, a - 1.6) * 2.4;
        zi = Math.round(100 - 10 * a);
      }
      if (a > 3.4) op = Math.max(0, 1 - (a - 3.4) / .8);
      var bob = reduce ? 0 : Math.sin(t * 1.1 + c._seed) * H * .006 * Math.min(1, a);
      var y = bob - (1 - s) * H * .04;
      ry += sx * 10;
      op *= ie;
      c.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) perspective(1300px) translateZ(" +
        z.toFixed(1) + "px) rotateY(" + ry.toFixed(2) + "deg) rotateX(" + (-sy * 6).toFixed(2) + "deg) scale(" +
        (s * (.6 + .4 * ie)).toFixed(3) + ")";
      c.style.opacity = op.toFixed(3);
      c.style.filter = blur > .05 ? "blur(" + blur.toFixed(2) + "px)" : "";
      c.style.zIndex = zi;
      c.style.visibility = op < .01 ? "hidden" : "visible";
    }

    if (room) room.style.transform = "translate3d(" + (-sx * 22) + "px," + (-sy * 14) + "px,0) scale(" + (1.08 - .03 * ie) + ")";
    ghost.style.transform = "translate(calc(-50% - " + (sx * 40) + "px)," + (-sy * 16) + "px)";
    for (var j = 0; j < ghostLetters.length; j++) {
      ghostLetters[j].style.transform = "translateY(" + ((1 - ie) * (60 + 30 * j)).toFixed(1) + "px)";
    }

    if (N && !dragging && Math.abs(target - pos) < .02) {
      var idx = mod(Math.round(target), list.length);
      if (idx !== shown) tryOn(idx);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Saisie : glisser, lancer, cliquer ---------- */
  var p0 = 0, x0 = 0, y0 = 0, lastX = 0, lastT = 0, vel = 0, downCard = null;
  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    dragging = true; moved = 0;
    p0 = pos; x0 = lastX = e.clientX; y0 = e.clientY; lastT = performance.now(); vel = 0;
    downCard = e.target.closest(".card");
    root.classList.add("dragging");
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - x0;
    moved = Math.max(moved, Math.abs(dx), Math.abs(e.clientY - y0));
    pos = p0 - dx / XS[1];
    var now = performance.now(), dt = now - lastT;
    if (dt > 0) vel = vel * .6 + ((e.clientX - lastX) / dt) * .4;
    lastX = e.clientX; lastT = now;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("dragging");
    if (moved < 6 && downCard) {
      var u = mod(downCard._i - pos + N / 2, N) - N / 2;
      target = Math.round(pos + u);
    } else {
      target = Math.round(pos - vel * 3.2);
    }
    downCard = null;
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  var wheelAcc = 0, wheelT = 0;
  stage.addEventListener("wheel", function (e) {
    // Seul le geste horizontal fait tourner l'arc : la molette verticale fait défiler la page
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    var d = e.deltaX;
    e.preventDefault();
    wheelAcc += d;
    var now = performance.now();
    if (Math.abs(wheelAcc) > 60 && now - wheelT > 260) {
      target += wheelAcc > 0 ? 1 : -1;
      wheelAcc = 0; wheelT = now;
    }
  }, { passive: false });

  function step(d) { target = Math.round(target) + d; }
  document.getElementById("vf-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("vf-next").addEventListener("click", function () { step(1); });
  document.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input, textarea, select")) return;
    var r = root.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H) return; // seulement quand la vitrine est à l'écran
    if (document.querySelector(".lightbox.open, .cart-drawer.open, .cz-overlay.open")) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- Raccourcis de la barre latérale ---------- */
  root.querySelectorAll(".rail-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var go = b.dataset.go;
      if (go === "panier") { if (window.Cart) window.Cart.open(); return; }
      var el = document.getElementById(go);
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Curseur en verre ---------- */
  var cur = root.querySelector(".cur");
  var cx = W / 2, cy = H / 2, tx = cx, ty = cy, curOn = false;
  if (fine) {
    root.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!curOn) { cx = tx; cy = ty; curOn = true; }
      cur.classList.add("show");
      var tgt = e.target;
      var mode = "";
      if (dragging) mode = "drag";
      else if (tgt.closest(".card")) mode = "try";
      else if (tgt.closest("button, a")) mode = "btn";
      else if (tgt.closest(".stage")) mode = "drag";
      cur.dataset.mode = mode;
    });
    root.addEventListener("pointerleave", function () { cur.classList.remove("show"); });
    root.addEventListener("pointerdown", function () { cur.classList.add("down"); });
    window.addEventListener("pointerup", function () { cur.classList.remove("down"); });
    (function follow() {
      cx += (tx - cx) * .22; cy += (ty - cy) * .22;
      cur.style.transform = "translate(" + (cx - 29).toFixed(1) + "px," + (cy - 29).toFixed(1) + "px)";
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- Parallaxe selon le pointeur ---------- */
  root.addEventListener("pointermove", function (e) {
    tsx = e.clientX / W - .5;
    tsy = e.clientY / H - .5;
  });
  root.addEventListener("pointerleave", function () { tsx = tsy = 0; });

  window.addEventListener("resize", function () {
    layoutVars();
    var on = tabsEl.querySelector(".vf-tab.on");
    if (on) movePill(on);
  });

  /* ---------- Démarrage ---------- */
  function start() {
    layoutVars();
    buildTabs();
    requestAnimationFrame(frame);
  }
  if (window.Coumao) start();
  else document.addEventListener("coumao:ready", start, { once: true });
})();
