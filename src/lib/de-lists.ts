/**
 * German list pages under /de/vornamen/<slug> (2026-11-23, SEO revival).
 *
 * Why: German users pay and convert (the app ranks top 3 for "babynamen" in
 * the DE App Store), but the /names corpus is English-only and its Google
 * traffic is "<name> meaning" lookups from low-income markets. German parents
 * search for lists ("seltene Mädchennamen", "nordische Jungennamen"), so each
 * page here is one such list, built from the same Supabase rows, showing the
 * German meaning (meaning_short_de) and origin (origin_de).
 *
 * Quality gates:
 *   - only rows with a German meaning are listed (no English fallbacks);
 *   - a list with fewer than MIN_NAMES rows is not built at all (no thin pages);
 *   - at most MAX_NAMES per page, most-used first.
 */
import type { NameRow } from './types';
import dachNames from '../data/dach-names.json' assert { type: 'json' };

export const MIN_NAMES = 12;
export const MAX_NAMES = 60;

export interface DeList {
  slug: string;
  /** H1, rendered with the <em> part highlighted. */
  h1: [string, string, string];
  title: string;
  description: string;
  intro: string;
  filter: (r: NameRow) => boolean;
  /** Optional custom order; default = most US births first, then A-Z. */
  sort?: (a: NameRow, b: NameRow) => number;
}

const girl = (r: NameRow) => r.gender === 'F';
const boy = (r: NameRow) => r.gender === 'M';
const uni = (r: NameRow) => r.gender === 'U';
const originIs = (re: RegExp) => (r: NameRow) => re.test(r.origin_de ?? '') || re.test(r.origin ?? '');
const short = (r: NameRow) => r.name.replace(/[^\p{L}]/gu, '').length <= 4 || r.name_length === 'short';
const rare = (r: NameRow) => (r.births_last_year ?? 0) < 250 && r.trend_label !== 'popular';
const tags = (r: NameRow) => `${r.style_tags ?? ''},${r.vibe_tags ?? ''}`.toLowerCase();
const vintage = (r: NameRow) => /vintage|old-fashioned|classic|traditional|nostalg/.test(tags(r));
const rising = (r: NameRow) => r.trend_label === 'rising' || r.trend_label === 'reviving';

const NORDIC = /nordisch|skandinav|altnordisch|norse|scandinav|swedish|norwegian|danish|icelandic|finnish|schwed|norweg|dänisch|isländ|finn/i;
const GREEK = /griech|greek/i;
const ITALIAN = /italien|italian/i;
const FRENCH = /französ|french/i;
const HEBREW = /hebrä|hebrew|biblisch|biblical/i;
const IRISH = /irisch|gälisch|keltisch|irish|gaelic|celtic/i;
const LATIN = /latein|latin|römisch|roman/i;
const GERMANIC = /germanisch|althochdeutsch|deutsch|germanic|german|old high german/i;

const dachOrder = new Map<string, number>((dachNames as string[]).slice(0, 80).map((n, i) => [n.toLowerCase(), i]));

