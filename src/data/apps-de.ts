/**
 * apps-de.ts — competitor facts for the German cluster.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️  THE RULE, AFTER AN INDEPENDENT REVIEW KILLED THE FIRST VERSION
 *     (2026-08-19, verdict "DO NOT PUBLISH", ten blockers):
 *
 *     NOTHING GOES IN THIS FILE THAT WAS NOT READ DIRECTLY FROM THE PRIMARY
 *     SOURCE BY THE PERSON ADDING IT. Not from a research summary, not from
 *     the vendor's marketing site when a store listing exists, not from a
 *     previous version of this file.
 *
 *     Every field below carries `q` (the literal transcription) and `src`
 *     (the URL it was read from). If you cannot fill both, the field is
 *     `null` and the page prints "keine Angabe im Store-Eintrag".
 *
 *     WHY SO STRICT: §4 Nr. 2 UWG reverses the burden of proof for factual
 *     statements about a competitor — we must be able to PROVE each one, and
 *     an unprovable statement counts as unlawful. §6 UWG additionally
 *     requires compared characteristics to be objectively VERIFIABLE. A
 *     dated literal quote with a link satisfies both. A paraphrase does not.
 *
 *     WHAT THE FIRST VERSION GOT WRONG — all four were avoidable by opening
 *     the listing:
 *       ✗ "Unser Baby Name kostet ebenfalls 7,99 € einmalig" — the German
 *         App Store shows "Full Version 8,99 €". 7,99 € was taken from the
 *         vendor's own website. A whole page was built on the false premise.
 *       ✗ "Kinder … ohne Werbung" — the listing says "Enthält Werbung".
 *       ✗ "CharliesNames … Beliebtheitsdaten für sechzehn Länder" — the
 *         listing says "Internationale Namen aus über 40 Ländern".
 *       ✗ Three sentences were printed inside quotation marks and attributed
 *         to competitors that DO NOT APPEAR in any of their sources. The
 *         worst was Mini Marvin's "Niemand sieht, wie der andere abstimmt",
 *         which was even flagged in the page as verbatim. Its site actually
 *         says "Jeder swipet unabhängig durch die Namen, und die App zeigt
 *         automatisch eure gemeinsamen Favoriten."
 *         Attributing an invented sentence to a named competitor is the most
 *         legally exposed thing this cluster could do. Never again.
 *
 * ⚠️  CONSEQUENCE FOR POSITIONING — read before writing any page:
 *     NO GERMAN COMPETITOR STATES ANYWHERE THAT PARTNER VOTES STAY HIDDEN.
 *     Several describe independent swiping and mutual-match display, which
 *     is similar observable behaviour without the privacy claim. So we may:
 *       ✓ describe precisely what Namore does
 *       ✓ quote what each listing says, dated and linked
 *     and we may NOT:
 *       ✗ say Namore is the only app with hidden voting
 *       ✗ say any competitor SHOWS partner votes (not established for any)
 *       ✗ characterise a competitor's internal behaviour at all
 *
 *     Kinder's listing does mention a rejected-names view ("Likes, Abgelehnt
 *     und Matches") and CharliesNames mentions shared favourites — quote
 *     those and stop; do not build an argument on top of them.
 *
 * ⚠️  NO SUPERLATIVES ABOUT COMPETITORS. The first version said CharliesNames
 *     is "am schwächsten" at something and Kinder's interface "zeigt ihr
 *     Alter". Unsourced value judgements about a named competitor are the
 *     §4 Nr. 1 UWG (Herabsetzung) surface. Say what Namore does instead.
 *
 *     All entries transcribed 2026-08-19 from the German storefront.
 * ══════════════════════════════════════════════════════════════════════════
 */

export const VERIFIED = '19. August 2026';

