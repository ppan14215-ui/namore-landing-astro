/**
 * Helpers for the hub / index pages (/names, by-letter, by-origin, by-gender).
 *
 * Hub pages exist to fix the "Discovered – currently not indexed" problem:
 * before they existed, the 10.8K name pages were an orphan island reachable
 * only via the sitemap. Hubs give Googlebot a shallow crawl path
 * (homepage → hub → name page) and concentrate internal-link importance so
 * Google spends crawl budget on the section.
 *
 * Kept separate from names.ts so the existing data layer stays untouched.
 */

import type { NameRow } from './types';
import { nameToSlug } from './types';

/** Origin → URL slug. Reuses the name slugifier (lowercase, ASCII, hyphens). */
export function originSlug(origin: string): string {
  return nameToSlug(origin);
}

/** A–Z initial for the by-letter hubs; anything non-alpha buckets under '#'. */
export function nameInitial(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function genderLabel(gender: NameRow['gender']): string {
  if (gender === 'F') return 'Girl names';
  if (gender === 'M') return 'Boy names';
  return 'Names';
}

/** Most-used first — recent US births, then alphabetical as a stable tie-break. */
export function sortByPopularity(rows: NameRow[]): NameRow[] {
  return [...rows].sort(
    (a, b) =>
      (b.births_last_year ?? 0) - (a.births_last_year ?? 0) ||
      a.name.localeCompare(b.name),
  );
}

/**
 * Distinct origins with their slug + count, sorted by how many names carry
 * them (biggest clusters first). Collisions on slug keep the first origin —
 * matches the deterministic-first-wins rule used for name slugs.
 */
export function distinctOrigins(
  all: NameRow[],
): Array<{ origin: string; slug: string; count: number }> {
  const bySlug = new Map<string, { origin: string; slug: string; count: number }>();
  for (const row of all) {
    if (!row.origin) continue;
    const slug = originSlug(row.origin);
    if (!slug) continue;
    const existing = bySlug.get(slug);
    if (existing) existing.count += 1;
    else bySlug.set(slug, { origin: row.origin, slug, count: 1 });
  }
  return Array.from(bySlug.values()).sort(
    (a, b) => b.count - a.count || a.origin.localeCompare(b.origin),
  );
}
