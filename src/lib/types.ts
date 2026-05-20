/**
 * TypeScript types mirroring the `public.names` table in Supabase.
 * Source of truth: `Documents/Projects/Namore/baby-name-app/supabase/schema.sql`.
 *
 * Keep this in sync if the schema changes — the Astro build relies on these
 * shapes for static page generation. Mismatches surface at build time, not
 * runtime, so a column rename in Supabase that isn't reflected here will
 * break the next Vercel build cleanly rather than silently shipping wrong
 * pages.
 */

export type Gender = 'M' | 'F' | 'U';

export type TrendLabel =
  | 'rising'
  | 'reviving'
  | 'classic_steady'
  | 'stable'
  | 'fading'
  | 'popular';

export type SourceStatus =
  | 'verified'
  | 'curated'
  | 'seed_promoted'
  | 'extended';

export type NameLength = 'short' | 'medium' | 'long';

/**
 * A single row from the `names` table. Nullable fields reflect uneven
 * dataset coverage — `popularity_history` only populates for names with
 * SSA matches, `nicknames` is sparse for many origins, etc. The template
 * is null-tolerant on every field it reads.
 *
 * **v1 is English-only.** The i18n columns (DE / NL / ES) are declared as
 * `?:` (optional) at the end of the interface because they exist in the
 * Supabase schema (migration 010_add_meaning_translation_columns) and
 * will be present in real Supabase rows — but the v1 build does NOT read
 * them, and the mock fixture does NOT supply them. Translation data is
 * currently weak and locale variants are explicitly off the v1 roadmap.
 * If/when translation quality improves, locale variants are a separate
 * decision; until then English-only.
 */
export interface NameRow {
  id: string;
  name: string;
  gender: Gender | null;
  countries: string | null;
  country_flags: string | null;
  region_tags: string | null;
  region: string | null;
  meaning: string | null;
  meaning_short: string | null;
  origin: string | null;
  style_tags: string | null;
  vibe_tags: string | null;
  nicknames: string | null;
  longevity_read: string | null;
  trend_label: TrendLabel | null;
  trend_context: string | null;
  pronunciation_text: string | null;
  source_status: SourceStatus | null;
  country_count: number | null;
  syllable_count: number | null;
  name_length: NameLength | null;
  phonetic_key: string | null;

  // SSA popularity — added by migration 006_ssa_popularity.sql
  // Format: JSONB array of 6 integers covering decades from 1970s → 2025.
  popularity_history: number[] | null;
  popularity_rank: number | null;
  peak_decade: string | null;
  peak_count: number | null;
  births_last_year: number | null;

  // i18n columns — present in the schema, OPTIONAL in this interface.
  // The build does not read them in v1; they're listed so that a real
  // Supabase row carrying them doesn't break the type. Translation data
  // quality is weak and locale variants are out of v1 scope.
  meaning_short_de?: string | null;
  meaning_short_nl?: string | null;
  meaning_short_es?: string | null;
  origin_de?: string | null;
  origin_nl?: string | null;
  origin_es?: string | null;
  longevity_read_de?: string | null;
  longevity_read_nl?: string | null;
  longevity_read_es?: string | null;
  trend_context_de?: string | null;
  trend_context_nl?: string | null;
  trend_context_es?: string | null;
}

/**
 * URL slug derivation — lowercase, ASCII-only, hyphens. The slug column
 * doesn't exist in Supabase (yet); we derive it at build time from `name`.
 *
 * Edge cases handled:
 * - Diacritics (Zoë → zoe, Renée → renee)
 * - Apostrophes (D'Andre → dandre — apostrophes stripped, not hyphenated)
 * - Spaces (Mary-Jane → mary-jane; Mary Jane → mary-jane)
 * - Non-ASCII (Aleksandr → aleksandr after the NFD strip)
 *
 * This is deterministic — given the same input it always produces the same
 * slug, so the URL never changes for an existing name. If a future name
 * collides (two distinct rows producing the same slug), the build logs a
 * warning and the second row wins. See `getAllNames()` for the collision
 * check.
 */
export function nameToSlug(name: string): string {
  return name
    .normalize('NFD')                  // split diacritics from base chars
    .replace(/[̀-ͯ]/g, '')   // strip the diacritic marks
    .toLowerCase()
    .replace(/['']/g, '')              // strip apostrophes (D'Andre → dandre)
    .replace(/[^a-z0-9]+/g, '-')       // anything non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '');          // trim leading/trailing hyphens
}