export const DE_LISTS: DeList[] = [
  {
    slug: 'beliebte-vornamen-deutschland',
    h1: ['Beliebte ', 'Vornamen', ' in Deutschland'],
    title: 'Beliebte Vornamen in Deutschland – mit Bedeutung',
    description: 'Die Vornamen, die in Deutschland und Österreich gerade vergeben werden, mit Bedeutung und Herkunft. Zu zweit swipen und den gemeinsamen Favoriten finden.',
    intro: 'Diese Namen stehen in den deutschen und österreichischen Hitlisten oder sind im deutschsprachigen Raum gerade gefragt. Gut, wenn ihr einen vertrauten Namen sucht, den jeder sofort schreiben kann.',
    filter: (r) => dachOrder.has(r.name.toLowerCase()),
    sort: (a, b) => (dachOrder.get(a.name.toLowerCase()) ?? 999) - (dachOrder.get(b.name.toLowerCase()) ?? 999),
  },
  {
    slug: 'seltene-maedchennamen',
    h1: ['Seltene ', 'Mädchennamen', ' mit Bedeutung'],
    title: 'Seltene Mädchennamen mit Bedeutung – schön und ungewöhnlich',
    description: 'Seltene, schöne Mädchennamen, die kaum jemand trägt, mit Bedeutung und Herkunft. Findet zu zweit den Namen, den ihr beide liebt.',
    intro: 'Namen, die schön klingen, aber selten vergeben werden. Eure Tochter ist damit vermutlich die einzige in der Kita-Gruppe.',
    filter: (r) => girl(r) && rare(r),
  },
  {
    slug: 'seltene-jungennamen',
    h1: ['Seltene ', 'Jungennamen', ' mit Bedeutung'],
    title: 'Seltene Jungennamen mit Bedeutung – stark und ungewöhnlich',
    description: 'Seltene Jungennamen, die nicht jeder hat, mit Bedeutung und Herkunft. Zu zweit swipen und den gemeinsamen Favoriten finden.',
    intro: 'Ungewöhnliche Jungennamen, die trotzdem leicht auszusprechen sind. Für Eltern, die keinen Top-10-Namen wollen.',
    filter: (r) => boy(r) && rare(r),
  },
  {
    slug: 'kurze-maedchennamen',
    h1: ['Kurze ', 'Mädchennamen', ''],
    title: 'Kurze Mädchennamen – kurz, schön, mit Bedeutung',
    description: 'Kurze Mädchennamen mit höchstens vier Buchstaben, mit Bedeutung und Herkunft. Passen zu fast jedem Nachnamen.',
    intro: 'Kurze Namen passen zu langen Nachnamen und funktionieren in jeder Sprache. Hier die schönsten mit Bedeutung.',
    filter: (r) => girl(r) && short(r),
  },
  {
    slug: 'kurze-jungennamen',
    h1: ['Kurze ', 'Jungennamen', ''],
    title: 'Kurze Jungennamen – kurz, stark, mit Bedeutung',
    description: 'Kurze Jungennamen mit höchstens vier Buchstaben, mit Bedeutung und Herkunft. Klar, stark und international.',
    intro: 'Kurz, klar und international verständlich. Diese Jungennamen kommen ohne Spitznamen aus.',
    filter: (r) => boy(r) && short(r),
  },
  {
    slug: 'nordische-maedchennamen',
    h1: ['Nordische ', 'Mädchennamen', ''],
    title: 'Nordische Mädchennamen mit Bedeutung – skandinavisch und schön',
    description: 'Nordische und skandinavische Mädchennamen mit Bedeutung, von Freya bis Linnea. Zu zweit swipen und den gemeinsamen Favoriten finden.',
    intro: 'Skandinavische Namen sind hell, klar und oft mit der nordischen Mythologie verbunden.',
    filter: (r) => girl(r) && originIs(NORDIC)(r),
  },
  {
    slug: 'nordische-jungennamen',
    h1: ['Nordische ', 'Jungennamen', ''],
    title: 'Nordische Jungennamen mit Bedeutung – Wikinger und Skandinavien',
    description: 'Nordische Jungennamen mit Bedeutung, von altnordisch bis modern skandinavisch. Zu zweit swipen und den gemeinsamen Favoriten finden.',
    intro: 'Von Göttern, Wikingern und Seefahrern: nordische Jungennamen sind kraftvoll und trotzdem kurz.',
    filter: (r) => boy(r) && originIs(NORDIC)(r),
  },
  {
    slug: 'griechische-vornamen',
    h1: ['Griechische ', 'Vornamen', ' mit Bedeutung'],
    title: 'Griechische Vornamen mit Bedeutung – für Mädchen und Jungen',
    description: 'Griechische Vornamen für Mädchen und Jungen mit Bedeutung: zeitlos, oft aus Mythologie und Antike.',
    intro: 'Viele unserer Klassiker kommen aus dem Griechischen. Hier findet ihr bekannte und überraschende Namen mit ihrer Bedeutung.',
    filter: originIs(GREEK),
  },
  {
    slug: 'italienische-vornamen',
    h1: ['Italienische ', 'Vornamen', ''],
    title: 'Italienische Vornamen mit Bedeutung – Mädchen und Jungen',
    description: 'Italienische Vornamen mit Bedeutung, melodisch und warm. Für Mädchen und Jungen.',
    intro: 'Italienische Namen klingen weich und melodisch und lassen sich auch auf Deutsch gut aussprechen.',
    filter: originIs(ITALIAN),
  },
  {
    slug: 'franzoesische-vornamen',
    h1: ['Französische ', 'Vornamen', ''],
    title: 'Französische Vornamen mit Bedeutung – elegant und zeitlos',
    description: 'Französische Vornamen mit Bedeutung für Mädchen und Jungen, elegant und zeitlos.',
    intro: 'Französische Namen wirken elegant, ohne verstaubt zu sein. Hier mit Bedeutung und Herkunft.',
    filter: originIs(FRENCH),
  },
  {
    slug: 'biblische-vornamen',
    h1: ['Biblische und hebräische ', 'Vornamen', ''],
    title: 'Biblische Vornamen mit Bedeutung – hebräisch und zeitlos',
    description: 'Biblische und hebräische Vornamen mit Bedeutung, für Mädchen und Jungen.',
    intro: 'Von Anna bis Jonah: viele Namen aus der Bibel sind heute wieder modern.',
    filter: originIs(HEBREW),
  },
  {
    slug: 'irische-vornamen',
    h1: ['Irische und keltische ', 'Vornamen', ''],
    title: 'Irische Vornamen mit Bedeutung – keltisch und gälisch',
    description: 'Irische, gälische und keltische Vornamen mit Bedeutung und Aussprache.',
    intro: 'Irische Namen haben oft eine eigene Schreibweise. Deshalb steht bei jedem Namen die Aussprache dabei.',
    filter: originIs(IRISH),
  },
  {
    slug: 'lateinische-vornamen',
    h1: ['Lateinische ', 'Vornamen', ''],
    title: 'Lateinische Vornamen mit Bedeutung – klassisch und klar',
    description: 'Lateinische und römische Vornamen mit Bedeutung, für Mädchen und Jungen.',
    intro: 'Lateinische Namen sind klar, international und haben fast immer eine schöne Bedeutung.',
    filter: originIs(LATIN),
  },
  {
    slug: 'altdeutsche-vornamen',
    h1: ['Altdeutsche ', 'Vornamen', ''],
    title: 'Altdeutsche und germanische Vornamen mit Bedeutung',
    description: 'Altdeutsche und germanische Vornamen mit Bedeutung, viele davon gerade wieder im Kommen.',
    intro: 'Namen wie Emil, Ida oder Frieda waren lange vergessen und sind jetzt wieder gefragt.',
    filter: originIs(GERMANIC),
  },
  {
    slug: 'vintage-vornamen',
    h1: ['Alte ', 'Vornamen', ', die zurückkommen'],
    title: 'Alte Vornamen, die zurückkommen – Vintage-Namen mit Bedeutung',
    description: 'Vintage-Vornamen und Klassiker, die gerade ein Comeback feiern, mit Bedeutung und Herkunft.',
    intro: 'Omas und Opas Namen sind zurück. Diese Klassiker klingen heute wieder frisch.',
    filter: (r) => vintage(r) && rising(r),
  },
  {
    slug: 'vornamen-im-trend',
    h1: ['Vornamen ', 'im Trend', ''],
    title: 'Vornamen im Trend – diese Namen werden beliebter',
    description: 'Vornamen, die international gerade beliebter werden, mit Bedeutung. Für Eltern, die früh dran sein wollen.',
    intro: 'Diese Namen steigen in mehreren Ländern gerade auf. Wer sie jetzt wählt, ist vor der Welle dran.',
    filter: (r) => r.trend_label === 'rising',
  },
  {
    slug: 'unisex-namen',
    h1: ['Unisex-', 'Namen', ''],
    title: 'Unisex-Namen mit Bedeutung – für Mädchen und Jungen',
    description: 'Geschlechtsneutrale Vornamen, die für Mädchen und Jungen passen, mit Bedeutung und Herkunft.',
    intro: 'Namen, die für jedes Kind passen. Praktisch, wenn ihr das Geschlecht noch nicht kennt.',
    filter: uni,
  },
];

export function sortDefault(a: NameRow, b: NameRow): number {
  return (b.births_last_year ?? 0) - (a.births_last_year ?? 0) || a.name.localeCompare(b.name, 'de');
}

/** Rows for one list, or null if the list is too thin to publish. */
export function buildList(list: DeList, all: NameRow[]): NameRow[] | null {
  const rows = all.filter((r) => (r.meaning_short_de ?? '').trim().length > 0 && list.filter(r));
  rows.sort(list.sort ?? sortDefault);
  if (rows.length < MIN_NAMES) return null;
  return rows.slice(0, MAX_NAMES);
}
