/* =============================================================
   COUMAO — Réglage du paiement du panier
   -------------------------------------------------------------
   Le paiement groupé est géré par le "moteur" PHP hébergé chez OVH
   (fichier create-checkout.php). Le site lui envoie le panier et
   reçoit en retour la page de paiement Stripe.

   👉 La clé Stripe N'EST PAS ici : elle est stockée en sécurité
   dans le fichier config.php sur le serveur OVH (jamais dans le
   site ni dans GitHub).

   checkoutEndpoint : l'adresse du moteur de paiement.
   ============================================================= */

window.STRIPE_CONFIG = {
  checkoutEndpoint: "/create-checkout.php",
  reservationEndpoint: "/reservation.php",
};
