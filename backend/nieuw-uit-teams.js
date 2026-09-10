"use strict";
/**
 * Voegt de opdrachten toe die op 10 september 2026 in Teams stonden en nog niet
 * in de lokale database zaten (Assignments-tab, agenda en het General-kanaal).
 *
 *   node backend/nieuw-uit-teams.js
 *
 * Bestaat een id al, dan wordt die opdracht overschreven met deze versie.
 * De rest van de database blijft ongemoeid.
 */
const store = require("./lib/store");

const nieuw = {
  burg1wereld: {
    titel: "Burgerschap — Mijn Wereld, Mijn Stem (opdracht 1)",
    vak: "Loopbaan & burgerschap", code: "1.1 opdracht 1",
    deadline: "2026-09-10", periode: "P1", status: "todo",
    link: "", notitie: "Te laat, maar inleveren mag nog: de opdracht staat op 'multiple submissions allowed'. Bijlage in Teams: Opdracht week 1 en 2 - Mijn Wereld Mijn Stem - studenten v1.docx",
    stappen: [
      { t: "Deel A: welk thema heb je gekozen (uit de vier thema's)?", d: false },
      { t: "Deel A: kies een onderwerp binnen dat thema en schrijf het op bij punt 2", d: false },
      { t: "Deel A: waarom heb je dit onderwerp gekozen?", d: false },
      { t: "Deel A: wat zou je willen veranderen of verbeteren?", d: false },
      { t: "Deel B: zit met een groepje dat hetzelfde thema koos", d: false },
      { t: "Deel B: welk onderwerp van iemand anders vind je interessant, en waarom?", d: false },
      { t: "Deel B: welk onderwerp vindt het groepje het belangrijkst / moet het snelst opgelost?", d: false },
      { t: "Deel B: waarom vind je dat onderwerp het belangrijkst?", d: false },
      { t: "Het docx-bestand invullen en inleveren in Teams", d: false }
    ]
  },

  burg2spionagewet: {
    titel: "Burgerschap — Spionagewet (opdracht 2)",
    vak: "Loopbaan & burgerschap", code: "1.1 opdracht 2",
    deadline: "2026-09-17", periode: "P1", status: "todo",
    link: "", notitie: "",
    stappen: [
      { t: "Zoek een betrouwbaar nieuwsartikel met de kernwoorden 'nieuwe spionagewet', van 9 of 10 september — zet de link bij punt 1", d: false },
      { t: "Waarom is deze bron betrouwbaar?", d: false },
      { t: "Ben je het eens met de invoering van de nieuwe spionagewet? Waarom wel/niet?", d: false },
      { t: "Zoek iemand met een andere mening en bespreek het; schrijf zijn/haar mening en onderbouwing op", d: false },
      { t: "Wat is jullie conclusie — is er iemand van mening veranderd?", d: false }
    ]
  },

  sprint2pandz: {
    titel: "Oplevering Sprint 2 — Team PANDZ",
    vak: "Projecten", code: "Sprint 2",
    deadline: "2026-09-11", periode: "P1", status: "todo",
    link: "", notitie: "Teams-vergadering vrijdag 14:30, organisator Nour Georgess. Jimmy Scheer is erbij. Mijn uitnodiging staat nog op 'niet gereageerd'.",
    stappen: [
      { t: "Uitnodiging in de Teams-agenda beantwoorden", d: false },
      { t: "In de groepschat vragen wat we precies opleveren en wie welk deel doet", d: false },
      { t: "Mijn deel van Sprint 2 afmaken vóór vrijdag 14:30", d: false },
      { t: "Oplevering presenteren in de vergadering", d: false }
    ]
  },

  profiellessen: {
    titel: "Profielles kiezen vóór maandag 17:00 (les op woensdag 10:00–12:30)",
    vak: "Profiellessen", code: "wekelijks",
    deadline: "2026-09-14", periode: "P1", status: "todo",
    link: "https://profiellessen.ehcprojects.nl", notitie: "Elke week opnieuw: uiterlijk maandag 17:00 kiezen voor de woensdag daarna.",
    stappen: [
      { t: "Ga naar profiellessen.ehcprojects.nl", d: false },
      { t: "Vul je studentnummer in", d: false },
      { t: "Kies een profielles voor woensdag", d: false },
      { t: "Keuze opslaan (niet vergeten!)", d: false }
    ]
  },

  slbjanwolf: {
    titel: "Nieuwe SLB-afspraak met Jan Wolf — wacht op de uitnodiging",
    vak: "Loopbaan & burgerschap", code: "SLB",
    deadline: "", periode: "P1", status: "bezig",
    link: "", notitie: "De oude afspraak is verzet; Jan Wolf plant een nieuwe in.",
    stappen: [
      { t: "Uitnodiging accepteren zodra die binnenkomt", d: false },
      { t: "Voorbereiden: voortgang per vak (rapport uit de radar meenemen)", d: false }
    ]
  }
};

const ids = Object.keys(nieuw);
ids.forEach(function (id) { store.zetOpdracht(id, nieuw[id]); });

console.log(ids.length + " opdrachten uit Teams toegevoegd (" + store.motor + ").");
console.log("Herlaad de pagina in de browser om ze te zien.");
