/* =============================================================
   COUMAO — Moteur de paiement groupé (Netlify Function)
   -------------------------------------------------------------
   Reçoit le panier du site, crée UN paiement Stripe qui additionne
   tous les articles, et renvoie l'URL de paiement.

   🔒 Sécurité :
   - Les PRIX sont définis ICI, côté serveur (le client ne peut pas
     les modifier depuis son navigateur).
   - La clé Stripe n'est PAS dans ce fichier : elle est lue depuis
     une variable d'environnement Netlify (STRIPE_SECRET_KEY),
     donc jamais visible sur le site.

   👉 Quand un prix change, mets-le à jour dans CATALOG ci-dessous.
   ============================================================= */

// Prix en centimes (9000 = 90,00 €). À garder en accord avec le site.
const CATALOG = {
  "coumao-candy":        { name: "Coumao Candy",        amount: 9000 },
  "coumao-ocean":        { name: "Coumao Océan",        amount: 9000 },
  "coumao-brownie":      { name: "Coumao Brownie",      amount: 9000 },
  "coumao-passion-fruit":{ name: "Coumao Passion Fruit",amount: 9000 },
  "coumao-flower":       { name: "Coumao Flower",       amount: 9000 },
  "coumao-rainbow":      { name: "Coumao Rainbow",      amount: 9000 },
  "coumao-cookies":      { name: "Coumao Cookies",      amount: 9000 },
  "coumao-firework":     { name: "Coumao Firework",     amount: 9000 },
  "coumao-havane":       { name: "Coumao Havane",       amount: 9000 },
  "coumao-arizona":      { name: "Coumao Arizona",      amount: 9000 },
  "coumao-casual":       { name: "Coumao Casual",       amount: 9000 },
  "coumao-strawberry":   { name: "Coumao Strawberry",   amount: 9000 },
  "coumao-emilio":       { name: "Coumao Emilio",       amount: 9000 },
  "coumao-sea":          { name: "Coumao Sea",          amount: 7000 },
  "pochette-telephone":  { name: "Pochette Téléphone personnalisée", amount: 4000 },
};

// Pays de livraison autorisés
const SHIP_COUNTRIES = ["FR", "BE", "LU", "CH", "MC"];

function json(status, obj) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Méthode non autorisée." });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json(500, { error: "Le serveur n'est pas encore configuré (clé Stripe manquante)." });
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch (e) { return json(400, { error: "Requête invalide." }); }

  const items = Array.isArray(body.items) ? body.items : [];
  const chosen = [];
  for (const it of items) {
    const p = CATALOG[it && it.slug];
    if (!p) continue;
    let qty = parseInt(it.quantity, 10);
    if (!qty || qty < 1) qty = 1;
    if (qty > 20) qty = 20;
    let custom = "";
    if (typeof it.customization === "string") custom = it.customization.slice(0, 490);
    chosen.push({ name: p.name, amount: p.amount, qty: qty, custom: custom });
  }
  if (!chosen.length) {
    return json(400, { error: "Panier vide ou articles introuvables." });
  }

  // Origine du site (pour les pages de retour)
  const origin =
    (event.headers && (event.headers.origin || (event.headers.referer || "").replace(/\/[^/]*$/, ""))) ||
    "";
  const successUrl = (body.successUrl || (origin + "/?paiement=reussi"));
  const cancelUrl = (body.cancelUrl || (origin + "/"));

  // Construction de la requête Stripe (form-encodée)
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", successUrl);
  params.append("cancel_url", cancelUrl);
  params.append("billing_address_collection", "required");
  params.append("phone_number_collection[enabled]", "true");
  SHIP_COUNTRIES.forEach((c, i) => {
    params.append(`shipping_address_collection[allowed_countries][${i}]`, c);
  });
  chosen.forEach((li, i) => {
    params.append(`line_items[${i}][quantity]`, String(li.qty));
    params.append(`line_items[${i}][price_data][currency]`, "eur");
    params.append(`line_items[${i}][price_data][unit_amount]`, String(li.amount));
    params.append(`line_items[${i}][price_data][product_data][name]`, li.name);
    if (li.custom) {
      // La personnalisation apparaît sur la page de paiement, le reçu et le tableau de bord
      params.append(`line_items[${i}][price_data][product_data][description]`, li.custom);
      params.append(`metadata[personnalisation_${i + 1}]`, (li.name + " — " + li.custom).slice(0, 490));
    }
  });

  try {
    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await resp.json();
    if (data.error) {
      return json(400, { error: data.error.message || "Erreur Stripe." });
    }
    return json(200, { url: data.url });
  } catch (e) {
    return json(502, { error: "Impossible de contacter Stripe. Réessaie." });
  }
};
