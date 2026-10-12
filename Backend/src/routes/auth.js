"use strict";

/**
 * Customer sessions.
 *   POST /api/auth/login    { name, email, phone } → { token, customer }
 *   GET  /api/auth/me       (Bearer token) → { customer }
 *   POST /api/auth/logout   (Bearer token) → { ok: true }
 *   GET  /api/customers     (staff-only via ADMIN_KEY)
 */

const express = require("express");
const db = require("../db");
const adminAuth = require("../admin-auth");
const { login, logout, publicCustomer, customerFromToken, validateIdentity, cleanPhone } = require("../auth");

const router = express.Router();
const customersRouter = express.Router();

router.post("/login", async (req, res) => {
  try {
    const result = await login(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.status ? err.message : "Internal server error" });
  }
});

router.get("/me", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const customer = customerFromToken(db.get(), token);
  if (!customer) return res.status(401).json({ error: "Session expired — please sign in again." });
  res.json({ customer });
});

router.post("/logout", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  await logout(token);
  res.json({ ok: true });
});

// Edit own details — same strict checks as sign-up (email format,
// 10-digit Indian mobile). Changing to another customer's email is refused.
router.patch("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const current = customerFromToken(db.get(), token);
  if (!current) return res.status(401).json({ error: "Session expired — please sign in again." });

  const { name, email, phone } = req.body || {};
  const problem = validateIdentity({ name, email, phone });
  if (problem) return res.status(400).json({ error: problem });

  const updated = await db.update((database) => {
    const me = database.customers.find((c) => c.id === current.id);
    if (!me) return null;
    const normalizedEmail = String(email).trim().toLowerCase();
    const clash = database.customers.find((c) => c.email === normalizedEmail && c.id !== me.id);
    if (clash) return { __conflict: true };
    me.name = String(name).trim().slice(0, 80);
    me.email = normalizedEmail;
    me.phone = cleanPhone(phone);
    return publicCustomer(me);
  }).catch(() => null);

  if (!updated) return res.status(404).json({ error: "Account not found." });
  if (updated.__conflict) {
    return res.status(409).json({ error: "That email belongs to another account — use a different one." });
  }
  res.json({ customer: updated });
});

// Staff-only customer list (emails + phones — keep the key secret).
customersRouter.get("/", adminAuth, (req, res) => {
  const { customers, orders } = db.get();
  res.json(
    customers.map((c) => ({
      ...publicCustomer(c),
      orders: orders.filter((o) => o.customerId === c.id).length,
    })),
  );
});

module.exports = { router, customersRouter };
