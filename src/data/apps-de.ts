/**
 * apps-de.ts — verified competitor facts for the German comparison cluster.
 *
 * ⚠️ THIS IS THE ONLY PLACE THESE NUMBERS MAY LIVE. Every /de/blog/* page
 * imports from here. Never hardcode a rating, price or name count into a
 * page — if a fact changes we must be able to fix it in one edit, and a
 * comparison cluster that contradicts itself across pages is worse than no
 * cluster at all.
 *
 * SOURCES: German App Store (apps.apple.com/de/), Google Play at hl=de&gl=DE,
 * and each vendor's own site. Verified 2026-08-19 by research pass.
 *
 * ══════════════════════════════════════════════════════════════════════
 * CLAIMS THAT ARE NOW FORBIDDEN — each was tested and is FALSE:
 *
 * ✗ "Die einzige App mit verdeckten Stimmen" / only double-blind app.
 *   Mini Marvin (Dresden, web) states it explicitly:
 *   "Niemand sieht, wie der andere abstimmt, also bleibt jede Bewertung
 *   ehrlich und unvoreingenommen." We are NOT alone. Never imply it.
 *
 * ✗ "Nur CharliesNames nutzt KI." Three do: CharliesNames (learns taste),
 *   Unser Baby Name (chat assistant), NameHatch (EN only).
 *
 * ✗ "Die anderen zeigen dir die Stimmen deines Partners." Only established
 *   for CharliesNames. For Kinder, BabyName and Unser Baby Name it is
 *   UNVERIFIED — which is not the same as "no". Do not generalise.
 *
 * ✗ "Der einzige Einmalpreis." Unser Baby Name also sells a 7,99 €
 *   one-time PRO unlock — an exact price collision. Mini Marvin sells
 *   12,99 € lifetime. Kinder sells name sets outright.
 *
 * ✗ Treating "Baby Name Together" and "Unser Baby Name" as two apps.
 *   They are ONE product by Linkinet — same iOS id 918073224, same Android
 *   package com.BabyName.start. Listing both would be a factual error a
 *   competitor could complain about.
 *
 * ══════════════════════════════════════════════════════════════════════
 * WHAT NAMORE MAY HONESTLY CLAIM AS DISTINCT:
 *   1. The decision round AFTER the match — no competitor found claims a
 *      post-match ranking stage. This is the strongest genuinely unique one.
 *   2. No account at all (6-letter code). Unser Baby Name and Mini Marvin
 *      both confirmedly require registration.
 *   3. No ads on the free tier. Mini Marvin's free tier carries ads.
 *   4. Double-blind voting in a NATIVE app on both platforms — Mini Marvin
 *      has the mechanic but is web-only.
 *   5. Stated EU hosting. Rare to see stated at all.
 */

export const VERIFIED = '19. August 2026';

export type App = {
  slug: string;
  name: string;
  vendor: string;
  /** Short label for the comparison table. */
  bestFor: string;
  standout: string;
  ios: string;
  android: string;
  price: string;
  account: string;
  names: string;
  /** 'ja' | 'nein' | 'nicht belegt' — never guess. */
  doubleBlind: string;
  ai: string;
  platform: string;
};

export const NAMORE: App = {
  slug: 'namore',
  name: 'Namore',
  vendor: 'Julian Ziegler, Fürth',
  bestFor: 'Paare, die sich gegenseitig die Namen kaputtreden',
  standout: 'Verdeckte Stimmen, Endrunde nach dem Match, kein Konto',
  ios: 'iPhone, seit Mai 2026',
  android: 'Google Play, seit August 2026',
  price: 'Kostenlos, 100 Swipes pro Person je 24 Stunden, keine Werbung · 7,99 € einmalig für beide Handys',
  account: 'Keins — sechsstelliger Code',
  names: '15.182',
  doubleBlind: 'ja',
  ai: 'Keine KI-Werbung; der Deck lernt aus euren eigenen Likes',
  platform: 'iOS + Android',
};

