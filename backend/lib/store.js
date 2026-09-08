"use strict";
/**
 * Opslaglaag.
 *
 * Probeert eerst SQLite (ingebouwd in Node 22.5+ als `node:sqlite`, geen npm
 * install nodig). Lukt dat niet, dan valt hij terug op een JSON-bestand, zodat
 * het project ook op een oudere Node draait. De rest van de app merkt daar
 * niets van: die praat alleen met de functies onderaan dit bestand.
 *
 * Let op: alle SQL hier gebruikt PARAMETERS (?), nooit string-concatenatie.
 * Dat is precies wat SQL-injectie onmogelijk maakt.
 */
const fs = require("node:fs");
const path = require("node:path");

const DATA_DIR = path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

let db = null;          // SQLite-verbinding, of null
let jsonPad = path.join(DATA_DIR, "db.json");
let jsonData = null;    // fallback in geheugen

try {
  const { DatabaseSync } = require("node:sqlite");
  db = new DatabaseSync(path.join(DATA_DIR, "radar.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS opdrachten (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS documenten (naam TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS gebruikers (
      naam TEXT PRIMARY KEY, hash TEXT NOT NULL, salt TEXT NOT NULL, gemaakt TEXT NOT NULL
    );
  `);
} catch (e) {
  db = null;
  if (fs.existsSync(jsonPad)) {
    try { jsonData = JSON.parse(fs.readFileSync(jsonPad, "utf8")); } catch (_) { jsonData = null; }
  }
  if (!jsonData) jsonData = { opdrachten: {}, documenten: {}, gebruikers: {} };
}

function bewaarJson() {
  fs.writeFileSync(jsonPad, JSON.stringify(jsonData, null, 2), "utf8");
}

const motor = db ? "sqlite" : "json";

/* ---------------- opdrachten ---------------- */

function alleOpdrachten() {
  if (db) {
    return db.prepare("SELECT id, data FROM opdrachten").all()
      .map((r) => Object.assign({ id: r.id }, JSON.parse(r.data)));
  }
  return Object.keys(jsonData.opdrachten)
    .map((id) => Object.assign({ id }, jsonData.opdrachten[id]));
}

function zetOpdracht(id, obj) {
  const tekst = JSON.stringify(obj);
  if (db) {
    db.prepare(
      "INSERT INTO opdrachten (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data"
    ).run(id, tekst);
    return;
  }
  jsonData.opdrachten[id] = obj;
  bewaarJson();
}

function verwijderOpdracht(id) {
  if (db) { db.prepare("DELETE FROM opdrachten WHERE id = ?").run(id); return; }
  delete jsonData.opdrachten[id];
  bewaarJson();
}

/* ---------------- losse documenten (specialisatie, instellingen) ---------------- */

function getDoc(naam) {
  if (db) {
    const r = db.prepare("SELECT data FROM documenten WHERE naam = ?").get(naam);
    return r ? JSON.parse(r.data) : {};
  }
  return jsonData.documenten[naam] || {};
}

function zetDoc(naam, obj) {
  const tekst = JSON.stringify(obj);
  if (db) {
    db.prepare(
      "INSERT INTO documenten (naam, data) VALUES (?, ?) ON CONFLICT(naam) DO UPDATE SET data = excluded.data"
    ).run(naam, tekst);
    return;
  }
  jsonData.documenten[naam] = obj;
  bewaarJson();
}

/* ---------------- gebruikers ---------------- */

function getGebruiker(naam) {
  if (db) return db.prepare("SELECT naam, hash, salt FROM gebruikers WHERE naam = ?").get(naam) || null;
  return jsonData.gebruikers[naam] || null;
}

function aantalGebruikers() {
  if (db) return db.prepare("SELECT COUNT(*) AS n FROM gebruikers").get().n;
  return Object.keys(jsonData.gebruikers).length;
}

function zetGebruiker(naam, hash, salt) {
  const nu = new Date().toISOString();
  if (db) {
    db.prepare(
      "INSERT INTO gebruikers (naam, hash, salt, gemaakt) VALUES (?, ?, ?, ?) " +
      "ON CONFLICT(naam) DO UPDATE SET hash = excluded.hash, salt = excluded.salt"
    ).run(naam, hash, salt, nu);
    return;
  }
  jsonData.gebruikers[naam] = { naam, hash, salt, gemaakt: nu };
  bewaarJson();
}

module.exports = {
  motor,
  alleOpdrachten, zetOpdracht, verwijderOpdracht,
  getDoc, zetDoc,
  getGebruiker, aantalGebruikers, zetGebruiker
};
