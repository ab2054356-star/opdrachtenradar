# Beveiliging

Wat er in deze applicatie bewust is afgedekt, waar het in de code staat, en hoe
ik het zelf test. Dit is mijn eigen omgeving — aanvallen doe ik alleen hier,
nooit op een systeem van school of van een bedrijf.

## 1. Wachtwoorden

`lib/auth.js` — scrypt met een salt van 16 bytes per gebruiker, 64 bytes uit.
Het wachtwoord zelf wordt nergens opgeslagen en nergens gelogd.

Vergelijken gaat via `crypto.timingSafeEqual`. Een gewone `===` stopt bij het
eerste verschillende teken, en dat tijdsverschil is meetbaar — een aanvaller kan
daarmee tekens raden. Bestaat de gebruikersnaam niet, dan wordt er alsnog een
hash berekend, anders verraadt het antwoordtempo welke namen bestaan.

**Testen:** meet met `curl -w "%{time_total}"` het verschil tussen een bestaande
en een niet-bestaande gebruikersnaam. Dat hoort ongeveer gelijk te zijn.

## 2. Sessies

Token van 32 willekeurige bytes, in een cookie met `HttpOnly`, `SameSite=Strict`
en `Path=/`. Verloopt na 8 uur.

- `HttpOnly` → JavaScript in de pagina kan de cookie niet lezen, dus een
  XSS-lek levert geen sessie op.
- `SameSite=Strict` → de cookie gaat niet mee met verzoeken die vanaf een andere
  site worden gestart. Dat is de CSRF-bescherming.
- `Secure` komt erbij zodra er HTTPS voor staat (`RADAR_HTTPS=1`).

**Testen:** `document.cookie` in de console — de sessiecookie hoort er niet in
te staan.

## 3. Brute force

Vijf mislukte pogingen per IP, daarna vijftien minuten blokkade
(`geblokkeerd()` / `noteerMislukt()`). Het antwoord bij een fout is altijd
hetzelfde: `401 onjuist`. Niet "gebruiker bestaat niet" — dat is gratis
informatie voor een aanvaller.

**Testen:** een lusje van tien `curl`-aanroepen op `/api/login`. Vanaf de zesde
hoort er `429` terug te komen.

## 4. SQL-injectie

Alle queries in `lib/store.js` gebruiken parameters (`?`), nooit string-plakwerk.
Een titel als `'; DROP TABLE opdrachten; --` wordt gewoon opgeslagen als tekst.

**Testen:** maak een opdracht met precies die titel en kijk of de tabel er nog is.

## 5. XSS

De frontend zet alles wat uit de database komt door `esc()` voordat het in de
HTML belandt. Daarbovenop staat een Content-Security-Policy die alleen scripts
van de eigen server toestaat — geen `unsafe-inline`. Zelfs als er ergens toch
iets doorheen glipt, voert de browser het niet uit.

**Testen:** zet `<img src=x onerror=alert(1)>` in de titel en in de notitie. Je
hoort de tekst te zien staan, geen alert. In de console verschijnt dan de
CSP-melding.

## 6. Padtraversal

`stuurBestand()` lost het pad op met `path.resolve` en weigert alles wat buiten
`frontend/` uitkomt.

**Testen:** `curl "http://127.0.0.1:3000/../backend/data/radar.db"` en varianten
met `%2e%2e%2f`. Hoort `403` te geven.

## 7. Invoer die de server binnenkomt

`schoneOpdracht()` neemt alleen bekende velden over, elk met een maximale
lengte; de status moet uit een vaste lijst komen en de link moet met `http(s)://`
beginnen (anders zou `javascript:` in een link kunnen belanden). De body is
begrensd op 64 KB, dus je kunt de server niet volproppen met één verzoek.

## 8. Wat er nog NIET goed is

Eerlijk blijven over wat open staat, hoort erbij:

- **Het certificaat is zelfondertekend.** TLS staat aan (zie 9), maar niemand
  bevestigt dat 127.0.0.1 ook echt mijn server is. De browser waarschuwt daar
  terecht voor. Versleuteling: ja. Identiteit: nee. Bij het uitrollen op de VM
  hoort hier een certificaat van een echte CA, of een eigen CA die ik op mijn
  machines vertrouw.
- **Sessies staan in het geheugen.** Server herstart = iedereen eruit. Voor één
  gebruiker prima, maar het is geen echte oplossing.
- **De sessie duurt 30 dagen.** Bewuste keuze: het draait op mijn eigen pc en ik
  wil niet elke dag opnieuw inloggen. De prijs is dat wie fysiek achter mijn
  laptop kruipt binnen is zonder wachtwoord. Voor een systeem met meer
  gebruikers, of zodra het buiten mijn eigen machine draait, gaat dit terug naar
  uren in plaats van dagen.
- **Het logbestand is alleen lokaal.** Elke inlogpoging gaat nu naar
  `backend/data/auth.log` (`lib/auth.js`, `logLogin()`), één regel per poging:
  tijd in ISO, IP, geschoonde gebruikersnaam (max 64 tekens, `\r` en `\n`
  verwijderd tegen log injection) en het resultaat `ok`, `fail` of `blocked`.
  Bewust **niet** in het log: het wachtwoord of een deel ervan, de cookie en het
  sessietoken. Wat nog ontbreekt: doorsturen naar een centrale plek of SIEM, en
  rotatie zodat het bestand niet eindeloos groeit. `backend/data/` staat in
  `.gitignore`, dus het log komt niet in git terecht.
- **De rate limit staat in het geheugen per IP.** Achter een NAT of proxy deelt
  een hele school hetzelfde IP.

## 9. HTTPS

`server.js` kijkt bij het starten of `backend/data/key.pem` en `cert.pem`
bestaan. Zo ja, dan start hij met `https.createServer` en zet hij
`RADAR_HTTPS=1`, waardoor de sessiecookie er `Secure` bij krijgt — die gaat dan
nooit meer over een onversleutelde verbinding. Zo niet, dan draait hij gewoon op
http, zodat het project ook werkt op een machine zonder certificaat.

Sleutel en certificaat maken:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout backend/data/key.pem -out backend/data/cert.pem \
  -subj "/CN=127.0.0.1" -addext "subjectAltName=IP:127.0.0.1,DNS:localhost"
```

`key.pem` is de private sleutel en hoort **nooit** in git; `backend/data/` staat
daarom in `.gitignore`. Een gelekte private sleutel op GitHub betekent dat
iedereen zich als mijn server kan voordoen.

**Zelf gezien, niet uit een boek.** `backend/sniff.js` is een TCP-proxy van
zestig regels die alles toont wat er tussen browser en server langskomt. Over
http stonden mijn wachtwoord in de login-POST en mijn `radar_sessie`-cookie bij
elk volgend verzoek gewoon leesbaar in beeld. Met TLS ervoor blijft er niets
over dan `16 03 01 ...` — versleutelde records. Dezelfde proxy, dezelfde plek op
de lijn, ander resultaat.

Wat dit **niet** oplost: iemand met toegang tot de machine zelf, of tot mijn
browser. TLS beschermt de weg ertussenin, niet de uiteinden.
