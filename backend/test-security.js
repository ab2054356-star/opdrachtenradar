"use strict";
/**
 * Automatische beveiligingstest voor de Opdrachtenradar-server.
 *
 *   node backend/test-security.js
 *
 * Geen testframework en geen npm-pakketten: alleen node:child_process om de
 * server te starten en de in Node ingebouwde fetch om hem te bevragen.
 *
 * De server draait tijdens de test op een EIGEN poort (3999, niet de standaard
 * 3000) met een WEGWERP-database en WEGWERP-gebruiker in de tijdelijke map van
 * het besturingssysteem. Je echte opdrachten, je wachtwoord-hash en je auth.log
 * blijven ongemoeid. Na afloop wordt alles opgeruimd.
 *
 * Exitcode 0 = alles geslaagd, 1 = minstens één test gefaald.
 */
const { spawn, spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const POORT = Number(process.env.TEST_PORT || 3999);
const BASIS = "http://127.0.0.1:" + POORT;
const GEBRUIKER = "testrunner";
const WACHTWOORD = "proef-" + crypto.randomBytes(12).toString("hex");   // alleen in het geheugen
const SERVER = path.join(__dirname, "server.js");
const AUTH = path.join(__dirname, "lib", "auth.js");

/* ---------------- kleine helpers ---------------- */

const slaap = (ms) => new Promise((r) => setTimeout(r, ms));

// De tests draaien niet op volgorde (test 3 blokkeert de gebruiker, dus die
// moet als laatste), maar de uitvoer sorteren we terug op nummer.
const resultaten = [];
function check(nr, naam, ok) {
  resultaten.push({ nr, naam, ok: !!ok });
}

function postJson(pad, body, cookie) {
  return fetch(BASIS + pad, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, cookie ? { Cookie: cookie } : {}),
    body: JSON.stringify(body)
  });
}
function putJson(pad, body, cookie) {
  return fetch(BASIS + pad, {
    method: "PUT",
    headers: Object.assign({ "Content-Type": "application/json" }, cookie ? { Cookie: cookie } : {}),
    body: JSON.stringify(body)
  });
}
async function haalOpdrachten(cookie) {
  const r = await fetch(BASIS + "/api/state", { headers: { Cookie: cookie } });
  const j = await r.json();
  return j.opdrachten || [];
}

/* ---------------- opzet ---------------- */

const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "orad-test-"));
const omgeving = Object.assign({}, process.env, {
  PORT: String(POORT),
  HOST: "127.0.0.1",
  RADAR_DATA_DIR: DATA_DIR,
  RADAR_HTTPS: ""            // over http testen, geen Secure-flag op de cookie
});

let server = null;

async function stopServer() {
  if (!server || server.exitCode !== null || server.signalCode !== null) return;
  await new Promise((klaar) => {
    let gedaan = false;
    const af = () => { if (!gedaan) { gedaan = true; klaar(); } };
    server.once("exit", af);
    try { server.kill(); } catch (_) { af(); }
    setTimeout(() => { try { server.kill("SIGKILL"); } catch (_) {} af(); }, 2000);
  });
}

// Windows geeft de SQLite-bestandslock pas een tik na het afsluiten van de
// server vrij; even opnieuw proberen tot de wegwerpmap echt weg is.
async function verwijderDataDir() {
  for (let i = 0; i < 20; i++) {
    try { fs.rmSync(DATA_DIR, { recursive: true, force: true }); return; }
    catch (_) { await slaap(100); }
  }
}

async function wachtOpServer() {
  for (let i = 0; i < 100; i++) {
    try { await fetch(BASIS + "/api/state"); return true; }
    catch (_) { await slaap(100); }
  }
  return false;
}

/* ---------------- testrun ---------------- */

