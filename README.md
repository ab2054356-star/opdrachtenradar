# Opdrachtenradar

Webapplicatie om mijn schoolopdrachten van Aventus bij te houden: inleverdatum,
vak, status, deelstappen en het bewijs dat ik per opdracht bewaar. Tweetalig
(Nederlands / Arabisch) en volledig zelf gehost.

Gemaakt door **Ashraf Mohammed** — ICT N3+N4, klas C, Aventus, specialisatie
Cyberbeveiliging.

## Waarom dit project

Ik hield mijn opdrachten eerst in mijn hoofd bij, daarna in een losse pagina in
de browser. Dat werkte niet: de gegevens stonden alleen op één apparaat en er
zat geen enkele beveiliging op. Dit project is de volgende stap — een echte
client-server-applicatie met een eigen database, inlog en een bewuste
beveiligingslaag, draaiend op een server die ik zelf beheer.

Het raakt daarmee direct aan wat ik op school doe: **Server en Cloud**
(server neerzetten en beheren), **Netwerkbeheer** (poorten, hosts, TLS) en mijn
specialisatie **cyberveiligheid** (authenticatie, sessies, invoervalidatie).

## Wat het kan

- Opdrachten toevoegen, bewerken, verwijderen; status in één klik doorzetten
- Automatisch groeperen op urgentie: te laat / deze week / later / afgerond
- Deelstappen per opdracht, met voortgang (`3/5`) in de lijst
- Bewijs per opdracht: link naar de repo of screenshot + korte notitie
- Rooster per vak, zodat de lijst kan sorteren op eerstvolgende les
- Voortgangsrapport als los HTML-bestand (voor SLB-gesprek of BPV-sollicitatie)
- Nederlands en Arabisch, inclusief RTL

## Techniek

| Onderdeel | Keuze | Waarom |
|---|---|---|
| Server | Node.js, `node:http` | Geen framework: je ziet elke header en elke route zelf |
| Opslag | `node:sqlite`, met JSON-fallback | Zit in Node zelf — geen npm-pakketten nodig |
| Wachtwoorden | scrypt + salt (`node:crypto`) | Traag te kraken, per gebruiker uniek |
| Sessies | willekeurig token in httpOnly-cookie | Niet te stelen via JavaScript/XSS |
| Frontend | HTML/CSS/JS, geen build-stap | Klein genoeg om helemaal te begrijpen |

**Nul npm-dependencies.** Dat is een bewuste keuze: geen `node_modules`, geen
supply-chain-risico, en alles wat draait heb ik zelf geschreven of zit in Node.

## Starten

Nodig: Node.js 22 of hoger (`node -v`).

```bash
git clone https://github.com/ab2054356-star/opdrachtenradar.git
cd opdrachtenradar

node backend/setup-user.js ashraf     # eenmalig: gebruiker + wachtwoord
node backend/server.js                # start op http://127.0.0.1:3000
```

Op Windows kan het ook met een dubbelklik op **`start.cmd`** in de projectmap.
Wil je dat de server meestart met Windows: maak een snelkoppeling naar
`start.cmd` en zet die in de map die je krijgt via `Windows + R` →
`shell:startup`. Weghalen doe je door de snelkoppeling daar te verwijderen.

> Bewust opgeschreven, want een dienst die vanzelf start is een dienst die je
> vergeet. Zolang `HOST` op `127.0.0.1` staat luistert hij alleen op deze
> machine. Zet ik dat ooit op `0.0.0.0`, dan staat er dankzij die snelkoppeling
> een server open op het netwerk zonder dat ik eraan denk.

De database komt in `backend/data/` te staan. Die map staat in `.gitignore`:
mijn opdrachten en mijn wachtwoord-hash horen niet in een publieke repo.

## Installeren als app

De radar is een **PWA** (progressive web app): dezelfde code draait als website
én als geïnstalleerde app, met een eigen icoon en een eigen venster zonder
adresbalk.

Start de server, open `http://127.0.0.1:3000` en klik in de adresbalk op het
installatie-icoontje (of menu → *Apps* → *Deze site installeren*). Daarna staat
de radar in het Startmenu.

Wat het toevoegt:

| Bestand | Wat het doet |
|---|---|
| `frontend/manifest.webmanifest` | Naam, kleuren, iconen — zonder dit geen installatieknop |
| `frontend/sw.js` | Service worker: cachet de schil, zodat de app ook zonder netwerk opent |
| `frontend/icon.svg` + de PNG's | Eén vectorbron; de PNG's zijn daaruit gerenderd voor Android en iOS |

