/* =============================================================
   COUMAO — Email "devis / bon de commande" à chaque vente
   -------------------------------------------------------------
   Stripe appelle cette fonction quand un paiement réussit
   (événement checkout.session.completed). On récupère la commande
   et on envoie un récapitulatif façon DEVIS à la boutique, via
   Formsubmit (pas de clé API à gérer).

   🔑 Variables d'environnement Netlify :
   - STRIPE_SECRET_KEY      (déjà présente)
   - STRIPE_WEBHOOK_SECRET  (recommandé : sécurise le webhook)
   - ORDER_EMAIL            (optionnel ; défaut : evapts123@gmail.com)

   ⚠️ Formsubmit : au tout 1er envoi, un email d'activation est
   envoyé à l'adresse — il faut cliquer le lien UNE fois. Ensuite
   toutes les commandes arrivent directement.
   ============================================================= */

const crypto = require("crypto");

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

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Méthode non autorisée." };

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const to = process.env.ORDER_EMAIL || "evapts123@gmail.com";

  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  if (webhookSecret && !verifyStripe(raw, sig, webhookSecret)) {
    return { statusCode: 400, body: "Signature invalide." };
  }

  let evt;
  try { evt = JSON.parse(raw); } catch (e) { return { statusCode: 400, body: "JSON invalide." }; }
  if (evt.type !== "checkout.session.completed") return { statusCode: 200, body: "ignoré" };

  const s = evt.data.object || {};
  const total = ((s.amount_total || 0) / 100).toFixed(2);

  // Date (format FR)
  let dateStr;
  try { dateStr = new Date().toLocaleString("fr-FR"); }
  catch (e) { dateStr = new Date().toISOString().slice(0, 16).replace("T", " "); }

  // Numéro de commande court
  const ref = "CM-" + String(s.id || "").slice(-8).toUpperCase();

  // Articles
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

  // Personnalisation
  const meta = s.metadata || {};
  const perso = Object.keys(meta)
    .filter(function (k) { return k.indexOf("personnalisation") === 0; })
    .map(function (k) { return meta[k]; });
  if (perso.length) fields["Personnalisation"] = perso.join("  ||  ");

  // Client + livraison
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

  return { statusCode: 200, body: "ok" };
};
