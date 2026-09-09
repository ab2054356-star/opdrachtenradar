(function(){
"use strict";

/* Eigen, kleine vertalingen: deze pagina laadt app.js bewust niet.
   Een inlogpagina hoort zo weinig mogelijk code uit te voeren. */
var T = {
  nl: { dir:"ltr", sub:"Log in om je opdrachten te zien.", gebruiker:"Gebruikersnaam",
        wachtwoord:"Wachtwoord", knop:"Inloggen", fout:"Gebruikersnaam of wachtwoord klopt niet.",
        teveel:"Te veel pogingen. Probeer het over een kwartier opnieuw.",
        offline:"De server reageert niet. Draait hij nog?" },
  ar: { dir:"rtl", sub:"سجّل الدخول عشان تشوف واجباتك.", gebruiker:"اسم المستخدم",
        wachtwoord:"كلمة المرور", knop:"دخول", fout:"اسم المستخدم أو كلمة المرور غير صحيحة.",
        teveel:"محاولات كثيرة. جرّب بعد ربع ساعة.",
        offline:"السيرفر ما يرد. تأكد إنه شغّال." }
};

var lang = "ar";
try { if (localStorage.getItem("orad_lang") === '"nl"') lang = "nl"; } catch (e) {}

function zetTaal(nieuw){
  lang = nieuw;
  try { localStorage.setItem("orad_lang", JSON.stringify(lang)); } catch (e) {}
  var L = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = L.dir;
  document.getElementById("login-sub").textContent = L.sub;
  document.getElementById("lb-gebruiker").textContent = L.gebruiker;
  document.getElementById("lb-wachtwoord").textContent = L.wachtwoord;
  document.getElementById("login-knop").textContent = L.knop;
  document.getElementById("lang-ar").setAttribute("aria-pressed", lang === "ar" ? "true" : "false");
  document.getElementById("lang-nl").setAttribute("aria-pressed", lang === "nl" ? "true" : "false");
  document.getElementById("login-fout").textContent = "";
}

document.getElementById("lang-ar").addEventListener("click", function(){ zetTaal("ar"); });
document.getElementById("lang-nl").addEventListener("click", function(){ zetTaal("nl"); });

document.getElementById("loginform").addEventListener("submit", function(e){
  e.preventDefault();
  var fout = document.getElementById("login-fout");
  var knop = document.getElementById("login-knop");
  fout.textContent = "";
  knop.disabled = true;   // geen dubbele verzoeken bij dubbelklik

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      gebruiker: document.getElementById("login-gebruiker").value,
      wachtwoord: document.getElementById("login-wachtwoord").value
    })
  }).then(function(r){
    if (r.status === 429) throw new Error("teveel");
    if (!r.ok) throw new Error("fout");
    // Gelukt: replace() zodat de terugknop niet terugkeert naar het inlogscherm.
    location.replace("/");
  }).catch(function(err){
    knop.disabled = false;
    document.getElementById("login-wachtwoord").value = "";
    var code = String(err && err.message);
    fout.textContent = code === "teveel" ? T[lang].teveel
                     : code === "fout"   ? T[lang].fout
                     : T[lang].offline;
  });
});

/* Het wachtertje: poten voor de ogen zodra je in het wachtwoordveld staat. */
(function(){
  var ww = document.getElementById("login-wachtwoord");
  if (!ww) return;
  var dicht = function(){ document.body.classList.add("bedekt"); };
  var open  = function(){ document.body.classList.remove("bedekt"); };
  ww.addEventListener("focus", dicht);
  ww.addEventListener("blur", open);
})();

zetTaal(lang);
document.getElementById("login-gebruiker").focus();
})();
