"use strict";

/**
 * Oven & Artisan — backend API.
 *
 * Run:  npm install  →  npm start   (or npm run dev for auto-reload)
 * Health: GET http://localhost:4000/api/health
 *
 * Endpoints (JSON):
 *   GET  /api/health
 *   GET  /api/products[?category=]        GET /api/products/:id
 *   GET  /api/menu[?category=&search=]    GET /api/menu/:id
 *   GET  /api/customizer
 *   POST /api/orders                     { items: [{id, qty, options?}], customer: {name, phone?}, note? }
 *   POST /api/orders/custom              { kind:'cake', base, frosting, toppings[], customer, message? }
 *                                        { kind:'box', slots:[6 ids], customer, message? }
 *   GET  /api/orders[?limit=]             GET /api/orders/:id
 *   PATCH /api/orders/:id/status          { status: pending|ready|completed|cancelled }
 *   GET  /api/reviews                    POST /api/reviews  { name, rating 1-5, text }
 *   POST /api/newsletter                 { email }           GET /api/newsletter
 *   GET  /api/store-info/store | /hours | /schedule[?at=ISO]
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");
const { productsRouter, menuRouter, customizerRouter } = require("./routes/products");
const ordersRouter = require("./routes/orders");
const reviewsRouter = require("./routes/reviews");
const newsletterRouter = require("./routes/newsletter");
const storeRouter = require("./routes/store");

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

app.use(cors({ origin: FRONTEND_URL.split(",").map((s) => s.trim()), maxAge: 86400 }));
app.use(express.json({ limit: "256kb" }));

// Ensure data/db.json exists (seeded) before serving anything.
db.get();

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "oven-and-artisan-backend", time: new Date().toISOString() });
});

// Staff order dashboard (reads /api/orders, updates status via PATCH).
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

app.use("/api/products", productsRouter);
app.use("/api/menu", menuRouter);
app.use("/api/customizer", customizerRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/newsletter", newsletterRouter);
// Backwards-friendly alias: the signup form posts an email.
app.use("/api/subscribe", newsletterRouter);
app.use("/api/store-info", storeRouter);
// Short aliases some frontends expect:
app.get("/api/store", (req, res) => res.json(db.get().store));
app.get("/api/hours", (req, res) => res.json(db.get().hours));

app.use("/api", (req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n  Oven & Artisan backend listening on http://localhost:${PORT}`);
    console.log(`  Allowing frontend: ${FRONTEND_URL}`);
    console.log(`  Health check: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