async function testen() {
  // Wegwerp-gebruiker in de wegwerp-database zetten. Dit gebeurt in een apart
  // node-proces dat meteen weer afsluit, zodat de SQLite-lock vrij is voordat
  // de server start.
  const mk = spawnSync(process.execPath, ["-e",
    "const a=require(" + JSON.stringify(AUTH) + ");" +
    "a.maakGebruiker(" + JSON.stringify(GEBRUIKER) + "," + JSON.stringify(WACHTWOORD) + ");"
  ], { env: omgeving, encoding: "utf8" });
  if (mk.status !== 0) {
    throw new Error("Kon de testgebruiker niet aanmaken:\n" + (mk.stderr || mk.stdout || ""));
  }

  let serverUit = "";
  server = spawn(process.execPath, [SERVER], { env: omgeving, stdio: ["ignore", "pipe", "pipe"] });
  server.stdout.on("data", (d) => { serverUit += d; });
  server.stderr.on("data", (d) => { serverUit += d; });

  if (!(await wachtOpServer())) {
    throw new Error("De testserver kwam niet op poort " + POORT + " omhoog.\n" + serverUit);
  }

  // 1. /api/state zonder cookie
  let r = await fetch(BASIS + "/api/state");
  check(1, "GET /api/state zonder cookie geeft 401", r.status === 401);

  // 2. login met fout wachtwoord
  r = await postJson("/api/login", { gebruiker: GEBRUIKER, wachtwoord: "fout-wachtwoord" });
  check(2, "Login met fout wachtwoord geeft 401", r.status === 401);

  // 4. juiste login (vóór test 3: een geslaagde login wist de pogingenteller,
  //    zodat test 3 met een schone lei van zes pogingen begint)
  r = await postJson("/api/login", { gebruiker: GEBRUIKER, wachtwoord: WACHTWOORD });
  const setCookie = r.headers.get("set-cookie") || "";
  check(4, "Juiste login geeft 200 + Set-Cookie met HttpOnly en SameSite=Strict",
    r.status === 200 && /HttpOnly/i.test(setCookie) && /SameSite=Strict/i.test(setCookie));
  const cookie = setCookie.split(";")[0];   // "radar_sessie=..."

  // 5. link=javascript:... moet leeg opgeslagen worden
  await putJson("/api/opdrachten/test-xss-link", { titel: "xss", link: "javascript:alert(1)" }, cookie);
  let op = (await haalOpdrachten(cookie)).find((o) => o.id === "test-xss-link");
  check(5, "Opdracht met link=javascript:alert(1) wordt opgeslagen met lege link",
    !!op && op.link === "");

  // 6. onbekend veld mag niet opgeslagen worden
  await putJson("/api/opdrachten/test-onbekend-veld",
    { titel: "onbekend", stiekem: "nep", isAdmin: true }, cookie);
  op = (await haalOpdrachten(cookie)).find((o) => o.id === "test-onbekend-veld");
  check(6, "Onbekend veld (stiekem/isAdmin) wordt niet opgeslagen",
    !!op && !("stiekem" in op) && !("isAdmin" in op));

  // 8. cijfer=99 valt buiten 1..10 en moet leeg opgeslagen worden
  await putJson("/api/opdrachten/test-cijfer-99", { titel: "cijfer", cijfer: 99 }, cookie);
  op = (await haalOpdrachten(cookie)).find((o) => o.id === "test-cijfer-99");
  check(8, "Opdracht met cijfer=99 wordt opgeslagen met leeg cijfer",
    !!op && op.cijfer === "");

  // 7. padtraversal naar de database mag nooit 200 geven. fetch normaliseert
  //    "/../" al weg; de %2e- en %2f-varianten komen ongewijzigd bij de server.
  const traversalPaden = [
    "/../backend/data/radar.db",
    "/%2e%2e/backend/data/radar.db",
    "/..%2f..%2fbackend%2fdata%2fradar.db"
  ];
  const codes = [];
  let geenLek = true;
  for (const p of traversalPaden) {
    const rr = await fetch(BASIS + p);
    codes.push(rr.status);
    if (rr.status === 200) geenLek = false;
  }
  check(7, "Padtraversal naar radar.db geeft geen 200 (codes: " + codes.join(", ") + ")", geenLek);

  // 3. zes foute pogingen achter elkaar: de zesde wordt geblokkeerd met 429
  let zesde = null;
  let vroegGeblokkeerd = false;
  for (let i = 1; i <= 6; i++) {
    const rr = await postJson("/api/login", { gebruiker: GEBRUIKER, wachtwoord: "steeds-fout" });
    if (i < 6 && rr.status === 429) vroegGeblokkeerd = true;
    if (i === 6) zesde = rr.status;
  }
  check(3, "Zes foute pogingen achter elkaar: de zesde geeft 429",
    zesde === 429 && !vroegGeblokkeerd);

}

async function main() {
  try {
    await testen();
  } finally {
    await stopServer();
    await verwijderDataDir();
  }
  // uitvoer op nummer, daarna de samenvatting
  resultaten.sort((a, b) => a.nr - b.nr);
  for (const x of resultaten) {
    console.log((x.ok ? "PASS" : "FAIL") + "  " + x.nr + ". " + x.naam);
  }
  const gefaald = resultaten.filter((x) => !x.ok).length;
  const geslaagd = resultaten.length - gefaald;
  console.log("");
  console.log("Samenvatting: " + geslaagd + "/" + resultaten.length + " geslaagd" +
    (gefaald ? " — " + gefaald + " GEFAALD" : ""));
  return gefaald ? 1 : 0;
}

// Laatste vangnet: als het proces om welke reden dan ook stopt, in elk geval
// de server neerhalen en de wegwerpmap opruimen (synchroon, best effort).
process.on("exit", () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    try { server.kill("SIGKILL"); } catch (_) {}
  }
  try { fs.rmSync(DATA_DIR, { recursive: true, force: true }); } catch (_) {}
});
process.on("SIGINT", () => process.exit(1));

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error("Onverwachte fout in de test:", e && e.message ? e.message : e);
    process.exit(1);
  }
);
