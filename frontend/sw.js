/**
 * Service worker — dit is wat van de website een installeerbare app maakt.
 *
 * Twee regels, en de tweede is een bewuste beveiligingskeuze:
 *
 *  1. De SCHIL (html, css, js, iconen) wordt gecachet. Die is voor iedereen
 *     gelijk en bevat geen persoonlijke gegevens. Daardoor opent de app direct,
 *     ook zonder netwerk.
 *
 *  2. Alles onder /api/ wordt NOOIT gecachet. Daar zitten mijn opdrachten en
 *     mijn sessie in. Een cache is een gewoon bestand op schijf: wie bij de
 *     cache van de browser kan, kan bij alles wat daarin staat — ook nadat ik
 *     ben uitgelogd. Offline werken doet de app al met localStorage in app.js;
 *     dat wis ik zelf bij uitloggen. Dus: netwerk of niets.
 *
 * Strategie voor de schil: stale-while-revalidate. Toon meteen wat in de cache
 * staat en haal ondertussen op de achtergrond de nieuwe versie op. Volgende
 * keer opstarten is die er.
 */
"use strict";

/* Hoog dit nummer op na elke wijziging in de frontend: de browser gooit dan de
   oude cache weg en haalt alles opnieuw op. */
const CACHE = "radar-schil-v2";

const SCHIL = [
  "/",
  "/index.html",
  "/login.html",
  "/style.css",
  "/app.js",
  "/login.js",
  "/achtergrond.svg",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  // addAll faalt als één bestand ontbreekt; daarom per stuk, zodat een
  // ontbrekend icoon niet de hele installatie tegenhoudt.
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(SCHIL.map((u) => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(
        namen.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Alleen gewone GET-verzoeken naar mijn eigen server.
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Regel 2: de API blijft buiten de cache. Ook geen fallback uit de cache —
  // liever een nette fout, dan valt app.js terug op de lokale modus.
  if (url.pathname.startsWith("/api/")) return;

  // De service worker zelf nooit uit de cache: anders zit een fout hier
  // voorgoed vast.
  if (url.pathname === "/sw.js") return;

  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req).then((gecacht) => {
        const vanNetwerk = fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => gecacht);   // offline: geef terug wat we hadden

        return gecacht || vanNetwerk;
      })
    )
  );
});
