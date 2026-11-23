/**
 * apps-fr.ts — competitor facts for the French cluster (/fr/blog/).
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️  SAME RULE AS apps-de.ts, FOR THE SAME REASONS. Read its header first.
 *
 *     NOTHING GOES IN THIS FILE THAT WAS NOT READ DIRECTLY FROM THE PRIMARY
 *     SOURCE BY THE PERSON ADDING IT. Every value is a literal transcription
 *     (`q`) with the URL it was read from (`src`). If a listing does not say
 *     something, the field is `null` and the page prints NO_STATEMENT.
 *
 *     French law is no looser than §§ 4, 5a, 6 UWG: comparative advertising is
 *     lawful only if it compares essential, relevant, VERIFIABLE and
 *     representative characteristics, is not misleading and does not
 *     denigrate (Code de la consommation, art. L122-1 s.), and the advertiser
 *     must be able to prove the accuracy of its factual claims (art. L122-5).
 *     Hiding the commercial intent of a page is a misleading omission
 *     (art. L121-3). Dated literal quotes with links carry all of that.
 *
 * ⚠️  THE FRENCH MARKET IS NOT THE GERMAN ONE — POSITIONING CONSEQUENCES:
 *     • Prénom de bébé à 2 (the #1 app in the French store search) says on
 *       Google Play: "Chaque parent swipe de manière indépendante et privée."
 *     • Namie says: "Chacun choisit en toute indépendance" AND has a
 *       post-match stage, « Le Grand Choix » (duels → classement → finale).
 *     • BabyName says you can add names "sans que votre partenaire le sache".
 *     So in France we may NOT claim, even softly, that hidden voting, a
 *     post-match round or anonymous name suggestions are unusual. The
 *     `distinct` flag in namore-features.ts is switched off for 'fr' for that
 *     reason. Describe what Namore does. Quote what the others say. Stop.
 *
 * ⚠️  NO SUPERLATIVES OR VALUE JUDGEMENTS ABOUT A NAMED COMPETITOR. Their
 *     store reviews mention bugs; we do not quote reviews, ever. Reviews are
 *     third-party opinions, cherry-picking them is denigration by proxy.
 *
 * ⚠️  IN-APP PURCHASES ARE ON THE APP STORE PAGE, JUST NOT IN <main>.
 *     The rows under « Achats intégrés » and the « Contient : Publicité » label
 *     sit in a collapsed section; Chrome's get_page_text (which reads <main>)
 *     missed them on 2026-09-27 and the first draft of this cluster wrongly
 *     told readers the App Store had stopped listing prices. The independent
 *     review caught it the same day. Price cells now carry the « Achats
 *     intégrés » rows, read from the served HTML of each French listing. A
 *     description line like "Monthly: $1.49" (English boilerplate, no matching
 *     purchase in the French store) is NOT a price and is not quoted.
 *
 * ⚠️  Ads cells quote GOOGLE PLAY's "Contient des annonces" and link there.
 *     (The App Store shows « Contient : Publicité » for the same four apps.)
 *     Same product, different store: never present a Play line as an App Store
 *     line.
 *
 *     All entries transcribed 2026-09-27 from apps.apple.com/fr and from
 *     play.google.com with hl=fr&gl=FR, read in Chrome by the author.
 * ══════════════════════════════════════════════════════════════════════════
 */

export const VERIFIED = '27 septembre 2026';

/** A single sourced fact: literal transcription + where it was read. */
export type Sourced = {
  q: string;
  q2?: string; q3?: string; q4?: string; q5?: string;
  /** true = separate lines from the same source, shown as a list, not one quote. */
  compiled?: boolean;
  /** Where in the source it sits, when that is not the description. */
  note?: string;
  src: string;
} | null;

export type App = {
  slug: string;
  name: string;
  vendor: string;
  /** The listing the app name links to (App Store France). */
  src: string;
  /** Google Play France listing, when there is one. */
  play: string | null;
  rating: Sourced;
  price: Sourced;
  names: Sourced;
  partner: Sourced;
  account: Sourced;
  ads: Sourced;
  ai: Sourced;
  /** What the listing says happens after a mutual like. */
  after: Sourced;
  /** What the listing says about suggesting / adding your own names. */
  add: Sourced;
  /** What the description itself says about how the app is paid for (sets, Pro, free). */
  model?: Sourced;
  updated: string;
  /** Neutral, non-evaluative one-liner for the overview table. */
  note: string;
};

