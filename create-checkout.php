<?php
/* =============================================================
   COUMAO — Moteur de paiement groupé (PHP, pour OVH)
   Reçoit le panier, crée UN paiement Stripe combiné, renvoie l'URL.
   🔒 Prix lus côté serveur dans contenu/catalogue.js. Clé lue depuis config.php.
   ============================================================= */

header('Content-Type: application/json; charset=utf-8');

// --- Configuration (clé Stripe) ---
$config = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : array();
$key = isset($config['STRIPE_SECRET_KEY']) ? $config['STRIPE_SECRET_KEY'] : getenv('STRIPE_SECRET_KEY');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array('error' => 'Méthode non autorisée.'));
  exit;
}
if (!$key) {
  http_response_code(500);
  echo json_encode(array('error' => "Le serveur n'est pas encore configuré (clé Stripe manquante)."));
  exit;
}

// Prix lus dans contenu/catalogue.js (le même fichier que le site) : le prix encaissé = le prix affiché.
require_once __DIR__ . '/catalogue.php';
$CATALOG = coumao_catalogue();
$SHIP_COUNTRIES = array('FR', 'BE', 'LU', 'CH', 'MC');

// --- Lecture du panier envoyé par le site ---
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) $body = array();
$items = (isset($body['items']) && is_array($body['items'])) ? $body['items'] : array();

$chosen = array();
foreach ($items as $it) {
  $slug = isset($it['slug']) ? $it['slug'] : '';
  if (!isset($CATALOG[$slug])) continue;
  $qty = isset($it['quantity']) ? intval($it['quantity']) : 1;
  if ($qty < 1) $qty = 1;
  if ($qty > 20) $qty = 20;
  $custom = '';
  if (isset($it['customization']) && is_string($it['customization'])) {
    $custom = mb_substr($it['customization'], 0, 490);
  }
  $chosen[] = array(
    'name'   => $CATALOG[$slug]['name'],
    'amount' => $CATALOG[$slug]['amount'],
    'qty'    => $qty,
    'custom' => $custom,
  );
}
if (!count($chosen)) {
  http_response_code(400);
  echo json_encode(array('error' => 'Panier vide ou articles introuvables.'));
  exit;
}

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$successUrl = isset($body['successUrl']) ? $body['successUrl'] : ($origin . '/?paiement=reussi');
$cancelUrl  = isset($body['cancelUrl'])  ? $body['cancelUrl']  : ($origin . '/');
// On ajoute l'identifiant de la commande au retour, pour afficher le numéro au client
$sep = (strpos($successUrl, '?') !== false) ? '&' : '?';
$successUrl = $successUrl . $sep . 'cmd={CHECKOUT_SESSION_ID}';

// --- Construction des paramètres Stripe (form-encoded) ---
$params = array(
  'mode' => 'payment',
  'success_url' => $successUrl,
  'cancel_url' => $cancelUrl,
  'billing_address_collection' => 'required',
  'phone_number_collection' => array('enabled' => 'true'),
  'shipping_address_collection' => array('allowed_countries' => $SHIP_COUNTRIES),
  // (Les infos de livraison — code immeuble, étage, interphone — sont
  //  demandées après le paiement, sur la page merci.html + livraison.php.)
  'line_items' => array(),
);
$meta = array();
foreach ($chosen as $i => $li) {
  $line = array(
    'quantity' => $li['qty'],
    'price_data' => array(
      'currency' => 'eur',
      'unit_amount' => $li['amount'],
      'product_data' => array('name' => $li['name']),
    ),
  );
  if ($li['custom'] !== '') {
    $line['price_data']['product_data']['description'] = $li['custom'];
    $meta['personnalisation_' . ($i + 1)] = mb_substr($li['name'] . ' — ' . $li['custom'], 0, 490);
  }
  $params['line_items'][$i] = $line;
}
if (!empty($meta)) $params['metadata'] = $meta;

// http_build_query produit exactement le format attendu par Stripe :
//   line_items[0][price_data][currency]=eur, shipping_address_collection[allowed_countries][0]=FR, etc.
$post = http_build_query($params);

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, array(
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer ' . $key,
    'Content-Type: application/x-www-form-urlencoded',
  ),
  CURLOPT_POSTFIELDS => $post,
  CURLOPT_TIMEOUT => 30,
));
$resp = curl_exec($ch);
if ($resp === false) {
  http_response_code(502);
  echo json_encode(array('error' => 'Impossible de contacter Stripe. Réessaie.'));
  curl_close($ch);
  exit;
}
curl_close($ch);

$data = json_decode($resp, true);
if (isset($data['error'])) {
  http_response_code(400);
  echo json_encode(array('error' => isset($data['error']['message']) ? $data['error']['message'] : 'Erreur Stripe.'));
  exit;
}
echo json_encode(array('url' => isset($data['url']) ? $data['url'] : null));
