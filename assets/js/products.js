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

/* ---- Les produits ---- */
const PRODUCTS = [
  {
    slug: "coumao-candy",
    category: "sacs",
    name: "Coumao Candy 🍭",
    price: "90 €",
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
    price: "90 €",
    desc: "Sac au crochet en trapilho, bleu marine et turquoise, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-ocean-1.jpg",
      "assets/products/coumao-ocean-2.jpg",
      "assets/products/coumao-ocean-3.jpg",
    ],
  },
  {
    slug: "coumao-brownie",
    category: "sacs",
    name: "Coumao Brownie 🤎",
    price: "90 €",
    desc: "Sac au crochet en trapilho, camaïeu chocolat, noir et beige, pampille de perles en bois et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-brownie-1.jpg",
      "assets/products/coumao-brownie-2.jpg",
      "assets/products/coumao-brownie-3.jpg",
    ],
  },
  {
    slug: "coumao-passion-fruit",
    category: "sacs",
    name: "Coumao Passion Fruit 💛",
    price: "90 €",
    desc: "Sac au crochet en trapilho, jaune, violet et corail, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-passion-fruit-1.jpg",
      "assets/products/coumao-passion-fruit-2.jpg",
      "assets/products/coumao-passion-fruit-3.jpg",
    ],
  },
  {
    slug: "coumao-flower",
    category: "sacs",
    name: "Coumao Flower 🌸",
    price: "90 €",
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
    price: "90 €",
    desc: "Sac au crochet en trapilho, rayures turquoise, orange, bleu marine et moutarde, pampille multicolore et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-rainbow-1.jpg",
      "assets/products/coumao-rainbow-2.jpg",
      "assets/products/coumao-rainbow-3.jpg",
    ],
  },
  {
    slug: "coumao-cookies",
    category: "sacs",
    name: "Coumao Cookies 🍪",
    price: "90 €",
    desc: "Sac au crochet en trapilho, camaïeu chocolat, beige et écru façon cookie, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-cookies-1.jpg",
      "assets/products/coumao-cookies-2.jpg",
      "assets/products/coumao-cookies-3.jpg",
    ],
  },
  {
    slug: "coumao-firework",
    category: "sacs",
    name: "Coumao Firework 🎆",
    price: "90 €",
    desc: "Sac au crochet en trapilho, bordeaux et violet, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-firework-1.jpg",
      "assets/products/coumao-firework-2.jpg",
      "assets/products/coumao-firework-3.jpg",
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
    price: "90 €",
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
    price: "90 €",
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
    price: "90 €",
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
    price: "90 €",
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
    slug: "pochette-telephone",
    category: "telephone",
    name: "Pochette Téléphone Personnalisable 📱",
    price: "40 €",
    desc: "Pochette téléphone au crochet, faite main sur commande. Choisis tes couleurs et ton modèle, on la crée pour toi.",
    customizable: true,
    options: [
      {
        id: "modele",
        label: "Ton modèle de téléphone",
        type: "text",
        placeholder: "ex. iPhone 15, Samsung Galaxy S24…",
        required: true,
      },
      {
        id: "couleur_1",
        label: "Couleur 1 (principale)",
        type: "select",
        required: true,
        choices: COULEURS,
      },
      {
        id: "couleur_2",
        label: "Couleur 2 (optionnelle)",
        type: "select",
        choices: ["Aucune"].concat(COULEURS),
      },
      {
        id: "couleur_3",
        label: "Couleur 3 (optionnelle — 3 couleurs max)",
        type: "select",
        choices: ["Aucune"].concat(COULEURS),
      },
      {
        id: "remarque",
        label: "Une remarque ? (optionnel)",
        type: "textarea",
        placeholder: "toute précision utile pour ta pochette",
      },
    ],
    images: [
      "assets/products/pochette-telephone-1.jpg",
    ],
  },
  {
    slug: "coumao-sky",
    category: "telephone",
    name: "Pochette Sky ☁️",
    price: "40 €",
    desc: "Pochette téléphone au crochet en trapilho, bleu et turquoise, bandoulière tressée et étiquette cuir Coumao. Faite main.",
    images: [
      "assets/products/coumao-sky-1.jpg",
    ],
  },
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
];

// Ne pas modifier ci-dessous.
if (typeof module !== "undefined") { module.exports = { PRODUCTS: PRODUCTS, COLLECTIONS: COLLECTIONS }; }
