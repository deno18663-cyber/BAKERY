"use strict";

/**
 * Store info, hours, and the live "Fresh out of the oven" schedule.
 * The schedule math mirrors the frontend's lib/bakery-schedule.ts,
 * but is computed here on server time.
 *   GET /api/store
 *   GET /api/hours
 *   GET /api/schedule   (each item + live phase, with ?at=ISO-timestamp override)
 */

const express = require("express");
const db = require("../db");

const router = express.Router();

function parseHM(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fmtClock(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function cycleStatus(item, now) {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const elapsed = (now.getTime() - startOfDay.getTime()) / 60000;
  const cycleMin = item.bakeMin + item.coolMin + item.idleMin;
  const pos = ((elapsed % cycleMin) + cycleMin) % cycleMin;

  if (pos < item.bakeMin) {
    return {
      phase: "oven",
      label: "In the oven",
      minutesToNext: Math.ceil(item.bakeMin - pos),
      minutesUntilReady: Math.ceil(item.coolMin + (item.bakeMin - pos)),
      cycleMin,
    };
  }
  const coolingEnd = item.bakeMin + item.coolMin;
  if (pos < coolingEnd) {
    return {
      phase: "cooling",
      label: "Fresh out · cooling",
      minutesToNext: Math.ceil(coolingEnd - pos),
      minutesUntilReady: 0,
      cycleMin,
    };
  }
  return {
    phase: "idle",
    label: "Next batch",
    minutesToNext: Math.ceil(cycleMin - pos),
    minutesUntilReady: Math.ceil(cycleMin - pos + item.bakeMin),
    cycleMin,
  };
}

function openStatus(hours, now) {
  const dayIdx = now.getDay(); // 0 = Sunday
  const idx = (dayIdx + 6) % 7; // re-map to Monday-first HOURS order
  const today = hours[idx];
  const cur = now.getHours() * 60 + now.getMinutes();

  if (today && today.open && today.close) {
    const open = parseHM(today.open);
    const close = parseHM(today.close);
    if (cur >= open && cur < close) {
      const closesAt = fmtClock(today.close);
      return { open: true, label: `Open today until ${closesAt}`, closesAt, opensAt: null };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = hours[(idx + i) % 7];
    if (d && d.open) {
      return { open: false, label: `Closed · opens ${fmtClock(d.open)}`, closesAt: null, opensAt: fmtClock(d.open) };
    }
  }
  return { open: false, label: "Closed today", closesAt: null, opensAt: null };
}

router.get("/store", (req, res) => {
  const { store } = db.get();
  res.json(store);
});

router.get("/hours", (req, res) => {
  const { hours } = db.get();
  res.json(hours);
});

router.get("/schedule", (req, res) => {
  const { schedule, hours } = db.get();
  let now = new Date();
  if (req.query.at) {
    const parsed = new Date(req.query.at);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ error: "Invalid ?at timestamp. Use an ISO string." });
    }
    now = parsed;
  }
  res.json({
    serverTime: now.toISOString(),
    open: openStatus(hours, now),
    items: schedule.map((item) => ({ ...item, status: cycleStatus(item, now) })),
  });
});

module.exports = router;
