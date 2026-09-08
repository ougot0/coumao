<?php
/* =============================================================
   COUMAO — Réservation "Retrait sur place / paiement à la remise"
   Le client ne paie PAS en ligne : il réserve ses articles et
   viendra les chercher + payer sur place. On envoie un email
   récapitulatif (façon devis) au commerçant via Formsubmit.
   ============================================================= */

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Europe/Paris');

$config = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : array();
$to = isset($config['ORDER_EMAIL']) ? $config['ORDER_EMAIL'] : (getenv('ORDER_EMAIL') ? getenv('ORDER_EMAIL') : 'coumaobrand@gmail.com');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array('error' => 'Méthode non autorisée.'));
  exit;
}

// Prix en centimes (identiques au site). À garder en accord avec create-checkout.php.
$CATALOG = array(
  'coumao-summer'        => array('name' => 'Coumao Summer (solde)', 'amount' => 5000),
  'coumao-pinkie'        => array('name' => 'Coumao Pinkie (solde)', 'amount' => 5000),
  'coumao-clutch-roma'   => array('name' => 'Clutch Roma',        'amount' => 9000),
  'coumao-candy'         => array('name' => 'Coumao Candy (solde)',  'amount' => 5000),
  'coumao-ocean'         => array('name' => 'Coumao Océan (solde)',  'amount' => 5000),
  'coumao-flower'        => array('name' => 'Coumao Flower',         'amount' => 5000),
  'coumao-rainbow'       => array('name' => 'Coumao Rainbow',        'amount' => 5000),
  'coumao-havane'        => array('name' => 'Coumao Havane',         'amount' => 9000),
  'coumao-arizona'       => array('name' => 'Coumao Arizona',        'amount' => 5000),
  'coumao-casual'        => array('name' => 'Coumao Casual',         'amount' => 5000),
  'coumao-strawberry'    => array('name' => 'Coumao Strawberry',     'amount' => 5000),
  'coumao-emilio'        => array('name' => 'Coumao Emilio (solde)', 'amount' => 5000),
  'coumao-safari'        => array('name' => 'Coumao Safari',         'amount' => 9000),
  'coumao-sea'           => array('name' => 'Coumao Sea',           'amount' => 7000),
  'coumao-chocolat'      => array('name' => 'Pochette Chocolat',    'amount' => 4000),
  'anse'                 => array('name' => 'Anse (bandoulière)',   'amount' => 500),
  'charme'               => array('name' => 'Charm (bijou de sac)', 'amount' => 500),
  'clip'                 => array('name' => 'Clip (fermeture du sac)', 'amount' => 300),
);

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) $body = array();

$items = (isset($body['items']) && is_array($body['items'])) ? $body['items'] : array();
$cust  = isset($body['customer']) && is_array($body['customer']) ? $body['customer'] : array();

$name  = isset($cust['name'])  ? trim(mb_substr($cust['name'], 0, 120))  : '';
$email = isset($cust['email']) ? trim(mb_substr($cust['email'], 0, 160)) : '';
$phone = isset($cust['phone']) ? trim(mb_substr($cust['phone'], 0, 40))  : '';
$note  = isset($cust['note'])  ? trim(mb_substr($cust['note'], 0, 500))  : '';

if ($name === '' || ($email === '' && $phone === '')) {
  http_response_code(400);
  echo json_encode(array('error' => 'Merci d\'indiquer ton nom et un moyen de te contacter (email ou téléphone).'));
  exit;
}

$fields = array();
$total = 0;
$n = 0;
foreach ($items as $it) {
  $slug = isset($it['slug']) ? $it['slug'] : '';
  if (!isset($CATALOG[$slug])) continue;
  $qty = isset($it['quantity']) ? intval($it['quantity']) : 1;
  if ($qty < 1) $qty = 1;
  if ($qty > 20) $qty = 20;
  $lineAmount = $CATALOG[$slug]['amount'] * $qty;
  $total += $lineAmount;
  $n++;
  $label = $qty . ' × ' . $CATALOG[$slug]['name'] . '  —  ' . number_format($lineAmount / 100, 2, ',', ' ') . ' €';
  if (isset($it['customization']) && is_string($it['customization']) && $it['customization'] !== '') {
    $label .= '  (' . mb_substr($it['customization'], 0, 300) . ')';
  }
  $fields['Article ' . $n] = $label;
}
if (!$n) {
  http_response_code(400);
  echo json_encode(array('error' => 'Panier vide ou articles introuvables.'));
  exit;
}

$ref = 'RESA-' . strtoupper(substr(md5(uniqid('', true)), 0, 6));
$totalStr = number_format($total / 100, 2, ',', ' ') . ' €';

$mail = array(
  '_subject'   => '🏬 RÉSERVATION (retrait en main propre) ' . $ref . ' — ' . $totalStr,
  '_template'  => 'table',
  'Type'       => 'Retrait en main propre — paiement à la remise',
  'Réservation N°' => $ref,
  'Date'       => date('d/m/Y H:i'),
  'Client'     => $name,
);
if ($email !== '') $mail['Email client'] = $email;
if ($phone !== '') $mail['Téléphone'] = $phone;
foreach ($fields as $k => $v) $mail[$k] = $v;
$mail['TOTAL à régler en main propre'] = $totalStr;
if ($note !== '') $mail['Remarque du client'] = $note;

$ch = curl_init('https://formsubmit.co/ajax/' . rawurlencode($to));
curl_setopt_array($ch, array(
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => array('Content-Type: application/json', 'Accept: application/json'),
  CURLOPT_POSTFIELDS => json_encode($mail),
  CURLOPT_TIMEOUT => 20,
));
curl_exec($ch);
curl_close($ch);

echo json_encode(array('ok' => true, 'ref' => $ref, 'total' => $totalStr));
