"use strict";

/**
 * Staff-only gate for the admin dashboard and sensitive API routes.
 * The key comes from the ADMIN_KEY env var. Clients send it as the
 * `x-admin-key` header (preferred) or the `?key=` query param.
 * Customer-facing routes (checkout, menu, reviews, newsletter signup)
 * stay public.
 */

const crypto = require("crypto");

/** Constant-time comparison so key bytes can't be probed one by one. */
function keyMatches(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return res
      .status(500)
      .json({ error: "ADMIN_KEY is not configured on the server." });
  }
  const provided = req.headers["x-admin-key"] || req.query.key;
  if (typeof provided !== "string" || !keyMatches(provided, expected)) {
    return res.status(401).json({ error: "Unauthorized: valid admin key required." });
  }
  next();
}

module.exports = adminAuth;
module.exports.keyMatches = keyMatches;
