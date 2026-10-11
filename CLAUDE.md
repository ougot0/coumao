# CLAUDE.md — Mémoire du projet Coumao

> Ce fichier est lu automatiquement au début de chaque session Claude Code sur ce dépôt.
> Il sert à reprendre le projet **sans l'historique des conversations précédentes**.
> **Langue du projet : français.** Le client n'est pas technique — expliquer simplement,
> une étape à la fois, et proposer des aperçus plutôt que du jargon.

---

## 1. But du site et client

- **Coumao** est une **boutique en ligne de sacs et accessoires au crochet (trapilho), faits main en France**. Pièces uniques, colorées, et personnalisables.
- « Coumao » signifie **merci en coréen** (voir section « À propos » du site).
- **Cliente** : la créatrice de la marque (non technique). Compte GitHub **`ougot0`**, email de contact commande **coumaobrand@gmail.com**.
- **Domaine en ligne : https://www.coumaoo.com** (double « o » volontaire : coumao.com / .fr étaient pris). SSL actif.
- **Hébergement : OVH mutualisé** (cluster **cluster131**, datacenter eu-west-gra, offre « Personal », PHP 8.2, racine web = dossier **`www/`**).

---

## 2. Technologies

- **Front-end statique** : HTML + CSS + **JavaScript vanilla** (aucun framework, aucune étape de build). Le catalogue est piloté par des données dans `assets/js/products.js`.
- **Back-end paiement : PHP** (pour OVH), via cURL vers l'API Stripe. Pas de base de données.
- **Paiement : Stripe Checkout** (mode `payment`). ⚠️ **PAS de « liens de paiement » Stripe** : le site **construit lui-même** la session de paiement à partir des prix définis **côté serveur** (voir `create-checkout.php`). Pour changer un prix, on modifie le code, pas Stripe.
- **Emails : fonction `mail()` native d'OVH** (fiable, sans activation). From = `no-reply@coumaoo.com`. **FormSubmit a été abandonné** (ne délivrait rien depuis OVH).
- **Dépôt GitHub : `ougot0/coumao`**, **branche de travail : `claude/kumao-product-gallery-fsdcc1`** (c'est la seule branche ; c'est là que tout vit).

---

## 3. Structure des fichiers

```
/ (racine = contenu de www/ sur le serveur)
├── index.html              Page d'accueil (héro, onglets, grille produits, à propos, footer)
├── merci.html              Page « Merci » après paiement + formulaire d'infos de livraison
├── cgv.html                Conditions générales de vente (texte réel fourni par la cliente)
├── create-checkout.php     Crée la session Stripe Checkout (PRIX EN CENTIMES ICI)
├── stripe-webhook.php      Reçu par Stripe quand un paiement réussit → mail commerçant + mail client
├── reservation.php         Réservation « retrait en main propre » (pas de paiement en ligne) → mails
├── personnalisation.php    Formulaire de demande de personnalisation → mail commerçant
├── livraison.php           Reçoit le formulaire de merci.html → mail avec n° commande + adresse + code immeuble
├── config.sample.php       Modèle de config. À copier en config.php SUR LE SERVEUR uniquement.
├── config.php              ⚠️ N'EXISTE QUE SUR LE SERVEUR (gitignored). Contient les secrets Stripe.
├── assets/
│   ├── css/styles.css      Toute la mise en forme + responsive (menu burger mobile)
│   ├── js/
│   │   ├── products.js     LE CATALOGUE (voir §6 — ATTENTION co-géré par l'app Simple Commerce)
│   │   ├── main.js         Onglets, rendu des cartes, carrousel, lightbox, menu mobile, logique Nouveautés
│   │   ├── cart.js         Panier + Stripe Checkout + modale de réservation (retrait)
│   │   └── stripe-config.js  URLs des endpoints PHP (/create-checkout.php, etc.)
│   ├── img/                logo-coumao.png, favicon-coumao.png, hero.jpg
│   ├── products/           photos des produits : <slug>-1.jpg, -2.jpg, …
│   └── video/              (vide pour l'instant ; la section vidéo s'affiche si une vidéo est déposée)
└── favicon.ico             Icône (C + COUMAO), 16/32/48 px, à la racine
```

---

## 4. Charte graphique

