/* =============================================================
   COUMAO — Catalogue des produits
   -------------------------------------------------------------
   👉 C'EST LE FICHIER À MODIFIER POUR AJOUTER TES PRODUITS.

   Le site est organisé en COLLECTIONS (ex. Sacs, Téléphone).
   Chaque produit appartient à une collection via son champ
   "category" (l'identifiant de la collection : "sacs", "telephone"…).

   Pour chaque produit, remplis :
     - category : la collection ("sacs" ou "telephone")
     - name   : le nom du produit
     - price  : le prix (ex. "45 €"), ou "" si tu ne veux pas l'afficher
     - desc   : une petite description (matière, dimensions, etc.)
     - images : les photos du produit (2 ou 3), dans assets/products/

   💳 Le paiement se fait via le PANIER (bouton "Payer tout"). Les
   identifiants de prix Stripe sont centralisés dans stripe-config.js
   (un "price_..." par sac). Plus besoin de lien par produit.

   👉 Photos : assets/products/<slug>-1.jpg, -2.jpg, -3.jpg
   ============================================================= */

/* =============================================================
   🔴 OUVERTURE DE LA BOUTIQUE
   -------------------------------------------------------------
   Pour FERMER temporairement les commandes : mets  ouverte: false
   Pour ROUVRIR : remets  ouverte: true
   (Quand c'est fermé, un bandeau rouge s'affiche et les boutons
   d'achat sont désactivés.)
   ============================================================= */
const BOUTIQUE = {
  ouverte: true,
  message: "Commandes temporairement fermées. Nous sommes momentanément fermés. Les commandes rouvrent très vite — merci de votre patience !",
};

/* ---- Les collections (l'ordre = l'ordre d'affichage) ---- */
const COLLECTIONS = [
  {
    id: "sacs",
    title: "Les Sacs",
    subtitle: "Sacs au crochet en trapilho, faits main en France. Pièces uniques.",
  },
  {
    id: "telephone",
    title: "Pochettes Téléphone",
    subtitle: "Bientôt disponibles.",
  },
];

/* ---- Palette de couleurs proposée à la personnalisation ---- */
const COULEURS = [
  "Blanc", "Écru", "Beige", "Taupe", "Gris clair", "Gris", "Noir",
  "Rose poudré", "Rose", "Fuchsia", "Corail", "Rouge", "Bordeaux",
  "Orange", "Moutarde", "Jaune", "Vert d'eau", "Vert", "Vert sapin",
  "Kaki", "Turquoise", "Bleu ciel", "Bleu", "Bleu marine",
  "Lilas", "Parme", "Violet", "Camel", "Marron", "Chocolat", "Doré",
];

/* ---- Options de personnalisation "couleurs seules" (3 couleurs max) ---- */
const OPTIONS_COULEURS_3 = [
  { id: "couleur_1", label: "Couleur 1 (principale)", type: "select", required: true, choices: COULEURS },
  { id: "couleur_2", label: "Couleur 2 (optionnelle)", type: "select", choices: ["Aucune"].concat(COULEURS) },
  { id: "couleur_3", label: "Couleur 3 (optionnelle — 3 couleurs max)", type: "select", choices: ["Aucune"].concat(COULEURS) },
  { id: "remarque", label: "Une remarque ? (optionnel)", type: "textarea", placeholder: "toute précision utile pour ton sac" },
];

/* ---- Modèles proposés à la personnalisation (galerie dans l'onglet Personnalisation) ---- */
const MODELES_PERSO = [
  { name: "Modèle Poignée",     image: "assets/products/modele-poignee.jpg" },
  { name: "Modèle Bandoulière", image: "assets/products/modele-bandouliere.jpg" },
  { name: "Modèle Pochette",    image: "assets/products/modele-pochette.jpg" },
  { name: "Modèle Cabas",       image: "assets/products/modele-cabas.jpg" },
];

