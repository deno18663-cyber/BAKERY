"use strict";

/**
 * Passwordless customer auth (email + phone — no passwords to leak).
 * - login upserts a customer by email and mints a random session token.
 * - Only a SHA-256 hash of the token is stored; the raw token is shown
 *   once in the login response and kept by the customer's browser.
 * - Sessions expire after 30 days and are pruned lazily.
 * - customerAuth middleware attaches req.customer or returns 401.
 */

const crypto = require("crypto");
const db = require("./db");

const SESSION_DAYS = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function cleanPhone(phone) {
  return String(phone || "").replace(/[^\d]/g, "");
}

function validateIdentity({ name, email, phone }) {
  if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
    return "name is required (max 80 chars).";
  }
  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
    return "A valid email address is required.";
  }
  const digits = cleanPhone(phone);
  if (digits.length < 7 || digits.length > 15) {
    return "A valid phone number is required (7–15 digits).";
  }
  return null;
}

function pruneSessions(database) {
  const now = Date.now();
  database.sessions = database.sessions.filter((s) => s.expiresAt > now);
}

async function login({ name, email, phone }) {
  const problem = validateIdentity({ name, email, phone });
  if (problem) {
    const err = new Error(problem);
    err.status = 400;
    throw err;
  }
  return db.update((database) => {
    pruneSessions(database);
    const normalizedEmail = email.trim().toLowerCase();
    let customer = database.customers.find((c) => c.email === normalizedEmail);
    if (customer) {
      customer.name = name.trim().slice(0, 80);
      customer.phone = cleanPhone(phone);
    } else {
      customer = {
        id: db.uid("cus"),
        name: name.trim().slice(0, 80),
        email: normalizedEmail,
        phone: cleanPhone(phone),
        createdAt: new Date().toISOString(),
      };
      database.customers.push(customer);
    }
    const token = crypto.randomBytes(32).toString("hex");
    database.sessions.push({
      tokenHash: hashToken(token),
      customerId: customer.id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    });
    return { token, customer: publicCustomer(customer) };
  });
}

function publicCustomer(customer) {
  return { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone };
}

function customerFromToken(database, token) {
  if (typeof token !== "string" || token === "") return null;
  pruneSessions(database);
  const session = database.sessions.find((s) => s.tokenHash === hashToken(token));
  if (!session) return null;
  const customer = database.customers.find((c) => c.id === session.customerId);
  return customer ? publicCustomer(customer) : null;
}

function customerAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const customer = customerFromToken(db.get(), token);
  if (!customer) {
    return res.status(401).json({ error: "Please sign in with your email and phone number to order." });
  }
  req.customer = customer;
  next();
}

async function logout(token) {
  if (!token) return;
  await db.update((database) => {
    database.sessions = database.sessions.filter((s) => s.tokenHash !== hashToken(token));
  });
}

module.exports = { login, logout, customerAuth, customerFromToken, publicCustomer };
