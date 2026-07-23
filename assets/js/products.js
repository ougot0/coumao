/* =============================================================
   COUMAO — Catalogue des produits
   -------------------------------------------------------------
   👉 C'EST LE SEUL FICHIER À MODIFIER POUR AJOUTER TES SACS.

   Pour chaque sac, remplis :
     - name   : le nom du produit
     - price  : le prix (ex. "45 €"), ou "" si tu ne veux pas l'afficher
     - desc   : une petite description (matière, dimensions, etc.)
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
    name: "Coumao Candy",
    price: "",
    desc: "Sac au crochet en trapilho, dégradé de rose bonbon, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
    images: [
      "assets/products/coumao-candy-1.jpg",
      "assets/products/coumao-candy-2.jpg",
      "assets/products/coumao-candy-3.jpg",
    ],
  },
  {
    slug: "sac-02",
    name: "Sac n°2",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-02-1.jpg",
      "assets/products/sac-02-2.jpg",
      "assets/products/sac-02-3.jpg",
    ],
  },
  {
    slug: "sac-03",
    name: "Sac n°3",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-03-1.jpg",
      "assets/products/sac-03-2.jpg",
      "assets/products/sac-03-3.jpg",
    ],
  },
  {
    slug: "sac-04",
    name: "Sac n°4",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-04-1.jpg",
      "assets/products/sac-04-2.jpg",
      "assets/products/sac-04-3.jpg",
    ],
  },
  {
    slug: "sac-05",
    name: "Sac n°5",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-05-1.jpg",
      "assets/products/sac-05-2.jpg",
      "assets/products/sac-05-3.jpg",
    ],
  },
  {
    slug: "sac-06",
    name: "Sac n°6",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-06-1.jpg",
      "assets/products/sac-06-2.jpg",
      "assets/products/sac-06-3.jpg",
    ],
  },
  {
    slug: "sac-07",
    name: "Sac n°7",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-07-1.jpg",
      "assets/products/sac-07-2.jpg",
      "assets/products/sac-07-3.jpg",
    ],
  },
  {
    slug: "sac-08",
    name: "Sac n°8",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-08-1.jpg",
      "assets/products/sac-08-2.jpg",
      "assets/products/sac-08-3.jpg",
    ],
  },
  {
    slug: "sac-09",
    name: "Sac n°9",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-09-1.jpg",
      "assets/products/sac-09-2.jpg",
      "assets/products/sac-09-3.jpg",
    ],
  },
  {
    slug: "sac-10",
    name: "Sac n°10",
    price: "",
    desc: "Sac cousu main, entièrement fait maison.",
    images: [
      "assets/products/sac-10-1.jpg",
      "assets/products/sac-10-2.jpg",
      "assets/products/sac-10-3.jpg",
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
