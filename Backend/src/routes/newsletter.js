"use strict";

/**
 * Newsletter ("the proofing list"): subscribe + admin listing.
 *   POST /api/newsletter   { email }
 *   GET  /api/newsletter   (count + emails; protect this in production)
 */

const express = require("express");
const db = require("../db");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { email } = req.body || {};
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
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

router.get("/", (req, res) => {
  const { subscribers } = db.get();
  res.json({ count: subscribers.length, subscribers });
});

module.exports = router;
