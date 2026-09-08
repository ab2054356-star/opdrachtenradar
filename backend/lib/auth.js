"use strict";
/**
 * Inloggen, sessies en het afremmen van brute force.
 *
 * Drie dingen die je in elk veilig systeem terugziet:
 *  1. Wachtwoorden worden NOOIT opgeslagen — alleen een scrypt-hash met een
 *     eigen salt per gebruiker. Uit de hash valt het wachtwoord niet terug te
 *     rekenen, en twee gebruikers met hetzelfde wachtwoord krijgen door de salt
 *     toch een andere hash.
 *  2. Vergelijken gebeurt met timingSafeEqual. Een gewone === vergelijking stopt
 *     bij het eerste verschillende teken; uit dat tijdsverschil kan een aanvaller
 *     de hash letter voor letter raden.
 *  3. Sessies zijn willekeurige tokens (128 bits) in een httpOnly-cookie. De
 *     browser kan er met JavaScript niet bij, dus XSS kan de sessie niet stelen.
 */
const crypto = require("node:crypto");
const store = require("./store");

const SESSIE_DUUR_MS = 8 * 60 * 60 * 1000;   // 8 uur
const MAX_POGINGEN = 5;                       // per IP
const BLOKKADE_MS = 15 * 60 * 1000;           // 15 minuten

const sessies = new Map();   // token -> { gebruiker, verloopt }
const pogingen = new Map();  // ip -> { aantal, tot }

function hashWachtwoord(wachtwoord, salt) {
  // 64 bytes, standaard scrypt-kosten: bewust traag, zodat raden duur is.
  return crypto.scryptSync(wachtwoord, salt, 64).toString("hex");
}

function maakGebruiker(naam, wachtwoord) {
  const salt = crypto.randomBytes(16).toString("hex");
  store.zetGebruiker(naam, hashWachtwoord(wachtwoord, salt), salt);
}

function wachtwoordKlopt(naam, wachtwoord) {
  const g = store.getGebruiker(naam);
  if (!g) {
    // Toch een hash berekenen: anders verraadt de snelheid of de naam bestaat.
    hashWachtwoord(wachtwoord, "onbestaande-gebruiker");
    return false;
  }
  const a = Buffer.from(hashWachtwoord(wachtwoord, g.salt), "hex");
  const b = Buffer.from(g.hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------------- brute force afremmen ---------------- */

function geblokkeerd(ip) {
  const p = pogingen.get(ip);
  if (!p) return false;
  if (Date.now() > p.tot) { pogingen.delete(ip); return false; }
  return p.aantal >= MAX_POGINGEN;
}

function noteerMislukt(ip) {
  const p = pogingen.get(ip) || { aantal: 0, tot: 0 };
  p.aantal += 1;
  p.tot = Date.now() + BLOKKADE_MS;
  pogingen.set(ip, p);
}

function wisPogingen(ip) { pogingen.delete(ip); }

/* ---------------- sessies ---------------- */

function startSessie(gebruiker) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessies.set(token, { gebruiker, verloopt: Date.now() + SESSIE_DUUR_MS });
  return token;
}

function sessieVan(token) {
  if (!token) return null;
  const s = sessies.get(token);
  if (!s) return null;
  if (Date.now() > s.verloopt) { sessies.delete(token); return null; }
  return s;
}

function stopSessie(token) { if (token) sessies.delete(token); }

function leesCookie(req, naam) {
  const rauw = req.headers.cookie;
  if (!rauw) return null;
  for (const deel of rauw.split(";")) {
    const i = deel.indexOf("=");
    if (i < 0) continue;
    if (deel.slice(0, i).trim() === naam) return decodeURIComponent(deel.slice(i + 1).trim());
  }
  return null;
}

/**
 * Secure ontbreekt bewust zolang je op http://localhost draait; zodra er HTTPS
 * voor staat hoort "; Secure" erbij. SameSite=Strict blokkeert CSRF: de cookie
 * gaat niet mee met verzoeken die vanaf een andere site worden gestart.
 */
function sessieCookie(token, verlooptMs) {
  const delen = [
    "radar_sessie=" + encodeURIComponent(token),
    "HttpOnly", "SameSite=Strict", "Path=/",
    "Max-Age=" + Math.floor(verlooptMs / 1000)
  ];
  if (process.env.RADAR_HTTPS === "1") delen.push("Secure");
  return delen.join("; ");
}

module.exports = {
  SESSIE_DUUR_MS, MAX_POGINGEN,
  maakGebruiker, wachtwoordKlopt,
  geblokkeerd, noteerMislukt, wisPogingen,
  startSessie, sessieVan, stopSessie,
  leesCookie, sessieCookie
};
