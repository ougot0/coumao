/* =============================================================
   COUMAO — Configuration du paiement groupé (Stripe Checkout)
   -------------------------------------------------------------
   Pour payer PLUSIEURS sacs en UN SEUL paiement, Stripe a besoin
   de deux choses (à récupérer dans ton tableau de bord Stripe) :

   1) publishableKey : ta clé publique Stripe (commence par "pk_test_"
      en test, ou "pk_live_" en réel). Elle est faite pour être
      visible côté site, aucun risque.

   2) prices : pour CHAQUE sac, l'identifiant de son "Prix" Stripe
      (commence par "price_..."). Un par sac, associé à son "slug".

   Tant que ces infos ne sont pas remplies, le panier fonctionne
   (on peut choisir les sacs), mais le bouton "Payer tout" affiche
   un petit message au lieu d'ouvrir le paiement.
   ============================================================= */

window.STRIPE_CONFIG = {
  publishableKey: "", // ex. "pk_test_51ABC..."

  // "slug-du-sac": "price_XXXX"
  prices: {
    // "coumao-candy":        "price_...",
    // "coumao-ocean":        "price_...",
    // "coumao-brownie":      "price_...",
    // "coumao-passion-fruit":"price_...",
    // "coumao-flower":       "price_...",
    // "coumao-rainbow":      "price_...",
    // "coumao-cookies":      "price_...",
    // "coumao-firework":     "price_...",
    // "coumao-havane":       "price_...",
    // "coumao-arizona":      "price_...",
    // "coumao-casual":       "price_...",
  },
};
