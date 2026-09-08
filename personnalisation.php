<?php
/* =============================================================
   COUMAO — Demande de personnalisation (formulaire de contact)
   Le client laisse ses coordonnées ; on lui enverra les couleurs
   disponibles et on prépare sa pièce sur mesure. Email au commerçant
   via Formsubmit. Aucun paiement ici.
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

$raw = file_get_contents('php://input');
$b = json_decode($raw, true);
if (!is_array($b)) $b = array();

$prenom  = trim(mb_substr(isset($b['prenom'])    ? $b['prenom']    : '', 0, 80));
$nom     = trim(mb_substr(isset($b['nom'])       ? $b['nom']       : '', 0, 80));
$phone   = trim(mb_substr(isset($b['phone'])     ? $b['phone']     : '', 0, 40));
$email   = trim(mb_substr(isset($b['email'])     ? $b['email']     : '', 0, 160));
$insta   = trim(mb_substr(isset($b['instagram']) ? $b['instagram'] : '', 0, 80));
$modele  = trim(mb_substr(isset($b['modele'])    ? $b['modele']    : '', 0, 80));
$message = trim(mb_substr(isset($b['message'])   ? $b['message']   : '', 0, 800));

if ($prenom === '' || $nom === '' || $phone === '' || $email === '') {
  http_response_code(400);
  echo json_encode(array('error' => 'Merci de remplir tous les champs obligatoires (prénom, nom, téléphone, email).'));
  exit;
}

$ref = 'PERSO-' . strtoupper(substr(md5(uniqid('', true)), 0, 6));

$mail = array(
  '_subject'  => '🎨 Demande de personnalisation ' . $ref . ' — ' . $prenom . ' ' . $nom,
  '_template' => 'table',
  'Type'      => 'Demande de personnalisation',
  'Référence' => $ref,
  'Date'      => date('d/m/Y H:i'),
  'Prénom'    => $prenom,
  'Nom'       => $nom,
  'Téléphone' => $phone,
  'Email'     => $email,
);
if ($modele !== '')  $mail['Modèle souhaité'] = $modele;
if ($insta !== '')   $mail['Instagram'] = $insta;
if ($message !== '') $mail['Message'] = $message;

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

echo json_encode(array('ok' => true, 'ref' => $ref));
