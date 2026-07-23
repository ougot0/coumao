/* =============================================================
   COUMAO — Email "bon de commande" à chaque vente
   -------------------------------------------------------------
   Stripe appelle cette fonction quand un paiement réussit
   (événement checkout.session.completed). On récupère la commande
   (articles, total, client, adresse de livraison, personnalisation)
   et on envoie un email récapitulatif à la boutique via Resend.

   🔑 Variables d'environnement Netlify nécessaires :
   - STRIPE_SECRET_KEY     (déjà présente)
   - STRIPE_WEBHOOK_SECRET (le "signing secret" du webhook Stripe)
   - RESEND_API_KEY        (clé du service d'envoi d'email Resend)
   - ORDER_EMAIL           (optionnel ; défaut : evapts123@gmail.com)
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
  const expected = crypto
    .createHmac("sha256", secret)
    .update(parts.t + "." + rawBody, "utf8")
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatAddress(addr, name) {
  if (!addr) return "—";
  const l = [
    name,
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.country,
  ].filter(Boolean);
  return l.map(esc).join("<br>");
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Méthode non autorisée." };

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
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

  // On ne traite que les paiements réussis
  if (evt.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "ignoré" };
  }
  const s = evt.data.object || {};

  // Articles commandés (récupérés depuis Stripe)
  let itemsHtml = "";
  try {
    const r = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + s.id + "/line_items?limit=50",
      { headers: { Authorization: "Bearer " + stripeKey } }
    );
    const li = await r.json();
    itemsHtml = (li.data || [])
      .map(function (it) {
        var line =
          "<tr><td style='padding:6px 10px;border-bottom:1px solid #eee'>" +
          esc(it.quantity) + " × " + esc(it.description) +
          "</td><td style='padding:6px 10px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap'>" +
          (it.amount_total / 100).toFixed(2) + " €</td></tr>";
        return line;
      })
      .join("");
  } catch (e) { itemsHtml = ""; }

  const cd = s.customer_details || {};
  const shipping =
    (s.shipping_details && s.shipping_details.address) ||
    (s.collected_information && s.collected_information.shipping_details && s.collected_information.shipping_details.address) ||
    null;
  const shipName = (s.shipping_details && s.shipping_details.name) || cd.name || "";
  const total = ((s.amount_total || 0) / 100).toFixed(2);

  // Personnalisation (métadonnées)
  const meta = s.metadata || {};
  const perso = Object.keys(meta)
    .filter(function (k) { return k.indexOf("personnalisation") === 0; })
    .map(function (k) { return "<li>" + esc(meta[k]) + "</li>"; })
    .join("");

  const html =
    "<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#23281f'>" +
    "<h2 style='font-family:Georgia,serif;color:#34432e'>🧺 Nouvelle commande Coumao</h2>" +
    "<p style='color:#5f5d54'>Un paiement de <b>" + total + " €</b> vient d'être reçu.</p>" +
    "<table style='width:100%;border-collapse:collapse;margin:14px 0'>" + itemsHtml +
      "<tr><td style='padding:8px 10px;font-weight:bold'>Total</td>" +
      "<td style='padding:8px 10px;text-align:right;font-weight:bold'>" + total + " €</td></tr>" +
    "</table>" +
    (perso ? "<h3 style='color:#b3833f'>Personnalisation</h3><ul>" + perso + "</ul>" : "") +
    "<h3 style='color:#34432e'>Client</h3>" +
    "<p>" + esc(cd.name || "—") + "<br>" + esc(cd.email || "") +
      (cd.phone ? "<br>" + esc(cd.phone) : "") + "</p>" +
    "<h3 style='color:#34432e'>Livraison</h3>" +
    "<p>" + formatAddress(shipping, shipName) + "</p>" +
    "<hr style='border:none;border-top:1px solid #eee;margin:18px 0'>" +
    "<p style='color:#8a8378;font-size:12px'>Email automatique — détails complets sur ton tableau de bord Stripe.</p>" +
    "</div>";

  if (!resendKey) {
    // Pas d'email configuré : on renvoie 200 pour ne pas bloquer Stripe
    return { statusCode: 200, body: "email non configuré" };
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + resendKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Coumao <onboarding@resend.dev>",
        to: [to],
        subject: "🧺 Nouvelle commande Coumao — " + total + " €",
        html: html,
      }),
    });
  } catch (e) { /* on n'échoue pas le webhook pour un souci d'email */ }

  return { statusCode: 200, body: "ok" };
};
