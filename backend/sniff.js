"use strict";
/**
 * sniff.js — een piepkleine "Wireshark" van twintig regels.
 *
 * WAT HET DOET
 * Het gaat als tussenpersoon tussen je browser en je eigen server staan en zet
 * alles wat er langskomt op het scherm. Niets meer, niets minder.
 *
 *   browser  ->  sniff.js (poort 3001)  ->  server.js (poort 3000)
 *
 * WAAROM
 * Om met eigen ogen te zien wat er zonder HTTPS over de lijn gaat. Log in via
 * http://127.0.0.1:3001 en je ziet je eigen wachtwoord in leesbare tekst in dit
 * venster staan. Precies dat ziet ook iedereen die op hetzelfde netwerk zit.
 *
 * GEBRUIK
 *   venster 1:  node backend/server.js        (de echte server, poort 3000)
 *   venster 2:  node backend/sniff.js         (de meeluisteraar, poort 3001)
 *   browser:    http://127.0.0.1:3001
 *
 * ALLEEN OP JE EIGEN MACHINE EN JE EIGEN APPLICATIE. Meeluisteren op het
 * netwerk van school of van een bedrijf is strafbaar, ook "om te leren".
 */
const net = require("node:net");

const LUISTERPOORT = Number(process.env.SNIFF_PORT || 3001);
const DOELPOORT = Number(process.env.PORT || 3000);
const DOELHOST = "127.0.0.1";
const MAX = 1200;   // per richting niet meer dan dit aantal tekens tonen

/* Herkent een TLS-record aan het eerste byte: 0x16 = handshake, 0x17 = data.
   Draait de server met een certificaat, dan is dit alles wat er te zien valt. */
function isTLS(buf) {
  return buf.length > 5 && (buf[0] === 0x16 || buf[0] === 0x17 || buf[0] === 0x14 || buf[0] === 0x15);
}

/* Onleesbare bytes zichtbaar maken, zodat de uitvoer niet je terminal sloopt. */
function leesbaar(buf) {
  let t = buf.toString("utf8").slice(0, MAX);
  t = t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, ".");
  if (buf.length > MAX) t += "\n… (" + (buf.length - MAX) + " bytes ingekort)";
  return t;
}

function toon(richting, kleur, buf) {
  const streep = "─".repeat(60);
  console.log("\n\x1b[" + kleur + "m" + streep);
  console.log(richting + "  —  " + buf.length + " bytes  —  " + new Date().toLocaleTimeString());
  console.log(streep + "\x1b[0m");
  if (isTLS(buf)) {
    console.log("[TLS-versleuteld — hier valt niets uit te lezen]");
    console.log(buf.subarray(0, 48).toString("hex").replace(/(..)/g, "$1 "));
  } else {
    console.log(leesbaar(buf));
  }
}

const server = net.createServer((browser) => {
  const naarServer = net.connect(DOELPOORT, DOELHOST);

  browser.on("data", (b) => { toon("BROWSER  →  SERVER", "33", b); naarServer.write(b); });
  naarServer.on("data", (b) => { toon("SERVER   →  BROWSER", "36", b); browser.write(b); });

  browser.on("error", () => naarServer.destroy());
  naarServer.on("error", (e) => {
    console.log("\n[fout] kan de server op poort " + DOELPOORT + " niet bereiken: " + e.code);
    console.log("       draait 'node backend/server.js' wel in een ander venster?");
    browser.destroy();
  });
  browser.on("close", () => naarServer.end());
  naarServer.on("close", () => browser.end());
});

server.listen(LUISTERPOORT, "127.0.0.1", () => {
  console.log("Meeluisteren op http://127.0.0.1:" + LUISTERPOORT + "  →  doorgestuurd naar poort " + DOELPOORT);
  console.log("Open die eerste link in je browser en log in. Kijk daarna hier.\n");
});
