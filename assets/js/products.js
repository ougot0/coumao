/* =============================================================
   COUMAO — Catalogue des produits
   -------------------------------------------------------------
   👉 C'EST LE SEUL FICHIER À MODIFIER POUR AJOUTER TES SACS.

   Pour chaque sac, remplis :
     - name   : le nom du produit
     - price  : le prix (ex. "45 €"), ou "" si tu ne veux pas l'afficher
     - desc   : une petite description (matière, dimensions, etc.)
     - buyUrl : (optionnel) le lien de paiement Stripe du sac -> bouton
                "Commander". Retire la ligne si le sac n'est pas en vente.
     - images : les 3 photos du produit (dans le dossier assets/products/)

   👉 Nom des photos, convention simple :
        assets/products/<slug>-1.jpg   (photo 1)
        assets/products/<slug>-2.jpg   (photo 2)
        assets/products/<slug>-3.jpg   (photo 3)
     Le "slug" est juste un identifiant court sans accents ni espaces.
     Ex. pour le sac "Le Petit Nuage" -> slug "petit-nuage" ->
        assets/products/petit-nuage-1.jpg, -2.jpg, -3.jpg

   Tant qu'une photo n'existe pas encore, un joli visuel provisoire
   s'affiche automatiquement avec le nom du sac. Dès que tu déposes
   la vraie photo au bon nom, elle apparaît toute seule.
   ============================================================= */

const PRODUCTS = [
  {
    slug: "coumao-candy",
    name: "Coumao Candy 🍭",
    price: "",
    desc: "Sac au crochet en trapilho, dégradé de rose bonbon, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_aFa3cp3oUbaK8L1c4X87K00",
    images: [
      "assets/products/coumao-candy-1.jpg",
      "assets/products/coumao-candy-2.jpg",
      "assets/products/coumao-candy-3.jpg",
    ],
  },
  {
    slug: "coumao-ocean",
    name: "Coumao Océan 🌊",
    price: "",
    desc: "Sac au crochet en trapilho, bleu marine et turquoise, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_5kQ14h3oUbaK0ev6KD87K01",
    images: [
      "assets/products/coumao-ocean-1.jpg",
      "assets/products/coumao-ocean-2.jpg",
      "assets/products/coumao-ocean-3.jpg",
    ],
  },
  {
    slug: "coumao-brownie",
    name: "Coumao Brownie 🤎",
    price: "",
    desc: "Sac au crochet en trapilho, camaïeu chocolat, noir et beige, pampille de perles en bois et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_5kQ5kxgbG6Uu2mD3yr87K02",
    images: [
      "assets/products/coumao-brownie-1.jpg",
      "assets/products/coumao-brownie-2.jpg",
      "assets/products/coumao-brownie-3.jpg",
    ],
  },
  {
    slug: "coumao-passion-fruit",
    name: "Coumao Passion Fruit 💛",
    price: "",
    desc: "Sac au crochet en trapilho, jaune, violet et corail, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_9B6fZb0cIbaKd1hb0T87K03",
    images: [
      "assets/products/coumao-passion-fruit-1.jpg",
      "assets/products/coumao-passion-fruit-2.jpg",
      "assets/products/coumao-passion-fruit-3.jpg",
    ],
  },
  {
    slug: "coumao-flower",
    name: "Coumao Flower 🌸",
    price: "",
    desc: "Sac au crochet en trapilho, chocolat et fuchsia à motifs fleurs, pampille de perles roses et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_6oU4gt0cIa6G3qHfh987K04",
    images: [
      "assets/products/coumao-flower-2.jpg",
      "assets/products/coumao-flower-1.jpg",
      "assets/products/coumao-flower-3.jpg",
    ],
  },
  {
    slug: "coumao-rainbow",
    name: "Coumao Rainbow 🌈",
    price: "",
    desc: "Sac au crochet en trapilho, rayures turquoise, orange, bleu marine et moutarde, pampille multicolore et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_dRm5kx1gMa6Gf9pb0T87K06",
    images: [
      "assets/products/coumao-rainbow-1.jpg",
      "assets/products/coumao-rainbow-2.jpg",
      "assets/products/coumao-rainbow-3.jpg",
    ],
  },
  {
    slug: "coumao-cookies",
    name: "Coumao Cookies 🍪",
    price: "",
    desc: "Sac au crochet en trapilho, camaïeu chocolat, beige et écru façon cookie, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_cNidR3cZubaKbXdb0T87K09",
    images: [
      "assets/products/coumao-cookies-1.jpg",
      "assets/products/coumao-cookies-2.jpg",
      "assets/products/coumao-cookies-3.jpg",
    ],
  },
  {
    slug: "coumao-firework",
    name: "Coumao Firework 🎆",
    price: "",
    desc: "Sac au crochet en trapilho, bordeaux et violet, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_5kQbIV1gMceO5yPd9187K0a",
    images: [
      "assets/products/coumao-firework-1.jpg",
      "assets/products/coumao-firework-2.jpg",
      "assets/products/coumao-firework-3.jpg",
    ],
  },
  {
    slug: "coumao-havane",
    name: "Coumao Havane 🧡",
    price: "",
    desc: "Sac au crochet en trapilho, camel havane et écru, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
    buyUrl: "https://buy.stripe.com/test_14AfZb4sY4Mm8L1d9187K07",
    images: [
      "assets/products/coumao-havane-1.jpg",
      "assets/products/coumao-havane-2.jpg",
    ],
  },
  {
    slug: "coumao-arizona",
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
    slug: "sac-11",
    name: "Sac n°11",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-11-1.jpg",
      "assets/products/sac-11-2.jpg",
      "assets/products/sac-11-3.jpg",
    ],
  },
  {
    slug: "sac-12",
    name: "Sac n°12",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-12-1.jpg",
      "assets/products/sac-12-2.jpg",
      "assets/products/sac-12-3.jpg",
    ],
  },
  {
    slug: "sac-13",
    name: "Sac n°13",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-13-1.jpg",
      "assets/products/sac-13-2.jpg",
      "assets/products/sac-13-3.jpg",
    ],
  },
  {
    slug: "sac-14",
    name: "Sac n°14",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-14-1.jpg",
      "assets/products/sac-14-2.jpg",
      "assets/products/sac-14-3.jpg",
    ],
  },
  {
    slug: "sac-15",
    name: "Sac n°15",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-15-1.jpg",
      "assets/products/sac-15-2.jpg",
      "assets/products/sac-15-3.jpg",
    ],
  },
];

// Ne pas modifier ci-dessous.
if (typeof module !== "undefined") { module.exports = PRODUCTS; }
