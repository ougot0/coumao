/* =============================================================
   COUMAO — Réglage du paiement du panier
   -------------------------------------------------------------
   Le paiement groupé est géré par le "moteur" hébergé sur Netlify
   (dossier netlify/functions). Le site lui envoie le panier et
   reçoit en retour la page de paiement Stripe.

   👉 La clé Stripe N'EST PAS ici : elle est stockée en sécurité
   dans les réglages Netlify (variable STRIPE_SECRET_KEY), donc
   jamais visible sur le site.

   checkoutEndpoint : l'adresse du moteur. Par défaut, celle de
   Netlify. À ne changer que si le moteur est hébergé ailleurs.
   ============================================================= */

window.STRIPE_CONFIG = {
  checkoutEndpoint: "/.netlify/functions/create-checkout",
};
