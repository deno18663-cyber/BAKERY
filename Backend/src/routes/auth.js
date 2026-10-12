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
const { login, logout, publicCustomer, customerFromToken } = require("../auth");

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
