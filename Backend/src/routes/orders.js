"use strict";

/**
 * Orders + custom orders (cake builder / bake box).
 * Prices are ALWAYS computed server-side from the catalog —
 * the client-sent price is ignored, so totals can't be forged.
 *
 *   POST /api/orders          { items: [{id, qty, options?}], customer: {name, phone?}, note? }
 *   POST /api/orders/custom   { kind: 'cake'|'box', ... }  (cake builder / bake box)
 */

const express = require("express");
const db = require("../db");
const adminAuth = require("../admin-auth");

const router = express.Router();

const VALID_STATUSES = ["pending", "ready", "completed", "cancelled"];

function priceMap(database) {
  const map = new Map();
  for (const p of database.products) map.set(p.id, p);
  for (const m of database.menu) if (!map.has(m.id)) map.set(m.id, m);
  for (const b of database.customizer.boxSlots) if (!map.has(b.id)) map.set(b.id, b);
  // Synthetic ids used by the current frontend cart
  map.set("custom-cake", {
    id: "custom-cake",
    name: "Custom Celebration Cake",
    price: database.customizer.customCakePrice,
    emoji: "🎂",
  });
  map.set("custom-box", {
    id: "custom-box",
    name: "Build-Your-Box · 6 treats",
    price: database.customizer.boxPrice,
    emoji: "📦",
  });
  return map;
}

function validateItems(catalog, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "items must be a non-empty array of { id, qty }" };
  }
  const lines = [];
  for (const raw of items) {
    const id = raw && raw.id;
    const qty = raw && raw.qty;
    if (typeof id !== "string" || !catalog.has(id)) {
      return { error: `Unknown item id: ${JSON.stringify(id)}. Fetch /api/products or /api/menu for valid ids.` };
    }
    const q = Number(qty);
    if (!Number.isInteger(q) || q < 1 || q > 99) {
      return { error: `Invalid qty for item "${id}": must be an integer 1–99.` };
    }
    const entry = catalog.get(id);
    lines.push({
      id: entry.id,
      name: entry.name,
      emoji: entry.emoji || "🍞",
      unitPrice: entry.price,
      qty: q,
      lineTotal: Math.round(entry.price * q * 100) / 100,
      options: typeof raw.options === "string" ? raw.options.slice(0, 300) : undefined,
    });
  }
  return { lines };
}

