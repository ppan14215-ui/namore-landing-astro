/**
 * namore-features.ts — the VERIFIED capability set, in DE / EN / ES.
 *
 * ⚠️ ONE SOURCE FOR EVERY CLUSTER PAGE IN EVERY LANGUAGE. Never restate a
 * capability inline in a page. Twenty-one pages that each phrase the feature
 * set slightly differently is how a comparison cluster starts contradicting
 * itself, and a competitor only has to find one gap.
 *
 * Every entry below carries `proof` — how it was established on 2026-08-19.
 * If an entry has no proof it does not belong in this file.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * HOW THIS WAS VERIFIED (Julian's push-back 2026-08-19 that the pages were
 * underselling the product — he was right about most of it):
 *
 * DATABASE (Supabase `names`, n = 15,182, counted not sampled):
 *   meaning EN/DE/ES ........ 15,182 / 15,182   ✅ complete
 *   meaning NL .............. 11,182            ⛔ LEGACY DATA — NOT A SHIPPED LANGUAGE
 *   longevity_read EN/DE/ES . 15,182            ✅ complete
 *   trend_context EN/DE/ES .. 15,182            ✅ complete, written prose
 *   trend_label ............. 15,182            ✅
 *   country_ranks ........... 15,182            ✅ real positions per country
 *   pronunciation ........... 15,182            ✅
 *   style_tags / vibe_tags .. 15,182            ✅
 *   syllable_count .......... 15,182            ✅
 *   nicknames ...............  8,578            ⚠️ 56.5% — NEVER "every name"
 *   popularity_history ......      0            ❌ EMPTY
 *   peak_decade .............      0            ❌ EMPTY
 *   births_last_year ........      0            ❌ EMPTY
 *
 * ❌ THE THREE EMPTY COLUMNS MATTER: the App Store description promises
 *    "Real population trend, 1970 to 2025". There is NO time series in the
 *    database. What exists is per-country rank positions plus a written trend
 *    read — strong, but a different claim. Do not repeat the store's wording
 *    anywhere in this cluster.
 *
 * FEATURES (from the code-derived event inventory in the vault's CURRENT.md,
 * i.e. events the app actually emits — not from a marketing page):
 *   ai_insight_viewed · name_added · name_searched · name_shared ·
 *   filter_applied · filter_result_count · filter_zero_results ·
 *   filtered_deck_edit_filters · filtered_deck_exhausted ·
 *   filtered_deck_reset_filters · shortlist_viewed · shortlist_name_voted ·
 *   reveal_opened · super_like_attempted · match_occurred · like_curated
 *
 * ⚠️ shortlist_viewed has 7 hits all-time and shortlist_name_voted last fired
 *    2026-06-19. The feature EXISTS and may be described; but it is a product
 *    finding that nobody can find it, not a marketing strength.
 *
 * TASTE LEARNING — measured, after an earlier note wrongly suppressed it:
 *    216 sessions with votes · 114 span multiple days · max 17,260 votes in
 *    one session · longest span 95 days. `buildDeckContext` reads every love
 *    and pass for the session out of Postgres (paginated to 20k since the
 *    #117 fix). A "session" is the couple's whole naming journey, not one
 *    app-open, so the signal genuinely accumulates over months.
 *    ⚠️ But FOUR competitors advertise taste-learning too (Nameberry, Baby
 *    Name Genius, BabyCenter, CharliesNames — all quoted verbatim in
 *    apps-de.ts). Never claim a better AI. Claim only the COMBINATION:
 *    learns from both partners while neither sees the other's votes.
 *
 * ⛔ DUTCH IS NOT A SUPPORTED LANGUAGE. The catalogue holds 11,182 Dutch
 *    meanings, and that is legacy data only. The app UI and both store listings
 *    ship EN/DE/ES. The vault says so repeatedly and has since July 2026:
 *    "Dutch remains a separate legacy/data language and is not part of the
 *    current store-localization launch", "Dutch was intentionally untouched",
 *    "Dutch remains out of scope", "Dutch is untouched".
 *    A populated database column is NOT a shipped language. This mistake was
 *    made on 2026-08-19 — llms.txt and the English article had both been
 *    telling readers (and assistants) that Dutch was supported. Corrected.
 *    Do NOT plan Dutch pages and do NOT list Dutch among the languages.
 *
 * NOT VERIFIED — do not put these in a page until someone reads the code:
 *    "similar names", partner-sync stability, "more filters than anyone else".
 *    The baby-name-app repo mount went empty mid-session 2026-08-19.
 * ══════════════════════════════════════════════════════════════════════════
 */

