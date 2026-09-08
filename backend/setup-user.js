"use strict";
/**
 * Maakt een gebruiker aan (of zet een nieuw wachtwoord).
 *
 *   node backend/setup-user.js ashraf
 *
 * Het wachtwoord typ je zelf in; het staat nergens in de code, nergens in git
 * en het gaat niet mee in je shell-geschiedenis. Opgeslagen wordt alleen de
 * scrypt-hash met een eigen salt.
 */
const readline = require("node:readline");
const auth = require("./lib/auth");

const naam = (process.argv[2] || "").trim().toLowerCase();
if (!naam || !/^[A-Za-z0-9_.-]{2,64}$/.test(naam)) {
  console.log("Gebruik: node backend/setup-user.js <naam>   (letters, cijfers, . _ -)");
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });

function vraagVerborgen(vraag) {
  return new Promise((klaar) => {
    process.stdout.write(vraag);
    const uit = process.stdout;
    const schrijfOrigineel = uit.write.bind(uit);
    uit.write = (chunk, enc, cb) => (typeof chunk === "string" && chunk.includes("\n"))
      ? schrijfOrigineel(chunk, enc, cb) : true;   // tekens niet echoën
    rl.question("", (antwoord) => {
      uit.write = schrijfOrigineel;
      process.stdout.write("\n");
      klaar(antwoord);
    });
  });
}

(async () => {
  const ww = await vraagVerborgen("Wachtwoord: ");
  const nog = await vraagVerborgen("Nog een keer: ");
  rl.close();

  if (ww !== nog) { console.log("De wachtwoorden zijn niet gelijk."); process.exit(1); }
  if (ww.length < 10) { console.log("Neem er minstens 10 tekens bij — dit ding komt straks online."); process.exit(1); }

  auth.maakGebruiker(naam, ww);
  console.log("Gebruiker '" + naam + "' is klaar. Start nu de server:  node backend/server.js");
})();
