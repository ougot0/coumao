/* =============================================================
   COUMAO — Email "devis / bon de commande" (Fonction Vercel)
   Stripe appelle cette fonction quand un paiement réussit.
   On envoie un récapitulatif façon DEVIS via Formsubmit.

   🔑 Variables d'environnement Vercel :
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET  (recommandé)
   - ORDER_EMAIL            (optionnel ; défaut : coumaobrand@gmail.com)
   ============================================================= */

const crypto = require("crypto");

// Vercel : on désactive l'analyse automatique du corps (besoin du brut)
module.exports.config = { api: { bodyParser: false } };

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(typeof c === "string" ? Buffer.from(c) : c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function verifyStripe(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = {};
  sigHeader.split(",").forEach((kv) => {
    const i = kv.indexOf("=");
    if (i > 0) parts[kv.slice(0, i)] = kv.slice(i + 1);
  });
  if (!parts.t || !parts.v1) return false;
  const expected = crypto.createHmac("sha256", secret)
    .update(parts.t + "." + rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function fmtAddress(addr, name) {
  if (!addr) return "—";
  return [
    name, addr.line1, addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.country,
  ].filter(Boolean).join(", ");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Méthode non autorisée.");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const to = process.env.ORDER_EMAIL || "coumaobrand@gmail.com";

  const raw = await readRaw(req);
  const sig = req.headers["stripe-signature"];

  if (webhookSecret && !verifyStripe(raw, sig, webhookSecret)) {
    return res.status(400).send("Signature invalide.");
  }

  let evt;
  try { evt = JSON.parse(raw); } catch (e) { return res.status(400).send("JSON invalide."); }
  if (evt.type !== "checkout.session.completed") return res.status(200).send("ignoré");

  const s = evt.data.object || {};
  const total = ((s.amount_total || 0) / 100).toFixed(2);

  let dateStr;
  try { dateStr = new Date().toLocaleString("fr-FR"); }
  catch (e) { dateStr = new Date().toISOString().slice(0, 16).replace("T", " "); }

  const ref = "CM-" + String(s.id || "").slice(-8).toUpperCase();

  const fields = {
    _subject: "🧾 Devis / Commande Coumao " + ref + " — " + total + " €",
    _template: "table",
    "Commande N°": ref,
    "Date": dateStr,
  };
  try {
    const r = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + s.id + "/line_items?limit=50",
      { headers: { Authorization: "Bearer " + stripeKey } }
    );
    const li = await r.json();
    (li.data || []).forEach(function (it, i) {
      fields["Article " + (i + 1)] =
        it.quantity + " × " + it.description + "  —  " + (it.amount_total / 100).toFixed(2) + " €";
    });
  } catch (e) { /* ignore */ }

  fields["TOTAL"] = total + " €";

  const meta = s.metadata || {};
  const perso = Object.keys(meta)
    .filter(function (k) { return k.indexOf("personnalisation") === 0; })
    .map(function (k) { return meta[k]; });
  if (perso.length) fields["Personnalisation"] = perso.join("  ||  ");

  const cd = s.customer_details || {};
  const ship =
    (s.shipping_details && s.shipping_details.address) ||
    (s.collected_information && s.collected_information.shipping_details && s.collected_information.shipping_details.address) ||
    null;
  const shipName = (s.shipping_details && s.shipping_details.name) || cd.name || "";
  fields["Client"] = cd.name || "—";
  fields["Email client"] = cd.email || "—";
  if (cd.phone) fields["Téléphone"] = cd.phone;
  fields["Adresse de livraison"] = fmtAddress(ship, shipName);

  try {
    await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(fields),
    });
  } catch (e) { /* on n'échoue pas le webhook pour un souci d'email */ }

  return res.status(200).send("ok");
};
