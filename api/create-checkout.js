/* =============================================================
   COUMAO — Moteur de paiement groupé (Fonction Vercel)
   Reçoit le panier, crée UN paiement Stripe combiné, renvoie l'URL.
   🔒 Prix définis ici (côté serveur). Clé lue depuis STRIPE_SECRET_KEY.
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
  "coumao-safari":       { name: "Coumao Safari",       amount: 9000 },
  "sac-carre":           { name: "Sac Carré personnalisé",     amount: 9000 },
  "sac-rectangle":       { name: "Sac Rectangle personnalisé", amount: 9000 },
  "coumao-sea":          { name: "Coumao Sea",          amount: 7000 },
  "pochette-telephone":  { name: "Pochette Téléphone personnalisée", amount: 4000 },
  "coumao-sky":          { name: "Pochette Sky",         amount: 4000 },
  "coumao-chocolat":     { name: "Pochette Chocolat",    amount: 4000 },
  "anse":                { name: "Anse (bandoulière)",   amount: 500 },
  "charme":              { name: "Charm (bijou de sac)", amount: 500 },
  "clip":                { name: "Clip (fermeture du sac)", amount: 300 },
};

const SHIP_COUNTRIES = ["FR", "BE", "LU", "CH", "MC"];

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: "Le serveur n'est pas encore configuré (clé Stripe manquante)." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== "object") body = {};

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
  if (!chosen.length) return res.status(400).json({ error: "Panier vide ou articles introuvables." });

  const origin = (req.headers && req.headers.origin) || "";
  const successUrl = body.successUrl || (origin + "/?paiement=reussi");
  const cancelUrl = body.cancelUrl || (origin + "/");

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
    if (data.error) return res.status(400).json({ error: data.error.message || "Erreur Stripe." });
    return res.status(200).json({ url: data.url });
  } catch (e) {
    return res.status(502).json({ error: "Impossible de contacter Stripe. Réessaie." });
  }
};
