/* ============================================================
   COUMAO — Logique du site
   - Génère les cartes produits
   - Carrousel 3 photos par produit (flèches + points)
   - Vue plein écran (lightbox) pour tourner autour du sac
   Aucune bibliothèque externe.
   ============================================================ */

(function () {
  "use strict";

  /* Boutique fermée ? (interrupteur BOUTIQUE.ouverte dans products.js) */
  function shopClosed() {
    return typeof BOUTIQUE !== "undefined" && BOUTIQUE.ouverte === false;
  }

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

    var imgs = (product.images || []).slice(0, 8);
    if (imgs.length === 0) imgs = [null]; // au moins un emplacement
    var multi = imgs.length > 1;

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

    // Badge nombre de photos
    var badge = document.createElement("span");
    badge.className = "photo-badge";
    badge.innerHTML = "&#9673; " + imgs.length + " photo" + (multi ? "s" : "");
    gallery.appendChild(badge);

    var prev, next, dotEls = [];
    if (multi) {
      // Flèches
      prev = document.createElement("button");
      prev.className = "arrow prev";
      prev.setAttribute("aria-label", "Photo précédente");
      prev.innerHTML = "&#8249;";
      next = document.createElement("button");
      next.className = "arrow next";
      next.setAttribute("aria-label", "Photo suivante");
      next.innerHTML = "&#8250;";
      gallery.appendChild(prev);
      gallery.appendChild(next);

      // Points
      var dots = document.createElement("div");
      dots.className = "dots";
      imgs.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = i === 0 ? "active" : "";
        d.setAttribute("aria-label", "Voir la photo " + (i + 1));
        dots.appendChild(d);
        dotEls.push(d);
      });
      gallery.appendChild(dots);
    }

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
    if (multi) {
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
    }

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
    if (product.oldPrice) {
      price.innerHTML = '<span class="price-old">' + product.oldPrice + '</span>' +
                        '<span class="price-sale">' + (product.price || "") + '</span>';
    } else {
      price.textContent = product.price || "";
    }

    var btn = document.createElement("button");
    btn.className = "view-btn";
    btn.textContent = multi ? ("Voir les " + imgs.length + " photos") : "Voir en grand";
    btn.addEventListener("click", function () { openLightbox(product, pIndex, current); });

    foot.appendChild(price);
    foot.appendChild(btn);
    body.appendChild(h3);
    body.appendChild(desc);
    body.appendChild(foot);

    // Accessoires en option (cases à cocher) — sauf produits perso / si désactivé
    var addonEls = [];
    if (!product.customizable && product.addons !== false) {
      var exclude = product.addonsExclude || [];
      var addons = (typeof PRODUCTS !== "undefined")
        ? PRODUCTS.filter(function (p) {
            return p.category === "accessoire" && exclude.indexOf(p.slug) < 0;
          })
        : [];
      if (addons.length) {
        var box = document.createElement("div");
        box.className = "addons";
        var t = document.createElement("span");
        t.className = "addons-title";
        t.textContent = "Ajouter un accessoire :";
        box.appendChild(t);
        addons.forEach(function (a) {
          var lab = document.createElement("label");
          lab.className = "addon";
          var cb = document.createElement("input");
          cb.type = "checkbox";
          cb.value = a.slug;
          var span = document.createElement("span");
          span.textContent = a.name + (a.price ? " — +" + a.price : "");
          lab.appendChild(cb);
          lab.appendChild(span);
          box.appendChild(lab);
          addonEls.push(cb);
        });
        body.appendChild(box);
      }
    }

    // Bouton principal : "Personnaliser" (produit sur mesure) ou "Ajouter au panier"
    var addBtn = document.createElement("button");
    addBtn.className = "btn btn-primary buy-btn";
    if (shopClosed()) {
      addBtn.textContent = "Commandes fermées";
      addBtn.disabled = true;
    } else if (product.customizable) {
      addBtn.textContent = "Personnaliser & commander";
      addBtn.addEventListener("click", function () { openCustomize(product); });
    } else {
      addBtn.textContent = "Ajouter au panier";
      addBtn.addEventListener("click", function () {
        if (!window.Cart) return;
        window.Cart.add(product.slug);
        // Ajoute aussi les accessoires cochés
        addonEls.forEach(function (cb) {
          if (cb.checked) { window.Cart.add(cb.value); cb.checked = false; }
        });
      });
    }
    body.appendChild(addBtn);

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
    var imgs = (product.images || []).slice(0, 8);
    if (imgs.length === 0) imgs = [null];
    var multi = imgs.length > 1;

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

    // Bouton dans la vue plein écran
    lbBuy.innerHTML = "";
    var lbAdd = document.createElement("button");
    lbAdd.className = "btn btn-primary";
    if (shopClosed()) {
      lbAdd.textContent = "Commandes fermées";
      lbAdd.disabled = true;
      lbBuy.appendChild(lbAdd);
      return;
    }
    if (product.customizable) {
      lbAdd.textContent = "Personnaliser & commander";
      lbAdd.addEventListener("click", function () {
        closeLightbox();
        openCustomize(product);
      });
    } else {
      lbAdd.textContent = "Ajouter au panier";
      lbAdd.addEventListener("click", function () {
        if (window.Cart) window.Cart.add(product.slug);
        closeLightbox();
      });
    }
    lbBuy.appendChild(lbAdd);

    // Masque flèches + miniatures si une seule photo
    lb.querySelectorAll(".lb-arrow").forEach(function (a) {
      a.style.display = multi ? "" : "none";
    });
    lbThumbs.style.display = multi ? "" : "none";

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

  /* ---------------- Personnalisation (sur mesure) ---------------- */
  var cz, czMedia, czTitle, czSub, czForm, czProduct = null, czAddonEls = [];

  function buildCustomize() {
    cz = document.createElement("div");
    cz.className = "cz-overlay";
    cz.innerHTML =
      '<div class="cz-modal" role="dialog" aria-label="Personnalisation">' +
        '<button class="cz-close" aria-label="Fermer">&times;</button>' +
        '<div class="cz-media"><img alt="" /></div>' +
        '<div class="cz-panel">' +
          '<h2 class="cz-title"></h2>' +
          '<p class="cz-sub"></p>' +
          '<form class="cz-form"></form>' +
          '<div class="cz-actions">' +
            '<button type="button" class="btn btn-primary cz-submit">Envoyer et payer</button>' +
            '<p class="cz-note">Tu choisis, tu paies, et je crée ta pochette sur mesure 💛</p>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(cz);

    czMedia = cz.querySelector(".cz-media img");
    czTitle = cz.querySelector(".cz-title");
    czSub = cz.querySelector(".cz-sub");
    czForm = cz.querySelector(".cz-form");

    cz.querySelector(".cz-close").addEventListener("click", closeCustomize);
    cz.addEventListener("click", function (e) { if (e.target === cz) closeCustomize(); });
    cz.querySelector(".cz-submit").addEventListener("click", submitCustomize);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && cz.classList.contains("open")) closeCustomize();
    });
  }

  function openCustomize(product) {
    if (!cz) buildCustomize();
    czProduct = product;

    var src = (product.images && product.images[0]) || placeholder(product.name, 0);
    czMedia.src = src;
    czMedia.onerror = function () { this.onerror = null; this.src = placeholder(product.name, 0); };
    czMedia.alt = product.name;

    czTitle.textContent = product.name;
    czSub.textContent = [product.desc, product.price].filter(Boolean).join("  ·  ");

    // Construit le formulaire à partir des options du produit
    czForm.innerHTML = "";
    (product.options || []).forEach(function (opt) {
      var wrap = document.createElement("label");
      wrap.className = "cz-field";
      var span = document.createElement("span");
      span.className = "cz-label";
      span.innerHTML = opt.label + (opt.required ? ' <em class="cz-req">*</em>' : "");
      wrap.appendChild(span);

      var field;
      if (opt.type === "select") {
        field = document.createElement("select");
        (opt.choices || []).forEach(function (c) {
          var o = document.createElement("option");
          o.value = c; o.textContent = c;
          field.appendChild(o);
        });
      } else if (opt.type === "textarea") {
        field = document.createElement("textarea");
        field.rows = 2;
        if (opt.placeholder) field.placeholder = opt.placeholder;
      } else {
        field = document.createElement("input");
        field.type = "text";
        if (opt.placeholder) field.placeholder = opt.placeholder;
      }
      field.className = "cz-input";
      field.setAttribute("data-id", opt.id);
      field.setAttribute("data-label", opt.label);
      if (opt.required) field.setAttribute("data-required", "1");
      wrap.appendChild(field);
      czForm.appendChild(wrap);
    });

    // Accessoires en option dans la personnalisation (sacs perso uniquement)
    czAddonEls = [];
    if (product.czAddons && typeof PRODUCTS !== "undefined") {
      var czExclude = product.addonsExclude || [];
      var czAddons = PRODUCTS.filter(function (p) {
        return p.category === "accessoire" && czExclude.indexOf(p.slug) < 0;
      });
      if (czAddons.length) {
        var grp = document.createElement("div");
        grp.className = "cz-field cz-addons";
        var glab = document.createElement("span");
        glab.className = "cz-label";
        glab.textContent = "Ajouter un accessoire (optionnel) :";
        grp.appendChild(glab);
        czAddons.forEach(function (a) {
          var l = document.createElement("label");
          l.className = "addon";
          var cb = document.createElement("input");
          cb.type = "checkbox";
          cb.value = a.slug;
          var sp = document.createElement("span");
          sp.textContent = a.name + (a.price ? " — +" + a.price : "");
          l.appendChild(cb);
          l.appendChild(sp);
          grp.appendChild(l);
          czAddonEls.push(cb);
        });
        czForm.appendChild(grp);
      }
    }

    cz.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCustomize() {
    if (cz) cz.classList.remove("open");
    document.body.style.overflow = "";
  }

  function submitCustomize() {
    if (!czProduct) return;
    var fields = czForm.querySelectorAll(".cz-input");
    var parts = [];
    var missing = null;
    fields.forEach(function (f) {
      var val = (f.value || "").trim();
      if (f.getAttribute("data-required") && !val && !missing) missing = f;
      if (val && val !== "Aucune") {
        parts.push(f.getAttribute("data-label") + " : " + val);
      }
    });
    if (missing) {
      missing.focus();
      alert("Merci de remplir : " + missing.getAttribute("data-label"));
      return;
    }
    var summary = parts.join("  |  ");
    var addonSlugs = [];
    czAddonEls.forEach(function (cb) { if (cb.checked) addonSlugs.push(cb.value); });
    var btn = cz.querySelector(".cz-submit");
    btn.disabled = true;
    btn.textContent = "Redirection vers le paiement…";
    if (window.Cart && window.Cart.payCustom) {
      window.Cart.payCustom(czProduct.slug, summary, addonSlugs, function () {
        btn.disabled = false;
        btn.textContent = "Envoyer et payer";
      });
    }
  }

  /* ---------------- Onglets (Soldes, Nouveautés, Sacs…) ---------------- */
  // Nouveautés : liste de slugs mis en avant. Soldes : produits avec solde:true.
  var NOUVEAUTES = [
    "coumao-clutch-roma",
    "coumao-safari",
    "coumao-chocolat",
  ];
  // Collections saisonnières (répartition par tons — à ajuster librement).
  var SAISON = {
    ete: [
      "coumao-summer",
      "coumao-candy", "coumao-ocean", "coumao-flower",
      "coumao-rainbow", "coumao-emilio", "coumao-arizona", "coumao-strawberry",
      "coumao-sea",
    ],
    hiver: [
      "coumao-havane",
      "coumao-casual", "coumao-safari", "coumao-chocolat",
    ],
  };
  var TABS = [
    { id: "soldes",           label: "Soldes",          sub: "Nos pièces en promotion.",
      match: function (p) { return p.solde === true; } },
    { id: "nouveautes",       label: "Nouveautés",      sub: "Les dernières créations de l'atelier.",
      match: function (p) { return NOUVEAUTES.indexOf(p.slug) >= 0; } },
    { id: "sacs",             label: "Sacs",            sub: "Sacs au crochet, faits main — pièces uniques.",
      match: function (p) { return p.category === "sacs" && !p.customizable; } },
    { id: "cases",            label: "Cases",           sub: "Pochettes téléphone au crochet.",
      match: function (p) { return p.category === "telephone" && !p.customizable; } },
    { id: "personnalisation", label: "Personnalisation", sub: "Crée ta pièce sur mesure : couleurs, modèle…",
      match: function (p) { return p.customizable === true; } },
  ];

  function renderTab(tab, gridEl, subEl) {
    gridEl.innerHTML = "";
    if (subEl) subEl.textContent = tab.sub || "";
    // L'onglet Personnalisation = formulaire de contact (pas de produits)
    if (tab.id === "personnalisation") { renderPersoForm(gridEl, subEl); return; }
    var list = PRODUCTS.filter(function (p) {
      return p.category !== "accessoire" && tab.match(p);
    });
    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "collection-empty";
      empty.textContent = "Rien ici pour le moment — ça arrive très bientôt 👀";
      gridEl.appendChild(empty);
      return;
    }
    list.forEach(function (p, i) { gridEl.appendChild(buildCard(p, i)); });
  }

  /* ---------------- Onglet Personnalisation : formulaire de contact ---------------- */
  function renderPersoForm(gridEl, subEl) {
    if (subEl) subEl.textContent = "";
    var modeles = (typeof MODELES_PERSO !== "undefined") ? MODELES_PERSO : [];
    var galerie = "";
    var options = '<option value="">— Choisis un modèle —</option>';
    if (modeles.length) {
      galerie =
        '<h3 class="perso-h">Nos modèles</h3>' +
        '<p class="perso-galsub">Clique le modèle qui te plaît (tu peux aussi choisir dans la liste plus bas) :</p>' +
        '<div class="perso-models">' +
          modeles.map(function (m, i) {
            return '<button type="button" class="perso-model" data-name="' + m.name + '">' +
              '<img src="' + m.image + '" alt="' + m.name + '" loading="lazy">' +
              '<span>' + m.name + '</span></button>';
          }).join("") +
        '</div>';
      options += modeles.map(function (m) {
        return '<option value="' + m.name + '">' + m.name + '</option>';
      }).join("");
      options += '<option value="Je ne sais pas encore">Je ne sais pas encore</option>';
    }
    gridEl.innerHTML =
      '<div class="perso-wrap">' +
        '<div class="perso-info">' +
          '💌 <b>Une envie de pièce personnalisée ?</b><br>' +
          'Choisis un modèle, laisse-nous tes coordonnées (et ton Instagram si tu veux). On te recontacte pour ' +
          't\'envoyer les <b>couleurs disponibles du moment</b> 🎨 — tu choisis, et on prépare ' +
          'ta création sur mesure rien que pour toi 💛' +
        '</div>' +
        galerie +
        '<form class="perso-form" onsubmit="return false">' +
          (modeles.length ? '<label><span>Modèle souhaité *</span><select class="perso-in" data-k="modele">' + options + '</select></label>' : '') +
          '<div class="perso-row">' +
            '<label><span>Prénom *</span><input class="perso-in" data-k="prenom" type="text" autocomplete="given-name"></label>' +
            '<label><span>Nom *</span><input class="perso-in" data-k="nom" type="text" autocomplete="family-name"></label>' +
          '</div>' +
          '<label><span>Téléphone *</span><input class="perso-in" data-k="phone" type="tel" autocomplete="tel" placeholder="06 …"></label>' +
          '<label><span>Email *</span><input class="perso-in" data-k="email" type="email" autocomplete="email" placeholder="ton@email.com"></label>' +
          '<label><span>Instagram (optionnel)</span><input class="perso-in" data-k="instagram" type="text" placeholder="@ton_compte"></label>' +
          '<label><span>Ta demande (optionnel)</span><textarea class="perso-in" data-k="message" rows="3" placeholder="idées de couleurs, précisions…"></textarea></label>' +
          '<button type="button" class="btn btn-primary perso-send">Envoyer ma demande</button>' +
          '<div class="perso-ok" hidden></div>' +
        '</form>' +
      '</div>';
    var form = gridEl.querySelector(".perso-form");
    var sel = form.querySelector('select[data-k="modele"]');
    // Cliquer un modèle le sélectionne dans la liste + surligne
    gridEl.querySelectorAll(".perso-model").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (sel) sel.value = btn.getAttribute("data-name");
        gridEl.querySelectorAll(".perso-model").forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
      });
    });
    form.querySelector(".perso-send").addEventListener("click", function () { submitPerso(form); });
  }

  function submitPerso(form) {
    var data = {};
    form.querySelectorAll(".perso-in").forEach(function (f) { data[f.getAttribute("data-k")] = (f.value || "").trim(); });
    if (form.querySelector('select[data-k="modele"]') && !data.modele) {
      alert("Merci de choisir un modèle.");
      return;
    }
    if (!data.prenom || !data.nom || !data.phone || !data.email) {
      alert("Merci de remplir les champs obligatoires : prénom, nom, téléphone et email.");
      return;
    }
    var cfg = window.STRIPE_CONFIG || {};
    var endpoint = cfg.personnalisationEndpoint || "/personnalisation.php";
    var btn = form.querySelector(".perso-send");
    btn.disabled = true; btn.textContent = "Envoi…";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = "Envoyer ma demande";
        if (res.ok && res.d && res.d.ok) {
          form.querySelectorAll("label, .perso-row, .perso-send").forEach(function (el) { el.hidden = true; });
          var ok = form.querySelector(".perso-ok");
          ok.hidden = false;
          ok.innerHTML = "✅ <b>Demande envoyée !</b><br>Référence " + (res.d.ref || "") +
            "<br>On te recontacte très vite pour tes couleurs 💛";
        } else {
          alert((res.d && res.d.error) || "L'envoi n'a pas fonctionné. Réessaie.");
        }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Envoyer ma demande";
        alert("L'envoi ne marche pas encore sur cette adresse (il s'active une fois le site publié).");
      });
  }

  /* Bandeau de confirmation avec numéro de commande (retour de paiement) */
  function showOrderConfirmation() {
    var q = location.search || "";
    if (q.indexOf("paiement=reussi") < 0) return;
    var m = q.match(/[?&]cmd=([^&]+)/);
    var num = "";
    if (m && m[1]) {
      var id = decodeURIComponent(m[1]).replace(/[^A-Za-z0-9]/g, "");
      if (id) num = "CM-" + id.slice(-8).toUpperCase();
    }
    var b = document.createElement("div");
    b.className = "order-banner";
    b.innerHTML =
      "✅ <b>Merci, ta commande est confirmée !</b>" +
      (num ? "<br>Numéro de commande : <b>" + num + "</b> — garde-le précieusement 💛" : "") +
      "<button class='order-banner-x' aria-label='Fermer'>&times;</button>";
    document.body.insertBefore(b, document.body.firstChild);
    b.querySelector(".order-banner-x").addEventListener("click", function () { b.remove(); });
  }

  /* ---------------- Initialisation ---------------- */
  function init() {
    showOrderConfirmation();
    var tabsEl = document.getElementById("tabs");
    var gridEl = document.getElementById("grid");
    var subEl = document.getElementById("tab-sub");
    if (!tabsEl || !gridEl || typeof PRODUCTS === "undefined") return;

    // Bandeau "commandes fermées" si la boutique est fermée
    if (shopClosed()) {
      document.body.classList.add("shop-closed");
      var banner = document.createElement("div");
      banner.className = "shop-banner";
      var msg = (typeof BOUTIQUE !== "undefined" && BOUTIQUE.message) || "Commandes temporairement fermées.";
      banner.innerHTML = "🔴 " + msg.replace(/</g, "&lt;");
      document.body.insertBefore(banner, document.body.firstChild);
    }

    buildLightbox();

    var btns = {};
    function activate(id) {
      var tab = null;
      TABS.forEach(function (t) { if (t.id === id) tab = t; });
      if (!tab) tab = TABS[2]; // défaut : Sacs
      Object.keys(btns).forEach(function (k) {
        btns[k].classList.toggle("active", k === tab.id);
      });
      renderTab(tab, gridEl, subEl);
    }

    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.className = "tab";
      b.textContent = t.label;
      b.addEventListener("click", function () {
        activate(t.id);
        var col = document.getElementById("collection");
        if (col) col.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      tabsEl.appendChild(b);
      btns[t.id] = b;
    });

    // Liens d'en-tête qui pointent vers un onglet
    document.querySelectorAll("[data-tab]").forEach(function (a) {
      a.addEventListener("click", function () { activate(a.getAttribute("data-tab")); });
    });

    // Section vidéo : ne s'affiche que si une vraie vidéo est présente
    var vid = document.getElementById("coumao-video");
    var vidSection = document.getElementById("video");
    if (vid && vidSection) {
      vid.addEventListener("loadedmetadata", function () { vidSection.hidden = false; });
      // si la vidéo n'existe pas encore, la section reste masquée
    }

    // « Accueil » : remonter tout en haut (le héro)
    var accueil = document.querySelector(".nav-accueil");
    if (accueil) {
      accueil.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Menu ☰ (mobile) : ouvrir / fermer la navigation
    var header = document.querySelector(".site-header");
    var navToggle = document.getElementById("nav-toggle");
    var siteNav = document.getElementById("site-nav");
    if (header && navToggle) {
      navToggle.addEventListener("click", function () {
        var open = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (siteNav) {
        // Fermer le menu quand on clique un lien ou un onglet
        siteNav.addEventListener("click", function (e) {
          if (e.target.closest("a, .tab")) {
            header.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
          }
        });
      }
    }

    activate("sacs"); // onglet par défaut
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
