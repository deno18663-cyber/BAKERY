"use strict";

/**
 * Small, dependency-free security layer:
 *  - securityHeaders(): hides the stack, blocks clickjacking/sniffing,
 *    keeps the admin key out of Referer headers.
 *  - adminPageCsp(): tight Content-Security-Policy for the server-rendered
 *    /admin pages (they use no third-party resources at all).
 *  - rateLimit(): in-memory per-IP throttle. Requires `trust proxy` to see
 *    real client IPs when running behind Render's load balancer.
 */

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

function adminPageCsp(req, res, next) {
  // connect-src 'self' is required: the dashboard fetches its own /api/*
  // from the same origin. Without it the browser blocks those calls and
  // the page shows "Failed to fetch" even though the API is healthy.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'deny'",
  );
  next();
}

function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  const pruner = setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of hits) {
      if (e.reset <= now) hits.delete(ip);
    }
  }, windowMs);
  if (typeof pruner.unref === "function") pruner.unref();

  return (req, res, next) => {
    const ip = req.ip || "unknown";
    const now = Date.now();
    let e = hits.get(ip);
    if (!e || e.reset <= now) {
      e = { count: 0, reset: now + windowMs };
      hits.set(ip, e);
    }
    e.count += 1;
    if (e.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((e.reset - now) / 1000)));
      return res
        .status(429)
        .json({ error: message || "Too many requests — slow down and retry." });
    }
    next();
  };
}

module.exports = { securityHeaders, adminPageCsp, rateLimit };
