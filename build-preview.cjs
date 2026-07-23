/* ============================================================
   Assemble le site en UN SEUL fichier autonome pour l'apercu
   en ligne (CSS + JS inclus). Genere : dist/preview.html
   Lancer avec :  node build-preview.cjs
   ============================================================ */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const html = read("index.html");
const css = read("assets/css/styles.css");
const products = read("assets/js/products.js");
const main = read("assets/js/main.js");

// Recupere l'interieur du <body>
let body = html.split("<body>")[1].split("</body>")[0];

// Retire les balises <script src="..."> externes (on va tout inliner)
body = body.replace(/[ \t]*<script src="[^"]*"><\/script>\n?/g, "");

// Le fichier d'artefact ne doit PAS contenir <html>/<head>/<body> :
// on ecrit directement style + contenu + scripts.
const out =
  "<style>\n" + css + "\n</style>\n" +
  body.trim() + "\n" +
  "<script>\n" + products + "\n" + main + "\n</script>\n";

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/preview.html"), out);
console.log("dist/preview.html genere (" + out.length + " octets)");