const AS = {
  p2: 'https://apps.apple.com/fr/app/pr%C3%A9nom-de-b%C3%A9b%C3%A9-%C3%A0-2/id918073224',
  kinder: 'https://apps.apple.com/fr/app/kinder-find-baby-names/id1068421785',
  charlie: 'https://apps.apple.com/fr/app/charliesnames/id990425943',
  babyname: 'https://apps.apple.com/fr/app/babyname-find-it-together/id950562312',
  genius: 'https://apps.apple.com/fr/app/baby-name-genius-pr%C3%A9noms/id884932597',
  namie: 'https://apps.apple.com/fr/app/namie-pr%C3%A9nom-b%C3%A9b%C3%A9-en-couple/id6759967062',
};
const GP = (pkg: string) => `https://play.google.com/store/apps/details?id=${pkg}&hl=fr&gl=FR`;
const PLAY = {
  p2: GP('com.BabyName.start'),
  kinder: GP('global.kinder'),
  charlie: GP('com.charlie_names.charlies_names'),
  babyname: GP('ru.drivepixels.babyname'),
  genius: GP('com.verdantlabs.nametrix'),
  namie: GP('com.namie.app'),
};
const ON_PLAY = 'sur Google Play';
/** Rows of the collapsed « Achats intégrés » section of the App Store France listing. */
const IAP = 'rubrique «\u00a0Achats intégrés\u00a0» de la fiche App Store';