export type Lang = 'de' | 'en' | 'es';

/** Language-neutral counted facts. Numbers live here and nowhere else. */
export const FACTS = {
  names: 15182,
  namesWithNicknames: 8578,
  nicknamePct: 56,
  namesNl: 11182,
  freeSwipes: 100,
  cycleHours: 24,
  /** ⚠️ German storefront only, and currently ambiguous — see the privacy-price proof. */
  priceEurDe: '7,99',
  priceEurEn: '€7.99',
  maxSessionVotes: 17260,
  maxSessionDays: 95,
} as const;

type Feature = {
  key: string;
  /** How this was established. Shown to nobody; kept so it can be re-checked. */
  proof: string;
  /** true = we have found no competitor claiming it. Used sparingly. */
  distinct?: boolean;
  de: { title: string; body: string };
  en: { title: string; body: string };
  es: { title: string; body: string };
};

export const FEATURES: Feature[] = [
  {
    key: 'decision-round',
    proof: 'shortlist_viewed + shortlist_name_voted emitted by the app. EN research 2026-08-19 found no competitor with a post-match round BETWEEN THE TWO PARTNERS (Baby Name Genius and Baby Name Together have polls with friends/family — hence the careful wording).',
    distinct: true,
    de: {
      title: 'Es hört nicht beim Match auf',
      body: 'Zwölf gemeinsame Treffer sind keine Entscheidung. In der Endrunde bewertet ihr die gemeinsamen Treffer noch einmal getrennt, und daraus entsteht eine Reihenfolge statt einer Liste. Genau da bleiben Paare sonst stecken. Eine vergleichbare Stufe zwischen den beiden Partnern haben wir bei den hier verglichenen Apps nicht gefunden — mehrere bieten an, die Trefferliste gemeinsam weiter einzugrenzen oder Freunde und Familie abstimmen zu lassen.',
    },
    en: {
      title: 'It does not stop at the match',
      body: 'Twelve mutual matches are not a decision. In the final round you each rate the mutual matches again, separately, and what comes out is an order rather than a list. That is where couples usually get stuck. We did not find a comparable stage between the two partners in the apps compared here — several do offer to narrow the match list together, or to let friends and family vote.',
    },
    es: {
      title: 'No termina en el match',
      body: 'Doce coincidencias no son una decisión. En la ronda final volvéis a puntuar por separado los nombres coincidentes, y lo que sale es un orden en lugar de una lista. Ahí es donde las parejas se atascan. No hemos encontrado una fase comparable entre los dos miembros de la pareja en las apps comparadas aquí.',
    },
  },
  {
    key: 'no-account',
    proof: 'Six-letter session code; no signup path in the app. Unser Baby Name requires e-mail account linking, Mini Marvin requires registration — both verified from their own listings.',
    de: {
      title: 'Kein Konto, keine E-Mail',
      body: 'Einer startet eine Sitzung, der andere tritt mit einem Code aus sechs Buchstaben bei. Das klingt nach einer Kleinigkeit und ist im Alltag oft die Stelle, an der einer von beiden aussteigt: Wer sich erst registrieren muss, macht es abends auf dem Sofa vielleicht nicht mehr.',
    },
    en: {
      title: 'No account, no e-mail',
      body: 'One of you opens a session, the other joins with a six-letter code. It sounds minor and it is usually the point where one partner quietly drops out — someone who has to register first often does not bother on the sofa at night.',
    },
    es: {
      title: 'Sin cuenta y sin correo',
      body: 'Uno abre una sesión y el otro entra con un código de seis letras. Parece un detalle y suele ser justo el punto en el que uno de los dos abandona: quien tiene que registrarse primero muchas veces ya no lo hace.',
    },
  },
  {
    key: 'no-ads',
    proof: 'No ad SDK in the app; free tier is swipe-capped instead. Verified ad-carrying: BabyName (its own "No Ads $0.99" IAP proves it), Baby Name Genius, Baby Name Together, Kinder, BabyCenter, Mini Marvin.',
    de: {
      title: 'Keine Werbung, auch nicht gratis',
      body: 'Die kostenlose Version zeigt keine Anzeigen. Stattdessen gibt es 100 Swipes pro Person je 24 Stunden. Die meisten anderen Apps in diesem Vergleich finanzieren ihre Gratisversion mit Werbung — bei BabyName lässt sich das sogar für 0,99 € abkaufen.',
    },
    en: {
      title: 'No ads, not even on the free tier',
      body: 'The free version shows no advertising at all. Instead you get 100 swipes per partner per 24 hours. Most of the other apps here fund their free tier with ads — BabyName even sells removing them as a $0.99 purchase.',
    },
    es: {
      title: 'Sin publicidad, tampoco en la versión gratuita',
      body: 'La versión gratuita no muestra anuncios. A cambio tenéis 100 deslizamientos por persona cada 24 horas. La mayoría de las demás apps financian su versión gratuita con publicidad.',
    },
  },
  {
    key: 'name-depth',
    proof: 'Counted in Supabase 2026-08-19: meaning, pronunciation, country_ranks, trend_context, trend_label, longevity_read, style_tags, vibe_tags, syllable_count all 15,182/15,182. Nicknames deliberately excluded from the "every name" list — only 8,578.',
    de: {
      title: 'Auf jedem Namen steht mehr als eine Bedeutung',
      body: 'Alle 15.182 Namen tragen Bedeutung, Herkunft, Aussprache, Silbenzahl, Stil- und Vibe-Merkmale, echte Platzierungen in mehreren Ländern, eine Trend-Einordnung und eine Einschätzung, ob der Name Bestand hat — nicht als Schlagwort, sondern als geschriebener Satz. Auf Deutsch, Englisch und Spanisch vollständig. Kosenamen gibt es bei gut der Hälfte der Namen.',
    },
    en: {
      title: 'Every name carries more than a meaning',
      body: 'All 15,182 names come with meaning, origin, pronunciation, syllable count, style and vibe traits, real rank positions in several countries, a trend read and an assessment of whether the name lasts — written as a sentence, not a tag. Complete in English, German and Spanish. Nicknames exist for a little over half the names.',
    },
    es: {
      title: 'Cada nombre lleva más que un significado',
      body: 'Los 15.182 nombres incluyen significado, origen, pronunciación, número de sílabas, rasgos de estilo, posiciones reales en varios países, una lectura de tendencia y una valoración de si el nombre perdura — escrito como frase, no como etiqueta. Completo en español, alemán e inglés. Hay diminutivos en algo más de la mitad.',
    },
  },
  {
    key: 'learning',
    proof: 'buildDeckContext reads all loves+passes for the session from Postgres (paginated to 20k since fix #117); scoreCard applies asymmetric negative-preference penalties from lovedStyles/lovedVibes/lovedRegions. Measured 2026-08-19: 114/216 sessions multi-day, max 17,260 votes, max 95-day span.',
    de: {
      title: 'Das Deck lernt — aus euch beiden, ohne euch zu verraten',
      body: 'Jeder Swipe schärft die Auswahl: Stil, Klang, Herkunft, Silbenfluss. Das läuft über die gesamte Zeit, die ihr sucht, nicht nur über einen Abend — in echten Sitzungen sind das bis zu 17.000 Swipes, und die längste lief über drei Monate. Der Unterschied zu anderen Apps mit KI-Versprechen liegt nicht in der Technik, sondern darin, dass gelernt wird, ohne dass einer von euch die Stimmen des anderen sieht.',
    },
    en: {
      title: 'The deck learns — from both of you, without exposing either',
      body: 'Every swipe sharpens what comes next: style, sound, origin, syllable flow. It runs across the whole time you are searching, not one evening — real sessions reach 17,000 votes, and the longest ran for three months. The difference from other apps promising AI is not the technique, it is that the learning happens without either of you seeing the other’s votes.',
    },
    es: {
      title: 'El mazo aprende — de los dos, sin delatar a ninguno',
      body: 'Cada deslizamiento afina lo siguiente: estilo, sonido, origen, ritmo silábico. Funciona durante todo el tiempo que estéis buscando, no una sola noche. La diferencia con otras apps que prometen IA no está en la técnica, sino en que aprende sin que ninguno vea los votos del otro.',
    },
  },
  {
    key: 'no-repeats',
    proof: 'Client-side dedup in buildDeck against the full voted set; the 1000-row PostgREST truncation that broke it is bug #117, fixed and shipped. Julian 2026-05-21: "the entire promise of the app is no name shown twice".',
    de: {
      title: 'Kein Name kommt zweimal',
      body: 'Was einmal weggewischt wurde, taucht nicht wieder auf — auch nicht nach tausend Swipes, auch nicht nach Wochen. Das klingt selbstverständlich und ist es nicht: Es war der Fehler, der uns am meisten Arbeit gekostet hat.',
    },
    en: {
      title: 'No name comes back',
      body: 'Anything you have swiped away stays away — after a thousand swipes, after weeks. That sounds obvious and is not: it was the single bug that cost us the most work to get right.',
    },
    es: {
      title: 'Ningún nombre se repite',
      body: 'Lo que habéis descartado no vuelve a aparecer, ni tras mil deslizamientos ni semanas después. Parece obvio y no lo es.',
    },
  },
  {
    key: 'tools',
    proof: 'Emitted events: name_added, name_searched, name_shared, super_like_attempted, ai_insight_viewed, filter_applied + six further filter events including zero-result and deck-exhausted handling.',
    de: {
      title: 'Filter, Suche, eigene Namen, KI-Einordnung zum Match',
      body: 'Ihr könnt nach Stil, Herkunft, Länge und Klang filtern, gezielt suchen, eigene Namen einwerfen, die im Deck des Partners auftauchen, Favoriten mit einem Super-Like markieren und euch zu einem Match erklären lassen, warum er zu euch beiden passt.',
    },
    en: {
      title: 'Filters, search, your own names, AI insight on a match',
      body: 'Filter by style, origin, length and sound, search directly, add your own names so they appear in your partner’s deck, mark a favourite with a super like, and on a match get an explanation of why it fits you both.',
    },
    es: {
      title: 'Filtros, búsqueda, vuestros nombres y contexto con IA',
      body: 'Filtrad por estilo, origen, longitud y sonido, buscad directamente, añadid vuestros propios nombres para que aparezcan en el mazo de la pareja y, al hacer match, recibid una explicación de por qué encaja con los dos.',
    },
  },
  {
    key: 'privacy-price',
    proof: 'Supabase eu-west-1 (Ireland). One-time IAP unlocks both phones; no subscription tier exists. ⚠️ PRICE IS LOCALISED PER STOREFRONT (Julian, 2026-08-19) — never state one figure as if it were global; AT/CH/ES readers would be misled, and §3 PAngV wants the actual Endpreis. Additionally the GERMAN storefront currently lists TWO products, "Namore Unlimited 7,99 €" and "Namore Unlimited 4,99 €", so even the German figure is not unambiguous. Say "einmaliger Kauf" and name the German figure only as the current one, in the store.',
    de: {
      title: 'Ein Preis, einmal, für beide — und Daten in der EU',
      body: 'Ein einmaliger Kauf schaltet unbegrenztes Wischen und alle Filter für beide Handys frei. Kein Abo, keine Folgekosten. Der Preis wird je Land festgelegt — im deutschen App Store liegt er derzeit bei 7,99 €; was für euch gilt, steht im Store vor dem Kauf. Gehostet in Irland, keine Weitergabe von Daten, kein Modelltraining mit euren Swipes.',
    },
    en: {
      title: 'One price, once, for both — and EU hosting',
      body: 'A single purchase unlocks unlimited swiping and every filter on both phones. No subscription, nothing recurring. The price is set per country — the store shows what applies to you before you buy. Hosted in Ireland, no data sold, no model trained on your swipes.',
    },
    es: {
      title: 'Un precio, una vez, para los dos — y datos en la UE',
      body: 'Un único pago desbloquea deslizamientos ilimitados y todos los filtros en ambos móviles. Sin suscripción. El precio se fija por país — la tienda os muestra el vuestro antes de comprar. Alojado en Irlanda, sin venta de datos ni entrenamiento de modelos con vuestros votos.',
    },
  },
];

export const featuresFor = (lang: Lang) =>
  FEATURES.map((f) => ({ key: f.key, distinct: !!f.distinct, ...f[lang] }));