Définie en variables CSS dans `assets/css/styles.css` (`:root`). **À réutiliser, ne pas introduire d'autres couleurs.**

| Rôle | Variable | Valeur |
|---|---|---|
| Fond crème | `--bg` | `#f7f3ec` |
| Fond crème foncé | `--bg-soft` | `#efe9dd` |
| Texte principal (vert très foncé) | `--ink` | `#23281f` |
| Texte secondaire | `--ink-soft` | `#5f5d54` |
| Accent (vert forêt) | `--accent` | `#34432e` |
| Accent foncé | `--accent-dk` | `#26301f` |
| Doré (sur-titres) | `--gold` | `#b3833f` |
| Filets / bordures | `--line` | `#e4ddcf` |

- **Police des titres** (`--font-title`) : `"Georgia", "Times New Roman", serif` (élégant, sérif).
- **Police du texte** (`--font-body`) : `"Helvetica Neue", "Segoe UI", system-ui, sans-serif`.
- **Logo** : grand « C » + « COUMAO » (noir sur fond blanc). Dans l'en-tête, on le pose avec `mix-blend-mode: multiply` pour que le fond blanc disparaisse sur le crème.
- **Ton éditorial** : chaleureux, artisanal, fait-main, « pièce unique », tutoiement côté client (« Ajoute tes pièces préférées 👜 »). Descriptions produits type : « Sac au crochet en trapilho, …, étiquette cuir Coumao. Pièce unique faite main. »

---

## 5. Fonctionnement du site (parcours)

- **Onglets** (générés par `main.js`, tableau `TABS`) : **Soldes · Nouveautés · Sacs · Cases · Personnalisation** (+ liens Accueil et Contact). Les onglets « Été » et « Hiver » ont été retirés.
  - **Soldes** = produits avec `solde: true`.
  - **Nouveautés** = fonction `estNouveaute(p)` : vrai si le slug est dans la liste `NOUVEAUTES`, **ou** si le **nom du produit est en MAJUSCULES** (voir §6), ou s'il est dans `NOUVEAUTES_NOMS`.
  - **Sacs** = `category === "sacs"`. **Cases** = `category === "telephone"`. **Personnalisation** = formulaire (pas de produits).
- **Deux modes d'achat** (dans le panier, `cart.js`) :
  1. **🚚 Livraison — paiement en ligne (GRATUITE)** → Stripe Checkout → redirige vers **merci.html**.
  2. **🏬 Retrait en main propre — paiement à la remise** → modale de réservation → `reservation.php` (pas de paiement en ligne). **Retrait à Levallois-Perret** ; on contacte le client au numéro donné pour l'horaire. Adresse de retrait utilisée dans le mail client : **37 rue Collange, 92300 Levallois-Perret**.
- **Après paiement** → **merci.html** : message chaleureux + n° de commande (`CM-` + 8 derniers caractères de la session Stripe) + **formulaire de livraison OBLIGATOIRE** (prénom, nom, téléphone, email, adresse, CP, ville, **code immeuble/étage/interphone**). À l'envoi → `livraison.php` → mail au commerçant réunissant **n° de commande + articles + adresse + accès**. Un avertissement empêche de quitter la page sans envoyer.
- **Emails reçus par la commerçante** (coumaobrand@gmail.com) :
  - Commande payée : mail « Commande payée » (via `stripe-webhook.php`) **+** la notification native Stripe (réglée dans le compte Stripe).
  - Livraison : mail « LIVRAISON commande CM-… » (via `livraison.php`).
  - Réservation : mail « RESERVATION (retrait) … » (via `reservation.php`).
  - Personnalisation : mail « Demande de personnalisation … » (via `personnalisation.php`).
  - Le **client** reçoit aussi un récap (réservation + commande payée) si son email est fourni.

---

## 6. ⚠️ POINT CRITIQUE : `products.js` est co-géré par une app externe

La cliente a une **application à part appelée « Simple Commerce »** (portail multi-sites, projet/dépôt **séparé**, PAS dans ce dépôt) qui se connecte **en SFTP/FTP directement au serveur OVH** et **écrit les produits dans `assets/js/products.js` sur le serveur**.

