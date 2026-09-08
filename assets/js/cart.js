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
  var mode = "livraison";          // "livraison" (paiement en ligne) ou "retrait" (paiement sur place)
  var resaOverlay, resaModal;      // fenêtre de réservation

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
        '<div class="cart-mode">' +
          '<label class="cart-mode-opt"><input type="radio" name="cart-mode" value="livraison" checked>' +
            '<span>🚚 Livraison — <b>paiement en ligne</b></span></label>' +
          '<label class="cart-mode-opt"><input type="radio" name="cart-mode" value="retrait">' +
            '<span>🏬 Retrait en main propre — <b>paiement à la remise</b></span></label>' +
        '</div>' +
        '<button class="btn btn-primary cart-pay">Payer tout</button>' +
        '<button class="cart-clear">Vider le panier</button>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    listEl = drawer.querySelector(".cart-list");
    totalEl = drawer.querySelector(".cart-total-val");
    drawer.querySelector(".cart-close").addEventListener("click", close);
    drawer.querySelector(".cart-pay").addEventListener("click", payOrReserve);
    drawer.querySelector(".cart-clear").addEventListener("click", function () {
      if (count()) clear();
    });
    // Choix Livraison / Retrait
    drawer.querySelectorAll('input[name="cart-mode"]').forEach(function (r) {
      r.addEventListener("change", function () {
        mode = r.value;
        updatePayLabel();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); closeResa(); }
    });
    buildResa();
    updatePayLabel();
  }

  function updatePayLabel() {
    if (!drawer) return;
    var btn = drawer.querySelector(".cart-pay");
    if (!btn) return;
    btn.textContent = (mode === "retrait")
      ? "Réserver (paiement en main propre)"
      : "Payer tout";
  }

  // Aiguillage du bouton principal selon le mode choisi
  function payOrReserve() {
    if (!count()) return;
    if (typeof BOUTIQUE !== "undefined" && BOUTIQUE.ouverte === false) {
      alert("Les commandes sont temporairement fermées. Reviens très vite 🙏");
      return;
    }
    if (mode === "retrait") openResa();
    else checkout();
  }

  /* ---- Fenêtre de réservation (retrait + paiement sur place) ---- */
  function buildResa() {
    resaOverlay = document.createElement("div");
    resaOverlay.className = "resa-overlay";
    resaOverlay.addEventListener("click", function (e) { if (e.target === resaOverlay) closeResa(); });

    resaModal = document.createElement("div");
    resaModal.className = "resa-modal";
    resaModal.innerHTML =
      '<button class="resa-close" aria-label="Fermer">&times;</button>' +
      '<h2>Retrait en main propre</h2>' +
      '<p class="resa-sub">Réserve tes articles : tu viens les chercher et tu paies en main propre. ' +
        'On te recontacte pour convenir du retrait 💛</p>' +
      '<label class="resa-field"><span>Ton nom *</span>' +
        '<input type="text" class="resa-input" data-k="name" placeholder="Prénom Nom"></label>' +
      '<label class="resa-field"><span>Email</span>' +
        '<input type="email" class="resa-input" data-k="email" placeholder="ton@email.com"></label>' +
      '<label class="resa-field"><span>Téléphone</span>' +
        '<input type="tel" class="resa-input" data-k="phone" placeholder="06 …"></label>' +
      '<label class="resa-field"><span>Une remarque ? (optionnel)</span>' +
        '<textarea class="resa-input" data-k="note" rows="2" placeholder="créneau souhaité, précision…"></textarea></label>' +
      '<p class="resa-hint">* nom + (email <b>ou</b> téléphone) obligatoires pour te recontacter.</p>' +
      '<button class="btn btn-primary resa-send">Envoyer ma réservation</button>' +
      '<div class="resa-ok" hidden></div>';

    document.body.appendChild(resaOverlay);
    document.body.appendChild(resaModal);
    resaModal.querySelector(".resa-close").addEventListener("click", closeResa);
    resaModal.querySelector(".resa-send").addEventListener("click", sendResa);
  }

  function openResa() {
    if (resaModal) {
      resaModal.querySelector(".resa-ok").hidden = true;
      resaModal.querySelectorAll(".resa-input, .resa-send, .resa-field, .resa-sub, .resa-hint").forEach(function (el) { el.hidden = false; });
      resaOverlay.classList.add("open");
      resaModal.classList.add("open");
    }
  }
  function closeResa() {
    if (resaModal) { resaOverlay.classList.remove("open"); resaModal.classList.remove("open"); }
  }

  function sendResa() {
    var cust = {};
    resaModal.querySelectorAll(".resa-input").forEach(function (f) { cust[f.getAttribute("data-k")] = (f.value || "").trim(); });
    if (!cust.name || (!cust.email && !cust.phone)) {
      alert("Merci d'indiquer ton nom et un moyen de te contacter (email ou téléphone).");
      return;
    }
    var list = [];
    for (var slug in items) {
      if (items.hasOwnProperty(slug)) list.push({ slug: slug, quantity: items[slug] });
    }
    var cfg = window.STRIPE_CONFIG || {};
    var endpoint = cfg.reservationEndpoint || "/reservation.php";
    var btn = resaModal.querySelector(".resa-send");
    btn.disabled = true; btn.textContent = "Envoi…";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: list, customer: cust }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = "Envoyer ma réservation";
        if (res.ok && res.d && res.d.ok) {
          // Succès : on masque le formulaire, on affiche la confirmation, on vide le panier
          resaModal.querySelectorAll(".resa-input, .resa-send, .resa-field, .resa-sub, .resa-hint").forEach(function (el) { el.hidden = true; });
          var ok = resaModal.querySelector(".resa-ok");
          ok.hidden = false;
          ok.innerHTML = "✅ <b>Réservation envoyée !</b><br>Référence " + (res.d.ref || "") +
            "<br>On te recontacte très vite pour le retrait. Merci 💛";
          clear();
        } else {
          alert((res.d && res.d.error) || "La réservation n'a pas pu être envoyée. Réessaie.");
        }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Envoyer ma réservation";
        alert("La réservation ne fonctionne pas encore sur cette adresse (elle s'active une fois le site publié).");
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

  /* ---- Paiement (moteur Netlify -> Stripe) ----
     Envoie une liste d'articles au moteur, qui crée un paiement Stripe
     combiné et renvoie l'URL de paiement. */
  function startCheckout(itemsList, onError) {
    var cfg = window.STRIPE_CONFIG || {};
    var endpoint = cfg.checkoutEndpoint || "/.netlify/functions/create-checkout";
    var base = location.origin + location.pathname;
    var payload = {
      items: itemsList,
      successUrl: base + "?paiement=reussi",
      cancelUrl: base,
    };
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && res.d && res.d.url) {
          window.location.href = res.d.url; // page de paiement Stripe
        } else {
          if (onError) onError();
          alert((res.d && res.d.error) || "Le paiement n'est pas disponible pour le moment.");
        }
      })
      .catch(function () {
        if (onError) onError();
        alert(
          "Le paiement n'est pas encore actif sur cette adresse.\n" +
          "Il s'active une fois le site publié sur Netlify (avec la clé Stripe)."
        );
      });
  }

  // Paiement de tout le panier
  function checkout() {
    if (typeof BOUTIQUE !== "undefined" && BOUTIQUE.ouverte === false) {
      alert("Les commandes sont temporairement fermées. Reviens très vite 🙏");
      return;
    }
    if (!count()) return;
    var list = [];
    for (var slug in items) {
      if (items.hasOwnProperty(slug)) list.push({ slug: slug, quantity: items[slug] });
    }
    var payBtn = drawer.querySelector(".cart-pay");
    var prevTxt = payBtn.textContent;
    payBtn.disabled = true;
    payBtn.textContent = "Redirection vers le paiement…";
    startCheckout(list, function () {
      payBtn.disabled = false;
      payBtn.textContent = prevTxt;
    });
  }

  // Paiement d'un article personnalisé (sur mesure) + accessoires optionnels
  function payCustom(slug, customization, addonSlugs, onError) {
    // Rétro-compatibilité : payCustom(slug, customization, onError)
    if (typeof addonSlugs === "function") { onError = addonSlugs; addonSlugs = []; }
    var list = [{ slug: slug, quantity: 1, customization: customization }];
    (addonSlugs || []).forEach(function (s) { list.push({ slug: s, quantity: 1 }); });
    startCheckout(list, onError);
  }

  /* ---- Init ---- */
  function init() {
    build();
    var btn = document.getElementById("cart-btn");
    if (btn) btn.addEventListener("click", open);
    render();
  }

  // Exposé pour main.js
  window.Cart = { add: add, open: open, count: count, payCustom: payCustom };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
