/**
 * hreflang set for the comparison hubs (EN / DE / FR). Each market's hub
 * compares the apps that market actually sees, so they are localized
 * equivalents rather than translations; the annotation tells Google which one
 * to show per language. Must be reciprocal: every page in the set carries the
 * whole set, itself included. FR joins only while FR_LIVE is on.
 */
import { FR_LIVE } from './fr-live';

export type Alternate = { hreflang: string; href: string };

const EN = 'https://www.namore.app/blog/best-baby-name-apps';
export const COMPARISON_HUBS: Alternate[] = [
  { hreflang: 'en', href: EN },
  { hreflang: 'de', href: 'https://www.namore.app/de/blog/beste-babynamen-apps' },
  ...(FR_LIVE ? [{ hreflang: 'fr', href: 'https://www.namore.app/fr/blog/meilleures-applications-prenom-bebe' }] : []),
  { hreflang: 'x-default', href: EN },
];