/** A single sourced fact: literal transcription + where it was read. */
export type Sourced = {
  q: string;
  /** Further literal lines from the same source. */
  q2?: string; q3?: string; q4?: string; q5?: string;
  /**
   * true = several separate lines from the listing, shown as a list rather
   * than as one quotation. The store prints ten separate in-app-purchase rows;
   * merging them into one sentence inside quotation marks — as the first
   * version did — is a paraphrase presented as a quote.
   */
  compiled?: boolean;
  /** Where in the source it sits, when that is not the description. */
  note?: string;
  src: string;
} | null;

export type App = {
  slug: string;
  name: string;
  vendor: string;
  src: string;
  rating: Sourced;
  price: Sourced;
  names: Sourced;
  partner: Sourced;
  account: Sourced;
  ads: Sourced;
  ai: Sourced;
  updated: string;
  /** Neutral, non-evaluative one-liner for the overview table. */
  note: string;
};

const APPLE = (id: string, slug: string) => `https://apps.apple.com/de/app/${slug}/id${id}`;

export const APPS: App[] = [
  {
    slug: 'charliesnames',
    name: 'CharliesNames',
    vendor: 'CharliesNames UG (haftungsbeschränkt)',
    src: APPLE('990425943', 'charliesnames'),
    rating: { q: '4,0 von 5 · 468 Bewertungen', src: APPLE('990425943', 'charliesnames') },
    price: { q: 'CN1 1,99 €', q2: 'CN2 2,99 €', q3: 'CN5 5,99 €', q4: 'CN15 14,99 €', compiled: true, src: APPLE('990425943', 'charliesnames') },
    names: { q: 'Über 15.000 Vornamen inklusive Herkunft und Bedeutung', src: APPLE('990425943', 'charliesnames') },
    partner: { q: '… Partner-Matching – ihr seht sofort eure gemeinsamen Favoriten', src: APPLE('990425943', 'charliesnames') },
    account: null,
    ads: { q: 'Ohne Werbung', src: APPLE('990425943', 'charliesnames') },
    ai: { q: 'Meine KI lernt deinen Geschmack kennen und so schlage ich dir genau die Namen vor, die zu dir passen.', src: APPLE('990425943', 'charliesnames') },
    updated: '8. März (Version 2.0.59)',
    note: 'Internationale Namen aus über 40 Ländern, werbefrei',
  },
  {
    slug: 'kinder',
    name: 'Kinder – Find Baby Names',
    vendor: 'Krijn Haasnoot',
    src: APPLE('1068421785', 'kinder-find-baby-names'),
    rating: { q: '4,3 von 5 · 381 Bewertungen', src: APPLE('1068421785', 'kinder-find-baby-names') },
    price: { q: 'All Sets 5,99 €', q2: 'German 0,99 €', q3: 'French 0,99 €', q4: 'Spanish 0,99 € (und weitere Sprach-Sets zu je 0,99 €)', compiled: true, src: APPLE('1068421785', 'kinder-find-baby-names') },
    names: { q: '20.000+ sorgfältig kuratierte Babynamen', src: APPLE('1068421785', 'kinder-find-baby-names') },
    partner: { q: 'Partner-Verbindung — Käufe werden geteilt, wenn ihr verbunden seid', src: APPLE('1068421785', 'kinder-find-baby-names') },
    account: { q: 'Mit E-Mail anmelden — Du kannst jetzt ein Konto erstellen oder dich mit deiner E-Mail-Adresse anmelden, zusätzlich zu Apple und Google.', note: 'aus den Versionshinweisen zu Version 2.0.8 vom 10. April', src: APPLE('1068421785', 'kinder-find-baby-names') },
    ads: { q: 'Enthält Werbung', src: APPLE('1068421785', 'kinder-find-baby-names') },
    ai: null,
    updated: '16. Juli (Version 2.0.16)',
    note: 'Sprach-Sets einzeln kaufbar, Käufe gelten für beide Partner',
  },
  {
    slug: 'unser-baby-name',
    name: 'Unser Baby Name',
    vendor: 'Linkinet',
    src: APPLE('918073224', 'unser-baby-name-vornamensuche'),
    rating: { q: '4,0 von 5 · 76 Bewertungen', src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    price: { q: 'Full Version 8,99 €', q2: 'Unlock all features 1,99 €', q3: 'Monthly: $1.49', compiled: true, src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    names: { q: 'Mehr als 30 000 Jungen- und Mädchenvornamen aller Herkunft', src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    partner: { q: 'Beide Elternteile installieren die App und verbinden ihre Accounts', src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    account: { q: 'Beide Elternteile installieren die App und verbinden ihre Accounts', src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    ads: { q: 'Enthält Werbung', q2: 'Entferne die Werbung', compiled: true, src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    ai: { q: 'KI-Namensassistent: Chatte mit der KI für personalisierte Namensvorschläge', src: APPLE('918073224', 'unser-baby-name-vornamensuche') },
    updated: '1. Juli (Version 4.1.0)',
    note: 'International als „Baby Name Together“ dieselbe App, gleiche App-ID',
  },
  {
    slug: 'mini-marvin',
    name: 'Mini Marvin',
    vendor: '',
    src: 'https://mini-marvin.com/de/',
    rating: null,
    price: { q: 'Kostenlos 0 €', q2: 'Für Paare 6,99 € einmalig', q3: 'Familie & Freunde 12,99 € einmalig', compiled: true, src: 'https://mini-marvin.com/de/preise' },
    names: { q: '10.000+ Babynamen', src: 'https://mini-marvin.com/de/' },
    partner: { q: 'Jeder swipet unabhängig durch die Namen, und die App zeigt automatisch eure gemeinsamen Favoriten.', src: 'https://mini-marvin.com/de/' },
    account: { q: 'Registriere dich kostenlos und speichere die App direkt auf deinem Homescreen.', src: 'https://mini-marvin.com/de/' },
    ads: { q: '500 Swipes pro Tag inklusive', q2: 'Mit Werbung', q3: 'max. 1 Partner einladen', compiled: true, src: 'https://mini-marvin.com/de/preise' },
    ai: null,
    updated: 'Web-Anwendung, keine Store-Version',
    note: 'Läuft im Browser, keine Installation nötig',
  },
  {
    slug: 'babyname',
    name: 'BabyName – find it together',
    vendor: 'Do Something Good LLC',
    src: APPLE('950562312', 'babyname-find-it-together'),
    rating: { q: '3,4 von 5 · 87 Bewertungen (deutscher Store)', src: APPLE('950562312', 'babyname-find-it-together') },
    price: { q: 'Traum Eltern 8,99 €', q2: 'Coole Eltern 7,99 €', q3: 'Gute Eltern 5,99 €', q4: 'Buy all filters 2,99 €', q5: 'No Ads 0,99 €', compiled: true, src: APPLE('950562312', 'babyname-find-it-together') },
    names: { q: 'über 30.000 einzigartige Namen', src: APPLE('950562312', 'babyname-find-it-together') },
    partner: { q: 'Wenn beide Partner die App installiert haben, könnt ihr eure Handys über einen Link oder per AirDrop verbinden – und los geht’s mit eurer ganz persönlichen, streitfreien Liste.', src: APPLE('950562312', 'babyname-find-it-together') },
    account: null,
    ads: { q: 'Enthält Werbung', src: APPLE('950562312', 'babyname-find-it-together') },
    ai: null,
    updated: '16. Apr. (Version 3.4.5) · © 2014-2025 Do Something Good LLC',
    note: 'Kopplung per Link oder AirDrop, ohne Registrierung',
  },
];

export const byslug = (s: string): App => {
  const a = APPS.find((x) => x.slug === s);
  if (!a) throw new Error(`apps-de: unknown slug "${s}"`);
  return a;
};

/** What a page prints when a listing simply does not address something. */
export const NO_STATEMENT = 'Keine Angabe im Store-Eintrag';

export const APP_STORE = (c: string) =>
  `https://apps.apple.com/app/id6766572995?utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
export const PLAY = (c: string) =>
  `https://play.google.com/store/apps/details?id=com.julian.namore&utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
