<?php
/* =============================================================
   COUMAO — Configuration secrète
   -------------------------------------------------------------
   👉 SUR LE SERVEUR OVH : copie ce fichier en "config.php"
      (même dossier) et remplace les valeurs par les tiennes.

   ⚠️ NE JAMAIS mettre la vraie clé Stripe dans GitHub.
      Le fichier "config.php" est ignoré par git (voir .gitignore)
      et n'existe que sur le serveur.
   ============================================================= */

return array(
  // Clé secrète Stripe (commence par sk_live_… en production)
  'STRIPE_SECRET_KEY'     => 'sk_live_A_REMPLACER',

  // Secret du webhook Stripe (commence par whsec_…). Recommandé.
  'STRIPE_WEBHOOK_SECRET' => 'whsec_A_REMPLACER',

  // Adresse qui reçoit les commandes (format devis)
  'ORDER_EMAIL'           => 'coumaobrand@gmail.com',
);
