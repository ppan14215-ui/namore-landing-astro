/**
 * namore-cells — the one place the overview and head-to-head tables get their
 * Namore column from. These are statements about OUR OWN product (permissible
 * without a source link; §4 Nr. 2 UWG bites on statements about competitors).
 * Wording matches the copy the pre-publication reviews already approved on
 * the family pages. Change it here, every table changes.
 *
 * Do NOT add comparative or superlative phrasing here ("mehr als", "einzige",
 * "moderner als") — these cells sit directly next to competitor cells, which
 * is exactly where §6 UWG scrutiny lands.
 */

export type CellKey = 'price' | 'names' | 'partner' | 'account' | 'ads' | 'ai';

export const NAMORE_DE: Record<CellKey, string> = {
  price:
    'Kostenlos mit 100 Swipes pro Person je 24 Stunden · einmaliger Kauf für beide Handys, kein Abo (deutscher Store derzeit 9,99 €, je Land unterschiedlich)',
  names:
    '15.182 Namen mit Bedeutung, Herkunft und Aussprache, Inhalte auf Deutsch, Englisch und Spanisch',
  partner:
    'Beide wischen getrennt; ein Name erscheint erst als Treffer, wenn beide unabhängig Ja gesagt haben. Danach folgt die Endrunde.',
  account: 'Kein Konto, keine E-Mail nötig',
  ads: 'Keine Werbung, auch nicht im Gratistarif',
  ai: 'KI-Einordnung zum Match; die Vorschläge lernen aus dem Wischen von euch beiden',
};

export const LABELS_DE: Record<CellKey, string> = {
  price: 'Preisangabe',
  names: 'Namen',
  partner: 'Zusammen entscheiden',
  account: 'Konto',
  ads: 'Werbung',
  ai: 'KI',
};

export const NAMORE_EN: Record<CellKey, string> = {
  price:
    'Free with 100 swipes per partner per rolling 24 hours · a single one-time purchase covers both phones, no subscription, priced per country in your app store',
  names:
    '15,182 names with meaning, origin and pronunciation, content in English, German and Spanish',
  partner:
    'You swipe separately; a name only appears as a match once you have both said yes independently. A final round follows.',
  account: 'No account, no e-mail required',
  ads: 'No ads, not even on the free tier',
  ai: 'AI insight on a match; suggestions learn from how you both swipe',
};

export const LABELS_EN: Record<CellKey, string> = {
  price: 'Pricing shown',
  names: 'Names',
  partner: 'Deciding together',
  account: 'Account',
  ads: 'Ads',
  ai: 'AI',
};

/**
 * French cluster (2026-09-27). Two extra columns exist only here: `after`
 * (what happens after a mutual like) and `add` (suggesting your own names),
 * because in the French stores those are the points where listings actually
 * differ. Same rule as above: our own product, no comparative phrasing.
 * ⚠️ `names` says the content is written in French: true only once the French
 * name data is complete. The cluster stays noindex until then (fr-live.ts).
 */
export type CellKeyFr = CellKey | 'after' | 'add';

export const NAMORE_FR: Record<CellKeyFr, string> = {
  price:
    'Gratuit avec 100 swipes par personne toutes les 24 heures · achat unique pour les deux téléphones, sans abonnement (prix fixé par pays, affiché par l’App Store ou Google Play)',
  names:
    '15 182 prénoms avec signification, origine et prononciation, contenus en français, anglais, allemand et espagnol',
  partner:
    'Chacun swipe de son côté ; un prénom n’apparaît en match que lorsque vous avez dit oui tous les deux, indépendamment.',
  account: 'Aucun compte obligatoire : un code à six caractères suffit',
  ads: 'Pas de publicité, même en version gratuite',
  ai: 'Éclairage par IA sur un match ; les suggestions apprennent de vos swipes à tous les deux',
  after:
    'Le dernier tour : chacun note vos matchs de 1 à 5 en privé, puis les deux classements s’affichent côte à côte',
  add: 'Vos propres prénoms apparaissent tôt dans la pile de l’autre, sans montrer qui les a ajoutés ; 3 par jour en gratuit',
};

export const LABELS_FR: Record<CellKeyFr, string> = {
  price: 'Prix indiqué',
  names: 'Prénoms',
  partner: 'Choisir à deux',
  account: 'Compte',
  ads: 'Publicité',
  ai: 'IA',
  after: 'Après le match',
  add: 'Proposer ses prénoms',
};
