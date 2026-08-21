/**
 * apps-en.ts — competitor facts for the ENGLISH cluster.
 *
 * SAME EVIDENCE RULE AS apps-de.ts: nothing goes in here that was not read
 * directly from the primary source. Every field carries the literal
 * transcription and the URL it was read from, or it is null and the page
 * prints "No statement in the listing".
 *
 * All entries transcribed 2026-08-20 from the US App Store, Google Play (US)
 * and vendor sites. The German and US listings of the same product differ in
 * wording, price currency and sometimes in substance. NEVER copy a fact
 * across from apps-de.ts.
 *
 * ⚠️ Claims that are FORBIDDEN on English pages, each checked:
 *   ✗ "BabyName shipped swipe matching in December 2014" — Apple exposes no
 *     original release date; only "© 2014-2025 Do Something Good LLC" exists.
 *   ✗ "We are the only app with hidden votes" — Baby Name Together's US Play
 *     listing states it verbatim; Nameberry's listing states it too.
 *   ✗ Any claim of AI superiority — Nameberry, Baby Name Genius, BabyCenter
 *     and NameHatch all advertise learning/AI in their own words below.
 *   ✗ "no other app has a post-match decision round" — use only the scoped
 *     form: we did not find a comparable stage between the two partners.
 *   ✗ A fixed price for Namore — the unlock is priced per storefront.
 */

export const VERIFIED_EN = 'August 20, 2026';

export type Sourced = {
  q: string;
  q2?: string; q3?: string; q4?: string; q5?: string;
  /** true = separate lines from the listing, shown as a list, not one sentence. */
  compiled?: boolean;
  note?: string;
  src: string;
} | null;

export type AppEn = {
  slug: string;
  name: string;
  vendor: string;
  src: string;
  rating: Sourced;
  price: Sourced;
  names: Sourced;
  partner: Sourced;
  ai: Sourced;
  ads: Sourced;
  updated: string;
};

const A = (id: string, slug: string) => `https://apps.apple.com/us/app/${slug}/id${id}`;
const BNT_PLAY = 'https://play.google.com/store/apps/details?id=com.BabyName.start&hl=en&gl=US';