export const APPS: App[] = [
  {
    slug: 'prenom-de-bebe-a-2',
    name: 'Prénom de bébé à 2',
    vendor: 'Linkinet',
    src: AS.p2,
    play: PLAY.p2,
    rating: { q: '4,6 sur 5 · 1,2 k notes', src: AS.p2 },
    price: { q: 'Version complète 8,99 €', q2: 'Unlock all features 1,99 €', compiled: true, note: IAP, src: AS.p2 },
    names: { q: 'Plus de 30 000 prénoms pour garçon ou fille de toutes origines', src: AS.p2 },
    partner: { q: 'Chaque parent swipe de manière indépendante et privée. L\'application ne révèle que les prénoms que vous avez aimés tous les deux — pas de disputes, pas de veto, juste des prénoms en commun.', note: ON_PLAY, src: PLAY.p2 },
    account: { q: 'Les 2 parents installent l’application sur leur portable ou leur tablette, et relient leurs comptes grâce à leurs adresses emails', src: AS.p2 },
    ads: { q: 'Contient des annonces', note: ON_PLAY, src: PLAY.p2 },
    ai: { q: 'Discutez avec notre assistant IA pour des suggestions de prénoms personnalisées !', note: ON_PLAY, src: PLAY.p2 },
    after: { q: 'Consultez les prénoms que les deux parents adorent et choisissez LE prénom parfait dans cette courte liste.', note: ON_PLAY, src: PLAY.p2 },
    add: { q: 'Proposez ou consultez les prénoms proposés par la communauté', note: 'communauté de l’appli', src: AS.p2 },
    updated: 'version 4.2.0 du 19 sept.',
    note: 'Même app que « Baby Name Together » (même identifiant App Store), éditeur Linkinet',
  },
  {
    slug: 'kinder',
    name: 'Kinder - Find Baby Names',
    vendor: 'Krijn Haasnoot',
    src: AS.kinder,
    play: PLAY.kinder,
    rating: { q: '4,4 sur 5 · 387 notes', src: AS.kinder },
    price: { q: 'All Sets 5,99 €', q2: 'French 0,99 €', q3: 'Spanish 0,99 €', q4: 'Italian 0,99 €', compiled: true, note: IAP + ', qui compte d’autres sets de langue à 0,99 € chacun', src: AS.kinder },
    names: { q: 'Plus de 20 000 prénoms soigneusement sélectionnés, de styles et origines variés', src: AS.kinder },
    partner: { q: 'Connexion partenaire — les achats sont partagés une fois connectés', src: AS.kinder },
    account: null,
    ads: { q: 'Contient des annonces', note: ON_PLAY, src: PLAY.kinder },
    ai: null,
    after: { q: 'Favoris, refusés et matchs (bonjour la shortlist !)', src: AS.kinder },
    add: null,
    updated: 'version 2.0.16 du 16 juil.',
    model: { q: 'Commencez gratuitement avec un set basé sur votre localisation', q2: 'Ajoutez d’autres sets quand vous voulez', compiled: true, src: AS.kinder },
    note: 'Sets de prénoms supplémentaires à l’achat, partagés avec le partenaire connecté',
  },
  {
    slug: 'charliesnames',
    name: 'CharliesNames',
    vendor: 'CharliesNames UG (haftungsbeschraenkt)',
    src: AS.charlie,
    play: PLAY.charlie,
    rating: { q: '4,2 sur 5 · 19 notes', src: AS.charlie },
    price: { q: 'CN1 1,99 €', q2: 'CN2 2,99 €', q3: 'CN15 14,99 €', q4: 'CN5 5,99 €', compiled: true, note: IAP, src: AS.charlie },
    names: { q: 'Plus de 15 000 prénoms avec origine et signification', src: AS.charlie },
    partner: { q: 'Fonction de swipe intuitive et matching avec votre partenaire – voyez immédiatement vos favoris communs', src: AS.charlie },
    account: null,
    ads: { q: 'Sans publicité', q2: 'Utilisez l’application et le site sans aucune publicité', compiled: true, note: 'la seconde ligne figure dans la liste « Avec la version Pro »', src: AS.charlie },
    ai: { q: 'Mon intelligence artificielle apprend à connaître vos goûts et vous propose exactement les prénoms qui vous correspondent.', src: AS.charlie },
    after: null,
    add: { q: 'Ajoutez des prénoms manquants', src: AS.charlie },
    updated: 'version 2.0.59 du 8 mars',
    model: { q: '… et bien plus encore – à vie', note: 'la ligne clôt la liste «\u00a0Avec la version Pro, vous obtenez en plus\u00a0»', src: AS.charlie },
    note: 'Prénoms de plus de 40 pays, suggestions par IA',
  },
  {
    slug: 'babyname',
    name: 'BabyName - find it together',
    vendor: 'Do Something Good LLC',
    src: AS.babyname,
    play: PLAY.babyname,
    rating: { q: '3,8 sur 5 · 27 notes', src: AS.babyname },
    price: { q: 'Parents Épiques 8,99 €', q2: 'Parents Cool 7,99 €', q3: 'Bons Parents 5,99 €', q4: 'Buy all filters 2,99 €', q5: 'No Ads 0,99 €', compiled: true, note: IAP + ', qui compte cinq autres achats à 0,99 €', src: AS.babyname },
    names: { q: 'L\'application Babyname propose plus de 30 000 prénoms uniques, chacun accompagné de son origine et de sa signification.', src: AS.babyname },
    partner: { q: 'Connectez-vous à votre partenaire et faites défiler ensemble des cartes de prénoms. Si vous aimez tous les deux un même prénom, c’est un match !', src: AS.babyname },
    account: { q: 'Si votre partenaire utilise aussi l’app, vous pouvez synchroniser vos téléphones via un lien partageable ou AirDrop, et créer ensemble une liste commune sans accroc.', note: 'passage du descriptif présenté comme le texte de l’équipe éditoriale d’Apple', src: AS.babyname },
    ads: { q: 'Contient des annonces', note: ON_PLAY, src: PLAY.babyname },
    ai: null,
    after: { q: 'Tous les prénoms aimés par les deux sont regroupés dans une liste spéciale, ce qui vous permet de les affiner ensemble – sans peur de proposer un prénom qui déclenche « ce regard ».', note: 'passage du descriptif présenté comme le texte de l’équipe éditoriale d’Apple', src: AS.babyname },
    add: { q: 'Grâce à notre nouvelle fonctionnalité, vous pouvez ajouter des noms potentiels à l\'application sans que votre partenaire le sache et recevoir des commentaires honnêtes à leur sujet.', note: ON_PLAY, src: PLAY.babyname },
    updated: 'version 3.4.5 du 16 avr.',
    note: 'Téléphones reliés par lien ou AirDrop',
  },
  {
    slug: 'baby-name-genius',
    name: 'Baby Name Genius: Prénoms',
    vendor: 'Verdant Labs, LLC',
    src: AS.genius,
    play: PLAY.genius,
    rating: { q: '5,0 sur 5 · 2 notes', src: AS.genius },
    price: { q: 'Full upgrade - monthly 5,99 €', q2: 'Full upgrade - lifetime 29,99 €', compiled: true, note: IAP, src: AS.genius },
    names: { q: 'Des milliers de prénoms avec origines, significations et données riches', src: AS.genius },
    partner: { q: 'Matching avec le partenaire. Vous évaluez chacun de votre côté. L\'appli trouve vos points d\'accord, du « vous adorez tous les deux » au « à discuter ».', src: AS.genius },
    account: null,
    ads: { q: 'Contient des annonces', note: ON_PLAY, src: PLAY.genius },
    ai: { q: 'Des recommandations qui s\'affinent au fur et à mesure.', src: AS.genius },
    after: null,
    add: null,
    updated: 'version 3.6.45 du 17 sept.',
    note: 'Courbes de popularité depuis 1900, fonctionne hors ligne',
  },
  {
    slug: 'namie',
    name: 'Namie - Prénom bébé en couple',
    vendor: 'Thomas Servan',
    src: AS.namie,
    play: PLAY.namie,
    rating: { q: '5,0 sur 5 · 4 notes', src: AS.namie },
    price: { q: 'Gratuit', q2: '100 % gratuit, sans publicité, sans abonnement', compiled: true, src: AS.namie },
    names: { q: 'Plus de 8 500 prénoms français et internationaux', src: AS.namie },
    partner: { q: 'Chacun choisit en toute indépendance, sans pression.', q2: 'Dès que vous aimez tous les deux le même prénom, c’est un match !', compiled: true, src: AS.namie },
    account: null,
    ads: { q: '100 % gratuit, sans publicité, sans abonnement', src: AS.namie },
    ai: null,
    after: { q: 'Des duels : comparez vos prénoms deux par deux', q2: 'Un classement : chacun classe ses préférés', q3: 'La finale : les 3 meilleurs s’affrontent pour révéler LE prénom gagnant', compiled: true, note: 'les trois phases du « Grand Choix »', src: AS.namie },
    add: null,
    updated: 'version 1.0.7 du 19 sept.',
    model: { q: '100 % gratuit, sans publicité, sans abonnement', src: AS.namie },
    note: '« Le Grand Choix » : duels, classement, finale',
  },
];

export const byslug = (s: string): App => {
  const a = APPS.find((x) => x.slug === s);
  if (!a) throw new Error(`apps-fr: unknown slug "${s}"`);
  return a;
};

/** What a page prints when a listing simply does not address something. */
export const NO_STATEMENT = 'Rien à ce sujet dans la fiche';

/**
 * Store links with attribution that works (see apps-de.ts for why utm_* on
 * the bare store URL measures nothing). Campaign tokens end in _fr so the
 * French cluster is separable in App Store Connect and Play Console.
 */
const PROVIDER_TOKEN = ''; // same pt as apps-de.ts once Julian has it

export const APP_STORE = (c: string) => {
  const params = [PROVIDER_TOKEN ? `pt=${PROVIDER_TOKEN}` : '', `ct=${c}`, 'mt=8']
    .filter(Boolean)
    .join('&');
  return `https://apps.apple.com/fr/app/id6766572995?${params}`;
};

export const PLAY_STORE = (c: string) => {
  const referrer = encodeURIComponent(
    `utm_source=namore_blog&utm_medium=organic&utm_campaign=${c}`,
  );
  return `https://play.google.com/store/apps/details?id=com.julian.namore&hl=fr&gl=FR&referrer=${referrer}`;
};
