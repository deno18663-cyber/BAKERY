"use strict";

/**
 * Staff-only gate for the admin dashboard and sensitive API routes.
 * The key comes from the ADMIN_KEY env var. Clients send it as the
 * `x-admin-key` header (preferred) or the `?key=` query param.
 * Customer-facing routes (checkout, menu, reviews, newsletter signup)
 * stay public.
 */

function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) {
    return res
      .status(500)
      .json({ error: "ADMIN_KEY is not configured on the server." });
  }
  const provided = req.headers["x-admin-key"] || req.query.key;
  if (typeof provided !== "string" || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized: valid admin key required." });
  }
  next();
}

module.exports = adminAuth;
