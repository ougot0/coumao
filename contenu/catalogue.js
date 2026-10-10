/* =============================================================
   COUMAO — Contenu de la boutique (produits, prix, photos)
   -------------------------------------------------------------
   Modifiable depuis Simple Commerce, ou à la main.
   Si tu le modifies à la main : garde exactement le format JSON
   (guillemets doubles, pas de virgule après le dernier élément).
   Ce fichier est lu par le site ET par le paiement (create-checkout.php,
   reservation.php) : un prix changé ici est le prix encaissé.
   ============================================================= */
globalThis.COUMAO_CONTENU = {
  "boutique": {
    "ouverte": true,
    "message": "Commandes temporairement fermées. Nous sommes momentanément fermés. Les commandes rouvrent très vite — merci de votre patience !"
  },
  "collections": [
    {
      "id": "sacs",
      "title": "Les Sacs",
      "subtitle": "Sacs au crochet en trapilho, faits main en France. Pièces uniques."
    },
    {
      "id": "telephone",
      "title": "Pochettes Téléphone",
      "subtitle": "Bientôt disponibles."
    }
  ],
  "produits": [
    {
      "slug": "coumao-summer",
      "category": "sacs",
      "name": "Coumao Summer ☀️",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, fuchsia et jaune citron, anse à main et étiquette cuir Coumao. Collection Été — pièce unique faite main.",
      "images": [
        "assets/products/coumao-summer-4.jpg",
        "assets/products/coumao-summer-1.jpg",
        "assets/products/coumao-summer-2.jpg",
        "assets/products/coumao-summer-3.jpg",
        "assets/products/coumao-summer-5.jpg"
      ]
    },
    {
      "slug": "coumao-pinkie",
      "category": "sacs",
      "name": "Coumao Pinkie 💗",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, rose fuchsia et rose poudré, anse à main, bandoulière amovible et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-pinkie-1.jpg",
        "assets/products/coumao-pinkie-2.jpg",
        "assets/products/coumao-pinkie-3.jpg",
        "assets/products/coumao-pinkie-4.jpg",
        "assets/products/coumao-pinkie-5.jpg",
        "assets/products/coumao-pinkie-6.jpg"
      ]
    },
    {
      "slug": "coumao-clutch-roma",
      "category": "sacs",
      "name": "Clutch Roma 👛",
      "price": "89 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": true,
      "disponible": true,
      "desc": "Pochette (clutch) au crochet en trapilho, bordeaux, camel et gris chiné, poignée intégrée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-clutch-roma-4.jpg",
        "assets/products/coumao-clutch-roma-1.jpg",
        "assets/products/coumao-clutch-roma-2.jpg",
        "assets/products/coumao-clutch-roma-3.jpg",
        "assets/products/coumao-clutch-roma-5.jpg",
        "assets/products/coumao-clutch-roma-6.jpg",
        "assets/products/coumao-clutch-roma-7.jpg",
        "assets/products/coumao-clutch-roma-8.jpg"
      ]
    },
    {
      "slug": "coumao-clutch-moka",
      "category": "sacs",
      "name": "Clutch Moka 🤎",
      "price": "89 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": true,
      "disponible": true,
      "desc": "Pochette (clutch) au crochet en trapilho, camaïeu moka, camel et chocolat, poignée intégrée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-clutch-moka-1.jpg",
        "assets/products/coumao-clutch-moka-2.jpg",
        "assets/products/coumao-clutch-moka-3.jpg",
        "assets/products/coumao-clutch-moka-4.jpg"
      ]
    },
    {
      "slug": "coumao-nyc",
      "category": "sacs",
      "name": "Coumao NYC 🖤",
      "price": "89 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": true,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, gris perle et noir, anse à main tressée, charm cœur et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-nyc-1.jpg",
        "assets/products/coumao-nyc-2.jpg",
        "assets/products/coumao-nyc-3.jpg",
        "assets/products/coumao-nyc-4.jpg"
      ]
    },
    {
      "slug": "coumao-candy",
      "category": "sacs",
      "name": "Coumao Candy 🍭",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, dégradé de rose bonbon, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-candy-1.jpg",
        "assets/products/coumao-candy-2.jpg",
        "assets/products/coumao-candy-3.jpg"
      ]
    },
    {
      "slug": "coumao-ocean",
      "category": "sacs",
      "name": "Coumao Océan 🌊",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, bleu marine et turquoise, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-ocean-1.jpg",
        "assets/products/coumao-ocean-2.jpg",
        "assets/products/coumao-ocean-3.jpg"
      ]
    },
    {
      "slug": "coumao-flower",
      "category": "sacs",
      "name": "Coumao Flower 🌸",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, chocolat et fuchsia à motifs fleurs, pampille de perles roses et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-flower-2.jpg",
        "assets/products/coumao-flower-1.jpg",
        "assets/products/coumao-flower-3.jpg"
      ]
    },
    {
      "slug": "coumao-rainbow",
      "category": "sacs",
      "name": "Coumao Rainbow 🌈",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, rayures turquoise, orange, bleu marine et moutarde, pampille multicolore et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-rainbow-1.jpg",
        "assets/products/coumao-rainbow-2.jpg",
        "assets/products/coumao-rainbow-3.jpg"
      ]
    },
    {
      "slug": "coumao-havane",
      "category": "sacs",
      "name": "Coumao Havane 🧡",
      "price": "89 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, camel havane et écru, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-havane-1.jpg",
        "assets/products/coumao-havane-2.jpg"
      ]
    },
    {
      "slug": "coumao-arizona",
      "category": "sacs",
      "name": "Coumao Arizona 🌅",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, camel caramel et bleu ciel, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-arizona-1.jpg",
        "assets/products/coumao-arizona-2.jpg",
        "assets/products/coumao-arizona-3.jpg"
      ]
    },
    {
      "slug": "coumao-casual",
      "category": "sacs",
      "name": "Coumao Casual ♟️",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, noir et écru chiné, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-casual-1.jpg",
        "assets/products/coumao-casual-2.jpg",
        "assets/products/coumao-casual-3.jpg"
      ]
    },
    {
      "slug": "coumao-strawberry",
      "category": "sacs",
      "name": "Coumao Strawberry ❤️",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, rouge et blanc, bandoulière tressée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-strawberry-1.jpg",
        "assets/products/coumao-strawberry-2.jpg"
      ]
    },
    {
      "slug": "coumao-emilio",
      "category": "sacs",
      "name": "Coumao Emilio 🧩",
      "price": "49 €",
      "oldPrice": "89 €",
      "solde": true,
      "nouveaute": false,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, camaïeu pastel turquoise, citron et rose, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-emilio-1.jpg",
        "assets/products/coumao-emilio-2.jpg",
        "assets/products/coumao-emilio-3.jpg"
      ]
    },
    {
      "slug": "coumao-safari",
      "category": "sacs",
      "name": "Coumao Safari 🐆",
      "price": "89 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": true,
      "disponible": true,
      "desc": "Sac au crochet en trapilho, tons safari moutarde, kaki et prune, anse à main et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-safari-1.jpg",
        "assets/products/coumao-safari-2.jpg",
        "assets/products/coumao-safari-3.jpg",
        "assets/products/coumao-safari-4.jpg",
        "assets/products/coumao-safari-5.jpg",
        "assets/products/coumao-safari-6.jpg"
      ]
    },
    {
      "slug": "coumao-sea",
      "category": "sacs",
      "name": "Coumao Sea 🐚",
      "price": "70 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Pochette au crochet en trapilho, bleu marine et écru, fermeture zippée et étiquette cuir Coumao. Pièce unique faite main.",
      "images": [
        "assets/products/coumao-sea-1.jpg",
        "assets/products/coumao-sea-2.jpg",
        "assets/products/coumao-sea-3.jpg"
      ]
    },
    {
      "slug": "coumao-chocolat",
      "category": "telephone",
      "name": "Pochette Chocolat 🍫",
      "price": "29 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Pochette téléphone au crochet en trapilho, chocolat, noir et écru, bandoulière tressée et étiquette cuir Coumao. Faite main.",
      "images": [
        "assets/products/coumao-chocolat-1.jpg"
      ]
    },
    {
      "slug": "anse",
      "category": "accessoire",
      "name": "Anse (bandoulière)",
      "price": "5 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Anse / bandoulière tressée en supplément.",
      "images": []
    },
    {
      "slug": "charme",
      "category": "accessoire",
      "name": "Charm (bijou de sac)",
      "price": "5 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Petit charm / bijou de sac en supplément.",
      "images": []
    },
    {
      "slug": "clip",
      "category": "accessoire",
      "name": "Clip (fermeture du sac)",
      "price": "3 €",
      "oldPrice": "",
      "solde": false,
      "nouveaute": false,
      "disponible": true,
      "desc": "Système de clip pour fermer le sac, en supplément.",
      "images": []
    }
  ]
};