/* ---- Les produits ---- */
const PRODUCTS = [
  {
    slug: "coumao-summer",
    category: "sacs",
    name: "Coumao Summer ☀️",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, fuchsia et jaune citron, anse à main et étiquette cuir Coumao. Collection Été — pièce unique faite main.",
    images: [
      "assets/products/coumao-summer-4.jpg",
      "assets/products/coumao-summer-1.jpg",
      "assets/products/coumao-summer-2.jpg",
      "assets/products/coumao-summer-3.jpg",
      "assets/products/coumao-summer-5.jpg",
    ],
  },
  {
    slug: "coumao-pinkie",
    category: "sacs",
    name: "Coumao Pinkie 💗",
    price: "50 €",
    oldPrice: "80 €",       // prix barré (solde)
    solde: true,            // apparaît aussi dans l'onglet Soldes
    desc: "Sac au crochet en trapilho, rose fuchsia et rose poudré, anse à main, bandoulière amovible et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-pinkie-1.jpg",
      "assets/products/coumao-pinkie-2.jpg",
      "assets/products/coumao-pinkie-3.jpg",
      "assets/products/coumao-pinkie-4.jpg",
      "assets/products/coumao-pinkie-5.jpg",
      "assets/products/coumao-pinkie-6.jpg",
    ],
  },
  {
    slug: "coumao-clutch-roma",
    category: "sacs",
    name: "Clutch Roma 👛",
    price: "90 €",
    desc: "Pochette (clutch) au crochet en trapilho, bordeaux, camel et gris chiné, poignée intégrée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-clutch-roma-1.jpg",
      "assets/products/coumao-clutch-roma-2.jpg",
      "assets/products/coumao-clutch-roma-3.jpg",
      "assets/products/coumao-clutch-roma-4.jpg",
      "assets/products/coumao-clutch-roma-5.jpg",
      "assets/products/coumao-clutch-roma-6.jpg",
      "assets/products/coumao-clutch-roma-7.jpg",
      "assets/products/coumao-clutch-roma-8.jpg",
    ],
  },
  {
    slug: "coumao-candy",
    category: "sacs",
    name: "Coumao Candy 🍭",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, dégradé de rose bonbon, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-candy-1.jpg",
      "assets/products/coumao-candy-2.jpg",
      "assets/products/coumao-candy-3.jpg",
    ],
  },
  {
    slug: "coumao-ocean",
    category: "sacs",
    name: "Coumao Océan 🌊",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, bleu marine et turquoise, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-ocean-1.jpg",
      "assets/products/coumao-ocean-2.jpg",
      "assets/products/coumao-ocean-3.jpg",
    ],
  },
  {
    slug: "coumao-flower",
    category: "sacs",
    name: "Coumao Flower 🌸",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, chocolat et fuchsia à motifs fleurs, pampille de perles roses et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-flower-2.jpg",
      "assets/products/coumao-flower-1.jpg",
      "assets/products/coumao-flower-3.jpg",
    ],
  },
  {
    slug: "coumao-rainbow",
    category: "sacs",
    name: "Coumao Rainbow 🌈",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, rayures turquoise, orange, bleu marine et moutarde, pampille multicolore et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-rainbow-1.jpg",
      "assets/products/coumao-rainbow-2.jpg",
      "assets/products/coumao-rainbow-3.jpg",
    ],
  },
  {
    slug: "coumao-havane",
    category: "sacs",
    name: "Coumao Havane 🧡",
    price: "90 €",
    desc: "Sac au crochet en trapilho, camel havane et écru, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-havane-1.jpg",
      "assets/products/coumao-havane-2.jpg",
    ],
  },
  {
    slug: "coumao-arizona",
    category: "sacs",
    name: "Coumao Arizona 🌅",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, camel caramel et bleu ciel, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-arizona-1.jpg",
      "assets/products/coumao-arizona-2.jpg",
      "assets/products/coumao-arizona-3.jpg",
    ],
  },
  {
    slug: "coumao-casual",
    category: "sacs",
    name: "Coumao Casual ♟️",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, noir et écru chiné, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-casual-1.jpg",
      "assets/products/coumao-casual-2.jpg",
      "assets/products/coumao-casual-3.jpg",
    ],
  },
  {
    slug: "coumao-strawberry",
    category: "sacs",
    name: "Coumao Strawberry ❤️",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, rouge et blanc, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-strawberry-1.jpg",
      "assets/products/coumao-strawberry-2.jpg",
    ],
  },
  {
    slug: "coumao-emilio",
    category: "sacs",
    name: "Coumao Emilio 🧩",
    price: "50 €",
    oldPrice: "90 €",
    solde: true,
    desc: "Sac au crochet en trapilho, camaïeu pastel turquoise, citron et rose, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-emilio-1.jpg",
      "assets/products/coumao-emilio-2.jpg",
      "assets/products/coumao-emilio-3.jpg",
    ],
  },
  {
    slug: "coumao-safari",
    category: "sacs",
    name: "Coumao Safari 🐆",
    price: "90 €",
    desc: "Sac au crochet en trapilho, tons safari moutarde, kaki et prune, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-safari-1.jpg",
      "assets/products/coumao-safari-2.jpg",
      "assets/products/coumao-safari-3.jpg",
      "assets/products/coumao-safari-4.jpg",
      "assets/products/coumao-safari-5.jpg",
      "assets/products/coumao-safari-6.jpg",
    ],
  },
  {
    slug: "coumao-sea",
    category: "sacs",
    name: "Coumao Sea 🐚",
    price: "70 €",
    desc: "Pochette au crochet en trapilho, bleu marine et écru, fermeture zippée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-sea-1.jpg",
      "assets/products/coumao-sea-2.jpg",
      "assets/products/coumao-sea-3.jpg",
    ],
  },

  /* ---- Produit PERSONNALISABLE (collection Téléphone) ----
     "customizable: true" + "options" affiche un bouton "Personnaliser"
     qui ouvre une page de choix, puis "Envoyer et payer".
     Types d'option : "select" (menu), "text" (une ligne), "textarea" (message).
     👉 À ajuster : la photo, le prix, et la liste des options ci-dessous. */
  {
    slug: "coumao-chocolat",
    category: "telephone",
    name: "Pochette Chocolat 🍫",
    price: "40 €",
    desc: "Pochette téléphone au crochet en trapilho, chocolat, noir et écru, bandoulière tressée et étiquette cuir Coumao. Faite main.",
    images: [
      "assets/products/coumao-chocolat-1.jpg",
    ],
  },

  /* ---- ACCESSOIRES EN OPTION (category "accessoire") ----
     Ils n'apparaissent PAS comme produits séparés : ils s'affichent
     en cases à cocher sous les sacs (« Ajouter un accessoire »).
     👉 Prix provisoires — à confirmer. */
  {
    slug: "anse",
    category: "accessoire",
    name: "Anse (bandoulière)",
    price: "5 €",
    desc: "Anse / bandoulière tressée en supplément.",
    images: [],
  },
  {
    slug: "charme",
    category: "accessoire",
    name: "Charm (bijou de sac)",
    price: "5 €",
    desc: "Petit charm / bijou de sac en supplément.",
    images: [],
  },
  {
    slug: "clip",
    category: "accessoire",
    name: "Clip (fermeture du sac)",
    price: "3 €",
    desc: "Système de clip pour fermer le sac, en supplément.",
    images: [],
  },
];

// Ne pas modifier ci-dessous.
if (typeof module !== "undefined") { module.exports = { PRODUCTS: PRODUCTS, COLLECTIONS: COLLECTIONS }; }
