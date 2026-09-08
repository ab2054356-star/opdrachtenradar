"use strict";
/**
 * Vult de database eenmalig met de opdrachten die nu in de online versie staan,
 * zodat je niet alles opnieuw hoeft in te typen.
 *
 *   node backend/seed.js
 *
 * Bestaande opdrachten met hetzelfde id worden overschreven; de rest blijft staan.
 */
const store = require("./lib/store");

const opdrachten = {
  lab001n: { titel: "Installeren Windows Server Omgeving", vak: "Server en Cloud", code: "LAB-001N", deadline: "", periode: "P1", status: "klaar", link: "", notitie: "", stappen: [] },
  lab101n: { titel: "Installeren AD en werkstation toevoegen", vak: "Server en Cloud", code: "LAB-101N", deadline: "", periode: "P1", status: "todo", link: "", notitie: "", stappen: [
    { t: "Active Directory installeren (AD DS rol)", d: false },
    { t: "Domein promoveren en controleren", d: false },
    { t: "Werkstation aan het domein toevoegen", d: false }
  ] },
  lab201n: { titel: "HDD bij maken, Volumes bij maken, Shares maken, Mappings, Profielen", vak: "Server en Cloud", code: "LAB-201N", deadline: "", periode: "P1", status: "todo", link: "", notitie: "", stappen: [
    { t: "HDD bij maken", d: false }, { t: "Volumes bij maken", d: false },
    { t: "Shares maken", d: false }, { t: "Mappings", d: false }, { t: "Profielen", d: false }
  ] },
  lab301n: { titel: "OU's, Gebruikers en groepen", vak: "Server en Cloud", code: "LAB-301N", deadline: "", periode: "P1", status: "todo", link: "", notitie: "", stappen: [
    { t: "OU's aanmaken", d: false }, { t: "Gebruikers aanmaken", d: false }, { t: "Groepen aanmaken en koppelen", d: false }
  ] },
  lab202n: { titel: "DHCP, containers, eigenschappen en reserveringen", vak: "Server en Cloud", code: "LAB-202N", deadline: "", periode: "P2", status: "todo", link: "", notitie: "", stappen: [
    { t: "DHCP installeren", d: false }, { t: "Containers", d: false },
    { t: "Eigenschappen instellen", d: false }, { t: "Reserveringen", d: false }
  ] },
  lab302n: { titel: "Printers en RDP", vak: "Server en Cloud", code: "LAB-302N", deadline: "", periode: "P2", status: "todo", link: "", notitie: "", stappen: [
    { t: "Printers installeren en delen", d: false }, { t: "RDP inrichten en testen", d: false }
  ] },
  basislijn1: { titel: "Basislijn Project 1 — Young Professional", vak: "Loopbaan & burgerschap", code: "", deadline: "", periode: "P1", status: "bezig", link: "", notitie: "", stappen: [] },
  nl3fproef: { titel: "Proefexamen Nederlands 3F (codename.online)", vak: "Nederlands", code: "3F", deadline: "", periode: "P1", status: "todo", link: "", notitie: "", stappen: [] },
  topdesk1: { titel: "Servicemanagement — incidenten vastleggen in TOPdesk", vak: "Servicemanagement", code: "", deadline: "", periode: "P1", status: "todo", link: "", notitie: "", stappen: [] }
};

Object.keys(opdrachten).forEach((id) => store.zetOpdracht(id, opdrachten[id]));

const bestaand = store.getDoc("instellingen");
store.zetDoc("instellingen", {
  rooster: Object.assign({ Nederlands: { dag: "2", tijd: "11:30" } }, bestaand.rooster || {}),
  periodes: bestaand.periodes || { P1: "", P2: "", P3: "", P4: "" }
});

console.log(Object.keys(opdrachten).length + " opdrachten klaargezet. Start de server: node backend/server.js");