De service worker cachet **alleen** html, css, js en iconen. Alles onder `/api/`
gaat er bewust langs — zie `docs/SECURITY.md` §10.

> Installeren werkt alleen in een *secure context*: `https://` of
> `127.0.0.1`/`localhost`. Op `http://192.168.x.x` weigert de browser de service
> worker, en terecht: die zit tussen de pagina en het netwerk, dus zoiets mag je
> niet over een lijn halen die onderweg aan te passen is.

### Ook op mijn telefoon

Dat vraagt twee dingen, in deze volgorde:

1. **De server op het netwerk zetten:** `set HOST=0.0.0.0` vóór het starten.
   Vanaf dat moment luistert hij op elk netwerk waar de laptop op zit — ook op
   het schoolnetwerk. Alleen doen op mijn eigen wifi.
2. **HTTPS met een certificaat dat de telefoon vertrouwt.** Het zelfondertekende
   certificaat uit §9 is niet genoeg: de telefoon weigert dan de service worker.
   Dat betekent een eigen CA die ik op de telefoon installeer, of een echt
   certificaat via een domeinnaam.

Zolang stap 2 niet af is, blijft de app op de telefoon een gewone website in de
browser — bruikbaar, maar niet installeerbaar.

## Testen

```bash
node backend/test-security.js
```

Geen testframework — alleen `node:child_process` en de ingebouwde `fetch`. Het
script start de server op een eigen poort (3999) met een **wegwerp-database en
wegwerp-gebruiker** in de tijdelijke map van het systeem, draait de tests, en
ruimt daarna alles op. Je eigen data, wachtwoord-hash en `auth.log` blijven
ongemoeid. Elke test print `PASS` of `FAIL`; de exitcode is `0` als alles slaagt
en `1` zodra er iets faalt (handig voor CI).

Wat het controleert:

1. `GET /api/state` zonder cookie geeft `401`
2. Inloggen met een fout wachtwoord geeft `401`
3. Zes foute pogingen achter elkaar: de zesde wordt geblokkeerd met `429`
4. Een juiste login geeft `200` met een `Set-Cookie` die `HttpOnly` en
   `SameSite=Strict` bevat
5. Een opdracht met `link=javascript:alert(1)` wordt opgeslagen met een lege link
6. Een onbekend veld in een opdracht wordt niet opgeslagen
7. Het pad `/../backend/data/radar.db` (en `%2e`/`%2f`-varianten) geeft geen `200`
8. Een opdracht met `cijfer=99` wordt opgeslagen met een leeg cijfer

## Mappen

```
start.cmd           dubbelklikken om de server te starten (Windows)
backend/
  server.js         HTTP/HTTPS-server, routes, validatie, veiligheidsheaders
  setup-user.js     gebruiker aanmaken (wachtwoord typ je zelf)
  test-security.js  automatische beveiligingstest (wegwerp-database)
  lib/store.js      opslag: SQLite of JSON
  lib/auth.js       hashen, sessies, brute force afremmen
  data/             database (niet in git)
frontend/
  index.html        de applicatie zelf
  app.js            alle logica in de browser
  login.html        inlogpagina, laadt app.js bewust niet
  login.js          het inlogscript (apart bestand: de CSP staat geen inline script toe)
  style.css         opmaak, licht en donker thema
  manifest.webmanifest  maakt de site installeerbaar als app
  sw.js             service worker: schil cachen, /api nooit
  icon.svg          bron voor alle iconen (icon-*.png zijn hieruit gerenderd)
docs/
  SECURITY.md       welke aanvallen zijn afgedekt en hoe
  API.md            beschrijving van de endpoints
```

## Volgende stappen

- [ ] Uitrollen op een Windows Server-VM in VMware (Server en Cloud)
- [x] Installeerbaar als app (PWA), met offline start
- [ ] Een eigen CA opzetten en op mijn telefoon vertrouwen, zodat de app ook
      daar installeerbaar is
- [x] HTTPS met een eigen certificaat, en `Secure` op de sessiecookie
- [ ] Zelf aanvallen: XSS, SQL-injectie, padtraversal, brute force — en
      vastleggen wat er gebeurt (zie `docs/SECURITY.md`)
- [x] Logging van inlogpogingen, zodat ik iets te analyseren heb