**Conséquences vitales :**
- Le `products.js` **sur le serveur** peut contenir des produits qui **ne sont PAS dans GitHub** (ex. ajoutés : MISO, BERRY, LILA, SOHO, MAPLE, CHOCO, MALKA, OLIVE — pochettes/sacs 59–149 €). Leurs **photos sont sur le serveur** (`assets/products/`), **pas** sur GitHub.
- **NE JAMAIS re-téléverser `products.js` ni le dossier `assets/products/` depuis GitHub vers le serveur** → cela **effacerait** les produits ajoutés par l'app. En clair : lors d'un déploiement manuel, **exclure `products.js` et `assets/products/`**.
- Les sacs ajoutés par l'app ont un **nom tout en MAJUSCULES** (MISO, BERRY…). C'est pour ça que `estNouveaute()` dans `main.js` met **automatiquement** tout produit au nom en MAJUSCULES dans l'onglet **Nouveautés** (l'app ne sait pas encore choisir l'onglet). Pour ajouter un nouveau sac de l'app en Nouveautés, en général **rien à faire** ; sinon ajouter son nom dans `NOUVEAUTES_NOMS`.

**Répartition des rôles (source de vérité) :**
- **L'app Simple Commerce** possède : `products.js` + photos produits (le catalogue).
- **Ce dépôt GitHub** possède : tout le reste (`main.js`, `cart.js`, `styles.css`, les `.html`, les `.php`, le logo, le favicon).

---

## 7. Décisions importantes (et pourquoi)

