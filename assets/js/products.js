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

/* ---- Les produits ---- */
const PRODUCTS = [
  {
    slug: "coumao-candy",
    category: "sacs",
    name: "Coumao Candy 🍭",
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
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
    price: "",
    desc: "Sac au crochet en trapilho, rouge et blanc, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-strawberry-1.jpg",
      "assets/products/coumao-strawberry-2.jpg",
    ],
  },
];

// Ne pas modifier ci-dessous.
if (typeof module !== "undefined") { module.exports = { PRODUCTS: PRODUCTS, COLLECTIONS: COLLECTIONS }; }
