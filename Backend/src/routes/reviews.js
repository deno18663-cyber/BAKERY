"use strict";

/**
 * Reviews: list all, submit a new one.
 *   GET  /api/reviews
 *   POST /api/reviews   { name, rating (1-5), text }
 */

const express = require("express");
const db = require("../db");

const router = express.Router();

const PALETTE = ["#E09F3E", "#9E2A2B", "#889681", "#540B0E", "#C98A4B"];

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

router.get("/", (req, res) => {
  const { reviews } = db.get();
  res.json(reviews);
});

router.post("/", async (req, res) => {
  const { name, rating, text } = req.body || {};
  if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
    return res.status(400).json({ error: "name is required (max 80 chars)." });
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ error: "rating must be an integer 1–5." });
  }
  if (typeof text !== "string" || !text.trim() || text.trim().length > 1000) {
    return res.status(400).json({ error: "text is required (max 1000 chars)." });
  }

  const review = await db.update((database) => {
    const record = {
      id: db.uid("rev"),
      name: name.trim(),
      rating: r,
      date: "just now",
      text: text.trim(),
      initials: initials(name),
      color: PALETTE[database.reviews.length % PALETTE.length],
      createdAt: new Date().toISOString(),
    };
    database.reviews.unshift(record);
    return record;
  });

  res.status(201).json(review);
});

module.exports = router;
