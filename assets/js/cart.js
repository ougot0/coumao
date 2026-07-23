/* =============================================================
   COUMAO — Panier + paiement groupé (Stripe Checkout)
   - Ajouter plusieurs produits, gérer les quantités
   - Calcule le total automatiquement
   - "Payer tout" ouvre UN SEUL paiement Stripe pour tout le panier
     (dès que la config Stripe est renseignée dans stripe-config.js)
   Aucune bibliothèque externe (hors Stripe.js pour le paiement).
   ============================================================= */

(function () {
  "use strict";

  var KEY = "coumao_cart_v1";
  var items = load();               // { slug: quantité }
  var drawer, overlay, listEl, totalEl, countEl;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  function product(slug) {
    if (typeof PRODUCTS === "undefined") return null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }
  function priceOf(p) {
    if (!p) return null;
    if (typeof p.priceEUR === "number") return p.priceEUR;
    var m = (p.price || "").replace(",", ".").match(/[0-9]+(\.[0-9]+)?/);
    return m ? parseFloat(m[0]) : null;
  }
  function fmt(n) {
    return n.toLocaleString("fr-FR", {
      minimumFractionDigits: (n % 1 ? 2 : 0),
      maximumFractionDigits: 2,
    }) + " €";
  }
  function count() {
    var n = 0;
    for (var s in items) { if (items.hasOwnProperty(s)) n += items[s]; }
    return n;
  }

  function add(slug) {
    if (!product(slug)) return;
    items[slug] = (items[slug] || 0) + 1;
    save(); render(); open();
  }
  function setQty(slug, q) {
    q = Math.max(0, q);
    if (q === 0) delete items[slug]; else items[slug] = q;
    save(); render();
  }
  function removeItem(slug) { delete items[slug]; save(); render(); }
  function clear() { items = {}; save(); render(); }

  function open() { if (drawer) { drawer.classList.add("open"); overlay.classList.add("open"); } }
  function close() { if (drawer) { drawer.classList.remove("open"); overlay.classList.remove("open"); } }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.addEventListener("click", close);

    drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("aria-label", "Panier");
    drawer.innerHTML =
      '<div class="cart-head">' +
        '<h2>Votre panier</h2>' +
        '<button class="cart-close" aria-label="Fermer">&times;</button>' +
      '</div>' +
      '<div class="cart-list"></div>' +
      '<div class="cart-foot">' +
        '<div class="cart-total"><span>Total</span><strong class="cart-total-val">0 €</strong></div>' +
        '<button class="btn btn-primary cart-pay">Payer tout</button>' +
        '<button class="cart-clear">Vider le panier</button>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    listEl = drawer.querySelector(".cart-list");
    totalEl = drawer.querySelector(".cart-total-val");
    drawer.querySelector(".cart-close").addEventListener("click", close);
    drawer.querySelector(".cart-pay").addEventListener("click", checkout);
    drawer.querySelector(".cart-clear").addEventListener("click", function () {
      if (count()) clear();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function render() {
    // Compteur dans l'en-tête
    countEl = document.getElementById("cart-count");
    var c = count();
    if (countEl) {
      countEl.textContent = c;
      countEl.style.display = c ? "" : "none";
    }
    if (!listEl) return;

    listEl.innerHTML = "";
    var slugs = Object.keys(items);
    if (!slugs.length) {
      listEl.innerHTML = '<p class="cart-empty">Votre panier est vide.<br>Ajoutez vos pièces préférées 👜</p>';
      totalEl.textContent = "0 €";
      return;
    }

    var total = 0, allPriced = true;
    slugs.forEach(function (slug) {
      var p = product(slug);
      if (!p) { delete items[slug]; return; }
      var qty = items[slug];
      var pr = priceOf(p);
      if (pr == null) allPriced = false; else total += pr * qty;

      var img = (p.images && p.images[0]) || "";
      var row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML =
        '<img class="cart-thumb" src="' + img + '" alt="" />' +
        '<div class="cart-info">' +
          '<div class="cart-name">' + p.name + '</div>' +
          '<div class="cart-price">' + (pr != null ? fmt(pr) : '<em>prix à venir</em>') + '</div>' +
        '</div>' +
        '<div class="cart-qty">' +
          '<button class="qty minus" aria-label="Retirer un">&minus;</button>' +
          '<span>' + qty + '</span>' +
          '<button class="qty plus" aria-label="Ajouter un">+</button>' +
        '</div>' +
        '<button class="cart-remove" aria-label="Retirer">&times;</button>';

      row.querySelector(".minus").addEventListener("click", function () { setQty(slug, qty - 1); });
      row.querySelector(".plus").addEventListener("click", function () { setQty(slug, qty + 1); });
      row.querySelector(".cart-remove").addEventListener("click", function () { removeItem(slug); });
      var thumb = row.querySelector(".cart-thumb");
      thumb.onerror = function () { this.style.visibility = "hidden"; };

      listEl.appendChild(row);
    });

    totalEl.innerHTML = allPriced
      ? fmt(total)
      : (fmt(total) + ' <span class="cart-partial">+ prix à confirmer</span>');
  }

  /* ---- Paiement groupé (un seul paiement pour tout le panier) ---- */
  function checkout() {
    if (!count()) return;
    var cfg = window.STRIPE_CONFIG || {};
    var line = [], missing = [];

    for (var slug in items) {
      if (!items.hasOwnProperty(slug)) continue;
      var pid = cfg.prices && cfg.prices[slug];
      if (pid) {
        line.push({ price: pid, quantity: items[slug] });
      } else {
        var p = product(slug);
        missing.push(p ? p.name : slug);
      }
    }

    if (!cfg.publishableKey || !line.length || missing.length) {
      alert(
        "Le paiement groupé n'est pas encore activé.\n\n" +
        "Il me faut ta clé Stripe (pk_...) et l'identifiant de prix de chaque produit." +
        (missing.length ? "\n\nÀ configurer : " + missing.join(", ") : "")
      );
      return;
    }
    if (typeof Stripe === "undefined") {
      alert("Le module de paiement n'a pas pu se charger. Réessaie sur le site en ligne (ougot0.github.io/coumao).");
      return;
    }

    var stripe = Stripe(cfg.publishableKey);
    var base = location.href.split("#")[0].split("?")[0];
    stripe.redirectToCheckout({
      lineItems: line,
      mode: "payment",
      successUrl: base + "?paiement=reussi",
      cancelUrl: base,
    }).then(function (res) {
      if (res && res.error) alert(res.error.message);
    });
  }

  /* ---- Init ---- */
  function init() {
    build();
    var btn = document.getElementById("cart-btn");
    if (btn) btn.addEventListener("click", open);
    render();
  }

  // Exposé pour main.js
  window.Cart = { add: add, open: open, count: count };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