export const APPS_EN: AppEn[] = [
  {
    slug: 'babyname',
    name: 'BabyName – find it together',
    vendor: 'Do Something Good LLC',
    src: A('950562312', 'babyname-find-it-together'),
    rating: { q: '4.1 out of 5 · 21K Ratings', src: A('950562312', 'babyname-find-it-together') },
    price: { q: 'Epic Parents $7.99', q2: 'Cool Parents $6.99', q3: 'Good Parents $4.99', q4: 'Buy all filters $2.99', q5: 'No Ads $0.99', compiled: true, src: A('950562312', 'babyname-find-it-together') },
    names: { q: 'over 30,000 unique names', src: A('950562312', 'babyname-find-it-together') },
    partner: { q: 'If your partner also downloads the app, you can sync up your phones using a shareable link or AirDrop', src: A('950562312', 'babyname-find-it-together') },
    ai: null,
    ads: { q: 'No Ads $0.99', note: 'sold as an in-app purchase, which is how the listing addresses ads', src: A('950562312', 'babyname-find-it-together') },
    updated: 'Apr 16 (version 3.4.5) · © 2014-2025 Do Something Good LLC',
  },
  {
    slug: 'baby-name-together',
    name: 'Baby Name Together',
    vendor: 'Linkinet — sold in Germany as “Unser Baby Name”, same app id',
    src: A('918073224', 'baby-name-together'),
    rating: { q: '4.5 · 321 Ratings', src: A('918073224', 'baby-name-together') },
    price: { q: 'Full Version $7.99', q2: 'Unlock all features $1.99', q3: 'Monthly: $1.49', compiled: true, src: A('918073224', 'baby-name-together') },
    names: { q: '30,000 baby names and counting!', src: A('918073224', 'baby-name-together') },
    partner: { q: 'Each parent swipes independently and privately. The app reveals only the names you both liked — no arguments, no vetoes, just matches.', note: 'from the Google Play listing; the App Store listing says “Both parents install the app and link their accounts through email address.”', src: BNT_PLAY },
    ai: { q: 'AI Name Assistant: Chat with AI for personalized name suggestions', src: A('918073224', 'baby-name-together') },
    ads: { q: 'Contains ads', src: BNT_PLAY },
    updated: 'Jul 1 (version 4.1.0)',
  },
  {
    slug: 'baby-name-genius',
    name: 'Baby Name Genius: Swipe Names',
    vendor: 'Verdant Labs, LLC',
    src: A('884932597', 'baby-name-genius-swipe-names'),
    rating: { q: '4.6 out of 5 · 556 Ratings', src: A('884932597', 'baby-name-genius-swipe-names') },
    price: { q: 'Full upgrade - monthly $4.99', q2: 'Full upgrade - lifetime $24.99', compiled: true, src: A('884932597', 'baby-name-genius-swipe-names') },
    names: null,
    partner: { q: 'Partner matching. Both of you rate names independently. The app finds where your tastes align, from “you both love it” to “worth talking about.”', src: A('884932597', 'baby-name-genius-swipe-names') },
    ai: { q: 'Recommendations that get smarter as you rate more.', src: A('884932597', 'baby-name-genius-swipe-names') },
    ads: { q: 'Contains Advertising', src: A('884932597', 'baby-name-genius-swipe-names') },
    updated: 'Jul 31 (version 3.6.39)',
  },
  {
    slug: 'nameberry',
    name: 'Nameberry',
    vendor: 'Nameberry LLC',
    src: A('6759727179', 'nameberry'),
    rating: { q: '2.8 out of 5 · 29 Ratings', src: A('6759727179', 'nameberry') },
    price: { q: 'Start free with 50 swipes', q2: '$4.99', compiled: true, note: 'the $4.99 is listed as a one-time purchase', src: A('6759727179', 'nameberry') },
    names: null,
    partner: { q: 'You each swipe independently and see only the names you both love.', src: A('6759727179', 'nameberry') },
    ai: { q: 'The more you swipe, the smarter Nameberry gets.', src: A('6759727179', 'nameberry') },
    ads: null,
    updated: 'May 25 (version 0.1.6)',
  },
  {
    slug: 'namehatch',
    name: 'NameHatch',
    vendor: 'Web app, no store listing',
    src: 'https://www.namehatchapp.com/',
    rating: null,
    price: { q: 'Free Trial $0', q2: 'Pay Once for 6 Months $29', q3: 'Premium Monthly $7/month', compiled: true, src: 'https://www.namehatchapp.com/' },
    names: { q: 'over 59,000 curated names', src: 'https://www.namehatchapp.com/' },
    partner: { q: 'Invite your partner to swipe in private. When you both like the same name, you’ll get a match notification.', src: 'https://www.namehatchapp.com/' },
    ai: { q: 'Let AI suggest names based on your style and preferences.', src: 'https://www.namehatchapp.com/' },
    ads: { q: 'ad-free experience', src: 'https://www.namehatchapp.com/' },
    updated: 'Web app',
  },
  {
    slug: 'babycenter',
    name: 'Baby Names by BabyCenter',
    vendor: 'Everyday Health, Inc.',
    src: A('1336227072', 'baby-names-by-babycenter'),
    rating: { q: '4.5 out of 5 · 7.1K Ratings', src: A('1336227072', 'baby-names-by-babycenter') },
    price: { q: 'Free, no in-app purchases listed', src: A('1336227072', 'baby-names-by-babycenter') },
    names: null,
    partner: { q: 'When you and your partner both love the same name, it’s a match!', q2: 'Use your personal code to connect with a partner', compiled: true, src: A('1336227072', 'baby-names-by-babycenter') },
    ai: { q: 'As you rate names, our app learns what you like and gives you more names you’ll love.', src: A('1336227072', 'baby-names-by-babycenter') },
    ads: { q: 'Contains Advertising', src: A('1336227072', 'baby-names-by-babycenter') },
    updated: 'Version 1.7.0, 12/03/2025',
  },
];

export const NO_STATEMENT_EN = 'No statement in the listing';

export const APP_STORE_EN = (c: string) =>
  `https://apps.apple.com/app/id6766572995?utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
export const PLAY_EN = (c: string) =>
  `https://play.google.com/store/apps/details?id=com.julian.namore&utm_source=blog&utm_medium=organic&utm_campaign=${c}`;
