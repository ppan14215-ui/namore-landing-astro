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
    'Kostenlos mit 100 Swipes pro Person je 24 Stunden · einmaliger Kauf für beide Handys, kein Abo (deutscher Store derzeit 7,99 €, je Land unterschiedlich)',
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
