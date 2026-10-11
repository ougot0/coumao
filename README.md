# Coumao — Site vitrine des sacs faits main

Petit site vitrine pour présenter la collection de sacs **Coumao** :
une page avec **tous les produits**, et **3 photos par produit** que les
visiteurs peuvent faire défiler (flèches, points, ou glisser sur mobile),
avec un mode plein écran pour « tourner autour » du sac.

## Voir le site

Ouvre simplement le fichier `index.html` dans un navigateur.
Aucune installation, aucune connexion internet nécessaire.

Pour le mettre en ligne gratuitement plus tard : GitHub Pages, Netlify,
ou tout hébergeur de site statique (le site est 100 % statique).

## ➕ Ajouter / modifier les sacs

Tout se passe dans **un seul fichier** : `assets/js/products.js`.

Pour chaque sac tu renseignes :

```js
{
  slug: "petit-nuage",              // identifiant court, sans accents ni espaces
  name: "Le Petit Nuage",           // nom affiché
  price: "45 €",                    // prix (ou "" pour ne rien afficher)
  desc: "Toile de coton, doublé.",  // petite description
  images: [
    "assets/products/petit-nuage-1.jpg",
    "assets/products/petit-nuage-2.jpg",
    "assets/products/petit-nuage-3.jpg",
  ],
},
```

## 📸 Ajouter les photos

1. Mets tes 3 photos dans le dossier `assets/products/`.
2. Nomme-les d'après le `slug` du sac, suivi de `-1`, `-2`, `-3` :
   - `petit-nuage-1.jpg`
   - `petit-nuage-2.jpg`
   - `petit-nuage-3.jpg`

Tant qu'une photo n'existe pas, un joli visuel provisoire s'affiche
automatiquement avec le nom du sac. Dès que tu déposes la vraie photo
au bon nom, elle apparaît toute seule — rien d'autre à faire.

> Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`.
> Conseil : des photos verticales (portrait) rendent le mieux.

## Structure du projet

```
index.html                → la page du site
assets/css/styles.css      → le style
assets/js/products.js      → 🟢 LA LISTE DES SACS (à remplir)
assets/js/main.js          → la mécanique (galerie, carrousel, plein écran)
assets/products/           → 🟢 LES PHOTOS (à déposer ici)
```
