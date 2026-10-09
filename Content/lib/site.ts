/**
 * Site-wide public config for SEO, sitemap, robots, and analytics.
 * Override with env vars (e.g. in Vercel project settings) — every value
 * has a safe production default so nothing breaks when unset.
 */

/** Canonical public URL of the site (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bakery-three-xi.vercel.app").replace(
  /\/$/,
  "",
);

/**
 * Google Analytics 4 measurement ID ("G-XXXXXXXXXX").
 * When unset, no analytics scripts are loaded at all.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
