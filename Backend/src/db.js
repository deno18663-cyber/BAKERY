"use strict";

/**
 * Tiny JSON-file database.
 * - Lives in ../data/db.json (created + seeded on first run).
 * - No native modules, no external DB server needed.
 * - Writes are atomic (tmp file + rename) and serialized via a promise chain.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let writeChain = Promise.resolve();

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDb() {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    const seed = require("./seed");
    const initial = seed.buildInitialDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(raw);
}

function writeDb(db) {
  ensureDir();
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_FILE);
}

/** Read-only access. */
function get() {
  return readDb();
}

/**
 * Mutate the DB safely: fn receives the db object, may mutate it,
 * optionally return a value that resolves from update().
 */
function update(fn) {
  const run = async () => {
    const db = readDb();
    const result = await fn(db);
    writeDb(db);
    return result;
  };
  const p = writeChain.then(run, run);
  // Keep the chain alive even if one write fails.
  writeChain = p.catch(() => {});
  return p;
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = { get, update, uid, DB_FILE };
