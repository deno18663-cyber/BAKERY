"use strict";

/**
 * Catalog: products, full menu, and customizer options.
 * Read-only — backed by the seed data in data/db.json.
 * Mounted as:
 *   /api/products, /api/menu, /api/customizer
 */

const express = require("express");
const db = require("../db");

const VALID_CATEGORIES = ["pastries", "breads", "cakes", "gluten-free"];

const productsRouter = express.Router();
const menuRouter = express.Router();
const customizerRouter = express.Router();

// ── Products ──────────────────────────────────────────────
productsRouter.get("/", (req, res) => {
  const { products } = db.get();
  const { category } = req.query;
  if (category) {
    if (!VALID_CATEGORIES.includes(String(category))) {
      return res.status(400).json({ error: `Invalid category. Use one of: ${VALID_CATEGORIES.join(", ")}` });
    }
    return res.json(products.filter((p) => p.category === category));
  }
  res.json(products);
});

productsRouter.get("/:id", (req, res) => {
  const { products } = db.get();
  const item = products.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(item);
});

// ── Menu (searchable) ─────────────────────────────────────
menuRouter.get("/", (req, res) => {
  const { menu } = db.get();
  const { category, search } = req.query;
  let items = menu;
  if (category) {
    if (!VALID_CATEGORIES.includes(String(category))) {
      return res.status(400).json({ error: `Invalid category. Use one of: ${VALID_CATEGORIES.join(", ")}` });
    }
    items = items.filter((m) => m.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        (m.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }
  res.json(items);
});

menuRouter.get("/:id", (req, res) => {
  const { menu } = db.get();
  const item = menu.find((m) => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json(item);
});

// ── Customizer options (cake builder + bake box) ──────────
customizerRouter.get("/", (req, res) => {
  const { customizer } = db.get();
  res.json(customizer);
});

module.exports = { productsRouter, menuRouter, customizerRouter };
