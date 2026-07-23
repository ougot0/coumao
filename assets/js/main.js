/* ============================================================
   COUMAO — Logique du site
   - Génère les cartes produits
   - Carrousel 3 photos par produit (flèches + points)
   - Vue plein écran (lightbox) pour tourner autour du sac
   Aucune bibliothèque externe.
   ============================================================ */

(function () {
  "use strict";

  /* Visuel provisoire élégant quand une photo n'existe pas encore.
     Renvoie une image SVG (data URI) avec le nom du produit. */
  function placeholder(name, index) {
    var tones = [
      ["#efe4d6", "#c9a982"],
      ["#e9ddd0", "#bd9a72"],
      ["#f0e7db", "#d0b28c"],
    ];
    var t = tones[index % tones.length];
    var label = (name || "Coumao").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + t[0] + '"/>' +
      '<stop offset="1" stop-color="' + t[1] + '"/>' +
      "</linearGradient></defs>" +
      '<rect width="800" height="1000" fill="url(#g)"/>' +
      '<g fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3">' +
      '<path d="M270 430 q130 -150 260 0 v300 a40 40 0 0 1 -40 40 h-180 a40 40 0 0 1 -40 -40 z"/>' +
      '<path d="M330 430 v-40 a70 70 0 0 1 140 0 v40"/>' +
      "</g>" +
      '<text x="400" y="850" font-family="Georgia, serif" font-size="46" fill="#5a4632" ' +
      'text-anchor="middle" font-style="italic">' + label + "</text>" +
      '<text x="400" y="905" font-family="Helvetica, sans-serif" font-size="22" ' +
      'letter-spacing="6" fill="#5a4632" fill-opacity="0.6" text-anchor="middle">COUMAO</text>' +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* Construit une carte produit complète. */
  function buildCard(product, pIndex) {
    var card = document.createElement("article");
    card.className = "card";

    var imgs = (product.images || []).slice(0, 3);
    while (imgs.length < 3) imgs.push(null); // garantit 3 emplacements

    var gallery = document.createElement("div");
    gallery.className = "gallery";

    var slideEls = [];
    imgs.forEach(function (src, i) {
      var img = document.createElement("img");
      img.className = "slide" + (i === 0 ? " active" : "");
      img.alt = product.name + " — photo " + (i + 1);
      img.loading = "lazy";
      img.src = src || placeholder(product.name, i);
      // Si la vraie photo n'existe pas, on retombe sur le visuel provisoire.
      img.onerror = function () {
        this.onerror = null;
        this.src = placeholder(product.name, i);
      };
      gallery.appendChild(img);
      slideEls.push(img);
    });

    // Badge "3 photos"
    var badge = document.createElement("span");
    badge.className = "photo-badge";
    badge.innerHTML = "&#9673; 3 photos";
    gallery.appendChild(badge);

    // Flèches
    var prev = document.createElement("button");
    prev.className = "arrow prev";
    prev.setAttribute("aria-label", "Photo précédente");
    prev.innerHTML = "&#8249;";
    var next = document.createElement("button");
    next.className = "arrow next";
    next.setAttribute("aria-label", "Photo suivante");
    next.innerHTML = "&#8250;";
    gallery.appendChild(prev);
    gallery.appendChild(next);

    // Points
    var dots = document.createElement("div");
    dots.className = "dots";
    var dotEls = [];
    imgs.forEach(function (_, i) {
      var d = document.createElement("button");
      d.className = i === 0 ? "active" : "";
      d.setAttribute("aria-label", "Voir la photo " + (i + 1));
      dots.appendChild(d);
      dotEls.push(d);
    });
    gallery.appendChild(dots);

    // État courant du carrousel
    var current = 0;
    function show(i) {
      current = (i + imgs.length) % imgs.length;
      slideEls.forEach(function (el, k) {
        el.classList.toggle("active", k === current);
      });
      dotEls.forEach(function (el, k) {
        el.classList.toggle("active", k === current);
      });
    }
    prev.addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
    next.addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
    dotEls.forEach(function (d, i) {
      d.addEventListener("click", function (e) { e.stopPropagation(); show(i); });
    });

    // Glisser (tactile) pour tourner les photos sur mobile
    var startX = null;
    gallery.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });

    // Ouvrir en plein écran au clic sur l'image
    gallery.addEventListener("click", function () {
      openLightbox(product, pIndex, current);
    });

    // Corps de la carte
    var body = document.createElement("div");
    body.className = "card-body";

    var h3 = document.createElement("h3");
    h3.textContent = product.name;

    var desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = product.desc || "";

    var foot = document.createElement("div");
    foot.className = "card-foot";

    var price = document.createElement("span");
    price.className = "price";
    price.textContent = product.price || "";

    var btn = document.createElement("button");
    btn.className = "view-btn";
    btn.textContent = "Voir les 3 photos";
    btn.addEventListener("click", function () { openLightbox(product, pIndex, current); });

    foot.appendChild(price);
    foot.appendChild(btn);
    body.appendChild(h3);
    body.appendChild(desc);
    body.appendChild(foot);

    // Bouton "Commander" (si un lien de paiement est renseigné)
    if (product.buyUrl) {
      var buy = document.createElement("a");
      buy.className = "btn btn-primary buy-btn";
      buy.href = product.buyUrl;
      buy.target = "_blank";
      buy.rel = "noopener";
      buy.textContent = "Commander";
      body.appendChild(buy);
    }

    card.appendChild(gallery);
    card.appendChild(body);
    return card;
  }

  /* ---------------- Lightbox partagée ---------------- */
  var lb, lbStage, lbTitle, lbSub, lbThumbs, lbBuy, lbImgs = [], lbCurrent = 0, lbProduct = null;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-close" aria-label="Fermer">&times;</button>' +
      '<div class="lb-inner">' +
        '<div class="lb-stage">' +
          '<button class="lb-arrow prev" aria-label="Précédente">&#8249;</button>' +
          '<button class="lb-arrow next" aria-label="Suivante">&#8250;</button>' +
        '</div>' +
        '<div class="lb-title"></div>' +
        '<div class="lb-sub"></div>' +
        '<div class="lb-thumbs"></div>' +
        '<div class="lb-buy"></div>' +
      '</div>';
    document.body.appendChild(lb);

    lbStage = lb.querySelector(".lb-stage");
    lbTitle = lb.querySelector(".lb-title");
    lbSub = lb.querySelector(".lb-sub");
    lbThumbs = lb.querySelector(".lb-thumbs");
    lbBuy = lb.querySelector(".lb-buy");

    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-arrow.prev").addEventListener("click", function () { lbShow(lbCurrent - 1); });
    lb.querySelector(".lb-arrow.next").addEventListener("click", function () { lbShow(lbCurrent + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbShow(lbCurrent - 1);
      if (e.key === "ArrowRight") lbShow(lbCurrent + 1);
    });
  }

  function openLightbox(product, pIndex, startAt) {
    lbProduct = product;
    var imgs = (product.images || []).slice(0, 3);
    while (imgs.length < 3) imgs.push(null);

    // (Re)construit les images du stage
    lbStage.querySelectorAll("img").forEach(function (n) { n.remove(); });
    lbThumbs.innerHTML = "";
    lbImgs = [];

    imgs.forEach(function (src, i) {
      var img = document.createElement("img");
      img.alt = product.name + " — photo " + (i + 1);
      img.src = src || placeholder(product.name, i);
      img.onerror = function () { this.onerror = null; this.src = placeholder(product.name, i); };
      lbStage.insertBefore(img, lbStage.firstChild);
      lbImgs.push(img);

      var thumb = document.createElement("img");
      thumb.src = src || placeholder(product.name, i);
      thumb.alt = "Miniature " + (i + 1);
      thumb.onerror = function () { this.onerror = null; this.src = placeholder(product.name, i); };
      thumb.addEventListener("click", function () { lbShow(i); });
      lbThumbs.appendChild(thumb);
    });

    lbTitle.textContent = product.name;
    lbSub.textContent = [product.desc, product.price].filter(Boolean).join("  ·  ");

    // Bouton "Commander" dans la vue plein écran
    lbBuy.innerHTML = "";
    if (product.buyUrl) {
      var buy = document.createElement("a");
      buy.className = "btn btn-primary";
      buy.href = product.buyUrl;
      buy.target = "_blank";
      buy.rel = "noopener";
      buy.textContent = "Commander";
      lbBuy.appendChild(buy);
    }

    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lbShow(startAt || 0);
  }

  function lbShow(i) {
    lbCurrent = (i + lbImgs.length) % lbImgs.length;
    lbImgs.forEach(function (el, k) { el.classList.toggle("active", k === lbCurrent); });
    var thumbs = lbThumbs.querySelectorAll("img");
    thumbs.forEach(function (el, k) { el.classList.toggle("active", k === lbCurrent); });
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- Initialisation ---------------- */
  function init() {
    var grid = document.getElementById("grid");
    var countEl = document.getElementById("count");
    if (!grid || typeof PRODUCTS === "undefined") return;

    buildLightbox();

    PRODUCTS.forEach(function (p, i) {
      grid.appendChild(buildCard(p, i));
    });

    if (countEl) {
      countEl.textContent =
        PRODUCTS.length + (PRODUCTS.length > 1 ? " modèles" : " modèle");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
