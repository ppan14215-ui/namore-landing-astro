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

export type Lang = 'de' | 'en' | 'es' | 'fr';

/** Language-neutral counted facts. Numbers live here and nowhere else. */
export const FACTS = {
  names: 15182,
  namesWithNicknames: 8578,
  nicknamePct: 56,
  namesNl: 11182,
  freeSwipes: 100,
  cycleHours: 24,
  /** German storefront price. Every other storefront sets its own local price (Julian 2026-09-27: "9,99 with localisation"). */
  priceEurDe: '9,99',
  priceEurEn: '€9.99',
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
  /**
   * French (2026-09-27). ⚠️ 'name-depth' and 'content-languages' say the name
   * material is written in French. That is only true once the French name data
   * (meaning_fr, origin_fr, longevity_read_fr, trend_context_fr) is complete —
   * the whole French cluster is noindex behind FR_LIVE until then (fr-live.ts).
   */
  fr: { title: string; body: string };
};

export const FEATURES: Feature[] = [
  {
    key: 'decision-round',
    proof: 'shortlist_viewed + shortlist_name_voted emitted by the app. EN research 2026-08-19 found no competitor with a post-match round BETWEEN THE TWO PARTNERS (Baby Name Genius and Baby Name Together have polls with friends/family — hence the careful wording).',
    distinct: true,
    de: {
      title: 'Es hört nicht beim Match auf',
      body: 'Zwölf gemeinsame Treffer sind keine Entscheidung. In der Endrunde bewertet ihr die gemeinsamen Treffer noch einmal getrennt, und daraus entsteht eine Reihenfolge statt einer Liste. Genau da bleiben Paare sonst stecken. Eine vergleichbare Stufe zwischen den beiden Partnern haben wir bei den hier verglichenen Apps nicht gefunden; mehrere bieten an, die Trefferliste gemeinsam weiter einzugrenzen oder Freunde und Familie abstimmen zu lassen.',
    },
    en: {
      title: 'It does not stop at the match',
      body: 'Twelve mutual matches are not a decision. In the final round you each rate the mutual matches again, separately, and what comes out is an order rather than a list. That is where couples usually get stuck. We did not find a comparable stage between the two partners in the apps compared here; several do offer to narrow the match list together, or to let friends and family vote.',
    },
    es: {
      title: 'No termina en el match',
      body: 'Doce coincidencias no son una decisión. En la ronda final volvéis a puntuar por separado los nombres coincidentes, y lo que sale es un orden en lugar de una lista. Ahí es donde las parejas se atascan. No hemos encontrado una fase comparable entre los dos miembros de la pareja en las apps comparadas aquí.',
    },
    fr: {
      title: 'Le match n’est pas la fin',
      body: 'Douze matchs, ce n’est pas encore une décision. Au dernier tour, chacun note à nouveau vos prénoms en commun, séparément, de 1 à 5, et il en sort un classement, pas une simple liste. C’est souvent là que les couples restent bloqués. Plusieurs applis proposent aussi une étape après le match. Dans Namore, vos notes restent privées jusqu’à ce que vous ayez validé tous les deux, puis les deux classements s’affichent côte à côte.',
    },
  },
  {
    key: 'shared-deck',
    proof: 'App 1.0.10 (2026-10-06, commit 01745e6 "one shared deck per couple"; a8a2a50 persisted couple order 2026-10-08; fd0dcb7 couple taste is category-level via a membership-checked RPC, individual choices never reach the client; 04f581d 2026-10-09 partner passes no longer shown anywhere). changelogItem111Deck: "You and your partner now see the same names, so a name you both like turns into a match sooner." Added 2026-10-12.',
    de: {
      title: 'Ein Stapel für euch beide',
      body: 'Ihr wischt denselben Stapel in derselben Reihenfolge, gebaut aus den Ländern, deren Namen ihr wollt. Ein Name, den einer von euch mag, kommt also auch beim anderen vorbei, und Matches kommen schneller. Was der andere wegwischt, seht ihr trotzdem nie.',
    },
    en: {
      title: 'One deck for both of you',
      body: 'You swipe the same deck in the same order, built from the countries whose names you want. A name one of you likes reaches the other too, so matches come sooner. What your partner passes on still stays hidden.',
    },
    es: {
      title: 'Un solo mazo para los dos',
      body: 'Deslizáis el mismo mazo en el mismo orden, construido a partir de los países cuyos nombres queréis. Un nombre que le gusta a uno también le llega al otro, así que los matches llegan antes. Lo que descarta tu pareja sigue sin verse.',
    },
    fr: {
      title: 'Une seule pile pour vous deux',
      body: 'Vous swipez la même pile, dans le même ordre, construite à partir des pays dont vous voulez les prénoms. Un prénom que l’un aime passe aussi chez l’autre, et les matchs arrivent plus vite. Ce que l’autre écarte reste caché.',
    },
  },
  {
    key: 'countries-top',
    proof: 'App 1.0.10/1.0.11 (2026-09-28 f054e5e country ranks from official data; 2026-10-06 443d620 Names from + Trend Top 100/500; 2026-10-08 03caa33 countries first in the filter sheet, Top 100/500 in the premium block, Trend Rising/Stable/Reviving/Fading/Rare stays free). en.json filter.popularityHintCountries: "In the official top 100 or top 500 of {{countries}}." Added 2026-10-12.',
    de: {
      title: 'Namen aus euren Ländern, mit echtem Rang',
      body: 'Ihr wählt, aus welchen Ländern eure Namen kommen sollen, etwa Deutschland und Italien. Die Reihenfolge folgt der amtlichen Geburtenstatistik dieser Länder, und jeder Name zeigt seinen Rang dort. Nach Trend filtern (steigend bis selten) ist kostenlos; nur die Top 100 oder Top 500 zu sehen, gehört zum einmaligen Kauf.',
    },
    en: {
      title: 'Names from your countries, with their real rank',
      body: 'You pick which countries your names should come from, say the US and Italy. The order follows those countries’ official birth statistics, and every name shows its rank there. Filtering by trend, from rising to rare, is free; showing only the Top 100 or Top 500 comes with the one-time unlock.',
    },
    es: {
      title: 'Nombres de vuestros países, con su puesto real',
      body: 'Elegís de qué países deben venir los nombres, por ejemplo España y Francia. El orden sigue las estadísticas oficiales de nacimientos de esos países y cada nombre muestra su puesto allí. Filtrar por tendencia es gratis; ver solo el Top 100 o el Top 500 forma parte de la compra única.',
    },
    fr: {
      title: 'Les prénoms de vos pays, avec leur vrai rang',
      body: 'Vous choisissez de quels pays viennent vos prénoms, par exemple la France et l’Italie. L’ordre suit les statistiques officielles des naissances de ces pays, et chaque prénom affiche son rang. Filtrer par tendance est gratuit ; ne voir que le Top 100 ou le Top 500 fait partie de l’achat unique.',
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
      body: 'One of you opens a session, the other joins with a six-letter code. It sounds minor, and it is usually the point where one partner quietly drops out: someone who has to register first often does not bother on the sofa at night.',
    },
    es: {
      title: 'Sin cuenta y sin correo',
      body: 'Uno abre una sesión y el otro entra con un código de seis letras. Parece un detalle y suele ser justo el punto en el que uno de los dos abandona: quien tiene que registrarse primero muchas veces ya no lo hace.',
    },
    fr: {
      title: 'Pas de compte obligatoire',
      body: 'L’un de vous ouvre une session, l’autre la rejoint avec un code à six caractères. La connexion avec Apple, Google ou par e-mail reste facultative. Ça paraît secondaire, et c’est souvent là que l’un des deux décroche : quand il faut d’abord créer un compte, on remet à plus tard.',
    },
  },
  {
    key: 'no-ads',
    proof: 'No ad SDK in the app; free tier is swipe-capped instead. Verified ad-carrying: BabyName (its own "No Ads $0.99" IAP proves it), Baby Name Genius, Baby Name Together, Kinder, BabyCenter, Mini Marvin.',
    de: {
      title: 'Keine Werbung, auch nicht gratis',
      body: 'Die kostenlose Version zeigt keine Anzeigen. Stattdessen gibt es 100 Swipes pro Person je 24 Stunden. Die meisten anderen Apps in diesem Vergleich finanzieren ihre Gratisversion mit Werbung, bei BabyName lässt sich das sogar für 0,99 € abkaufen.',
    },
    en: {
      title: 'No ads, not even on the free tier',
      body: 'The free version shows no advertising at all. Instead you get 100 swipes per partner per 24 hours. Most of the other apps here fund their free tier with ads. BabyName even sells removing them as a $0.99 purchase.',
    },
    es: {
      title: 'Sin publicidad, tampoco en la versión gratuita',
      body: 'La versión gratuita no muestra anuncios. A cambio tenéis 100 deslizamientos por persona cada 24 horas. La mayoría de las demás apps financian su versión gratuita con publicidad.',
    },
    fr: {
      title: 'Pas de publicité, même en gratuit',
      body: 'La version gratuite n’affiche aucune annonce. À la place, vous avez chacun 100 swipes toutes les 24 heures. Sur Google Play, quatre des six applis comparées ici portent la mention « Contient des annonces ».',
    },
  },
  {
    key: 'name-depth',
    proof: 'Counted in Supabase 2026-08-19: meaning, pronunciation, country_ranks, trend_context, trend_label, longevity_read, style_tags, vibe_tags, syllable_count all 15,182/15,182. Nicknames deliberately excluded from the "every name" list — only 8,578.',
    de: {
      title: 'Auf jedem Namen steht mehr als eine Bedeutung',
      body: 'Alle 15.182 Namen tragen Bedeutung, Herkunft, Aussprache, Silbenzahl, Stil- und Vibe-Merkmale, echte Platzierungen in mehreren Ländern, eine Trend-Einordnung und eine Einschätzung, ob der Name Bestand hat, nicht als Schlagwort, sondern als geschriebener Satz. Auf Deutsch, Englisch und Spanisch vollständig. Kosenamen gibt es bei gut der Hälfte der Namen.',
    },
    en: {
      title: 'Every name carries more than a meaning',
      body: 'All 15,182 names come with meaning, origin, pronunciation, syllable count, style and vibe traits, real rank positions in several countries, a trend read and an assessment of whether the name lasts, written as a sentence, not a tag. Complete in English, German and Spanish. Nicknames exist for a little over half the names.',
    },
    es: {
      title: 'Cada nombre lleva más que un significado',
      body: 'Los 15.182 nombres incluyen significado, origen, pronunciación, número de sílabas, rasgos de estilo, posiciones reales en varios países, una lectura de tendencia y una valoración de si el nombre perdura, escrito como frase, no como etiqueta. Completo en español, alemán e inglés. Hay diminutivos en algo más de la mitad.',
    },
    fr: {
      title: 'Chaque prénom porte plus qu’une signification',
      body: 'Les 15 182 prénoms ont leur signification, leur origine, leur prononciation, leur nombre de syllabes, leur style, leur classement réel dans plusieurs pays, une lecture de tendance et une appréciation de leur longévité, rédigée en phrases et non en mots-clés. En français, en anglais, en allemand et en espagnol. Un peu plus de la moitié des prénoms ont aussi leurs diminutifs.',
    },
  },
  {
    key: 'learning',
    proof: 'buildDeckContext reads all loves+passes for the session from Postgres (paginated to 20k since fix #117); scoreCard applies asymmetric negative-preference penalties from lovedStyles/lovedVibes/lovedRegions. Measured 2026-08-19: 114/216 sessions multi-day, max 17,260 votes, max 95-day span.',
    de: {
      title: 'Das Deck lernt aus euch beiden, ohne euch zu verraten',
      body: 'Jeder Swipe schärft die Auswahl: Stil, Klang, Herkunft, Silbenfluss. Das läuft über die gesamte Zeit, die ihr sucht, nicht nur über einen Abend: In echten Sitzungen sind das bis zu 17.000 Swipes, und die längste lief über drei Monate. Der Unterschied zu anderen Apps mit KI-Versprechen liegt nicht in der Technik, sondern darin, dass gelernt wird, ohne dass einer von euch die Stimmen des anderen sieht.',
    },
    en: {
      title: 'The deck learns, from both of you, without exposing either',
      body: 'Every swipe sharpens what comes next: style, sound, origin, syllable flow. It runs across the whole time you are searching, not one evening, real sessions reach 17,000 votes, and the longest ran for three months. The difference from other apps promising AI is not the technique, it is that the learning happens without either of you seeing the other’s votes.',
    },
    es: {
      title: 'El mazo aprende, de los dos, sin delatar a ninguno',
      body: 'Cada deslizamiento afina lo siguiente: estilo, sonido, origen, ritmo silábico. Funciona durante todo el tiempo que estéis buscando, no una sola noche. La diferencia con otras apps que prometen IA no está en la técnica, sino en que aprende sin que ninguno vea los votos del otro.',
    },
    fr: {
      title: 'La pile apprend de vous deux, sans rien trahir',
      body: 'Chaque swipe affine la suite : style, sonorité, origine, rythme des syllabes. Et cela sur toute la durée de votre recherche, pas un seul soir : une vraie session a dépassé 17 000 swipes, et la plus longue a duré plus de trois mois. D’autres applis promettent aussi de l’IA ; chez Namore, l’apprentissage se fait sans que l’un de vous voie les votes de l’autre.',
    },
  },
  {
    key: 'for-you',
    proof: 'App 1.0.9, production 2026-09-19: For You tab (en.json forYou.*, changelogItem109ForYou). Every pick is anchored to a name the user loved ("Because you loved {{name}}"); forYou.hub.footFree: "One set is free. Unlock Namore for a fresh set every morning." Events for_you_viewed / for_you_vote. Added to this file 2026-09-27.',
    de: {
      title: 'Für dich: zehn Namen am Tag, jeder mit Grund',
      body: 'Namore stellt zehn Namen für dich zusammen, jeder zurückgeführt auf einen Namen, den du schon liebst, etwa „Weil du Leo liebst“. Ihr wischt sie im Vollbild durch und tippt doppelt, wenn einer passt. Zwei der zehn sind für euch beide zusammen ausgesucht, einer ist bewusst ein Wagnis. Das erste Set ist kostenlos, mit Unlimited kommt jeden Morgen ein neues.',
    },
    en: {
      title: 'For You: ten names a day, each with a reason',
      body: 'Namore puts together ten names for you, each traced back to one you already love, for example “Because you loved Leo”. Swipe through them full screen and double-tap the ones that fit. Two of the ten are picked for the two of you together, and one is a deliberate stretch. The first set is free; with Unlimited a fresh set arrives every morning.',
    },
    es: {
      title: 'Para ti: diez nombres al día, cada uno con su motivo',
      body: 'Namore reúne diez nombres para ti, cada uno con raíz en uno que ya te encanta, por ejemplo «Porque te encantó Leo». Los deslizáis a pantalla completa y tocáis dos veces los que encajan. Dos de los diez se eligen para los dos juntos y uno es una apuesta a propósito. El primer set es gratis; con Unlimited llega uno nuevo cada mañana.',
    },
    fr: {
      title: '« Pour toi » : dix prénoms par jour, chacun avec sa raison',
      body: 'Namore prépare pour chacun de vous dix prénoms, chacun relié à un prénom que vous aimez déjà, par exemple « Parce que tu as adoré Leo ». Vous les faites défiler en plein écran et touchez deux fois ceux qui vous plaisent. Deux des dix sont choisis pour vous deux ensemble, et un est volontairement un pari. La première série est gratuite ; une fois Namore débloqué, une nouvelle série arrive chaque matin.',
    },
  },
  {
    key: 'no-repeats',
    proof: 'Client-side dedup in buildDeck against the full voted set; the 1000-row PostgREST truncation that broke it is bug #117, fixed and shipped. Julian 2026-05-21: "the entire promise of the app is no name shown twice".',
    de: {
      title: 'Kein Name kommt zweimal',
      body: 'Was einmal weggewischt wurde, taucht nicht wieder auf, auch nicht nach tausend Swipes, auch nicht nach Wochen. Das klingt selbstverständlich und ist es nicht: Es war der Fehler, der uns am meisten Arbeit gekostet hat.',
    },
    en: {
      title: 'No name comes back',
      body: 'Anything you have swiped away stays away, after a thousand swipes, after weeks. That sounds obvious and is not: it was the single bug that cost us the most work to get right.',
    },
    es: {
      title: 'Ningún nombre se repite',
      body: 'Lo que habéis descartado no vuelve a aparecer, ni tras mil deslizamientos ni semanas después. Parece obvio y no lo es.',
    },
    fr: {
      title: 'Aucun prénom ne revient',
      body: 'Ce que vous avez écarté ne réapparaît jamais, ni après mille swipes ni des semaines plus tard. Ça semble évident, ça ne l’est pas : c’est le bug qui nous a demandé le plus de travail.',
    },
  },
  {
    key: 'tools',
    proof: 'Emitted events: name_added, name_searched, name_shared, super_like_attempted, ai_insight_viewed, filter_applied + six further filter events including zero-result and deck-exhausted handling.',
    de: {
      title: 'Filter, Super-Likes und KI-Einordnung zum Match',
      body: 'Ihr könnt nach Stil, Herkunft, Länge und Klang filtern, Favoriten mit einem Super-Like markieren und euch zu einem Match erklären lassen, warum er zu euch beiden passt.',
    },
    en: {
      title: 'Filters, search, your own names, AI insight on a match',
      body: 'Filter by style, origin, length and sound, search directly, add your own names so they appear in your partner’s deck, mark a favourite with a super like, and on a match get an explanation of why it fits you both.',
    },
    es: {
      title: 'Filtros, búsqueda, vuestros nombres y contexto con IA',
      body: 'Filtrad por estilo, origen, longitud y sonido, buscad directamente, añadid vuestros propios nombres para que aparezcan en el mazo de la pareja y, al hacer match, recibid una explicación de por qué encaja con los dos.',
    },
    fr: {
      title: 'Filtres, recherche, vos propres prénoms, éclairage par IA',
      body: 'Filtrez par style, origine, longueur et sonorité, cherchez directement, ajoutez vos propres prénoms pour qu’ils apparaissent dans la pile de l’autre, marquez un favori d’un super like, et obtenez sur un match une explication de ce qui vous plaît à tous les deux.',
    },
  },
  {
    key: 'search-add',
    proof: '⚠️ SCOPED TO THE GERMAN LISTINGS on 2026-08-19 after a US-storefront pass showed how easily this breaks: a research agent had reported a double-blind quote as coming from Baby Name Together\u2019s APPLE listing; a direct read found it is on the GOOGLE PLAY listing instead. Same product, different store, different text. Never say "the other apps\u2019 listings" when only one storefront was read. Events name_searched and name_added are emitted by the app (code-derived inventory in CURRENT.md). None of the five German store listings transcribed on 2026-08-19 mentions searching or adding your own names — which is not proof they cannot, only that they do not say so.',
    de: {
      title: 'Suchen und eigene Namen einwerfen',
      body: 'Wenn euch ein Name einfällt, der nicht im Deck war, von der Oma, aus einem Buch, aus dem Nichts, könnt ihr ihn suchen oder selbst hinzufügen. Er landet dann früh im Deck eures Partners, ohne dass zu sehen ist, von wem er kommt, und ihr seht erst beim Match, was er davon hält. Kein Nachfragen, kein „und, wie findest du …?“ Drei eigene Namen am Tag sind kostenlos.',
    },
    en: {
      title: 'Search, and add your own names',
      body: 'When a name occurs to you that was never in the deck, from a grandmother, a book, out of nowhere, you can search for it or add it yourself. It then appears early in your partner\u2019s deck, without showing who added it, and you only find out what they think when it matches. No asking, no "so… what do you reckon?" Three a day are free.',
    },
    es: {
      title: 'Buscar, y añadir vuestros propios nombres',
      body: 'Si se os ocurre un nombre que no estaba en el mazo, podéis buscarlo o añadirlo. Aparecerá pronto en el mazo de vuestra pareja, sin que se vea quién lo añadió, y solo sabréis qué opina cuando haya coincidencia. Tres al día son gratis.',
    },
    fr: {
      title: 'Chercher, et ajouter vos propres prénoms',
      body: 'Un prénom vous vient en tête et il n’était pas dans la pile, celui d’une grand-mère, d’un livre, venu de nulle part : vous pouvez le chercher ou l’ajouter vous-même. Il apparaît alors tôt dans la pile de l’autre, sans indiquer qui l’a ajouté, et vous ne saurez ce qu’il en pense qu’en cas de match. Pas de « alors, tu en penses quoi ? ». Trois par jour sont gratuits.',
    },
  },
  {
    key: 'content-languages',
    proof: 'Counted in Supabase 2026-08-19: meaning_short, longevity_read and trend_context each populated 15,182/15,182 in EN, DE and ES. ⚠️ This is CONTENT, not UI count — Kinder\u2019s own listing advertises 23 interface languages, Baby Name Together 9, Baby Name Genius 10. NEVER claim more languages than they have; claim that the name material itself is written, not machine-translated UI over an English database.',
    de: {
      title: 'Drei Sprachen, und zwar der Inhalt',
      body: 'Andere Apps bieten mehr Oberflächensprachen als wir, Kinder etwa 23. Bei uns sind dafür nicht nur die Knöpfe übersetzt: Bedeutung, Herkunft, Trend-Einordnung und die Einschätzung, ob ein Name Bestand hat, sind auf Deutsch, Englisch und Spanisch jeweils vollständig geschrieben. Alle 15.182 Namen, dreimal. Kein englischer Datensatz mit deutscher Beschriftung.',
    },
    en: {
      title: 'Three languages, of the content, not the buttons',
      body: 'Other apps offer more interface languages than we do; Kinder lists 23. What we have instead is written material: meaning, origin, trend read and the assessment of whether a name lasts, complete in English, German and Spanish. All 15,182 names, three times over, not an English dataset with translated labels.',
    },
    es: {
      title: 'Tres idiomas, del contenido, no de los botones',
      body: 'Otras apps ofrecen más idiomas de interfaz que nosotros. Lo que tenemos es contenido escrito: significado, origen, tendencia y durabilidad, completos en español, alemán e inglés. Los 15.182 nombres, tres veces.',
    },
    fr: {
      title: 'Quatre langues, pour le contenu et pas seulement les boutons',
      body: 'D’autres applis proposent plus de langues d’interface que nous ; la fiche de Kinder en affiche 23. Chez nous, ce ne sont pas seulement les boutons qui sont traduits : signification, origine, tendance et longévité de chaque prénom sont rédigées en français, en anglais, en allemand et en espagnol. Les 15 182 prénoms, dans chacune de ces langues.',
    },
  },
  {
    key: 'design',
    // NOT `distinct` — that flag renders the highlight meaning "no competitor
    // claims this", which for design would be exactly the comparative claim we
    // may not make. Design leads by ORDER on the pages, not by a badge.
    proof: 'Design is a LEAD differentiator, not a footnote — it was part of the positioning locked in the 2026-08-16 audit (interface quality, double-blind, no account, one-time price). ⚠️ The line runs at COMPARISON, not at confidence: "Namore hat ein modernes Design" is a statement about our own product and is entirely permissible. What is not: "moderner als X", or any claim that a named competitor looks dated — that is the §4 Nr. 1 Herabsetzung surface an earlier review already caught on this cluster ("Die Oberfläche zeigt inzwischen ihr Alter", removed). Say ours plainly. Say nothing about theirs. A first draft of this card opened with "das ist Geschmack" and apologised before it claimed anything; that was over-correction, not caution.',
    de: {
      title: 'Modernes Design, und das ist kein Beiwerk',
      body: 'Namen aussuchen ist etwas, das ihr abends auf dem Sofa macht, nicht am Schreibtisch. Also haben wir eine App gebaut, die sich danach anfühlt: eine Karte nach der anderen, ruhige Farben, große Typografie, nichts blinkt, nichts drängelt, keine Werbung dazwischen. Kein Formular, keine Trefferliste, kein Karussell aus Freischalt-Angeboten. Schaut euch die Bildschirmfotos im App Store an und entscheidet in zwei Minuten selbst.',
    },
    en: {
      title: 'A modern interface, and that is not decoration',
      body: 'Choosing a name is something you do on the sofa in the evening, not at a desk. So we built an app that feels like that: one card at a time, quiet colours, large type, nothing flashing, nothing nagging, no ads in between. No forms, no results list, no carousel of unlock offers. Look at the screenshots in the App Store and decide for yourself in two minutes.',
    },
    es: {
      title: 'Diseño moderno, y no como adorno',
      body: 'Elegir un nombre es algo que hacéis en el sofá por la noche, no en un escritorio. Así que hicimos una app que se siente así: una tarjeta cada vez, colores tranquilos, tipografía grande, nada que parpadee, sin publicidad de por medio. Mirad las capturas en el App Store y decidid en dos minutos.',
    },
    fr: {
      title: 'Un design moderne, et ce n’est pas accessoire',
      body: 'Choisir un prénom, ça se fait souvent le soir, à deux, pas à un bureau. Nous avons donc fait une appli qui ressemble à ce moment-là : une carte à la fois, des couleurs calmes, de grands caractères, rien qui clignote, rien qui insiste, pas de publicité entre deux cartes. Pas de formulaire, pas de liste de résultats, pas de carrousel d’offres à débloquer. Regardez les captures sur l’App Store et jugez en deux minutes.',
    },
  },
  {
    key: 'card-themes',
    proof: 'App 1.0.8/1.0.9 (2026-09-16/19): 105 illustrated card backdrops (commit 53eb8b2), Settings toggle settings.cardBackdrops with no premium gate in app/(tabs)/settings.tsx; changelogItem109Themes. Added to this file 2026-09-27.',
    de: {
      title: 'Karten-Themes, wenn ihr mögt',
      body: '105 sanfte Illustrationen, eigens für Namore gezeichnet, können hinter jeder Namenskarte liegen. In den Einstellungen schaltet ihr sie ein oder aus, kostenlos. Wer es schlicht mag, lässt sie einfach weg.',
    },
    en: {
      title: 'Card themes, if you like',
      body: '105 soft illustrations, drawn for Namore, can sit behind every name card. Switch them on or off in Settings, free. If you prefer plain cards, leave them off.',
    },
    es: {
      title: 'Temas de tarjeta, si os apetece',
      body: '105 ilustraciones suaves, dibujadas para Namore, pueden ir detrás de cada tarjeta. Se activan o desactivan en Ajustes, gratis. Si preferís tarjetas sencillas, dejadlas apagadas.',
    },
    fr: {
      title: 'Des thèmes de cartes, si vous voulez',
      body: 'Cent cinq illustrations tout en douceur, dessinées pour Namore, peuvent s’afficher derrière chaque carte. Vous les activez ou les désactivez dans les Réglages, gratuitement. Si vous préférez des cartes unies, laissez-les désactivées.',
    },
  },
  {
    key: 'privacy-price',
    proof: 'Supabase eu-west-1 (Ireland). One-time IAP unlocks both phones; no subscription tier exists. ⚠️ PRICE IS LOCALISED PER STOREFRONT (Julian, 2026-08-19) — never state one figure as if it were global; AT/CH/ES readers would be misled, and §3 PAngV wants the actual Endpreis. Price moved to 9,99 € with app 1.0.9 (2026-09-19); Julian confirmed 2026-09-27: "price is 9,99 with localisation". Say "einmaliger Kauf" and name the German figure only as the current one, in the store.',
    de: {
      title: 'Ein Preis für beide, und Daten in der EU',
      body: 'Ein einmaliger Kauf schaltet unbegrenztes Wischen, alle Filter und jeden Morgen ein neues Für-dich-Set für beide Handys frei. Kein Abo, keine Folgekosten. Der Preis wird je Land festgelegt, im deutschen App Store liegt er derzeit bei 9,99 €; was für euch gilt, steht im Store vor dem Kauf. Gehostet in Irland, keine Weitergabe von Daten, kein Modelltraining mit euren Swipes.',
    },
    en: {
      title: 'One price, once, for both, and EU hosting',
      body: 'A single purchase unlocks unlimited swiping, every filter and a fresh For You set each morning on both phones. No subscription, nothing recurring. The price is set per country, the store shows what applies to you before you buy. Hosted in Ireland, no data sold, no model trained on your swipes.',
    },
    es: {
      title: 'Un precio, una vez, para los dos, y datos en la UE',
      body: 'Un único pago desbloquea deslizamientos ilimitados, todos los filtros y un set nuevo de Para ti cada mañana en ambos móviles. Sin suscripción. El precio se fija por país, la tienda os muestra el vuestro antes de comprar. Alojado en Irlanda, sin venta de datos ni entrenamiento de modelos con vuestros votos.',
    },
    fr: {
      title: 'Un seul prix, une seule fois, pour vous deux, et des données dans l’UE',
      body: 'Un achat unique débloque les swipes illimités, tous les filtres et une nouvelle série « Pour toi » chaque matin, sur vos deux téléphones. Pas d’abonnement, rien de récurrent. Le prix est fixé par pays, et l’App Store ou Google Play l’affiche avant l’achat. Hébergement en Irlande, aucune revente de données, aucun modèle entraîné sur vos swipes.',
    },
  },
];

/**
 * `distinct` is never shown on French pages: in the French stores, hidden
 * voting (Prénom de bébé à 2, Namie), a post-match stage (Namie, « Le Grand
 * Choix ») and anonymous name suggestions (BabyName) are all claimed by
 * competitors. See the header of apps-fr.ts.
 */
export const featuresFor = (lang: Lang) =>
  FEATURES.map((f) => ({ key: f.key, distinct: lang === 'fr' ? false : !!f.distinct, ...f[lang] }));
