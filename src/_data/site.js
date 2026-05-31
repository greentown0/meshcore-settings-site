/**
 * Global site data — exposes `site.url` (no trailing slash) to all templates.
 *
 * Priority:
 *  1. SITE_URL env var  — set this in Cloudflare Pages for prod/other domains
 *  2. CF_PAGES_URL      — Cloudflare Pages injects this for preview builds
 *  3. Fallback          — local dev / current prod domain
 */
module.exports = () => {
  const raw =
    process.env.SITE_URL ||
    process.env.CF_PAGES_URL ||
    "https://settings.woodwar.com";
  return { url: raw.replace(/\/$/, "") };
};
