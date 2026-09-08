<?php
/* =============================================================
   COUMAO — Informations de livraison (après paiement)
   Le client est redirigé ici après avoir payé. Il remplit son
   adresse + code immeuble / étage / interphone. On envoie un mail
   au commerçant avec le NUMÉRO DE COMMANDE + les articles + la
   livraison, réunis. Envoi par mail() natif OVH (fiable).
   ============================================================= */

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Europe/Paris');

$config = file_exists(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : array();
$to = isset($config['ORDER_EMAIL']) ? $config['ORDER_EMAIL'] : (getenv('ORDER_EMAIL') ? getenv('ORDER_EMAIL') : 'coumaobrand@gmail.com');
$fromDomain = isset($config['MAIL_FROM']) ? $config['MAIL_FROM'] : 'no-reply@coumaoo.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array('error' => 'Méthode non autorisée.'));
  exit;
}

$raw = file_get_contents('php://input');
$b = json_decode($raw, true);
if (!is_array($b)) $b = array();

function champ($b, $k, $max) { return isset($b[$k]) ? trim(mb_substr($b[$k], 0, $max)) : ''; }

$order        = champ($b, 'orderNumber', 40);
$prenom       = champ($b, 'prenom', 80);
$nom          = champ($b, 'nom', 80);
$phone        = champ($b, 'phone', 40);
$email        = champ($b, 'email', 160);
$adresse      = champ($b, 'adresse', 200);
$cp           = champ($b, 'cp', 20);
$ville        = champ($b, 'ville', 100);
$acces        = champ($b, 'acces', 120);
$etage        = champ($b, 'etage', 60);
$interphone   = champ($b, 'interphone', 80);
$instructions = champ($b, 'instructions', 600);
$itemsText    = champ($b, 'itemsText', 1500);

if ($nom === '' || $adresse === '' || $cp === '' || $ville === '') {
  http_response_code(400);
  echo json_encode(array('error' => 'Merci de remplir au moins ton nom et ton adresse complète (rue, code postal, ville).'));
  exit;
}

$lines = array();
$lines[] = 'NUMÉRO DE COMMANDE : ' . ($order !== '' ? $order : '(non transmis)');
$lines[] = 'Date : ' . date('d/m/Y H:i');
$lines[] = '';
if ($itemsText !== '') {
  $lines[] = 'Articles commandés :';
  $lines[] = $itemsText;
  $lines[] = '';
}
$lines[] = 'Client : ' . trim($prenom . ' ' . $nom);
if ($phone !== '') $lines[] = 'Téléphone : ' . $phone;
if ($email !== '') $lines[] = 'Email : ' . $email;
$lines[] = '';
$lines[] = 'ADRESSE DE LIVRAISON :';
$lines[] = $adresse;
$lines[] = trim($cp . ' ' . $ville);
if ($acces !== '')      $lines[] = 'Code immeuble : ' . $acces;
if ($etage !== '')      $lines[] = 'Étage : ' . $etage;
if ($interphone !== '') $lines[] = 'Interphone : ' . $interphone;
if ($instructions !== '') {
  $lines[] = '';
  $lines[] = 'Instructions pour le livreur : ' . $instructions;
}

$subject = 'LIVRAISON commande ' . ($order !== '' ? $order : '') . ' — ' . trim($prenom . ' ' . $nom);
$headers  = 'From: Coumao <' . $fromDomain . ">\r\n";
if ($email !== '') $headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
@mail($to, $encodedSubject, implode("\r\n", $lines), $headers, '-f' . $fromDomain);

echo json_encode(array('ok' => true));
