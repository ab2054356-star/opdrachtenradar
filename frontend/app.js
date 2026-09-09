(function(){
"use strict";

/* ---------------- i18n ---------------- */
var T = {
  nl: {
    dir:"ltr", title:"Opdrachtenradar", eyebrow:"ICT N3+N4 · klas C · 2026-2027",
    subtitle:"Al je opdrachten van Aventus op één plek — met deadline, vak en status.",
    late:"Te laat", week:"Deze week", open:"Nog te doen", done:"Afgerond",
    progsub:"afgerond dit schooljaar",
    tabs:["Opdrachten","Rooster","Mijn specialisatie","Rapport","Importeren"],
    allevakken:"Alle vakken", allestatus:"Alle statussen", zoek:"Zoeken…",
    nieuw:"+ Nieuwe opdracht", opslaan:"Opslaan", annuleren:"Annuleren",
    lbTitel:"Titel", lbVak:"Vak", lbCode:"Opdrachtcode", lbDeadline:"Inleverdatum",
    lbPeriode:"Periode", lbStatus:"Status", lbCijfer:"Cijfer",
    st:{todo:"Te doen",bezig:"Bezig",ingeleverd:"Ingeleverd",klaar:"Afgerond"},
    groups:{late:"Te laat",week:"Deze week",later:"Later",geen:"Zonder datum",done:"Afgerond"},
    leeg:"Nog geen opdrachten. Voeg er één toe of plak je lijst bij Importeren.",
    geenmatch:"Geen opdracht past bij deze filters.",
    vandaag:"vandaag", morgen:"morgen",
    overd:function(n){return "over "+n+" dagen";}, gelden:function(n){return n+" dagen te laat";},
    verwijder:"Verwijderen", bewerk:"Bewerken",
    errTitel:"Vul minstens een titel in.",
    syncOn:"server", syncOff:"lokaal", syncWait:"verbinden…",
    loginSub:"Log in om je opdrachten te zien.", gebruiker:"Gebruikersnaam", wachtwoord:"Wachtwoord",
    inloggen:"Inloggen", uitloggen:"Uitloggen", loginFout:"Gebruikersnaam of wachtwoord klopt niet.",
    specintro:"Je specialisatie is Cyberbeveiliging binnen ICT system engineer (niveau 4). Dit is de lijst van wat er naast de gewone opdrachten van je gevraagd wordt. Vink af wat klaar is — het wordt bewaard.",
    importhint:"Plak je opdrachten, één per regel. Scheid de velden met een | of een tab:<br><code>Server en Cloud | LAB-202N | Active Directory inrichten | 25-09-2026</code><br>Volgorde: vak | code | titel | datum. Minder velden mag ook — wat ontbreekt laat je leeg.",
    importbtn:"Toevoegen aan lijst", importph:"Server en Cloud | LAB-202N | Active Directory inrichten | 25-09-2026",
    importok:function(n){return n+" opdracht(en) toegevoegd.";}, importleeg:"Er staat nog niks in het vak hierboven.",
    stappen:"Stappen", stapPh:"Stap toevoegen en Enter…", geenStappen:"Nog geen stappen — splits de opdracht op.",
    bewijs:"Bewijs & portfolio", linkPh:"https://github.com/…", notitiePh:"Wat heb je gedaan? Twee zinnen is genoeg.",
    openLink:"openen", setdate:"+ datum", details:"Details",
    qMorgen:"Morgen", qWeek:"+1 week", qTwee:"+2 weken", qPeriode:"Eind periode",
    sortDatum:"Op inleverdatum", sortLes:"Op eerstvolgende les",
    dagen:["ma","di","wo","do","vr"], geenDag:"— geen les —",
    roosterintro:"Zet hier neer op welke dag je elk vak hebt. De opdrachtenlijst kan dan sorteren op de eerstvolgende les in plaats van alleen op inleverdatum.",
    roostertitel:"Lesdag per vak", nieuwvakPh:"Vak toevoegen…", vakBtn:"Toevoegen",
    periodetitel:"Einddatum per periode", periodehint:"Vul je periodedata in; daarna zet de knop \"Eind periode\" de inleverdatum in één klik.",
    lesVandaag:"vandaag les", lesMorgen:"morgen les", lesOver:function(n){return "les over "+n+" d";},
    rapportintro:"Overzicht van wat je hebt ingeleverd en afgerond, met je bewijs erbij. Neem dit mee naar je SLB-gesprek of een BPV-sollicitatie.",
    rapportBtn:"Rapport downloaden", rapportLeeg:"Nog niets ingeleverd of afgerond.",
    rapportTitel:"Voortgangsrapport", rapportOnder:"ICT N3+N4 · klas C · 2026-2027 · specialisatie Cyberbeveiliging",
    rapportOk:"Opgeslagen.", rapportNee:"Downloaden lukt hier niet — kopieer het overzicht hieronder.",
    rapportGem:"Gemiddeld cijfer",
    geenNotitie:"(geen notitie)"
  },
  ar: {
    dir:"rtl", title:"رادار الواجبات", eyebrow:"ICT N3+N4 · صف C · 2026-2027",
    subtitle:"كل واجبات أفنتس في مكان واحد — مع تاريخ التسليم والمادة والحالة.",
    late:"متأخر", week:"هذا الأسبوع", open:"باقي عليك", done:"خلصت",
    progsub:"منجز من السنة الدراسية",
    tabs:["الواجبات","الجدول","تخصصي","التقرير","استيراد"],
    allevakken:"كل المواد", allestatus:"كل الحالات", zoek:"بحث…",
    nieuw:"+ واجب جديد", opslaan:"حفظ", annuleren:"إلغاء",
    lbTitel:"العنوان", lbVak:"المادة", lbCode:"رمز الواجب", lbDeadline:"تاريخ التسليم",
    lbPeriode:"الفترة", lbStatus:"الحالة", lbCijfer:"الدرجة",
    st:{todo:"لسه",bezig:"شغال عليه",ingeleverd:"سلّمته",klaar:"خلص"},
    groups:{late:"متأخر",week:"هذا الأسبوع",later:"لاحقاً",geen:"بدون تاريخ",done:"منجز"},
    leeg:"ما في واجبات بعد. أضف واحد أو الصق قائمتك في تبويب الاستيراد.",
    geenmatch:"ما في واجب يطابق هذي الفلاتر.",
    vandaag:"اليوم", morgen:"بكرة",
    overd:function(n){return "باقي "+n+" يوم";}, gelden:function(n){return "متأخر "+n+" يوم";},
    verwijder:"حذف", bewerk:"تعديل",
    errTitel:"اكتب عنوان الواجب على الأقل.",
    syncOn:"السيرفر", syncOff:"محلي", syncWait:"جاري الاتصال…",
    loginSub:"سجّل الدخول عشان تشوف واجباتك.", gebruiker:"اسم المستخدم", wachtwoord:"كلمة المرور",
    inloggen:"دخول", uitloggen:"خروج", loginFout:"اسم المستخدم أو كلمة المرور غير صحيحة.",
    specintro:"تخصصك هو الأمن السيبراني (Cyberbeveiliging) ضمن ICT system engineer مستوى 4. هذي قائمة اللي مطلوب منك غير الواجبات العادية. علّم على اللي خلصته — بيتحفظ.",
    importhint:"الصق واجباتك، كل واجب في سطر. افصل الحقول بـ | أو Tab:<br><code>Server en Cloud | LAB-202N | Active Directory inrichten | 25-09-2026</code><br>الترتيب: المادة | الرمز | العنوان | التاريخ. تقدر تكتب أقل حقول والباقي يظل فاضي.",
    importbtn:"أضف للقائمة", importph:"Server en Cloud | LAB-202N | Active Directory inrichten | 25-09-2026",
    importok:function(n){return "تمت إضافة "+n+" واجب.";}, importleeg:"المربع فوق فاضي.",
    stappen:"الخطوات", stapPh:"اكتب خطوة واضغط Enter…", geenStappen:"ما في خطوات بعد — قسّم الواجب.",
    bewijs:"الإثبات والبورتفوليو", linkPh:"https://github.com/…", notitiePh:"إيش سويت؟ سطرين يكفّون.",
    openLink:"افتح", setdate:"+ تاريخ", details:"تفاصيل",
    qMorgen:"بكرة", qWeek:"+أسبوع", qTwee:"+أسبوعين", qPeriode:"آخر الفترة",
    sortDatum:"حسب تاريخ التسليم", sortLes:"حسب الحصة الجاية",
    dagen:["الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"], geenDag:"— بدون حصة —",
    roosterintro:"حدّد هنا يوم حصة كل مادة. بعدها تقدر ترتّب الواجبات حسب الحصة الجاية بدل تاريخ التسليم فقط.",
    roostertitel:"يوم الحصة لكل مادة", nieuwvakPh:"أضف مادة…", vakBtn:"إضافة",
    periodetitel:"تاريخ نهاية كل فترة", periodehint:"عبّي تواريخ فتراتك، وبعدها زر «آخر الفترة» يحط تاريخ التسليم بضغطة.",
    lesVandaag:"الحصة اليوم", lesMorgen:"الحصة بكرة", lesOver:function(n){return "الحصة بعد "+n+" ي";},
    rapportintro:"ملخّص لما سلّمته وأنجزته مع الإثباتات. خذه معك لاجتماع المرشد أو لمقابلة BPV.",
    rapportBtn:"تحميل التقرير", rapportLeeg:"ما في شيء مُسلَّم أو منجز بعد.",
    rapportTitel:"تقرير التقدّم", rapportOnder:"ICT N3+N4 · صف C · 2026-2027 · تخصص الأمن السيبراني",
    rapportOk:"تم الحفظ.", rapportNee:"التحميل ما اشتغل هنا — انسخ الملخص من تحت.",
    rapportGem:"معدّل الدرجات",
    geenNotitie:"(بدون ملاحظة)"
  }
};
var lang = "ar";
function t(){ return T[lang]; }

/* ---------------- specialisatie checklist ---------------- */
var SPEC = [
  { id:"kern", nl:"Kernvakken en labopdrachten", ar:"المواد الأساسية والواجبات العملية",
    whyNl:"Dit is het vakinhoudelijke fundament onder cyberbeveiliging: zonder werkende servers, netwerken en Linux is security niet uit te voeren.",
    whyAr:"هذا الأساس التقني للأمن السيبراني: بدون سيرفرات وشبكات ولينكس شغّالة ما تقدر تشتغل سيكيوريتي.",
    items:[
      {id:"servercloud", nl:"Server en Cloud — alle LAB-opdrachten per periode inleveren", ar:"Server en Cloud — تسليم كل واجبات LAB لكل فترة", hintNl:"Teams-kanaal, map Opdrachten (LAB-001N, LAB-202N …)", hintAr:"قناة Teams، مجلد Opdrachten (LAB-001N، LAB-202N …)", tag:"Teams"},
      {id:"vm", nl:"VMware-omgeving werkend houden + snapshot vóór elke oefening", ar:"إبقاء بيئة VMware شغالة + عمل snapshot قبل كل تمرين", hintNl:"Windows Server + Windows 11 VM's — een snapshot scheelt een hele avond opnieuw installeren.", hintAr:"سيرفر ويندوز + ويندوز 11 — الـsnapshot يوفّر عليك إعادة تنصيب كاملة."},
      {id:"netwerk", nl:"Netwerkbeheer met Windows Server 2022 — boek + praktijk", ar:"Netwerkbeheer مع Windows Server 2022 — الكتاب + التطبيق", hintNl:"AD, DNS, DHCP, GPO: de basis waar elke SOC-vraag op terugvalt.", hintAr:"AD وDNS وDHCP وGPO: الأساس اللي ترجع له كل أسئلة الـSOC."},
      {id:"linux", nl:"Linux Hands-on afronden", ar:"إنهاء Linux Hands-on", hintNl:"Bijna alle securitytooling draait op Linux.", hintAr:"أغلب أدوات الأمن تشتغل على لينكس."},
      {id:"service", nl:"Servicemanagement (TOPdesk) — tickets correct vastleggen", ar:"Servicemanagement (TOPdesk) — تسجيل التذاكر صح", hintNl:"Incidentregistratie is letterlijk het eerste dat een SOC-analist doet.", hintAr:"تسجيل الحوادث هو أول شغلة يسويها محلل الـSOC."}
    ]},
  { id:"keuze", nl:"Keuzedelen kiezen en afronden", ar:"اختيار وإنهاء الـkeuzedelen",
    whyNl:"Keuzedelen zijn verplicht en tellen mee voor je diploma. Deze twee sturen je opleiding richting security.",
    whyAr:"الـkeuzedelen إجبارية وتحسب لشهادتك. هذين الاثنين يوجّهون دراستك ناحية الأمن السيبراني.",
    items:[
      {id:"k1352", nl:"K1352 — Basis Cybercriminaliteit en Cyberveiligheid aanmelden", ar:"K1352 — التسجيل في أساسيات الجريمة والأمن السيبراني", hintNl:"Dit is hét keuzedeel dat je specialisatie op je diploma zichtbaar maakt.", hintAr:"هذا الـkeuzedeel اللي يخلي تخصصك واضح في شهادتك.", tag:"K1352"},
      {id:"k0023", nl:"K0023 — Digitale vaardigheden gevorderd aanmelden", ar:"K0023 — التسجيل في المهارات الرقمية المتقدمة", hintNl:"Tweede keuze; check bij je SLB of dit past in je rooster.", hintAr:"الخيار الثاني؛ اسأل مرشدك إذا يناسب جدولك.", tag:"K0023"},
      {id:"keuzeslb", nl:"Keuze bevestigen bij J. Wolf (SLB)", ar:"تأكيد الاختيار مع J. Wolf (المرشد)", hintNl:"j.wolf@aventus.nl", hintAr:"j.wolf@aventus.nl"}
    ]},
  { id:"bpv", nl:"BPV — stage regelen", ar:"BPV — تأمين التدريب العملي",
    whyNl:"Zonder afgetekende BPV geen diploma. Een SOC-stage is schaars: begin vroeg en regel de papieren op tijd.",
    whyAr:"بدون BPV مختوم ما في شهادة. تدريب في SOC نادر: ابدأ بدري وجهّز الأوراق مبكراً.",
    items:[
      {id:"cv", nl:"CV en korte motivatiebrief in het Nederlands klaar", ar:"السيرة الذاتية ورسالة تحفيزية قصيرة بالهولندي", hintNl:"Eén A4 CV, één alinea motivatie per bedrijf.", hintAr:"صفحة وحدة سيرة، وفقرة تحفيز لكل شركة."},
      {id:"belasting", nl:"Belastingdienst SOC Apeldoorn benaderen", ar:"التواصل مع Belastingdienst SOC في أبلدورن", hintNl:"Je eerste voorkeur — vraag je BPV-consulent of Aventus er een contact heeft.", hintAr:"خيارك الأول — اسأل مستشار BPV إذا عند أفنتس تواصل معهم."},
      {id:"backup", nl:"Twee reservebedrijven aanschrijven", ar:"مراسلة شركتين احتياط", hintNl:"IT-beheer of helpdesk telt ook mee; ervaring eerst, SOC later.", hintAr:"إدارة IT أو helpdesk تحسب برضه؛ الخبرة أولاً والـSOC بعدين."},
      {id:"vog", nl:"VOG aanvragen zodra een bedrijf ja zegt", ar:"طلب VOG بمجرد ما تقبلك شركة", hintNl:"Overheids- en securitybedrijven vragen dit standaard; het duurt weken.", hintAr:"جهات الحكومة وشركات الأمن تطلبها دائماً، وتاخذ أسابيع."},
      {id:"bpvformulier", nl:"BPV-overeenkomst laten tekenen en inleveren", ar:"توقيع وتسليم عقد الـBPV", hintNl:"Bedrijf + school + jij; zonder handtekening telt geen uur mee.", hintAr:"الشركة + المدرسة + أنت؛ بدون توقيع ما تُحسب ولا ساعة."}
    ]},
  { id:"generiek", nl:"Generieke eisen (Nederlands, Engels, rekenen, burgerschap)", ar:"المتطلبات العامة (هولندي، إنجليزي، حساب، مواطنة)",
    whyNl:"Deze staan los van je vakvakken, maar houden je diploma tegen als ze niet af zijn.",
    whyAr:"هذي منفصلة عن مواد التخصص، لكن لو ما خلصتها تعطّل شهادتك.",
    items:[
      {id:"nl3f", nl:"Nederlands 3F — leerlijnen + proefexamens op codename.online", ar:"الهولندي 3F — المسارات والامتحانات التجريبية على codename.online", hintNl:"Les: dinsdag 11.30-13.00, docent Jeroen Ahuis.", hintAr:"الحصة: الثلاثاء 11:30-13:00، المدرّس Jeroen Ahuis.", tag:"3F"},
      {id:"rekenen", nl:"Rekenen 3F — examen halen", ar:"الحساب 3F — اجتياز الامتحان", hintNl:"2F heb je; 3F is de eis voor niveau 4.", hintAr:"2F عندك؛ 3F هو المطلوب لمستوى 4.", tag:"3F"},
      {id:"engels", nl:"Engels (Taalblokken) — bijhouden", ar:"الإنجليزي (Taalblokken) — متابعة", hintNl:"Vrijwel alle securitydocumentatie is Engels.", hintAr:"كل وثائق الأمن السيبراني تقريباً بالإنجليزي."},
      {id:"burgerschap", nl:"Burgerschap / Loopbaan — opdrachten inleveren", ar:"المواطنة / المسار المهني — تسليم الواجبات", hintNl:"Methode: De maatschappij dat ben JIJ.", hintAr:"المنهج: De maatschappij dat ben JIJ."},
      {id:"basislijn", nl:"Basislijn Project 1 — Young Professional afronden", ar:"إنهاء مشروع Basislijn 1 — Young Professional", hintNl:"Studieloopbaancoach: Jan Florijn.", hintAr:"المدرب المهني: Jan Florijn."}
    ]},
  { id:"portfolio", nl:"Portfolio en bewijs opbouwen", ar:"بناء ملف الأعمال والإثباتات",
    whyNl:"Bij een SOC-sollicitatie vragen ze wat je zélf gebouwd hebt. Bewijs verzamel je tijdens de opdrachten, niet erna.",
    whyAr:"لما تقدّم على SOC بيسألونك: إيش بنيت بنفسك؟ الإثباتات تجمعها أثناء الواجبات مش بعدها.",
    items:[
      {id:"github", nl:"GitHub-repo per labopdracht met screenshots en stappen", ar:"مستودع GitHub لكل واجب عملي مع صور وخطوات", hintNl:"Gebruikersnaam ab2054356-star — maak per LAB een map met een README.", hintAr:"الحساب ab2054356-star — سوِّ مجلد لكل LAB مع ملف README."},
      {id:"verslag", nl:"Van elke labopdracht een kort verslag in het Nederlands", ar:"تقرير قصير بالهولندي لكل واجب عملي", hintNl:"Twee vliegen: bewijs voor je portfolio én oefening voor 3F schrijven.", hintAr:"فايدتين: إثبات لملفك وتمرين على كتابة 3F."},
      {id:"mondeling", nl:"Voorbereiden op mondelinge vragen van de docent", ar:"الاستعداد لأسئلة المدرّس الشفوية", hintNl:"Kun je in je eigen woorden uitleggen wát je installeerde en waaróm?", hintAr:"تقدر تشرح بكلامك إيش نصّبت وليش؟"},
      {id:"thuislab", nl:"Eigen thuislab: één kwetsbare VM + één analyse-VM", ar:"مختبر بيتي: جهاز افتراضي ضعيف + جهاز للتحليل", hintNl:"Aanvallen en analyseren in je eigen netwerk — nooit op dat van school of een bedrijf.", hintAr:"الهجوم والتحليل داخل شبكتك أنت — أبداً مش شبكة المدرسة أو شركة."},
      {id:"linkedin", nl:"LinkedIn-profiel met je opleiding en projecten", ar:"حساب LinkedIn فيه دراستك ومشاريعك", hintNl:"Veel BPV-plaatsen in security lopen via mensen, niet via vacaturesites.", hintAr:"كثير من فرص BPV في الأمن تجي عن طريق الأشخاص مش المواقع."}
    ]}
];

/* ---------------- state ---------------- */
var online=false, items=[], specState={}, editId=null;
var settings={rooster:{},periodes:{}};
var LS_ITEMS="orad_items", LS_SPEC="orad_spec", LS_SET="orad_set";

function uid(){ return "o"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function today(){ var d=new Date(); d.setHours(0,0,0,0); return d; }
function parseDate(s){ if(!s) return null; var p=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s); if(!p) return null; var d=new Date(+p[1],+p[2]-1,+p[3]); d.setHours(0,0,0,0); return d; }
function daysLeft(s){ var d=parseDate(s); if(!d) return null; return Math.round((d-today())/86400000); }
function fmtDate(s){ var d=parseDate(s); if(!d) return "—"; var p=function(n){return n<10?"0"+n:""+n;}; return p(d.getDate())+"-"+p(d.getMonth()+1)+"-"+d.getFullYear(); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
/* Cijfer: getal 1..10 met één decimaal, of "" als er niets bruikbaars staat. */
function schoonCijfer(v){ var n=typeof v==="number"?v:(typeof v==="string"&&v.trim()!==""?parseFloat(v):NaN); return (isFinite(n)&&n>=1&&n<=10)?Math.round(n*10)/10:""; }
function cijferTekst(v){ var n=schoonCijfer(v); return n===""?"":n.toFixed(1); }

function lsGet(k,f){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

/* ---------------- persistence ---------------- */
/* ---------------- praten met de server ---------------- */
function api(method,path,body){
  return fetch(path,{
    method:method,
    headers: body?{"Content-Type":"application/json"}:undefined,
    body: body?JSON.stringify(body):undefined,
    credentials:"same-origin"
  }).then(function(r){
    if(r.status===401){ online=false; toonLogin(); throw new Error("auth"); }
    if(!r.ok) throw new Error("http "+r.status);
    return r.status===204?null:r.json();
  });
}
function lokaalOpslaan(){ lsSet(LS_ITEMS,items); lsSet(LS_SPEC,specState); lsSet(LS_SET,settings); }
function tekenAlles(){ render(); renderRooster(); renderRapport(); }

function saveItem(it){
  var i=items.findIndex(function(x){return x.id===it.id;});
  if(i>=0) items[i]=it; else items.push(it);
  tekenAlles();
  if(online){
    var copy={}; for(var k in it) if(k!=="id") copy[k]=it[k];
    api("PUT","/api/opdrachten/"+encodeURIComponent(it.id),copy).catch(function(){ setSync(false); });
  } else lokaalOpslaan();
}
function removeItem(id){
  items=items.filter(function(x){return x.id!==id;});
  tekenAlles();
  if(online) api("DELETE","/api/opdrachten/"+encodeURIComponent(id)).catch(function(){ setSync(false); });
  else lokaalOpslaan();
}
function saveSpec(){
  if(online) api("PUT","/api/specialisatie",{checked:specState}).catch(function(){ setSync(false); });
  else lokaalOpslaan();
}
function saveSettings(){
  renderRooster(); render();
  if(online) api("PUT","/api/instellingen",settings).catch(function(){ setSync(false); });
  else lokaalOpslaan();
}
/* dagen: 1=ma … 5=vr. Aantal dagen tot de eerstvolgende les van dit vak. */
function lesOverDagen(vak){
  var r=settings.rooster&&settings.rooster[vak];
  if(!r||!r.dag) return null;
  var vandaag=today().getDay(); // 0=zo
  var nu=(vandaag===0)?7:vandaag;
  var d=(+r.dag)-nu; if(d<0) d+=7;
  return d;
}
function lesTekst(vak){
  var d=lesOverDagen(vak); if(d===null) return "";
  var L=t();
  return d===0?L.lesVandaag:(d===1?L.lesMorgen:L.lesOver(d));
}
function setSync(ok,msg){
  var d=document.getElementById("syncdot"), m=document.getElementById("syncmsg");
  d.className="dot "+(ok?"on":"off");
  m.textContent = ok ? t().syncOn : (msg?t().syncOff:t().syncOff);
}

/* ---------------- rendering ---------------- */
function bucket(it){
  if(it.status==="klaar") return "done";
  var n=daysLeft(it.deadline);
  if(n===null) return "geen";
  if(n<0) return "late";
  if(n<=7) return "week";
  return "later";
}
function relText(it){
  var n=daysLeft(it.deadline);
  if(n===null) return "";
  if(it.status==="klaar") return "";
  if(n<0) return t().gelden(Math.abs(n));
  if(n===0) return t().vandaag;
  if(n===1) return t().morgen;
  return t().overd(n);
}
var ORDER=["late","week","later","geen","done"];
var NEXT={todo:"bezig",bezig:"ingeleverd",ingeleverd:"klaar",klaar:"todo"};
var openIds={};

function toISO(d){ var p=function(n){return n<10?"0"+n:""+n;}; return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate()); }
function inDays(n){ var d=today(); d.setDate(d.getDate()+n); return toISO(d); }

function detailHtml(i,st){
  var L=t(), h='<div class="detail">';
  h+='<div><h4>'+esc(L.stappen)+'</h4><div class="steps">';
  if(!st.length) h+='<div class="v" style="font-size:12.5px;color:var(--ink-3)">'+esc(L.geenStappen)+'</div>';
  st.forEach(function(s,idx){
    h+='<label class="step'+(s.d?" on":"")+'"><input type="checkbox" data-step="'+idx+'"'+(s.d?" checked":"")+'>'+
       '<span>'+esc(s.t)+'</span><button type="button" data-act="delstep" data-i="'+idx+'" aria-label="x">&times;</button></label>';
  });
  h+='</div><input type="text" class="addstep" data-act="addstep" placeholder="'+esc(L.stapPh)+'"></div>';
  h+='<div><h4>'+esc(L.bewijs)+'</h4><div class="bewijs">'+
     '<div class="linkrow"><input type="text" data-fld="link" value="'+esc(i.link||"")+'" placeholder="'+esc(L.linkPh)+'">'+
     (i.link?'<a href="'+esc(i.link)+'" target="_blank" rel="noopener">'+esc(L.openLink)+'</a>':'')+'</div>'+
     '<textarea data-fld="notitie" placeholder="'+esc(L.notitiePh)+'">'+esc(i.notitie||"")+'</textarea>'+
     '</div></div>';
  return h+'</div>';
}

function render(){
  var L=t();
  // filters options
  var vakken=[]; items.forEach(function(i){ if(i.vak && vakken.indexOf(i.vak)<0) vakken.push(i.vak); });
  vakken.sort();
  var fv=document.getElementById("f-vak"), cur=fv.value;
  fv.innerHTML='<option value="">'+esc(L.allevakken)+'</option>'+vakken.map(function(v){return '<option>'+esc(v)+'</option>';}).join("");
  if(vakken.indexOf(cur)>=0) fv.value=cur;
  document.getElementById("vakken").innerHTML=vakken.map(function(v){return '<option value="'+esc(v)+'">';}).join("");

  var fs=document.getElementById("f-status"), curs=fs.value;
  fs.innerHTML='<option value="">'+esc(L.allestatus)+'</option>'+["todo","bezig","ingeleverd","klaar"].map(function(s){return '<option value="'+s+'">'+esc(L.st[s])+'</option>';}).join("");
  fs.value=curs||"";
  var so=document.getElementById("f-sort"), curso=so.value;
  so.innerHTML='<option value="datum">'+esc(L.sortDatum)+'</option><option value="les">'+esc(L.sortLes)+'</option>';
  so.value=curso||"datum";

  var is=document.getElementById("i-status"), curi=is.value;
  is.innerHTML=["todo","bezig","ingeleverd","klaar"].map(function(s){return '<option value="'+s+'">'+esc(L.st[s])+'</option>';}).join("");
  is.value=curi||"todo";

  // stats
  var late=0,week=0,open=0,done=0;
  items.forEach(function(i){
    if(i.status==="klaar"){ done++; return; }
    open++;
    var n=daysLeft(i.deadline);
    if(n!==null && n<0) late++;
    else if(n!==null && n<=7) week++;
  });
  document.getElementById("s-late").textContent=late;
  document.getElementById("s-week").textContent=week;
  document.getElementById("s-open").textContent=open;
  document.getElementById("s-done").textContent=done;
  var pct= items.length? Math.round(done/items.length*100):0;
  document.getElementById("progbar").style.width=pct+"%";
  document.getElementById("proglab").textContent=pct+"%";
  document.getElementById("progsub").textContent=done+" / "+items.length+" · "+L.progsub;

  // list
  var q=document.getElementById("f-zoek").value.trim().toLowerCase();
  var fvak=fv.value, fst=fs.value;
  var shown=items.filter(function(i){
    if(fvak && i.vak!==fvak) return false;
    if(fst && i.status!==fst) return false;
    if(q){ var hay=((i.titel||"")+" "+(i.vak||"")+" "+(i.code||"")+" "+(i.periode||"")).toLowerCase(); if(hay.indexOf(q)<0) return false; }
    return true;
  });
  var box=document.getElementById("lijst");
  if(!items.length){ box.innerHTML='<div class="empty">'+esc(L.leeg)+'</div>'; return; }
  if(!shown.length){ box.innerHTML='<div class="empty">'+esc(L.geenmatch)+'</div>'; return; }

  var groups={}; ORDER.forEach(function(g){groups[g]=[];});
  shown.forEach(function(i){ groups[bucket(i)].push(i); });
  var mode=document.getElementById("f-sort").value||"datum";
  Object.keys(groups).forEach(function(g){
    groups[g].sort(function(a,b){
      if(mode==="les"){
        var la=lesOverDagen(a.vak), lb=lesOverDagen(b.vak);
        if(la===null&&lb!==null) return 1;
        if(lb===null&&la!==null) return -1;
        if(la!==null&&lb!==null&&la!==lb) return la-lb;
      }
      var da=parseDate(a.deadline), dbb=parseDate(b.deadline);
      if(!da&&!dbb) return 0; if(!da) return 1; if(!dbb) return -1; return da-dbb;
    });
  });
  var html="";
  ORDER.forEach(function(g){
    var arr=groups[g]; if(!arr.length) return;
    html+='<div class="group"><div class="ghead"><h2>'+esc(L.groups[g])+'</h2><span class="c">'+arr.length+'</span></div><div class="rows">';
    arr.forEach(function(i){
      var cls=g==="late"?"late":(g==="week"?"soon":(g==="done"?"done":""));
      var st=Array.isArray(i.stappen)?i.stappen:[];
      var klaar=st.filter(function(s){return s && s.d;}).length;
      var open=openIds[i.id];
      var due = i.deadline
        ? '<span class="d">'+esc(fmtDate(i.deadline))+'</span><br><span class="r">'+esc(relText(i))+'</span>'
        : '<button type="button" class="setdate" data-act="adddate">'+esc(L.setdate)+'</button>';
      html+='<div class="item" data-id="'+esc(i.id)+'"><div class="row '+cls+'">'+
        '<span class="stripe"></span>'+
        '<span class="code">'+esc(i.code||"—")+'</span>'+
        '<span class="meta"><span class="t">'+esc(i.titel||"—")+
          (st.length?'<span class="mini"><b>'+klaar+'/'+st.length+'</b></span>':'')+
          (i.link?'<span class="mini">&#128279;</span>':'')+
        '</span><br><span class="v">'+esc(i.vak||"")+(i.periode?" · "+esc(i.periode):"")+
          (i.status!=="klaar"&&lesTekst(i.vak)?" · "+esc(lesTekst(i.vak)):"")+'</span></span>'+
        '<span class="due">'+due+'</span>'+
        '<span class="acts">'+
          (cijferTekst(i.cijfer)?'<span class="mini" title="'+esc(L.lbCijfer)+'"><b>'+esc(cijferTekst(i.cijfer))+'</b></span>':'')+
          '<button type="button" class="pill" data-act="status" data-s="'+esc(i.status)+'">'+esc(L.st[i.status]||i.status)+'</button>'+
          '<button type="button" class="chev" data-act="toggle" aria-expanded="'+(open?"true":"false")+'" title="'+esc(L.details)+'" aria-label="'+esc(L.details)+'">'+(open?"&#9650;":"&#9660;")+'</button>'+
          '<button type="button" class="btn ghost" data-act="edit" title="'+esc(L.bewerk)+'" aria-label="'+esc(L.bewerk)+'">&#9998;</button>'+
          '<button type="button" class="btn ghost" data-act="del" title="'+esc(L.verwijder)+'" aria-label="'+esc(L.verwijder)+'">&times;</button>'+
        '</span></div>'+ (open?detailHtml(i,st):"") +'</div>';
    });
    html+='</div></div>';
  });
  box.innerHTML=html;
}

function renderSpec(){
  var L=lang, box=document.getElementById("specblocks"), html="";
  SPEC.forEach(function(b){
    html+='<div class="block"><h3>'+esc(L==="ar"?b.ar:b.nl)+'</h3><p class="why">'+esc(L==="ar"?b.whyAr:b.whyNl)+'</p><div class="checks">';
    b.items.forEach(function(it){
      var on=!!specState[it.id];
      html+='<label class="check'+(on?" on":"")+'"><input type="checkbox" data-spec="'+esc(it.id)+'"'+(on?" checked":"")+'>'+
        '<span class="txt">'+esc(L==="ar"?it.ar:it.nl)+(it.tag?'<span class="tag">'+esc(it.tag)+'</span>':'')+
        '<span class="hint">'+esc(L==="ar"?it.hintAr||"":it.hintNl||"")+'</span></span></label>';
    });
    html+='</div></div>';
  });
  box.innerHTML=html;
}

function renderRooster(){
  var L=t(), box=document.getElementById("roosterlijst");
  var vakken=[];
  items.forEach(function(i){ if(i.vak && vakken.indexOf(i.vak)<0) vakken.push(i.vak); });
  Object.keys(settings.rooster||{}).forEach(function(v){ if(vakken.indexOf(v)<0) vakken.push(v); });
  vakken.sort();
  if(!vakken.length){ box.innerHTML='<div class="empty">'+esc(L.leeg)+'</div>'; }
  else{
    box.innerHTML=vakken.map(function(v){
      var r=(settings.rooster||{})[v]||{};
      var opts='<option value="">'+esc(L.geenDag)+'</option>'+L.dagen.map(function(d,idx){
        return '<option value="'+(idx+1)+'"'+(+r.dag===idx+1?" selected":"")+'>'+esc(d)+'</option>';
      }).join("");
      return '<div class="rr" data-vak="'+esc(v)+'"><span class="nm">'+esc(v)+'</span>'+
        '<select data-set="dag">'+opts+'</select>'+
        '<input type="text" data-set="tijd" value="'+esc(r.tijd||"")+'" placeholder="11:30" size="6">'+
        '<span class="les">'+esc(lesTekst(v))+'</span></div>';
    }).join("");
  }
  var pb=document.getElementById("periodelijst");
  pb.innerHTML=["P1","P2","P3","P4"].map(function(p){
    return '<div class="rr" data-per="'+p+'"><span class="nm">'+p+'</span>'+
      '<input type="date" data-set="einde" value="'+esc((settings.periodes||{})[p]||"")+'">'+
      '<span></span><span class="les">'+esc((settings.periodes||{})[p]?fmtDate(settings.periodes[p]):"—")+'</span></div>';
  }).join("");
}

function rapportItems(){
  return items.filter(function(i){ return i.status==="klaar"||i.status==="ingeleverd"; })
    .sort(function(a,b){ return (a.periode||"").localeCompare(b.periode||"")||(a.code||"").localeCompare(b.code||""); });
}
function renderRapport(){
  var L=t(), arr=rapportItems(), box=document.getElementById("rapportview");
  if(!arr.length){ box.innerHTML='<div class="empty">'+esc(L.rapportLeeg)+'</div>'; return; }
  var h='<div class="rap"><h3>'+esc(L.rapportTitel)+' — Ashraf Mohammed</h3><p class="who">'+esc(L.rapportOnder)+'</p>';
  var cijfers=arr.map(function(i){return schoonCijfer(i.cijfer);}).filter(function(n){return n!=="";});
  if(cijfers.length){
    var gem=cijfers.reduce(function(s,n){return s+n;},0)/cijfers.length;
    h+='<p class="who"><b>'+esc(L.rapportGem)+': '+gem.toFixed(1)+'</b></p>';
  }
  arr.forEach(function(i){
    var st=Array.isArray(i.stappen)?i.stappen:[];
    var klaar=st.filter(function(s){return s&&s.d;}).length;
    h+='<div class="rapitem"><div class="rh"><span class="rc">'+esc(i.code||"—")+'</span>'+
       '<span class="rt">'+esc(i.titel||"")+'</span>'+
       '<span class="rv">'+esc(i.vak||"")+(i.periode?" · "+esc(i.periode):"")+
       (st.length?" · "+klaar+"/"+st.length:"")+' · '+esc(L.st[i.status])+
       (cijferTekst(i.cijfer)?" · "+esc(L.lbCijfer)+" "+esc(cijferTekst(i.cijfer)):"")+'</span></div>';
    h+='<p>'+esc(i.notitie||L.geenNotitie)+'</p>';
    if(i.link) h+='<a href="'+esc(i.link)+'" target="_blank" rel="noopener">'+esc(i.link)+'</a>';
    h+='</div>';
  });
  box.innerHTML=h+'</div>';
}
function rapportHtml(){
  var L=t(), arr=rapportItems(), esc2=esc;
  var cijfers=arr.map(function(i){return schoonCijfer(i.cijfer);}).filter(function(n){return n!=="";});
  var gemRij=cijfers.length
    ? '<p class="sub"><b>'+esc(L.rapportGem)+': '+(cijfers.reduce(function(s,n){return s+n;},0)/cijfers.length).toFixed(1)+'</b></p>'
    : "";
  var rows=arr.map(function(i){
    var st=Array.isArray(i.stappen)?i.stappen:[];
    var klaar=st.filter(function(s){return s&&s.d;}).length;
    return '<div class="it"><div class="hd"><b>'+esc2(i.code||"")+'</b> '+esc2(i.titel||"")+
      '</div><div class="mt">'+esc2(i.vak||"")+(i.periode?" · "+esc2(i.periode):"")+
      (st.length?" · "+klaar+"/"+st.length+" stappen":"")+' · '+esc2(L.st[i.status])+
      (cijferTekst(i.cijfer)?" · "+esc2(L.lbCijfer)+" "+esc2(cijferTekst(i.cijfer)):"")+'</div>'+
      '<p>'+esc2(i.notitie||"")+'</p>'+
      (i.link?'<a href="'+esc2(i.link)+'">'+esc2(i.link)+'</a>':'')+'</div>';
  }).join("");
  return '<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><title>'+esc(L.rapportTitel)+' — Ashraf Mohammed</title>'+
    '<style>body{font:14px/1.6 "Segoe UI",system-ui,sans-serif;color:#16211F;max-width:760px;margin:40px auto;padding:0 24px}'+
    'h1{font-size:20px;margin:0 0 2px}.sub{color:#6B7A82;font-size:12.5px;margin:0 0 24px}'+
    '.it{border-top:1px solid #D7DEDB;padding:12px 0}.hd{font-size:14.5px}.hd b{font-family:ui-monospace,monospace;color:#0E6E62;font-weight:500}'+
    '.mt{font-size:12px;color:#7A8B86;margin-top:2px}p{margin:6px 0 0;font-size:13px}a{font-size:11.5px;color:#0E6E62;word-break:break-all}</style></head><body>'+
    '<h1>'+esc(L.rapportTitel)+' — Ashraf Mohammed</h1><p class="sub">'+esc(L.rapportOnder)+' · '+fmtDate(toISO(today()))+'</p>'+
    gemRij+rows+'</body></html>';
}

function applyLang(){
  var L=t();
  document.documentElement.lang = lang==="ar"?"ar":"nl";
  document.documentElement.dir = L.dir;
  document.getElementById("title").textContent=L.title;
  document.getElementById("eyebrow").textContent=L.eyebrow;
  document.getElementById("subtitle").textContent=L.subtitle;
  document.getElementById("l-late").textContent=L.late;
  document.getElementById("l-week").textContent=L.week;
  document.getElementById("l-open").textContent=L.open;
  document.getElementById("l-done").textContent=L.done;
  document.getElementById("tab-opdrachten").textContent=L.tabs[0];
  document.getElementById("tab-rooster").textContent=L.tabs[1];
  document.getElementById("tab-spec").textContent=L.tabs[2];
  document.getElementById("tab-rapport").textContent=L.tabs[3];
  document.getElementById("tab-import").textContent=L.tabs[4];
  document.getElementById("roosterintro").textContent=L.roosterintro;
  document.getElementById("roostertitel").textContent=L.roostertitel;
  document.getElementById("i-nieuwvak").placeholder=L.nieuwvakPh;
  document.getElementById("btn-vak").textContent=L.vakBtn;
  document.getElementById("periodetitel").textContent=L.periodetitel;
  document.getElementById("periodehint").textContent=L.periodehint;
  document.getElementById("rapportintro").textContent=L.rapportintro;
  document.getElementById("btn-rapport").textContent=L.rapportBtn;
  document.getElementById("qp").textContent=L.qPeriode;
  document.getElementById("f-zoek").placeholder=L.zoek;
  document.getElementById("btn-new").textContent=L.nieuw;
  document.getElementById("btn-save").textContent=L.opslaan;
  document.getElementById("btn-cancel").textContent=L.annuleren;
  document.getElementById("lb-titel").textContent=L.lbTitel;
  document.getElementById("lb-vak").textContent=L.lbVak;
  document.getElementById("lb-code").textContent=L.lbCode;
  document.getElementById("lb-deadline").textContent=L.lbDeadline;
  document.getElementById("lb-periode").textContent=L.lbPeriode;
  document.getElementById("lb-status").textContent=L.lbStatus;
  document.getElementById("lb-cijfer").textContent=L.lbCijfer;
  document.getElementById("q1").textContent=L.qMorgen;
  document.getElementById("q7").textContent=L.qWeek;
  document.getElementById("q14").textContent=L.qTwee;
  document.getElementById("specintro").textContent=L.specintro;
  document.getElementById("importhint").innerHTML=L.importhint;
  document.getElementById("btn-import").textContent=L.importbtn;
  document.getElementById("importbox").placeholder=L.importph;
  document.getElementById("lang-ar").setAttribute("aria-pressed", lang==="ar"?"true":"false");
  document.getElementById("lang-nl").setAttribute("aria-pressed", lang==="nl"?"true":"false");
  document.getElementById("btn-uit").textContent=L.uitloggen;
  setSync(online);
  render(); renderSpec(); renderRooster(); renderRapport();
}

/* ---------------- events ---------------- */
document.getElementById("lang-ar").addEventListener("click",function(){ lang="ar"; lsSet("orad_lang","ar"); applyLang(); });
document.getElementById("lang-nl").addEventListener("click",function(){ lang="nl"; lsSet("orad_lang","nl"); applyLang(); });

["f-vak","f-status"].forEach(function(id){ document.getElementById(id).addEventListener("change",render); });
document.getElementById("f-zoek").addEventListener("input",render);

var tabs=[["tab-opdrachten","panel-opdrachten"],["tab-rooster","panel-rooster"],["tab-spec","panel-spec"],["tab-rapport","panel-rapport"],["tab-import","panel-import"]];
tabs.forEach(function(p){
  document.getElementById(p[0]).addEventListener("click",function(){
    tabs.forEach(function(q){
      var sel=q[0]===p[0];
      document.getElementById(q[0]).setAttribute("aria-selected",sel?"true":"false");
      document.getElementById(q[1]).hidden=!sel;
    });
    if(p[0]==="tab-rapport") renderRapport();
    if(p[0]==="tab-rooster") renderRooster();
  });
});

document.getElementById("f-sort").addEventListener("change",render);

document.getElementById("roosterlijst").addEventListener("change",function(e){
  var el=e.target, row=el.closest(".rr"); if(!row) return;
  var vak=row.getAttribute("data-vak"), k=el.getAttribute("data-set");
  if(!vak||!k) return;
  settings.rooster=settings.rooster||{};
  settings.rooster[vak]=settings.rooster[vak]||{};
  settings.rooster[vak][k]=el.value;
  saveSettings();
});
document.getElementById("periodelijst").addEventListener("change",function(e){
  var row=e.target.closest(".rr"); if(!row) return;
  var p=row.getAttribute("data-per"); if(!p) return;
  settings.periodes=settings.periodes||{};
  settings.periodes[p]=e.target.value;
  saveSettings();
});
document.getElementById("btn-vak").addEventListener("click",function(){
  var el=document.getElementById("i-nieuwvak"), v=el.value.trim(); if(!v) return;
  settings.rooster=settings.rooster||{};
  if(!settings.rooster[v]) settings.rooster[v]={dag:"",tijd:""};
  el.value=""; saveSettings();
});
document.getElementById("qp").addEventListener("click",function(){
  var p=(document.getElementById("i-periode").value||"").trim().toUpperCase();
  var d=(settings.periodes||{})[p];
  if(d) document.getElementById("i-deadline").value=d;
  else document.getElementById("formerr").textContent=t().periodehint;
});
document.getElementById("btn-rapport").addEventListener("click",async function(){
  var msg=document.getElementById("rapportmsg"), L=t();
  if(!rapportItems().length){ msg.textContent=L.rapportLeeg; return; }
  var dl=null;
  try{ dl = window.claude && claude.use ? await claude.use("downloads") : null; }catch(e){ dl=null; }
  if(!dl){ msg.textContent=L.rapportNee; return; }
  try{
    await dl.save({filename:"voortgangsrapport-ashraf.html", data:rapportHtml()});
    msg.textContent=L.rapportOk;
  }catch(err){ msg.textContent=L.rapportNee; }
});

function openForm(it){
  editId = it? it.id : null;
  document.getElementById("i-titel").value = it? (it.titel||"") : "";
  document.getElementById("i-vak").value = it? (it.vak||"") : "";
  document.getElementById("i-code").value = it? (it.code||"") : "";
  document.getElementById("i-deadline").value = it? (it.deadline||"") : "";
  document.getElementById("i-periode").value = it? (it.periode||"") : "";
  document.getElementById("i-status").value = it? (it.status||"todo") : "todo";
  document.getElementById("i-cijfer").value = it? (it.cijfer||"") : "";
  document.getElementById("formerr").textContent="";
  document.getElementById("formcard").hidden=false;
  document.getElementById("i-titel").focus();
}
document.getElementById("btn-new").addEventListener("click",function(){ openForm(null); });
["q1","q7","q14"].forEach(function(id){
  document.getElementById(id).addEventListener("click",function(){
    document.getElementById("i-deadline").value = inDays(+this.getAttribute("data-q"));
  });
});
document.getElementById("btn-cancel").addEventListener("click",function(){ document.getElementById("formcard").hidden=true; editId=null; });
document.getElementById("btn-save").addEventListener("click",function(){
  var titel=document.getElementById("i-titel").value.trim();
  if(!titel){ document.getElementById("formerr").textContent=t().errTitel; return; }
  var base = editId ? items.filter(function(x){return x.id===editId;})[0] : null;
  var it = base ? clone(base) : {};
  it.id = editId||uid();
  Object.assign(it,{
    titel: titel,
    vak: document.getElementById("i-vak").value.trim(),
    code: document.getElementById("i-code").value.trim(),
    deadline: document.getElementById("i-deadline").value,
    periode: document.getElementById("i-periode").value.trim(),
    status: document.getElementById("i-status").value||"todo",
    cijfer: schoonCijfer(document.getElementById("i-cijfer").value)
  });
  saveItem(it);
  document.getElementById("formcard").hidden=true; editId=null;
});

function itemOf(el){
  var box=el.closest(".item"); if(!box) return null;
  var id=box.getAttribute("data-id");
  return items.filter(function(x){return x.id===id;})[0]||null;
}
function clone(it){ var n={}; for(var k in it) n[k]=it[k]; if(Array.isArray(it.stappen)) n.stappen=it.stappen.map(function(s){return {t:s.t,d:!!s.d};}); return n; }

document.getElementById("lijst").addEventListener("click",function(e){
  var b=e.target.closest("button[data-act]"); if(!b) return;
  var it=itemOf(b); if(!it) return;
  var act=b.getAttribute("data-act");
  if(act==="del"){ removeItem(it.id); }
  else if(act==="edit"){ openForm(it); document.getElementById("formcard").scrollIntoView({block:"nearest"}); }
  else if(act==="status"){ var n=clone(it); n.status=NEXT[it.status]||"todo"; saveItem(n); }
  else if(act==="toggle"){ openIds[it.id]=!openIds[it.id]; render(); }
  else if(act==="delstep"){ var m=clone(it); (m.stappen||[]).splice(+b.getAttribute("data-i"),1); saveItem(m); }
  else if(act==="adddate"){
    var inp=document.createElement("input");
    inp.type="date"; inp.className="inlinedate"; inp.value=inDays(7);
    b.replaceWith(inp); inp.focus();
    if(inp.showPicker) try{ inp.showPicker(); }catch(err){}
    inp.addEventListener("change",function(){
      var n=clone(it); n.deadline=inp.value; saveItem(n);
    });
  }
});

document.getElementById("lijst").addEventListener("keydown",function(e){
  if(e.key!=="Enter") return;
  var inp=e.target; if(!inp.getAttribute || inp.getAttribute("data-act")!=="addstep") return;
  var txt=inp.value.trim(); if(!txt) return;
  var it=itemOf(inp); if(!it) return;
  var n=clone(it); n.stappen=(n.stappen||[]).concat([{t:txt,d:false}]);
  inp.value=""; saveItem(n);
});

document.getElementById("lijst").addEventListener("change",function(e){
  var el=e.target;
  var it=itemOf(el); if(!it) return;
  if(el.getAttribute && el.getAttribute("data-step")!==null && el.type==="checkbox"){
    var n=clone(it), idx=+el.getAttribute("data-step");
    if(n.stappen && n.stappen[idx]) n.stappen[idx].d=el.checked;
    saveItem(n); return;
  }
  var fld=el.getAttribute && el.getAttribute("data-fld");
  if(fld){
    var v=el.value.trim();
    if((it[fld]||"")===v) return;
    var m=clone(it); m[fld]=v; saveItem(m);
  }
});

document.getElementById("specblocks").addEventListener("change",function(e){
  var cb=e.target; if(!cb || !cb.getAttribute || !cb.getAttribute("data-spec")) return;
  specState[cb.getAttribute("data-spec")] = cb.checked;
  cb.closest(".check").classList.toggle("on", cb.checked);
  saveSpec();
});

document.getElementById("btn-import").addEventListener("click",function(){
  var raw=document.getElementById("importbox").value;
  var lines=raw.split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean);
  var msg=document.getElementById("importmsg");
  if(!lines.length){ msg.textContent=t().importleeg; return; }
  var n=0;
  lines.forEach(function(line){
    var parts=line.split(/\s*[|\t]\s*/);
    var vak=parts[0]||"", code=parts[1]||"", titel=parts[2]||"", dstr=parts[3]||"";
    if(parts.length===1){ titel=parts[0]; vak=""; }
    if(parts.length===2){ vak=parts[0]; titel=parts[1]; code=""; }
    if(parts.length===3){ vak=parts[0]; code=parts[1]; titel=parts[2]; }
    var deadline="";
    var m=/(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/.exec(dstr) ;
    if(m){ var y=m[3].length===2?"20"+m[3]:m[3]; deadline=y+"-"+("0"+m[2]).slice(-2)+"-"+("0"+m[1]).slice(-2); }
    else { var m2=/(\d{4})-(\d{2})-(\d{2})/.exec(dstr); if(m2) deadline=m2[0]; }
    if(!titel) return;
    saveItem({id:uid(),titel:titel,vak:vak,code:code,deadline:deadline,periode:"",status:"todo"});
    n++;
  });
  document.getElementById("importbox").value="";
  msg.textContent=t().importok(n);
});

/* ---------------- boot ---------------- */
/* Inloggen heeft nu een eigen pagina. Niet ingelogd? Dan sturen we de browser
   daarheen; deze pagina toont nooit meer twee schermen tegelijk. */
function toonLogin(){ location.replace("/login.html"); }
function toonApp(){ var a=document.getElementById("app"); if(a) a.hidden=false; }

function laadState(){
  return api("GET","/api/state").then(function(st){
    items = st.opdrachten||[];
    items.forEach(function(i){ if(!i.status) i.status="todo"; });
    specState = (st.specialisatie&&st.specialisatie.checked)||{};
    settings = {rooster:(st.instellingen&&st.instellingen.rooster)||{}, periodes:(st.instellingen&&st.instellingen.periodes)||{}};
    online=true; toonApp(); applyLang();
  });
}

document.getElementById("btn-uit").addEventListener("click",function(){
  fetch("/api/logout",{method:"POST",credentials:"same-origin"}).finally(function(){
    online=false; location.replace("/login.html");
  });
});

lang = lsGet("orad_lang","ar")==="nl" ? "nl":"ar";
items = lsGet(LS_ITEMS,[]);
specState = lsGet(LS_SPEC,{});
settings = lsGet(LS_SET,{rooster:{},periodes:{}});
if(!settings.rooster) settings.rooster={};
if(!settings.periodes) settings.periodes={};
applyLang();

/* Eerst de server proberen. 401 -> inlogscherm. Server onbereikbaar -> lokale modus. */
laadState().catch(function(err){
  if(String(err && err.message)!=="auth"){ online=false; toonApp(); applyLang(); }
});

})();