- **Prix côté serveur, pas de liens de paiement Stripe** : plus simple et plus sûr ; un prix se change dans `create-checkout.php` (+ affichage dans `products.js`), jamais dans Stripe.
- **`mail()` OVH au lieu de FormSubmit** : FormSubmit ne délivrait jamais depuis OVH (pas d'email d'activation reçu). `mail()` natif fonctionne sans activation.
- **Infos de livraison demandées APRÈS paiement (merci.html)** plutôt que via les « custom fields » Stripe : plus joli, plus fiable, et on relie paiement + livraison par le **même numéro de commande**. Les custom fields Stripe ont été **retirés** de `create-checkout.php`.
- **Prix actuels** (cohérents affichage + facturation) : **soldes 49 €** (barré 89 €), **sacs plein tarif 89 €** (Havane, Safari, Clutch Roma, Clutch Moka, NYC), **Coumao Sea 70 €**, **Pochette Chocolat (Cases) 29 €**, accessoires **anse 5 € / charm 5 € / clip 3 €**. (Les sacs de l'app ont leurs propres prix.)
- **En-tête mobile** : logo en grand au centre, **menu ☰ (burger)** à gauche qui déroule la navigation, panier à droite. Sur ordinateur : logo à gauche, menu en ligne à droite.
- **`[hidden]{display:none!important}`** ajouté en CSS : sans ça, l'attribut `hidden` est ignoré sur les éléments ayant un `display` explicite (bug repéré sur le bouton de réservation).
- **Bouton payer/réserver** : se réactive tout seul au retour sur la page (bfcache/`pageshow`) et à chaque changement de panier.
- **Logo & favicon** : issus du logo de la marque. `favicon.ico` à la racine (les navigateurs/aperçus le cherchent là en premier).
- **CGV** : texte réel fourni par la cliente (cite les articles L.221-18 et L.221-28 3° du Code de la consommation ; pas de rétractation sur les pièces personnalisées).

---

## 8. ❌ À NE SURTOUT PAS MODIFIER / CASSER

- ❌ Ne pas écraser **`config.php`** sur le serveur (secrets Stripe ; n'existe que là, gitignored).
- ❌ Ne pas re-déployer **`assets/js/products.js`** ni **`assets/products/`** depuis GitHub (voir §6 — on efface le travail de l'app).
- ❌ Ne pas réintroduire **FormSubmit** ni des **liens de paiement Stripe**.
- ❌ Ne pas pousser sur une autre branche que **`claude/kumao-product-gallery-fsdcc1`**.
- ❌ Ne pas mettre de secret (clé Stripe, mot de passe FTP) dans le dépôt.
- ⚠️ Garder la charte graphique (§4) et le ton chaleureux.

---

## 9. Mise en ligne (déploiement)

Le site **n'a pas de déploiement automatique** (proposé mais non mis en place — voir §10). Les changements poussés sur GitHub ne sont **PAS** live tant qu'on ne les téléverse pas sur OVH.

**Procédure manuelle (via WinSCP, par la cliente) :**
1. Télécharger le ZIP de la branche sur GitHub (bouton vert **Code → Download ZIP**).
2. **Clic droit → « Extraire tout »** (travailler depuis le vrai dossier, pas l'intérieur du ZIP — sinon « rond interdit » à la copie).
3. Dans WinSCP, se connecter à OVH en **SFTP** : hôte `ftp.cluster131.hosting.ovh.net` (ou `ssh.cluster131.hosting.ovh.net`), port 22, identifiant + mot de passe FTP OVH (onglet « FTP - SSH » de l'espace OVH).
4. Côté serveur, aller dans **`www/`**.
5. Copier les fichiers → **« Oui à tout »** pour écraser.
   - ✅ On déploie : `index.html`, `merci.html`, `cgv.html`, les `.php`, et `assets/css`, `assets/js/main.js`, `assets/js/cart.js`, `assets/js/stripe-config.js`, `assets/img`, `favicon.ico`.
   - ❌ **On NE touche PAS** : `config.php`, **`assets/js/products.js`**, **`assets/products/`** (gérés par l'app).
6. **Ctrl + F5** sur le site (le cache navigateur garde le JS/CSS longtemps ; au besoin tester en navigation privée).

**Astuce** : pour un petit changement (ex. `main.js`), on peut envoyer juste ce fichier au client, qui le glisse dans `www/assets/js/` en écrasant.

**Webhook Stripe** (déjà configuré) : endpoint « exquisite-voyage » → `https://coumaoo.com/stripe-webhook.php`, événement `checkout.session.completed` (0 % d'erreur). Un vieux webhook Netlify mort (`coumao.netlify.app`, 100 % d'erreur) peut être supprimé.

---

## 10. Reste à faire / idées

- [ ] **Déploiement automatique GitHub → OVH** (GitHub Actions FTP) pour supprimer le téléversement manuel. **Doit exclure** `products.js` et `assets/products/` (pour ne pas écraser l'app). Nécessite d'enregistrer les identifiants FTP OVH en **secrets GitHub**. (Proposé, refusé/en attente côté cliente.)
- [ ] **Faire en sorte que l'app Simple Commerce choisisse l'onglet** d'un produit (aujourd'hui l'app met tout dans « Sacs » ; on compense via la règle « nom en MAJUSCULES = Nouveautés »).
- [ ] **Vérifier la réception des emails** côté cliente après un vrai test (commande + livraison + réservation).
- [ ] Optionnel : version transparente du logo (sans le carré blanc) pour l'onglet en thème sombre.
- [ ] Optionnel : choisir une belle photo produit pour l'image d'aperçu de partage (og:image, actuellement `hero.jpg`).

---

## 11. Notes sur l'environnement de dev (Claude Code)

- **Réseau sortant bloqué vers coumaoo.com** depuis l'environnement : impossible de lire le site en ligne (ni curl ni WebFetch → EGRESS_BLOCKED). Pour voir l'état réel du serveur (ex. produits ajoutés par l'app), demander au client une capture ou le contenu du fichier.
- **Aperçu client** : un script `build-artifact.cjs` (dans le scratchpad, pas dans le dépôt) inline CSS/JS/products + photos (820 px, JPEG q0.72) en un seul HTML, publié comme artifact claude.ai pour que la cliente prévisualise. L'aperçu utilise le `products.js` de CE dépôt → il ne montre donc PAS les produits ajoutés par l'app.
- **Redimensionnement photos** : Chromium/Playwright (`playwright-core`, chromium dans `/opt/pw-browsers/...`) + `createImageBitmap(blob, {imageOrientation:"from-image"})` pour corriger l'orientation EXIF des photos de téléphone. Les photos brutes arrivent souvent à la racine du dépôt → les redimensionner dans `assets/products/` puis les supprimer de la racine (`git rm`). Cible ~1600 px, qualité 0.9.
- **Git** : commit + `git push -u origin claude/kumao-product-gallery-fsdcc1`. La cliente pousse parfois des photos en même temps → en cas de rejet (fetch first), faire `git fetch` + `git rebase origin/<branche>` puis repousser.
