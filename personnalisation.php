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

// --- Envoi de l'email au commerçant ---
// Méthode principale : fonction mail() native d'OVH (fiable, sans activation).
$fromDomain = isset($config['MAIL_FROM']) ? $config['MAIL_FROM'] : 'no-reply@coumaoo.com';
$bodyLines = array();
foreach ($mail as $k => $v) {
  if (substr($k, 0, 1) === '_') continue;
  $bodyLines[] = $k . ' : ' . $v;
}
$plainSubject = 'Demande de personnalisation ' . $ref . ' - ' . $prenom . ' ' . $nom;
$headers  = 'From: Coumao <' . $fromDomain . ">\r\n";
if ($email !== '') $headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$encodedSubject = '=?UTF-8?B?' . base64_encode($plainSubject) . '?=';
@mail($to, $encodedSubject, implode("\r\n", $bodyLines), $headers, '-f' . $fromDomain);

echo json_encode(array('ok' => true, 'ref' => $ref));
