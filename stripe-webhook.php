<?php
/* =============================================================
   COUMAO — Email "devis / bon de commande" (PHP, pour OVH)
   Stripe appelle ce fichier quand un paiement réussit.
   On envoie un récapitulatif façon DEVIS via Formsubmit.

   🔑 Valeurs dans config.php :
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET  (recommandé)
   - ORDER_EMAIL            (optionnel ; défaut : coumaobrand@gmail.com)
   ============================================================= */

date_default_timezone_set('Europe/Paris');

$config = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : array();
$webhookSecret = isset($config['STRIPE_WEBHOOK_SECRET']) ? $config['STRIPE_WEBHOOK_SECRET'] : getenv('STRIPE_WEBHOOK_SECRET');
$stripeKey     = isset($config['STRIPE_SECRET_KEY']) ? $config['STRIPE_SECRET_KEY'] : getenv('STRIPE_SECRET_KEY');
$to            = isset($config['ORDER_EMAIL']) ? $config['ORDER_EMAIL'] : (getenv('ORDER_EMAIL') ? getenv('ORDER_EMAIL') : 'coumaobrand@gmail.com');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo 'Méthode non autorisée.';
  exit;
}

$raw = file_get_contents('php://input');
$sig = isset($_SERVER['HTTP_STRIPE_SIGNATURE']) ? $_SERVER['HTTP_STRIPE_SIGNATURE'] : '';

function verifyStripe($raw, $sigHeader, $secret) {
  if (!$sigHeader) return false;
  $parts = array();
  foreach (explode(',', $sigHeader) as $kv) {
    $i = strpos($kv, '=');
    if ($i !== false) $parts[substr($kv, 0, $i)] = substr($kv, $i + 1);
  }
  if (empty($parts['t']) || empty($parts['v1'])) return false;
  $expected = hash_hmac('sha256', $parts['t'] . '.' . $raw, $secret);
  return hash_equals($expected, $parts['v1']);
}

if ($webhookSecret && !verifyStripe($raw, $sig, $webhookSecret)) {
  http_response_code(400);
  echo 'Signature invalide.';
  exit;
}

$evt = json_decode($raw, true);
if (!is_array($evt)) {
  http_response_code(400);
  echo 'JSON invalide.';
  exit;
}
if (!isset($evt['type']) || $evt['type'] !== 'checkout.session.completed') {
  http_response_code(200);
  echo 'ignoré';
  exit;
}

$s = isset($evt['data']['object']) ? $evt['data']['object'] : array();
$totalNum = (isset($s['amount_total']) ? $s['amount_total'] : 0) / 100;
$total = number_format($totalNum, 2, ',', ' ');
$dateStr = date('d/m/Y H:i');
$ref = 'CM-' . strtoupper(substr(isset($s['id']) ? $s['id'] : '', -8));

$fields = array(
  '_subject'    => '🧾 Devis / Commande Coumao ' . $ref . ' — ' . $total . ' €',
  '_template'   => 'table',
  'Commande N°' => $ref,
  'Date'        => $dateStr,
);

// Détail des articles (via l'API Stripe)
if ($stripeKey && isset($s['id'])) {
  $ch = curl_init('https://api.stripe.com/v1/checkout/sessions/' . $s['id'] . '/line_items?limit=50');
  curl_setopt_array($ch, array(
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => array('Authorization: Bearer ' . $stripeKey),
    CURLOPT_TIMEOUT => 20,
  ));
  $liResp = curl_exec($ch);
  curl_close($ch);
  $li = json_decode($liResp, true);
  if (isset($li['data']) && is_array($li['data'])) {
    $n = 1;
    foreach ($li['data'] as $it) {
      $fields['Article ' . $n] =
        $it['quantity'] . ' × ' . $it['description'] . '  —  ' .
        number_format($it['amount_total'] / 100, 2, ',', ' ') . ' €';
      $n++;
    }
  }
}

$fields['TOTAL'] = $total . ' €';

// Personnalisation (depuis les metadata)
$meta = isset($s['metadata']) ? $s['metadata'] : array();
$perso = array();
foreach ($meta as $k => $v) {
  if (strpos($k, 'personnalisation') === 0) $perso[] = $v;
}
if (count($perso)) $fields['Personnalisation'] = implode('  ||  ', $perso);

// Client + livraison
$cd = isset($s['customer_details']) ? $s['customer_details'] : array();
$ship = null;
if (isset($s['shipping_details']['address'])) {
  $ship = $s['shipping_details']['address'];
} elseif (isset($s['collected_information']['shipping_details']['address'])) {
  $ship = $s['collected_information']['shipping_details']['address'];
}
$shipName = isset($s['shipping_details']['name']) ? $s['shipping_details']['name'] : (isset($cd['name']) ? $cd['name'] : '');

function fmtAddress($addr, $name) {
  if (!$addr) return '—';
  $parts = array(
    $name,
    isset($addr['line1']) ? $addr['line1'] : '',
    isset($addr['line2']) ? $addr['line2'] : '',
    trim((isset($addr['postal_code']) ? $addr['postal_code'] : '') . ' ' . (isset($addr['city']) ? $addr['city'] : '')),
    isset($addr['country']) ? $addr['country'] : '',
  );
  return implode(', ', array_filter($parts, function ($x) { return $x !== '' && $x !== null; }));
}

$fields['Client'] = isset($cd['name']) ? $cd['name'] : '—';
$fields['Email client'] = isset($cd['email']) ? $cd['email'] : '—';
if (!empty($cd['phone'])) $fields['Téléphone'] = $cd['phone'];
$fields['Adresse de livraison'] = fmtAddress($ship, $shipName);

// --- Envoi de l'email au commerçant ---
// Méthode principale : fonction mail() native d'OVH (fiable, sans activation).
$fromDomain = isset($config['MAIL_FROM']) ? $config['MAIL_FROM'] : 'no-reply@coumaoo.com';
$bodyLines = array();
foreach ($fields as $k => $v) {
  if (substr($k, 0, 1) === '_') continue;
  $bodyLines[] = $k . ' : ' . $v;
}
$plainSubject = 'Commande payee Coumao ' . $ref . ' - ' . $total . ' EUR';
$headers  = 'From: Coumao <' . $fromDomain . ">\r\n";
if (!empty($cd['email'])) $headers .= 'Reply-To: ' . $cd['email'] . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$encodedSubject = '=?UTF-8?B?' . base64_encode($plainSubject) . '?=';
@mail($to, $encodedSubject, implode("\r\n", $bodyLines), $headers, '-f' . $fromDomain);

http_response_code(200);
echo 'ok';
