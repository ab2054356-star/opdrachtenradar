"use strict";
/**
 * Opdrachtenradar — server.
 *
 * Bewust zonder frameworks en zonder npm-pakketten: alleen wat in Node zit.
 * Je ziet daardoor precies wat er over de lijn gaat — handig als je later
 * moet uitleggen waarom iets veilig of juist lek is.
 *
 * Starten:   node backend/server.js
 * Gebruiker: node backend/setup-user.js <naam>
 */
const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const store = require("./lib/store");
const auth = require("./lib/auth");

const POORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";   // alleen lokaal; 0.0.0.0 pas als je het bewust openzet
const FRONTEND = path.join(__dirname, "..", "frontend");
const MAX_BODY = 64 * 1024;                      // 64 KB is ruim voor een opdracht

/* HTTPS. Liggen er een sleutel en een certificaat in backend/data/, dan start de
   server met TLS; anders gewoon http. Zo blijft het project draaien op een
   machine waar nog geen certificaat is aangemaakt.
   Maken:  openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
             -keyout backend/data/key.pem -out backend/data/cert.pem \
             -subj "/CN=127.0.0.1" -addext "subjectAltName=IP:127.0.0.1,DNS:localhost"
   De sleutel hoort NOOIT in git; backend/data/ staat in .gitignore. */
const DATA_DIR = process.env.RADAR_DATA_DIR
  ? path.resolve(process.env.RADAR_DATA_DIR)
  : path.join(__dirname, "data");
const SLEUTEL = path.join(DATA_DIR, "key.pem");
const CERTIFICAAT = path.join(DATA_DIR, "cert.pem");
const METTLS = fs.existsSync(SLEUTEL) && fs.existsSync(CERTIFICAAT);

// De sessiecookie mag pas "Secure" heten als er ook echt TLS onder zit.
if (METTLS) process.env.RADAR_HTTPS = "1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  // Zonder dit exacte type negeert de browser het manifest en verschijnt de
  // installatieknop niet.
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

/* ---------------- helpers ---------------- */

function veiligheidsHeaders(res) {
  // Content-Security-Policy: alleen eigen scripts, plus Google Fonts voor het lettertype.
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' https://fonts.googleapis.com; " +
    "font-src https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
}

function stuurJson(res, code, obj) {
  const tekst = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(tekst);
}

function leesBody(req) {
  return new Promise((klaar, fout) => {
    let lengte = 0;
    const stukken = [];
    req.on("data", (c) => {
      lengte += c.length;
      if (lengte > MAX_BODY) { fout(new Error("te groot")); req.destroy(); return; }
      stukken.push(c);
    });
    req.on("end", () => {
      if (!stukken.length) return klaar({});
      try { klaar(JSON.parse(Buffer.concat(stukken).toString("utf8"))); }
      catch (e) { fout(new Error("geen geldige json")); }
    });
    req.on("error", fout);
  });
}

/** Alleen bekende velden overnemen, met een maximale lengte. Nooit klakkeloos
 *  opslaan wat de client stuurt. */
function schoneOpdracht(b) {
  const tekst = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
  const status = ["todo", "bezig", "ingeleverd", "klaar"];
  const stappen = Array.isArray(b.stappen)
    ? b.stappen.slice(0, 50).map((s) => ({ t: tekst(s && s.t, 200), d: !!(s && s.d) }))
    : [];
  // Cijfer: alleen overnemen als het echt een getal 1..10 is. De browser mag
  // een string sturen ("7.5"), maar niets anders vertrouwen we. Eén decimaal.
  const cijferGetal = typeof b.cijfer === "number"
    ? b.cijfer
    : (typeof b.cijfer === "string" && b.cijfer.trim() !== "" ? Number(b.cijfer) : NaN);
  const cijfer = (Number.isFinite(cijferGetal) && cijferGetal >= 1 && cijferGetal <= 10)
    ? Math.round(cijferGetal * 10) / 10
    : "";
  return {
    titel: tekst(b.titel, 300),
    vak: tekst(b.vak, 100),
    code: tekst(b.code, 40),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(b.deadline) ? b.deadline : "",
    periode: tekst(b.periode, 10),
    status: status.includes(b.status) ? b.status : "todo",
    cijfer,
    link: /^https?:\/\//i.test(b.link || "") ? tekst(b.link, 500) : "",
    notitie: tekst(b.notitie, 2000),
    stappen
  };
}

function ipVan(req) {
  return (req.socket && req.socket.remoteAddress) || "onbekend";
}

/* ---------------- statische bestanden ---------------- */

function stuurBestand(res, urlPad) {
  const naam = urlPad === "/" ? "index.html" : urlPad.replace(/^\/+/, "");
  const doel = path.resolve(FRONTEND, naam);
  // Padtraversal blokkeren: alles buiten frontend/ weigeren (../../etc/passwd).
  if (!doel.startsWith(path.resolve(FRONTEND) + path.sep)) {
    res.writeHead(403).end("Verboden");
    return;
  }
  fs.readFile(doel, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Niet gevonden"); return; }
    const kop = { "Content-Type": MIME[path.extname(doel)] || "application/octet-stream" };
    // De service worker zelf nooit laten cachen. Anders blijft een oude versie
    // hangen en krijg je updates van de app nooit meer te zien.
    if (naam === "sw.js") {
      kop["Cache-Control"] = "no-cache";
      kop["Service-Worker-Allowed"] = "/";
    }
    res.writeHead(200, kop);
    res.end(data);
  });
}

