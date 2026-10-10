<?php
/* =============================================================
   COUMAO — Prix côté serveur
   Lit contenu/catalogue.js (le même fichier que le site) pour que
   le prix encaissé soit toujours le prix affiché.
   ============================================================= */

/** @return array<string, array{name: string, amount: int}> slug => nom et prix en centimes */
function coumao_catalogue() {
  $text = @file_get_contents(__DIR__ . '/contenu/catalogue.js');
  if ($text === false || !preg_match('/=\s*(\{.*\})\s*;?\s*$/s', $text, $m)) {
    return array();
  }
  $data = json_decode($m[1], true);
  if (!is_array($data) || !isset($data['produits']) || !is_array($data['produits'])) {
    return array();
  }
  $out = array();
  foreach ($data['produits'] as $p) {
    if (!is_array($p) || empty($p['slug']) || (isset($p['disponible']) && $p['disponible'] === false)) continue;
    $amount = coumao_centimes(isset($p['price']) ? $p['price'] : '');
    if ($amount === null) continue; // pas de prix : pas d'achat en ligne
    // Nom lisible sur le reçu Stripe (sans émoji), avec « (solde) » si le produit est soldé.
    $name = trim(preg_replace('/[^\p{L}\p{N}\s\'’().,&\-]/u', '', isset($p['name']) ? $p['name'] : $p['slug']));
    if (!empty($p['solde'])) $name .= ' (solde)';
    $out[$p['slug']] = array('name' => $name !== '' ? $name : $p['slug'], 'amount' => $amount);
  }
  return $out;
}

/** "49 €", "49,90 €", "49.9" → 4900, 4990, 4990 ; null si illisible. */
function coumao_centimes($price) {
  if (is_int($price) || is_float($price)) return (int) round($price * 100);
  $c = preg_replace('/[^\d,.]/', '', (string) $price);
  if ($c === '') return null;
  $c = str_replace(',', '.', $c);
  if (!is_numeric($c)) return null;
  $n = (int) round(((float) $c) * 100);
  return $n > 0 ? $n : null;
}
