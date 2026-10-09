"use strict";

/**
 * Newsletter ("the proofing list"): subscribe + admin listing.
 *   POST /api/newsletter   { email }
 *   GET  /api/newsletter   (staff-only subscriber list)
 */

const express = require("express");
const db = require("../db");
const adminAuth = require("../admin-auth");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { email, company } = req.body || {};
  // Honeypot: bots fill `company`; pretend success, store nothing.
  if (typeof company === "string" && company.trim() !== "") {
    return res.json({ ok: true, message: "You're on the list. Welcome in." });
  }
  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "A valid email address is required." });
  }
  const normalized = email.trim().toLowerCase();

  const result = await db.update((database) => {
    if (database.subscribers.some((s) => s.email === normalized)) {
      return { already: true };
    }
    database.subscribers.unshift({ email: normalized, subscribedAt: new Date().toISOString() });
    return { already: false };
  });

  if (result.already) {
    return res.json({ ok: true, message: "You're already on the list. Welcome back." });
  }
  res.status(201).json({ ok: true, message: "You're on the list. Welcome in." });
});

router.get("/", adminAuth, (req, res) => {
  const { subscribers } = db.get();
  res.json({ count: subscribers.length, subscribers });
});

module.exports = router;