// ── Create a standard order ───────────────────────────────
router.post("/", async (req, res) => {
  const { items, customer = {}, note } = req.body || {};
  const name = typeof customer.name === "string" ? customer.name.trim() : "";

  const order = await db.update((database) => {
    const catalog = priceMap(database);
    const checked = validateItems(catalog, items);
    if (checked.error) {
      // Throw a flagged error so the catch below returns 400.
      const err = new Error(checked.error);
      err.status = 400;
      throw err;
    }
    const subtotal = Math.round(checked.lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
    const record = {
      id: db.uid("ord"),
      type: "standard",
      lines: checked.lines,
      subtotal,
      total: subtotal,
      currency: "USD",
      customer: {
        name,
        phone: typeof customer.phone === "string" ? customer.phone.slice(0, 40) : undefined,
      },
      note: typeof note === "string" ? note.slice(0, 500) : undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    database.orders.unshift(record);
    return record;
  }).catch((err) => ({ __error: err }));

  if (order && order.__error) {
    return res.status(order.__error.status || 500).json({ error: order.__error.message });
  }
  res.status(201).json(order);
});

// ── Create a custom cake / bake-box order ─────────────────
router.post("/custom", async (req, res) => {
  const body = req.body || {};
  const { kind, customer = {}, message } = body;
  if (kind !== "cake" && kind !== "box") {
    return res.status(400).json({ error: "kind must be 'cake' or 'box'" });
  }

  const order = await db.update((database) => {
    const cz = database.customizer;
    let lines;
    if (kind === "cake") {
      const { base, frosting, toppings = [] } = body;
      if (!cz.bases.some((b) => b.id === base)) {
        throw Object.assign(new Error(`Unknown base "${base}". GET /api/customizer for options.`), { status: 400 });
      }
      if (!cz.frostings.some((f) => f.id === frosting)) {
        throw Object.assign(new Error(`Unknown frosting "${frosting}". GET /api/customizer for options.`), { status: 400 });
      }
      const bad = (Array.isArray(toppings) ? toppings : []).filter((t) => !cz.toppings.some((x) => x.id === t));
      if (bad.length) {
        throw Object.assign(new Error(`Unknown topping(s): ${bad.join(", ")}`), { status: 400 });
      }
      const baseLabel = cz.bases.find((b) => b.id === base).label;
      const frostLabel = cz.frostings.find((f) => f.id === frosting).label;
      const topLabels = (Array.isArray(toppings) ? toppings : []).map((t) => cz.toppings.find((x) => x.id === t).label);
      lines = [
        {
          id: "custom-cake",
          name: "Custom Celebration Cake",
          emoji: "🎂",
          unitPrice: cz.customCakePrice,
          qty: 1,
          lineTotal: cz.customCakePrice,
          options: `${baseLabel} · ${frostLabel}${topLabels.length ? ` + ${topLabels.join(", ")}` : ""}`,
        },
      ];
    } else {
      const { slots } = body;
      if (!Array.isArray(slots) || slots.length !== 6 || slots.some((s) => typeof s !== "string")) {
        throw Object.assign(new Error("box orders need slots: an array of exactly 6 box product ids."), { status: 400 });
      }
      const bad = slots.filter((s) => !cz.boxSlots.some((b) => b.id === s));
      if (bad.length) {
        throw Object.assign(new Error(`Unknown box item(s): ${bad.join(", ")}. GET /api/customizer for options.`), {
          status: 400,
        });
      }
      const names = slots.map((s) => cz.boxSlots.find((b) => b.id === s).name);
      lines = [
        {
          id: "custom-box",
          name: "Build-Your-Box · 6 treats",
          emoji: "📦",
          unitPrice: cz.boxPrice,
          qty: 1,
          lineTotal: cz.boxPrice,
          options: names.join(", "),
        },
      ];
    }
    const subtotal = lines[0].lineTotal;
    const record = {
      id: db.uid("ord"),
      type: kind === "cake" ? "custom-cake" : "custom-box",
      lines,
      subtotal,
      total: subtotal,
      currency: "USD",
      customer: {
        name: typeof customer.name === "string" ? customer.name.trim().slice(0, 80) : "",
        phone: typeof customer.phone === "string" ? customer.phone.slice(0, 40) : undefined,
      },
      message: typeof message === "string" ? message.slice(0, 300) : undefined,
      spec: kind === "cake" ? { base: body.base, frosting: body.frosting, toppings: body.toppings || [] } : { slots: body.slots },
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    database.orders.unshift(record);
    return record;
  }).catch((err) => ({ __error: err }));

  if (order && order.__error) {
    return res.status(order.__error.status || 500).json({ error: order.__error.message });
  }
  res.status(201).json(order);
});

// ── List / fetch / update status ──────────────────────────
// Listing + status changes are staff-only. Single-order lookup stays
// public (ids are unguessable) so customers could track their own order.
router.get("/", adminAuth, (req, res) => {
  const { orders } = db.get();
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10) || 20, 1), 100);
  res.json({ count: orders.length, orders: orders.slice(0, limit) });
});

router.get("/:id", (req, res) => {
  const { orders } = db.get();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

router.patch("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` });
  }
  const updated = await db.update((database) => {
    const order = database.orders.find((o) => o.id === req.params.id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  });
  if (!updated) return res.status(404).json({ error: "Order not found" });
  res.json(updated);
});

module.exports = router;