export const APPS: App[] = [
  {
    slug: 'charliesnames',
    name: 'CharliesNames',
    vendor: 'CharliesNames UG, Dachau',
    bestFor: 'Wer richtig über Namen lesen will',
    standout: 'Über 1 Mio. Installationen, echte Namensdatenbank im Web',
    ios: '4,0 · 468 Bewertungen',
    android: '4,3 · 3.950 Bewertungen · 1 Mio.+',
    price: 'Kostenlos mit In-App-Käufen von 1,99 € bis 14,99 €',
    account: 'Nicht belegt',
    names: 'über 15.000',
    doubleBlind: 'nein — die Daumen-runter-Liste sammelt Namen, die mindestens einem von euch nicht gefallen',
    ai: 'Ja: „Meine KI lernt deinen Geschmack kennen“',
    platform: 'iOS + Android',
  },
  {
    slug: 'kinder',
    name: 'Kinder – Find Baby Names',
    vendor: 'Krijn Haasnoot',
    bestFor: 'Den bekanntesten Wisch-Klassiker',
    standout: 'Hat das Prinzip populär gemacht, 23 Oberflächensprachen',
    ios: '4,3 · 381 Bewertungen',
    android: '3,7 · 3.180 Bewertungen · 500.000+',
    price: 'Kostenlos; Namenspakete ab 0,99 €, alle Pakete 5,99 €',
    account: 'Optionaler E-Mail-Login zur Sicherung',
    names: '20.000+ laut App Store, über 18.000 laut Google Play',
    doubleBlind: 'nicht belegt',
    ai: 'Keine KI-Werbung',
    platform: 'iOS + Android',
  },
  {
    slug: 'unser-baby-name',
    name: 'Unser Baby Name',
    vendor: 'Linkinet — international als „Baby Name Together“',
    bestFor: 'Die Frage, wie häufig ein Name wirklich wird',
    standout: 'Amtliche Namensstatistiken aus über 40 Ländern',
    ios: '4,0 · 76 Bewertungen',
    android: '3,9 · 6.840 Bewertungen · 1 Mio.+',
    price: '7,99 € einmalig oder 2,99 € im Monat',
    account: 'Ja — beide verknüpfen ihre Konten über die E-Mail-Adresse',
    names: 'mehr als 30.000',
    doubleBlind: 'nicht belegt — die App zeigt nur gemeinsame Treffer, sagt aber nirgends, dass Stimmen verdeckt bleiben',
    ai: 'Ja, als Chat-Assistent: „Chatte mit unserem KI-gestützten Namensassistenten“',
    platform: 'iOS + Android',
  },
  {
    slug: 'mini-marvin',
    name: 'Mini Marvin',
    vendor: 'Aus Dresden',
    bestFor: 'Wer nichts installieren will',
    standout: 'Verdeckte Stimmen im Browser, Matching auch mit Großeltern',
    ios: 'Keine App — läuft im Browser',
    android: 'Keine App — läuft im Browser',
    price: 'Kostenlos mit Werbung, 500 Swipes am Tag · 6,99 € für 3 Monate · 12,99 € einmalig auf Dauer',
    account: 'Ja — kostenlose Registrierung',
    names: '10.000+',
    doubleBlind: 'ja — „Niemand sieht, wie der andere abstimmt“',
    ai: 'Keine KI-Werbung',
    platform: 'Web',
  },
  {
    slug: 'babyname',
    name: 'BabyName – find it together',
    vendor: 'Do Something Good LLC',
    bestFor: 'Die längste Historie im Wisch-Matching',
    standout: 'Liefert das Prinzip seit Dezember 2014 aus',
    ios: '3,4 · 87 Bewertungen',
    android: 'Keine deutsche Play-Version gefunden',
    price: 'Kostenlos mit In-App-Käufen von 0,99 € bis 8,99 €',
    account: 'Nicht belegt',
    names: 'über 30.000',
    doubleBlind: 'nicht belegt',
    ai: 'Keine KI-Werbung',
    platform: 'iOS',
  },
];

export const byslug = (s: string): App => {
  const a = APPS.find((x) => x.slug === s);
  if (!a) throw new Error(`apps-de: unknown slug "${s}"`);
  return a;
};

export const APP_STORE = (c: string) =>
  `https://apps.apple.com/app/id6766572995?utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
export const PLAY = (c: string) =>
  `https://play.google.com/store/apps/details?id=com.julian.namore&utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