/* ---------------- server ---------------- */

const afhandelaar = async (req, res) => {
  veiligheidsHeaders(res);
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  const pad = url.pathname;
  const token = auth.leesCookie(req, "radar_sessie");
  const sessie = auth.sessieVan(token);

  try {
    /* --- inloggen --- */
    if (pad === "/api/login" && req.method === "POST") {
      const ip = ipVan(req);
      const b = await leesBody(req);
      const naam = typeof b.gebruiker === "string" ? b.gebruiker.trim().toLowerCase().slice(0, 64) : "";
      const ww = typeof b.wachtwoord === "string" ? b.wachtwoord.slice(0, 200) : "";
      if (auth.geblokkeerd(ip)) {
        auth.logLogin(ip, naam, "blocked");
        return stuurJson(res, 429, { fout: "te veel pogingen" });
      }
      if (!naam || !ww || !auth.wachtwoordKlopt(naam, ww)) {
        auth.noteerMislukt(ip);
        auth.logLogin(ip, naam, "fail");
        return stuurJson(res, 401, { fout: "onjuist" });   // niet verklappen wát er fout was
      }
      auth.wisPogingen(ip);
      auth.logLogin(ip, naam, "ok");
      const t = auth.startSessie(naam);
      res.setHeader("Set-Cookie", auth.sessieCookie(t, auth.SESSIE_DUUR_MS));
      return stuurJson(res, 200, { gebruiker: naam });
    }

    if (pad === "/api/logout" && req.method === "POST") {
      auth.stopSessie(token);
      res.setHeader("Set-Cookie", "radar_sessie=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
      return stuurJson(res, 200, { ok: true });
    }

    /* --- alles onder /api/ vanaf hier vereist een sessie --- */
    if (pad.startsWith("/api/")) {
      if (!sessie) return stuurJson(res, 401, { fout: "niet ingelogd" });

      if (pad === "/api/state" && req.method === "GET") {
        return stuurJson(res, 200, {
          opdrachten: store.alleOpdrachten(),
          specialisatie: store.getDoc("specialisatie"),
          instellingen: store.getDoc("instellingen"),
          motor: store.motor
        });
      }

      const m = pad.match(/^\/api\/opdrachten\/([A-Za-z0-9_-]{1,64})$/);
      if (m && req.method === "PUT") {
        store.zetOpdracht(m[1], schoneOpdracht(await leesBody(req)));
        return stuurJson(res, 200, { ok: true });
      }
      if (m && req.method === "DELETE") {
        store.verwijderOpdracht(m[1]);
        return stuurJson(res, 200, { ok: true });
      }

      if (pad === "/api/specialisatie" && req.method === "PUT") {
        const b = await leesBody(req);
        const uit = {};
        Object.keys(b.checked || {}).slice(0, 200).forEach((k) => {
          if (/^[A-Za-z0-9_-]{1,40}$/.test(k)) uit[k] = !!b.checked[k];
        });
        store.zetDoc("specialisatie", { checked: uit, bijgewerkt: new Date().toISOString() });
        return stuurJson(res, 200, { ok: true });
      }

      if (pad === "/api/instellingen" && req.method === "PUT") {
        const b = await leesBody(req);
        const rooster = {};
        Object.keys(b.rooster || {}).slice(0, 40).forEach((vak) => {
          const r = b.rooster[vak] || {};
          rooster[String(vak).slice(0, 100)] = {
            dag: ["", "1", "2", "3", "4", "5"].includes(String(r.dag)) ? String(r.dag) : "",
            tijd: typeof r.tijd === "string" ? r.tijd.slice(0, 10) : ""
          };
        });
        const periodes = {};
        ["P1", "P2", "P3", "P4"].forEach((p) => {
          const d = (b.periodes || {})[p];
          periodes[p] = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "";
        });
        store.zetDoc("instellingen", { rooster, periodes });
        return stuurJson(res, 200, { ok: true });
      }

      return stuurJson(res, 404, { fout: "onbekend eindpunt" });
    }

    /* --- frontend --- */
    if (req.method !== "GET") { res.writeHead(405).end("Methode niet toegestaan"); return; }
    return stuurBestand(res, pad);

  } catch (e) {
    // Nooit de stacktrace naar de browser sturen: dat is gratis informatie voor een aanvaller.
    console.error("[fout]", e.message);
    return stuurJson(res, 400, { fout: "verzoek kon niet verwerkt worden" });
  }
};

const server = METTLS
  ? https.createServer({ key: fs.readFileSync(SLEUTEL), cert: fs.readFileSync(CERTIFICAAT) }, afhandelaar)
  : http.createServer(afhandelaar);

if (store.aantalGebruikers() === 0) {
  console.log("\nEr is nog geen gebruiker. Maak er eerst een:\n  node backend/setup-user.js <naam>\n");
  process.exit(1);
}

server.listen(POORT, HOST, () => {
  console.log("Opdrachtenradar draait op " + (METTLS ? "https" : "http") + "://" + HOST + ":" + POORT);
  console.log("Opslag: " + store.motor);
  console.log(METTLS
    ? "TLS: aan  — de sessiecookie krijgt Secure"
    : "TLS: uit — alles gaat leesbaar over de lijn (zie backend/sniff.js)");
});
