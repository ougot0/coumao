/* =============================================================
   COUMAO — Catalogue des produits
   -------------------------------------------------------------
   👉 Les PRODUITS, les PRIX, les PHOTOS et l'OUVERTURE de la
   boutique sont maintenant dans  contenu/catalogue.js
   (modifiable depuis Simple Commerce, ou à la main).

   Ce fichier-ci garde seulement les réglages de personnalisation
   (couleurs, modèles) et prépare les données pour le site.
   ============================================================= */

var COUMAO_CONTENU = globalThis.COUMAO_CONTENU || (typeof require !== "undefined" ? (require("../../contenu/catalogue.js"), globalThis.COUMAO_CONTENU) : null) || {};

/* ---- Ouverture de la boutique (contenu/catalogue.js → "boutique") ---- */
const BOUTIQUE = COUMAO_CONTENU.boutique || { ouverte: true, message: "" };

/* ---- Les collections (l'ordre = l'ordre d'affichage) ---- */
const COLLECTIONS = COUMAO_CONTENU.collections || [];

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
  { name: "Modèle Pochette ordinateur", image: "assets/products/modele-pochette.jpg" },
  { name: "Modèle Cabas",       image: "assets/products/modele-cabas.jpg" },
];

/* ---- Les produits (contenu/catalogue.js → "produits") ----
   Un produit avec  "disponible": false  est masqué du site (et ne peut pas être acheté). */
const PRODUCTS = (COUMAO_CONTENU.produits || []).filter(function (p) {
  return p.disponible !== false;
});

// Ne pas modifier ci-dessous.
if (typeof module !== "undefined") { module.exports = { PRODUCTS: PRODUCTS, COLLECTIONS: COLLECTIONS }; }
