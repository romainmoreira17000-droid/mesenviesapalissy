/* Mes Envies au Centre — appli des envies des enfants (maternelle au CM2).
   Données : Supabase (tables envies, paroles, reglages — voir supabase-setup.sql). */

/* ---------------- Données de base ---------------- */
const CLASSES = [
  {id:"PS",cyc:"mat",sub:"Petite section"},{id:"MS",cyc:"mat",sub:"Moyenne section"},{id:"GS",cyc:"mat",sub:"Grande section"},
  {id:"CP",cyc:"elem",sub:"6-7 ans"},{id:"CE1",cyc:"elem",sub:"7-8 ans"},{id:"CE2",cyc:"elem",sub:"8-9 ans"},
  {id:"CM1",cyc:"elem",sub:"9-10 ans"},{id:"CM2",cyc:"elem",sub:"10-11 ans"}];
const MOMENTS = [
  {id:"peri",lbl:"Périscolaire",sub:"Le matin et le soir",pic:"🌅"},
  {id:"mer",lbl:"Mercredi",sub:"La journée au centre",pic:"🎒"},
  {id:"midi",lbl:"Pause du midi",sub:"Après la cantine",pic:"🍽️"}];
const BASE = {
  peri:[["lego","🧱","Lego et Kapla"],["jeux","🎲","Jeux de société"],["dessin","🖍️","Dessin et coloriage"],["lecture","📚","Lecture et BD"],
    ["pate","🟢","Pâte à modeler"],["perles","📿","Perles et bracelets"],["dehors","🏃","Jeux dehors"],["ballon","⚽","Ballon"],
    ["calme","🧘","Coin calme"],["devoirs","✏️","Aide aux devoirs"],["dinette","🧸","Dînette et poupées"],["musique","🎵","Musique"]],
  mer:[["piscine","🏊","Piscine"],["sortie","🌳","Sortie au parc"],["cinema","🎬","Cinéma"],["musee","🏛️","Musée"],
    ["cuisine","🧁","Cuisine"],["bricolage","✂️","Bricolage"],["grandjeu","🗺️","Grand jeu"],["sport","🤸","Sport"],
    ["danse","💃","Danse"],["theatre","🎭","Théâtre"],["jardin","🌱","Jardinage"],["sciences","🔬","Expériences"],
    ["peinture","🎨","Peinture"],["chasse","🔎","Chasse au trésor"],["velo","🚲","Vélo et trottinette"],["spectacle","🎤","Spectacle"]],
  midi:[["foot","⚽","Foot"],["corde","🪢","Corde à sauter"],["loup","🐺","Jeux de loup"],["cache","🙈","Cache-cache"],
    ["elastique","🎯","Élastique et marelle"],["biblio","📖","Bibliothèque"],["calme","😌","Coin calme"],["dessin","🖍️","Dessin"],
    ["jeux","🎲","Jeux de société"],["basket","🏀","Basket"],["chant","🎶","Chansons"],["relax","☁️","Relaxation"]]};
const MOODS=[{id:"top",pic:"😄",lbl:"J'adore",col:"var(--mer)"},{id:"bof",pic:"😐",lbl:"Un peu",col:"var(--sel)"},{id:"non",pic:"😟",lbl:"Pas trop",col:"var(--mat)"}];
const MAXCHOIX=3;
const AMELIO=[["jeux","🎲","Les jeux et le matériel"],["cour","⛹️","La cour"],["cantine","🍽️","La cantine"],["bruit","🤫","Le bruit, le calme"],
  ["regles","📏","Les règles"],["copains","🤝","S'entendre avec les copains"],["salles","🏠","Les salles et la déco"],["temps","⏰","Le temps pour jouer"],
  ["choisir","🙋","Pouvoir choisir"],["sorties","🚌","Les sorties"],["toilettes","🚻","Les toilettes"],["autre","➕","Autre chose"]];
const EXPLO=[["nature","🦋","La nature et les animaux"],["sciences","🧪","Les sciences"],["robots","🤖","Robots et numérique"],["cirque","🤹","Le cirque"],
  ["sportnew","🏹","Un nouveau sport"],["monde","🌍","Les pays du monde"],["cuisinem","🍜","Cuisiner d'ailleurs"],["metiers","👩‍🚒","Des métiers"],
  ["espace","🚀","L'espace et les étoiles"],["instrument","🥁","Jouer d'un instrument"],["film","🎥","Faire un film"],["potager","🌻","Un potager"],
  ["histoire","🏰","Les châteaux, l'histoire"],["autre","➕","Autre chose"]];
const PTYPES={
  ameliorer:{lbl:"J'améliore le centre",pic:"🔧",cls:"ame",col:"var(--peri)",q:"Qu'est-ce que tu changerais au centre ?",tags:AMELIO,ph:"Par exemple : avoir plus de ballons dans la cour",sub:"Ce que je changerais"},
  explorer:{lbl:"J'aimerais découvrir",pic:"🧭",cls:"exp",col:"var(--mer)",q:"Qu'est-ce que tu aimerais découvrir ?",tags:EXPLO,ph:"Par exemple : apprendre des tours de magie",sub:"Des choses nouvelles à essayer"},
  libre:{lbl:"Je m'exprime",pic:"💬",cls:"lib",col:"var(--midi)",q:"Dis ou dessine ce que tu veux !",tags:null,ph:"Écris ici ce que tu as envie de dire",sub:"Dire ou dessiner ce que je veux"}};
const EMOS=[["tristesse","😢","Tristesse","#BFE3FA","J'ai du chagrin, je suis déçu ou je me sens seul.","#2F9BD8"],
  ["peur","😨","Peur","#DCCBEF","J'ai peur de quelque chose, je ne me sens pas rassuré.","#8E5BB5"],
  ["colere","😠","Colère","#FBC9C4","Je suis fâché, pas d'accord, ou c'est injuste.","#D93A32"],
  ["honte","😳","Honte","#FBE49C","Je suis gêné, j'ai envie de me cacher.","#E8B21E"],
  ["joie","😄","Soulagement et joie","#D5EEBF","Je me sens bien, je suis content, ça va mieux.","#5BAE3A"]];
const EMO_POS=["joie"];
const emoById=id=>EMOS.find(e=>e[0]===id)||[id,"❔",id,"#eee"];
const CAUSES=[["copains","🤝","Les copains"],["jeu","🎲","Un jeu"],["activite","🎨","Une activité"],["cantine","🍽️","La cantine"],["ecole","🏫","L'école"],
  ["maison","🏠","La maison"],["adulte","🧑","Un adulte"],["sais","🤷","Je ne sais pas"],["autre","➕","Autre chose"]];
const PENS=["#1F2B3A","#E53935","#FB8C00","#FDD835","#43A047","#1E88E5","#8E24AA","#8D6E63"];

/* ---------------- Connexion Supabase ---------------- */
const CFG=window.ENVIES_CONFIG||{};
const configured=!!(CFG.supabaseUrl&&CFG.supabaseKey&&window.supabase);
/* « Rester connecté » : la session n'est gardée sur l'appareil que si l'animateur l'a demandé (téléphone perso).
   Sinon (tablette des enfants) elle reste en mémoire et disparaît à la fermeture. */
let remember=false; try{ remember=localStorage.getItem("envies-remember")==="1"; }catch(e){}
const memStore={};
const authStorage={
  getItem:k=>{ try{ return remember?localStorage.getItem(k):(k in memStore?memStore[k]:null); }catch(e){ return memStore[k]??null; } },
  setItem:(k,v)=>{ try{ if(remember) localStorage.setItem(k,v); else memStore[k]=v; }catch(e){ memStore[k]=v; } },
  removeItem:k=>{ delete memStore[k]; try{ localStorage.removeItem(k); }catch(e){} }};
function setRemember(v){ remember=!!v; try{ v?localStorage.setItem("envies-remember","1"):localStorage.removeItem("envies-remember"); }catch(e){} }
const sb=configured?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,storage:authStorage,storageKey:"envies-auth"}}):null;

/* ---------------- État ---------------- */
let voice=true, pen=PENS[0], session=null;
let votes=[], paroles=[], familles=[], emotions=[], emoReady=true, breathTimer=null, loadState="idle", lastLoad=0, refreshTimer=null;
let config={added:{peri:[],mer:[],midi:[]},hidden:[]};
const fresh=()=>({emo:null,intensite:null,causes:[],causeAutre:"",parler:null,prenom:"",emoTexte:"",autre:"",choix:[],humeur:null,moment:null,tags:[],texte:"",dessin:null,pmoment:null});
let s={view:"accueil",classe:null,...fresh()};
let acc={mode:"login",msg:"",pending:[],team:[],ntfy:null};
let adm={tab:"res",fm:"all",fc:"all",fp:"all",pt:"all",ft:"all",confirm:false,delp:null,err:"",busy:false};
let timer=null;
try{ if(localStorage.getItem("envies-voice")==="off") voice=false; }catch(e){}

const $=(sel,el=document)=>el.querySelector(sel);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,3000);}
/* Voix : on choisit explicitement une voix française quand l'appareil en a une (les tablettes la chargent parfois en retard). */
const hasTTS="speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
let frVoice=null, voiceCount=0;
function pickVoice(){ try{ const v=speechSynthesis.getVoices(); voiceCount=v.length;
  frVoice=v.find(x=>/^fr[-_]FR/i.test(x.lang)&&x.localService)||v.find(x=>/^fr[-_]FR/i.test(x.lang))||v.find(x=>/^fr/i.test(x.lang))||null; }catch(e){} }
if(hasTTS){ pickVoice(); try{ speechSynthesis.addEventListener("voiceschanged",pickVoice); }catch(e){} setTimeout(pickVoice,800); setTimeout(pickVoice,3000); }
/* Phrases enregistrées à l'avance (dossier audio/) : elles marchent même sur une tablette sans voix installée. */
let voixMap={}, curAudio=null;
try{ fetch("audio/voix.json?v=20261110i").then(r=>r.ok?r.json():{}).then(j=>{voixMap=j||{};}).catch(()=>{}); }catch(e){}
function say(t,force){
  if((!voice&&!force)||!t) return;
  const k=voixMap[t];
  if(k){
    try{ if(curAudio) curAudio.pause(); if(hasTTS) speechSynthesis.cancel();
      curAudio=new Audio("audio/"+k+".mp3"); const p=curAudio.play(); if(p&&p.catch) p.catch(()=>sayTTS(t)); return; }catch(e){}
  }
  sayTTS(t);
}
function sayTTS(t){
  if(!hasTTS||!t) return;
  try{
    const u=new SpeechSynthesisUtterance(t); u.lang="fr-FR"; u.rate=.95; if(frVoice) u.voice=frVoice;
    const speak=()=>{ try{ speechSynthesis.resume(); speechSynthesis.speak(u); }catch(e){} };
    /* sur Android, annuler puis parler dans la foulée fait parfois perdre la phrase : on laisse un court délai */
    if(speechSynthesis.speaking||speechSynthesis.pending){ speechSynthesis.cancel(); setTimeout(speak,90); } else speak();
  }catch(e){}
}
function voiceDiag(){
  const n=Object.keys(voixMap).length;
  if(n) return "✅ "+n+" phrases enregistrées dans l'appli : la voix marche même sans voix installée sur l'appareil. Si vous n'entendez rien, montez le volume « Multimédia » et vérifiez que le bouton 🔊 Voix est activé."+(hasTTS&&frVoice?"":" (Les activités ajoutées par l'équipe ne seront pas lues sur cet appareil.)");
  if(!hasTTS) return "⛔ Ce navigateur ne sait pas lire à voix haute. Ouvrez l'appli avec Chrome.";
  pickVoice();
  if(!voiceCount) return "⛔ Aucune voix n'est installée sur cet appareil. Dans les Paramètres de la tablette, cherchez « Synthèse vocale » : il faut un moteur (par exemple « Services vocaux de Google ») avec la langue Français. Sur une tablette gérée, c'est à demander à l'administrateur.";
  if(!frVoice) return "⚠️ "+voiceCount+" voix installées, mais aucune en français. Dans les Paramètres de la tablette, cherchez « Synthèse vocale » et ajoutez la langue Français.";
  return "✅ Voix française trouvée : "+frVoice.name+". Si vous n'entendez rien, montez le volume « Multimédia » de la tablette.";
}
function activities(m){
  const base=BASE[m].map(([id,e,l])=>({id:m+":"+id,e,l,custom:false}));
  const add=(config.added?.[m]||[]).map(a=>({id:a.id,e:a.e,l:a.l,custom:true}));
  return [...base,...add,{id:m+":autre",e:"➕",l:"Autre chose",custom:false,autre:true}];
}
const visibleActs=m=>activities(m).filter(a=>!(config.hidden||[]).includes(a.id));
function actById(id){for(const m of ["peri","mer","midi"]){const a=activities(m).find(x=>x.id===id); if(a) return a;} return {id,e:"❔",l:id.split(":").pop()};}
const tagById=(type,id)=>{const t=(PTYPES[type]?.tags||[]).find(x=>x[0]===id);return t?{e:t[1],l:t[2]}:{e:"•",l:id};};
const momentLbl=id=>id==="tous"?"Partout":(MOMENTS.find(m=>m.id===id)?.lbl||"");
const fdate=t=>new Date(t).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
const cycleOf=c=>CLASSES.find(x=>x.id===c)?.cyc;

/* ---------------- File d'attente (wifi coupé) ---------------- */
function readQueue(){try{return JSON.parse(localStorage.getItem("envies-queue")||"[]");}catch(e){return [];}}
function writeQueue(q){try{localStorage.setItem("envies-queue",JSON.stringify(q));return true;}catch(e){return false;}}
function showQueue(){const n=readQueue().length,c=$("#queueChip"); c.hidden=!n; c.textContent=`⏳ ${n} en attente d'envoi`; c.title="Ces réponses partiront dès que la connexion revient.";}
const tableMissing=err=>err?.code==="PGRST205"||err?.code==="42P01"||/schema cache|does not exist/i.test(err?.message||"");
const isNetworkError=err=>!navigator.onLine||!err?.code&&/fetch|network|load failed|timeout/i.test(err?.message||"");
let flushing=false;
async function flushQueue(){
  if(!sb||flushing) return; flushing=true;
  try{
    let q=readQueue();
    while(q.length){
      const {table,row}=q[0];
      const {error}=await sb.from(table).insert(row);
      if(error&&(isNetworkError(error)||tableMissing(error))) break;
      q.shift(); writeQueue(q);           // envoyé, ou refusé définitivement : on le retire
    }
  }finally{flushing=false; showQueue();}
}

/* ---------------- La mascotte (personnage du centre, images dans img/) ---------------- */
/* Égalité filles-garçons : la fille (f) et le garçon (g) alternent, et l'ordre s'inverse à chaque nouvel enfant. */
let mixFlip=false;
const genre=i=>((i+(mixFlip?1:0))%2===0)?"f":"g";
function fox(pose="wave",cls="fox",g){
  const src={wave:"perso-assis",cheer:"perso-coeur",peek:"perso-grimpe",calm:"perso-briques"}[pose]||"perso-assis";
  if(!g) g=pose==="peek"?genre(STEP[s.view]||0):genre(0);
  return `<img class="${cls} mascotte ${pose}" src="img/${src}-${g}.webp" alt="" aria-hidden="true">`;
}
const emoImg=(id,cls="emohead")=>`<img class="${cls}" src="img/emo-${id}-${genre(Math.max(0,EMOS.findIndex(e=>e[0]===id)))}.webp" alt="" aria-hidden="true">`;
const STEP={emo:3,emo2:4,classe:1,hub:2,moment:3,ameliorer:3,explorer:3,libre:3,choix:4,humeur:4};
const BACK={emo:"hub",emo2:"emo",classe:"accueil",hub:"classe",moment:"hub",choix:"moment",humeur:"choix",ameliorer:"hub",explorer:"hub",libre:"hub"};
function nav(){
  const n=STEP[s.view]||1;
  const dots=[1,2,3,4].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("<b></b>");
  return `<div class="topnav"><button class="round" data-go="${BACK[s.view]}" aria-label="Retour">←</button>
    <div class="dots" aria-label="Étape ${n} sur 4">${dots}</div>${s.classe&&s.view!=="classe"?`<span class="classchip">${esc(s.classe)}</span>`:"<span></span>"}</div>`;
}

/* ---------------- Rendu enfant ---------------- */
function render(){
  const app=$("#app");
  document.body.dataset.scene=s.view.startsWith("adm")?"adm":s.view;
  $("#voiceBtn").setAttribute("aria-pressed",voice);
  $("#voiceBtn").textContent=voice?"🔊 Voix":"🔇 Voix";
  $("#adultBtn").textContent=s.view.startsWith("adm")?"← Retour aux enfants":"Espace animateur";
  $("#voiceBtn").hidden=s.view.startsWith("adm"); if(typeof majFsBtn==="function") majFsBtn();
  if(s.view==="adm-login") return renderLogin(app);
  if(s.view==="adm"){ renderAdmin(app); const at=document.querySelector(".admtab[aria-pressed=true]"); if(at){ const nav=at.parentElement; nav.scrollLeft=Math.max(0,at.offsetLeft-nav.clientWidth/2+at.offsetWidth/2); } return; }

  if(s.view==="accueil"){
    app.innerHTML=`<div class="wrap kid">
      <div class="hero">${fox("wave","fox","f")}<div class="sign">Bonjour !<br>Qui es-tu ?<button class="speak" data-say="Bonjour ! Qui es-tu ? Enfants, ou familles ?" aria-label="Écouter">🔊</button></div>${fox("wave","fox right","g")}</div>
      <div class="grid tiles">
        <button class="tile" data-go="classe" aria-label="Enfants : je donne mes envies et mes idées"><img src="img/accueil-enfants.webp" alt="" width="560" height="553"><span class="tsub">Je donne mes envies et mes idées</span></button>
        <a class="tile" href="familles.html?app" aria-label="Familles : votre avis sur le centre"><img src="img/accueil-familles.webp" alt="" width="560" height="553"><span class="tsub">Parents : votre avis sur le centre</span></a>
      </div></div>`;
    return;
  }
  if(s.view==="classe"){
    const btn=c=>`<button class="big ${c.cyc}" data-classe="${c.id}"><span class="lbl">${c.id}</span><span class="sub">${c.sub}</span></button>`;
    app.innerHTML=`<div class="wrap kid">${nav()}
      ${q("Tu es dans quelle classe ?","",null,true)}
      <div class="cyc mat"><div class="cycle-title">Maternelle</div><div class="grid classes">${CLASSES.filter(c=>c.cyc==="mat").map(btn).join("")}</div></div>
      <div class="cyc elem"><div class="cycle-title">Élémentaire</div><div class="grid classes">${CLASSES.filter(c=>c.cyc==="elem").map(btn).join("")}</div></div></div>`;
  }
  else if(s.view==="hub"){
    const door=(cls,go,pic,lbl,sub)=>`<button class="big door ${cls}" data-go="${go}"><span class="pic" aria-hidden="true">${pic}</span><span class="lbl">${lbl}</span><span class="sub">${sub}</span></button>`;
    app.innerHTML=`<div class="wrap kid">${nav()}${q("Qu'est-ce que tu veux faire ?","",null,true)}
      <div class="grid hub">
        <button class="big door emo star" data-go="emo"><span class="pic">${emoImg("joie")}</span><span class="lbl">Mes émotions</span><span class="sub">Comment je me sens aujourd'hui</span><span class="daily">Tous les jours</span></button>
        ${CAL.isOpen(config.ouvertures,"env")?door("env","moment","🎯","Mes envies d'activités","Choisir ce que j'ai envie de faire"):""}
        ${Object.entries(PTYPES).filter(([k])=>CAL.isOpen(config.ouvertures,k)).map(([k,p])=>door(p.cls,k,p.pic,p.lbl,p.sub)).join("")}
      </div></div>`;
  }
  else if(s.view==="moment"){
    app.innerHTML=`<div class="wrap kid">${nav()}${q("C'est pour quel moment ?","","📅")}
      <div class="grid moments">${MOMENTS.map(m=>`<button class="big moment ${m.id}" data-moment="${m.id}"><span class="pic" aria-hidden="true">${m.pic}</span><span class="lbl">${m.lbl}</span><span class="sub">${m.sub}</span></button>`).join("")}</div></div>`;
  }
  else if(s.view==="choix"){
    const acts=visibleActs(s.moment);
    const n=s.choix.length;
    app.innerHTML=`<div class="wrap kid">${nav()}${q("Quelles activités tu as envie de faire ?",`Choisis jusqu'à ${MAXCHOIX} activités.`)}
      <div class="grid acts">${acts.map(a=>{const i=s.choix.indexOf(a.id);return `<button class="big act" data-act="${esc(a.id)}" aria-pressed="${i>=0}"><span class="badge" aria-hidden="true">✓</span><span class="pic" aria-hidden="true">${esc(a.e)}</span><span class="name">${esc(a.l)}</span></button>`}).join("")}</div>
      ${s.choix.some(id=>id.endsWith(":autre"))?`<div class="idea"><label for="autreTxt">➕ Quelle autre activité ?</label>
        <small>Un grand peut l'écrire pour toi.</small>
        <input id="autreTxt" maxlength="120" placeholder="Par exemple : faire une cabane" value="${esc(s.autre)}" style="font-size:1.2rem"></div>`:""}
      <div class="bar"><button class="back" data-go="moment">← Retour</button>
        <span class="count" aria-label="${n} choix sur ${MAXCHOIX}">${n} / ${MAXCHOIX}</span>
        <button class="go" data-go="humeur" ${n?"":"disabled"}>J'ai fini ! ✓</button></div></div>`;
  }
  if(s.view==="choix"&&$("#autreTxt")) $("#autreTxt").addEventListener("input",e=>s.autre=e.target.value);
  if(s.view==="emo"){
    app.innerHTML=`<div class="wrap kid">${nav()}${q("Comment tu te sens ?","Touche l'émotion qui te ressemble.")}
      <div class="grid emos">${EMOS.map(([id,e,l,c,d,ring])=>`<button class="big emocard" data-emo="${id}" aria-pressed="${s.emo===id}" style="--emo:${c};--ring:${ring}"><span class="badge" aria-hidden="true">✓</span><span class="kidpic">${emoImg(id,"")}</span><span class="name">${l}</span><span class="sub">${d}</span></button>`).join("")}</div>
      ${s.emo?`<div class="idea"><span class="lab">Un peu ou beaucoup ?</span><div class="grid inten">
        <button class="big tag" data-int="1" aria-pressed="${s.intensite===1}"><span class="badge" aria-hidden="true">✓</span><span class="pic">${emoImg(s.emo,"inthead small")}</span><span class="name">Un peu</span></button>
        <button class="big tag" data-int="2" aria-pressed="${s.intensite===2}"><span class="badge" aria-hidden="true">✓</span><span class="pic">${emoImg(s.emo,"inthead")}</span><span class="name">Beaucoup</span></button></div></div>`:""}
      <div class="bar"><button class="back" data-go="hub">← Retour</button><button class="go" data-go="emo2" ${s.emo?"":"disabled"}>Suivant →</button></div></div>`;
    return;
  }
  if(s.view==="emo2"){
    const [,e,l]=emoById(s.emo);
    app.innerHTML=`<div class="wrap kid">${nav()}${q("C'est à cause de quoi ?","Tu peux passer cette question.",emoImg(s.emo,"qhead"))}
      <div class="grid tags">${CAUSES.map(([id,ic,lb])=>`<button class="big tag" data-cause="${id}" aria-pressed="${s.causes.includes(id)}"><span class="badge" aria-hidden="true">✓</span><span class="pic" aria-hidden="true">${ic}</span><span class="name">${lb}</span></button>`).join("")}</div>
      ${s.causes.includes("autre")?`<div class="idea"><label for="causeAutre">➕ C'est quoi ?</label><small>Un grand peut l'écrire pour toi.</small><input id="causeAutre" maxlength="120" value="${esc(s.causeAutre)}" style="font-size:1.2rem"></div>`:""}
      <div class="idea"><span class="lab">🙋 Tu veux en parler à un animateur ?</span>
        <div class="grid inten"><button class="big tag" data-parler="oui" aria-pressed="${s.parler===true}"><span class="badge" aria-hidden="true">✓</span><span class="pic" aria-hidden="true">🙋</span><span class="name">Oui</span></button>
        <button class="big tag" data-parler="non" aria-pressed="${s.parler===false}"><span class="badge" aria-hidden="true">✓</span><span class="pic" aria-hidden="true">👍</span><span class="name">Non, ça va</span></button></div>
        ${s.parler===true?`<label for="prenom" style="margin-top:8px">Ton prénom</label><small>Pour qu'un animateur vienne te voir. Seuls les animateurs le verront.</small><input id="prenom" maxlength="40" autocomplete="off" value="${esc(s.prenom)}" style="font-size:1.2rem">`:""}</div>
      <div class="idea"><label for="emoTexte">✏️ Tu veux dire autre chose ? <span class="muted" style="font-weight:400">(facultatif)</span></label><small>Un grand peut l'écrire pour toi.</small>
        <textarea id="emoTexte" maxlength="300" style="min-height:80px">${esc(s.emoTexte)}</textarea></div>
      <div class="bar"><button class="back" data-go="emo">← Retour</button><button class="go" id="sendEmo">Envoyer 💌</button></div></div>`;
    [["causeAutre","causeAutre"],["prenom","prenom"],["emoTexte","emoTexte"]].forEach(([id,k])=>{const el=$("#"+id); if(el) el.addEventListener("input",ev=>s[k]=ev.target.value);});
    return;
  }
  if(s.view==="humeur"){
    app.innerHTML=`<div class="wrap kid">${nav()}${q("Tu aimes venir au centre ?","Tu peux aussi passer cette question.")}
      <div class="grid moods">${MOODS.map(m=>`<button class="big mood" data-mood="${m.id}" aria-pressed="${s.humeur===m.id}"><span class="pic" aria-hidden="true">${m.pic}</span><span class="name">${m.lbl}</span></button>`).join("")}</div>
      <div class="bar"><button class="back" data-go="choix">← Retour</button><button class="go" id="send">Envoyer 🚀</button></div></div>`;
  }
  else if(PTYPES[s.view]){
    const t=s.view, P=PTYPES[t];
    const tagsHtml=P.tags?`<div class="grid tags">${P.tags.map(([id,e,l])=>`<button class="big tag" data-tag="${id}" aria-pressed="${s.tags.includes(id)}"><span class="badge" aria-hidden="true">✓</span><span class="pic" aria-hidden="true">${e}</span><span class="name">${l}</span></button>`).join("")}</div>`:"";
    const momentHtml=t==="ameliorer"?`<div class="idea"><span class="lab">C'est pendant quel moment ?</span><div class="mini">${[...MOMENTS.map(m=>[m.id,m.pic+" "+m.lbl]),["tous","🏫 Partout"]].map(([id,l])=>`<button class="chip" data-pmoment="${id}" aria-pressed="${s.pmoment===id}">${l}</button>`).join("")}</div></div>`:"";
    const drawHtml=t==="libre"?`<div class="draw"><span class="idea"><span class="lab">🖍️ Avec un dessin</span></span>
      <div class="pens">${PENS.map(c=>`<button class="pen" data-pen="${c}" style="background:${c}" aria-label="Crayon de couleur" aria-pressed="${pen===c}"></button>`).join("")}
        <button class="chip" data-pen="eraser" aria-pressed="${pen==="eraser"}">🧽 Gomme</button><button class="chip" id="clearDraw">🗑️ Tout effacer</button></div>
      <canvas id="cv" width="720" height="480" aria-label="Zone de dessin"></canvas></div>`:"";
    app.innerHTML=`<div class="wrap kid">${nav()}${q(P.q,P.tags?"Touche une ou plusieurs images, puis explique si tu veux.":"Tu peux dessiner, écrire, ou les deux.",P.pic)}
      ${tagsHtml}${momentHtml}${drawHtml}
      <div class="idea"><label for="texte">✏️ ${t==="libre"?"Avec des mots":"Explique ton idée"}</label>
        <small>Un grand peut l'écrire pour toi. Ne mets pas de prénom.</small>
        <textarea id="texte" maxlength="500" placeholder="${esc(P.ph)}">${esc(s.texte)}</textarea></div>
      <div class="bar"><button class="back" data-go="hub">← Retour</button><button class="go" id="sendP">Envoyer 🚀</button></div></div>`;
    $("#texte").addEventListener("input",e=>s.texte=e.target.value);
    if(t==="libre") setupCanvas();
  }
  else if(s.view==="merci"&&s.emo){
    const neg=!EMO_POS.includes(s.emo);
    app.innerHTML=`<div class="wrap kid"><div class="merci">
      <div class="bravo"><h2>Merci !</h2><p>Merci de nous avoir dit<br>comment tu te sens.</p>
        ${neg?`<p class="soft">Ce que tu ressens est important.<br>${s.parler&&s.prenom.trim()?"Un animateur va venir te voir.":"Les animateurs sont là pour toi : va les voir quand tu veux."}</p>`:""}</div>
      ${neg?`${fox("calm","fox calm")}<div class="breathe" id="breatheBox"><div class="bubble"><span id="breatheTxt">Prêt ?</span></div>
        <button class="home-btn" id="breathe">🌬️ Respire avec moi</button></div>`:fox("cheer")}
      <button class="home-btn" data-go="accueil">🏠 Retour à l'accueil</button>
      <button class="later" data-go="hub">Encore une idée ? Continuer en ${esc(s.classe||"")} →</button></div></div>`;
  }
  else if(s.view==="merci"){
    const flags=["#FF5C8A","#FFC93C","#4FD18B","#5AA8FF","#B58CFF"];
    const bunting=`<svg class="bunting" viewBox="0 0 400 56" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q200 30 400 6" stroke="#fff" stroke-width="3" fill="none"/>${Array.from({length:12},(_,i)=>{const x=i*34+4,y=6+Math.sin((x/400)*Math.PI)*18;return `<path d="M${x} ${y} L${x+28} ${y+1} L${x+14} ${y+30}Z" fill="${flags[i%5]}"/>`}).join("")}</svg>`;
    const stars=[[6,14],[90,10],[12,52],[88,46],[20,80],[82,74]].map(([x,y])=>`<span style="left:${x}%;top:${y}%">★</span>`).join("");
    app.innerHTML=`<div class="wrap kid">${bunting}<div class="merci"><div class="stars-deco" aria-hidden="true">${stars}</div>
      <div class="bravo"><h2>Bravo !</h2><p>C'est bien arrivé<br>chez les animateurs !</p></div>
      ${fox("cheer")}
      <button class="home-btn" data-go="accueil">🏠 Retour à l'accueil</button>
      <button class="later" data-go="hub">Encore une idée ? Continuer en ${esc(s.classe||"")} →</button>
      <p class="note">On revient tout seul au choix dans quelques secondes.</p></div></div>`;
  }
}
function q(t,sub,ico,withFox){return `<div class="q${withFox?" withfox":""}">${ico?`<span class="qico" aria-hidden="true">${ico}</span>`:""}<div style="flex:1;min-width:0"><h2>${esc(t)}</h2>${sub?`<div class="qsub">${esc(sub)}</div>`:""}</div><button class="speak" data-say="${esc(t+(sub?" "+sub:""))}" aria-label="Écouter la question">🔊</button>${withFox?fox("peek","foxpeek"):""}</div>`;}

function setupCanvas(){
  const cv=$("#cv"), ctx=cv.getContext("2d");
  ctx.fillStyle="#fff"; ctx.fillRect(0,0,cv.width,cv.height);
  if(s.dessin){const im=new Image(); im.onload=()=>ctx.drawImage(im,0,0,cv.width,cv.height); im.src=s.dessin;}
  let drawing=false,last=null;
  const pos=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height];};
  const style=()=>{ctx.strokeStyle=ctx.fillStyle=pen==="eraser"?"#fff":pen; ctx.lineWidth=pen==="eraser"?30:9; ctx.lineCap=ctx.lineJoin="round";};
  const dot=p=>{style();ctx.beginPath();ctx.arc(p[0],p[1],ctx.lineWidth/2,0,Math.PI*2);ctx.fill();};
  const line=(a,b)=>{style();ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  cv.addEventListener("pointerdown",e=>{e.preventDefault();drawing=true;last=pos(e);try{cv.setPointerCapture(e.pointerId)}catch(_){ }dot(last);});
  cv.addEventListener("pointermove",e=>{if(!drawing)return;const p=pos(e);line(last,p);last=p;});
  const end=()=>{if(!drawing)return;drawing=false;s.dessin=cv.toDataURL("image/jpeg",.72);};
  cv.addEventListener("pointerup",end); cv.addEventListener("pointercancel",end); cv.addEventListener("pointerleave",end);
}

const SPEAK={emo:"Comment tu te sens ? Touche l'émotion qui te ressemble.",emo2:"C'est à cause de quoi ? Et tu veux en parler à un animateur ?",accueil:"Bonjour ! Qui es-tu ? Enfants, ou familles ?",classe:"Tu es dans quelle classe ?",hub:"Qu'est-ce que tu veux faire ? Mes envies d'activités, mes émotions, j'améliore le centre, j'aimerais découvrir, ou je m'exprime.",
  moment:"C'est pour quel moment ?",choix:"Qu'est-ce que tu as envie de faire ? Choisis jusqu'à trois activités.",humeur:"Tu aimes venir au centre ?",
  ameliorer:"Qu'est-ce que tu changerais au centre ?",explorer:"Qu'est-ce que tu aimerais découvrir ?",libre:"Dis ou dessine ce que tu veux !",merci:"Bravo ! C'est bien arrivé chez les animateurs !"};
function go(view){
  clearTimeout(timer); clearInterval(breathTimer); breathTimer=null;
  if(view==="classe"&&s.view==="accueil") mixFlip=!mixFlip;   // nouvel enfant : on inverse fille/garçon
  if(view==="classe"||view==="accueil") s={view,classe:null,...fresh()};
  if(view==="hub") Object.assign(s,fresh());
  if(PTYPES[view]&&s.view==="hub") Object.assign(s,fresh());
  s.view=view; render(); window.scrollTo({top:0});
  const t=view==="merci"&&s.emo?(EMO_POS.includes(s.emo)?"Merci de nous avoir dit comment tu te sens !":"Merci de nous avoir dit comment tu te sens. Ce que tu ressens est important. Les animateurs sont là pour toi."):SPEAK[view];
  if(t) say(t);
}

async function save(table,row,btn){
  const label=btn.textContent; btn.disabled=true; btn.textContent="Envoi…";
  let queued=false;
  if(!sb){ queued=true; }
  else{
    const {error}=await sb.from(table).insert(row);
    if(error){
      if(isNetworkError(error)||tableMissing(error)) queued=true;
      else{ btn.disabled=false; btn.textContent=label; console.error(error); toast("L'envoi a été refusé. Préviens un animateur."); return; }
    }
  }
  if(queued){
    const qq=readQueue(); qq.push({table,row});
    if(!writeQueue(qq)){ btn.disabled=false; btn.textContent=label; toast("Pas de connexion et pas de place pour garder la réponse. Réessaie plus tard."); return; }
    showQueue();
  }
  go("merci");
  if(!(s.emo&&!EMO_POS.includes(s.emo))) timer=setTimeout(()=>{ if(s.view==="merci") go("hub"); },s.emo?10000:7000);
}
function sendEnvies(){
  save("envies",{classe:s.classe,cycle:cycleOf(s.classe),moment:s.moment,activites:s.choix.slice(),humeur:s.humeur||null,autre:s.choix.some(id=>id.endsWith(":autre"))?(s.autre||"").trim().slice(0,200):""},$("#send"));
}
function sendEmotion(){
  const parler=s.parler===true;
  save("emotions",{classe:s.classe,cycle:cycleOf(s.classe),emotion:s.emo,intensite:s.intensite,causes:s.causes.slice(),
    cause_autre:s.causes.includes("autre")?(s.causeAutre||"").trim().slice(0,120):"",parler,prenom:parler?(s.prenom||"").trim().slice(0,40):"",
    texte:(s.emoTexte||"").trim().slice(0,300)},$("#sendEmo"));
}
function startBreathing(){
  const box=$("#breatheBox"),txt=$("#breatheTxt"); if(!box) return;
  clearInterval(breathTimer); let n=0;
  const step=()=>{ if(!$("#breatheBox")){clearInterval(breathTimer);return;}
    const inhale=n%2===0; box.classList.toggle("in",inhale); box.classList.toggle("out",!inhale);
    txt.textContent=n>=10?"Bravo !":inhale?"Inspire…":"Souffle…"; say(n>=10?"Bravo, tu as bien respiré.":inhale?"Inspire":"Souffle");
    if(n>=10){clearInterval(breathTimer);box.classList.remove("in","out");} n++; };
  step(); breathTimer=setInterval(step,4000);
}
function sendParole(){
  const t=s.view, txt=(s.texte||"").trim();
  if(!txt&&!s.tags.length&&!s.dessin){
    const m=t==="libre"?"Dessine ou écris quelque chose avant d'envoyer.":"Touche une image ou écris quelque chose avant d'envoyer.";
    toast(m); say(m); return;
  }
  save("paroles",{type:t,classe:s.classe,cycle:cycleOf(s.classe),tags:s.tags.slice(),texte:txt.slice(0,500),
    moment:t==="ameliorer"?(s.pmoment||null):null,dessin:t==="libre"?(s.dessin||null):null},$("#sendP"));
}

/* ---------------- Connexion animateur ---------------- */
function renderLogin(app){
  if(!sb){ app.innerHTML=`<div class="panel"><h2>Espace animateur</h2><div class="empty">L'appli n'est pas encore reliée à Supabase : remplis le fichier <b>config.js</b> (voir le mode d'emploi README).</div></div>`; return; }
  const signup=acc.mode==="signup";
  app.innerHTML=`<div class="panel"><form class="login" id="loginForm">
    <h2>${signup?"Créer mon compte animateur":"Espace animateur"}</h2>
    <p class="muted" style="margin:0">${signup?"Après la création, un animateur déjà inscrit devra valider ton compte (onglet Aide).":"Connecte-toi avec ton compte animateur."}</p>
    <label for="lemail">Adresse e-mail<input id="lemail" name="lemail" type="email" autocomplete="username" required></label>
    <label for="lpass">Mot de passe${signup?" (8 caractères minimum)":""}<input id="lpass" name="lpass" type="password" minlength="${signup?8:1}" autocomplete="${signup?"new-password":"current-password"}" required></label>
    ${signup?"":`<label class="remember" for="lremember"><input type="checkbox" id="lremember" name="lremember" ${remember?"checked":""}> <span>Rester connecté sur cet appareil<br><small class="muted">Sur votre téléphone perso. Pas sur la tablette des enfants.</small></span></label>`}
    <div class="err" role="alert">${esc(adm.err)}</div>
    ${acc.msg?`<div class="banner">${esc(acc.msg)}</div>`:""}
    <button class="btn primary" type="submit" ${adm.busy?"disabled":""}>${adm.busy?"Patiente…":signup?"Créer mon compte":"Se connecter"}</button>
    <button class="btn" type="button" id="switchMode">${signup?"J'ai déjà un compte : me connecter":"Pas encore de compte ? Créer mon compte"}</button></form></div>`;
  $("#loginForm").addEventListener("submit",async e=>{
    e.preventDefault(); unlockAlerts(); const email=e.target.lemail.value.trim(), password=e.target.lpass.value;
    adm.busy=true; adm.err=""; acc.msg=""; render();
    if(signup){
      const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.href.split("#")[0]}});
      adm.busy=false;
      if(error){ adm.err=/registered|exists/i.test(error.message)?"Ce compte existe déjà : connecte-toi.":/password/i.test(error.message)?"Mot de passe trop faible : 8 caractères minimum.":"Création impossible : "+error.message; render(); return; }
      if(data.session) await sb.auth.signOut();
      acc.mode="login"; acc.msg="Compte créé. Si tu reçois un e-mail de confirmation, clique sur le lien. Demande ensuite à un animateur de valider ton compte dans l'onglet Aide.";
      render(); return;
    }
    setRemember(!!e.target.lremember?.checked);
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){ adm.busy=false; adm.err=/confirm/i.test(error.message)?"Confirme d'abord ton adresse avec le lien reçu par e-mail.":/invalid/i.test(error.message)?"E-mail ou mot de passe incorrect.":"Connexion impossible : "+error.message; render(); return; }
    const {data:ok}=await sb.rpc("is_animateur");
    adm.busy=false;
    if(ok!==true){ await sb.auth.signOut(); adm.err="Ton compte n'est pas encore validé. Demande à un animateur de le valider dans l'onglet Aide."; render(); return; }
    session=data.session; s.view="adm"; nettoyer().then(loadAll); loadTeam(); startRefresh(); render();
  });
}
async function loadTeam(){
  if(!sb||!session) return;
  const [p,t,n]=await Promise.all([sb.rpc("comptes_en_attente"),sb.from("animateurs").select("user_id,email,created_at").order("created_at"),
    sb.from("alertes_config").select("ntfy_topic,actif").eq("id",1).maybeSingle()]);
  acc.pending=p.data||[]; acc.team=t.data||[]; acc.ntfy=n.error?null:(n.data||null);
  if(s.view==="adm"&&adm.tab==="set") render();
}
async function logout(){ try{await sb?.auth.signOut();}catch(e){} setRemember(false); session=null; votes=[]; paroles=[]; familles=[]; emotions=[]; acc.pending=[]; acc.team=[]; loadState="idle"; stopRefresh(); }

/* ---------------- Lecture des réponses ---------------- */
async function fetchAll(table){
  const out=[]; const page=1000;
  for(let from=0;from<20000;from+=page){
    const {data,error}=await sb.from(table).select("*").order("created_at",{ascending:false}).range(from,from+page-1);
    if(error) throw error;
    out.push(...data); if(data.length<page) break;
  }
  return out.map(r=>({...r,at:Date.parse(r.created_at)}));
}
async function loadAll(){
  if(!sb||!session) return;
  if(loadState!=="ok") loadState="loading";
  if(s.view==="adm") render();
  try{
    [votes,paroles,familles,emotions]=await Promise.all([fetchAll("envies"),fetchAll("paroles"),fetchAll("familles"),
      fetchAll("emotions").then(r=>{emoReady=true;return r;},e=>{console.warn(e);emoReady=false;return [];})]);
    loadState="ok"; lastLoad=Date.now();
  }catch(e){ console.error(e); loadState="err"; }
  if(s.view==="adm") render();
}
let todoKnown=null, todoTimer=null, audioCtx=null, baseTitle=document.title;
function startRefresh(){ stopRefresh(); baseTitle=document.title.replace(/^🔴 \(\d+\) Un enfant veut parler · /,""); refreshTimer=setInterval(()=>{ if(s.view==="adm"&&!adm.confirm&&!adm.delp) loadAll(); },60000);
  todoTimer=setInterval(pollTodo,15000); pollTodo(); }
function stopRefresh(){ clearInterval(refreshTimer); refreshTimer=null; clearInterval(todoTimer); todoTimer=null; todoKnown=null; document.title=baseTitle; }
function unlockAlerts(){ /* appelé pendant un clic : autorise le son et demande la permission des notifications */
  try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); audioCtx.resume?.(); }catch(e){}
  try{ if("Notification" in window&&Notification.permission==="default") Notification.requestPermission(); }catch(e){}
}
function chime(){
  try{ const c=audioCtx; if(!c) return; const t=c.currentTime;
    [[880,0],[1175,.18],[1568,.36]].forEach(([f,d])=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;
      g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.35,t+d+.02);g.gain.exponentialRampToValueAtTime(.001,t+d+.5);o.connect(g).connect(c.destination);o.start(t+d);o.stop(t+d+.55);}); }catch(e){}
}
function alertAnim(rows){
  chime(); try{navigator.vibrate?.([300,150,300,150,300]);}catch(e){}
  const r=rows[0], [,ic,lb]=emoById(r.emotion);
  const body=rows.length>1?`${rows.length} enfants veulent parler à un animateur.`:`${r.prenom?r.prenom+" ":"Un enfant "}(${r.classe}) · ${ic} ${lb}`;
  try{ if("Notification" in window&&Notification.permission==="granted"){ const n=new Notification("🙋 Un enfant veut parler à un animateur",{body,tag:"emotions-"+r.id,requireInteraction:true,icon:"icon.svg"}); n.onclick=()=>{window.focus();adm.tab="emo";s.view="adm";render();n.close();}; } }catch(e){}
  toast("🙋 "+body);
}
async function pollTodo(){
  if(!sb||!session) return;
  const {data,error}=await sb.from("emotions").select("id,classe,emotion,prenom,created_at").eq("parler",true).eq("traite",false).order("created_at",{ascending:false}).limit(50);
  if(error) return;
  const ids=new Set(data.map(r=>r.id));
  document.title=data.length?`🔴 (${data.length}) Un enfant veut parler · ${baseTitle}`:baseTitle;
  if(todoKnown){ const fresh=data.filter(r=>!todoKnown.has(r.id)); if(fresh.length){ alertAnim(fresh); loadAll(); } }
  else if(data.length){ alertAnim(data); }
  todoKnown=ids; todoCount=data.length;
  if(s.view==="adm") { const b=$("#todoBanner"); if(b){ b.hidden=!data.length; b.querySelector("b").textContent=data.length; } }
}
let todoCount=0;

/* ---------------- Espace animateur ---------------- */
function periodStart(){
  const now=Date.now(), day=864e5;
  if(adm.fp==="week"){const d=new Date();d.setHours(0,0,0,0);return d.getTime()-((d.getDay()+6)%7)*day;}
  if(adm.fp==="month"){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1).getTime();}
  if(adm.fp==="30") return now-30*day;
  return 0;
}
const byClasse=v=>adm.fc==="all"||v.classe===adm.fc||v.cycle===adm.fc;
function filteredVotes(useMoment=true,useClasse=true){const st=periodStart();return votes.filter(v=>(!useMoment||adm.fm==="all"||v.moment===adm.fm)&&(!useClasse||byClasse(v))&&(v.at||0)>=st);}
function filteredParoles(useType=true){const st=periodStart();return paroles.filter(p=>(!useType||adm.pt==="all"||p.type===adm.pt)&&byClasse(p)&&(p.at||0)>=st);}
const sel=(id,val,opts)=>`<select id="${id}">${opts.map(([v,l])=>`<option value="${v}" ${v===val?"selected":""}>${l}</option>`).join("")}</select>`;
const fClasse=()=>`<label>Classe ${sel("fc",adm.fc,[["all","Toutes"],["mat","Maternelle (PS-GS)"],["elem","Élémentaire (CP-CM2)"],...CLASSES.map(c=>[c.id,c.id])])}</label>`;
const fPeriode=()=>`<label>Période ${sel("fp",adm.fp,[["all","Depuis le début"],["week","Cette semaine"],["month","Ce mois-ci"],["30","30 derniers jours"]])}</label>`;
function rankHtml(entries,total,labelOf,color){
  if(!entries.length) return "";
  const max=entries[0][1]||1;
  return `<div class="rank">${entries.map(([id,c])=>{const a=labelOf(id);return `<div class="rk"><span class="e" aria-hidden="true">${esc(a.e)}</span><span class="n">${esc(a.l)}${a.x?` <small class="muted">· ${esc(a.x)}</small>`:""}</span><span class="track"><span class="fill" style="width:${c/max*100}%;background:${color}"></span></span><span class="v">${c}<small>${Math.round(c/total*100)} %</small></span></div>`}).join("")}</div>`;
}
function stateMsg(){return loadState==="err"?"Impossible de lire les réponses. Vérifie la connexion puis touche « Actualiser ».":"Chargement des réponses…";}

function renderAdmin(app){
  const upd=lastLoad?new Date(lastLoad).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):"–";
  const nTodo=Math.max(todoCount,emotions.filter(e=>e.parler&&!e.traite).length);
  const nEmo=emotions.filter(e=>e.parler&&!e.traite).length;
  const T=[["res","📊","Envies"],["emo","😊","Émotions"],["par","💬","Paroles"],["fam","👨‍👩‍👧","Familles"],["cal","📅","Calendrier"],["acts","🧩","Activités"],["set","⚙️","Aide"]];
  const tabs=`<button class="todo-banner" id="todoBanner" data-tab="emo" ${nTodo?"":"hidden"}>🙋 <b>${nTodo}</b> enfant(s) veulent parler à un animateur · Voir →</button>
    <div class="admbar"><nav class="admtabs" aria-label="Onglets de l'espace animateur">${T.map(([id,ic,lb])=>`<button class="admtab" data-tab="${id}" aria-pressed="${adm.tab===id}"><span aria-hidden="true">${ic}</span>${lb}${id==="emo"&&nEmo?`<b class="badge-n">${nEmo}</b>`:""}</button>`).join("")}</nav>
    <div class="admtools"><span class="upd" title="Dernière mise à jour">${upd}</span><button class="iconbtn" id="refresh" title="Actualiser" aria-label="Actualiser">↻</button><button class="iconbtn" id="logout" title="Se déconnecter" aria-label="Se déconnecter">⏻</button></div></div>`;
  if(adm.tab==="acts") return app.innerHTML=`<div class="wrap">${tabs}${renderActsAdmin()}</div>`;
  if(adm.tab==="cal") return app.innerHTML=`<div class="wrap">${tabs}${renderCalendrier()}</div>`;
  if(adm.tab==="set") return app.innerHTML=`<div class="wrap">${tabs}${renderSettings()}</div>`;
  if(adm.tab==="par") return app.innerHTML=`<div class="wrap">${tabs}${renderParoles()}</div>`;
  if(adm.tab==="fam") return app.innerHTML=`<div class="wrap">${tabs}${renderFamilles()}</div>`;
  if(adm.tab==="emo") return app.innerHTML=`<div class="wrap">${tabs}${renderEmotions()}</div>`;

  const filters=`<div class="filters"><label>Moment ${sel("fm",adm.fm,[["all","Tous les moments"],...MOMENTS.map(m=>[m.id,m.lbl])])}</label>${fClasse()}${fPeriode()}<button class="btn" id="exportCsv">⬇️ Exporter (Excel)</button></div>`;
  if(loadState!=="ok") return app.innerHTML=`<div class="wrap">${tabs}<div class="panel">${filters}<div class="empty">${stateMsg()}</div></div></div>`;

  const list=filteredVotes(), n=list.length;
  const counts={}; list.forEach(v=>(v.activites||[]).forEach(a=>counts[a]=(counts[a]||0)+1));
  const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,15);
  const rank=rankHtml(ranked,n,id=>{const a=actById(id);return {...a,x:adm.fm==="all"?momentLbl(id.split(":")[0]):""};},"var(--elem)")
    ||`<div class="empty">Aucune réponse pour ces filtres. Les envies apparaîtront ici dès que les enfants auront répondu.</div>`;
  const moodN=MOODS.map(m=>({...m,c:list.filter(v=>v.humeur===m.id).length})); const mt=moodN.reduce((a,b)=>a+b.c,0);
  const moodbar=mt?`<div class="moodbar">${moodN.filter(m=>m.c).map(m=>`<div style="width:${m.c/mt*100}%;background:${m.col}" title="${m.lbl} : ${m.c}">${m.pic} ${Math.round(m.c/mt*100)}%</div>`).join("")}</div><div class="muted" style="font-size:.9rem">${moodN.map(m=>`${m.pic} ${m.lbl} : ${m.c}`).join(" · ")}</div>`:`<div class="empty">Pas encore de réponse à « Tu aimes venir au centre ? ».</div>`;
  const per=filteredVotes(false,false);
  const table=`<div class="tbl"><table><thead><tr><th>Classe</th>${MOMENTS.map(m=>`<th>${m.pic} ${m.lbl}</th>`).join("")}<th>Total</th></tr></thead><tbody>${CLASSES.map(c=>{const r=MOMENTS.map(m=>per.filter(v=>v.classe===c.id&&v.moment===m.id).length);return `<tr><td><b>${c.id}</b></td>${r.map(x=>`<td>${x||"–"}</td>`).join("")}<td><b>${r.reduce((a,b)=>a+b,0)}</b></td></tr>`}).join("")}</tbody></table></div>`;
  const last=list[0]?new Date(list[0].at).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"}):"–";
  const confirm=adm.confirm?`<div class="confirm"><span>Effacer définitivement les <b>${n}</b> réponses affichées ?</span><button class="btn danger" id="doDel">Oui, effacer</button><button class="btn" id="noDel">Annuler</button></div>`
    :`<div><button class="btn danger" id="askDel" ${n?"":"disabled"}>Effacer ces ${n} réponses…</button></div>`;

  app.innerHTML=`<div class="wrap">${tabs}
    <div class="panel">${filters}
      <div class="kpis"><div class="kpi"><b>${n}</b><span>enfants ont donné leurs envies</span></div>
        <div class="kpi"><b>${ranked[0]?esc(actById(ranked[0][0]).e):"–"}</b><span>${ranked[0]?"N° 1 : "+esc(actById(ranked[0][0]).l):"pas encore de n° 1"}</span></div>
        <div class="kpi"><b>${filteredParoles(false).length}</b><span>paroles d'enfants (onglet 💬)</span></div>
        <div class="kpi"><b style="font-size:1.3rem;padding-block:.35rem">${last}</b><span>dernière réponse</span></div></div></div>
    <div class="cols">
      <div class="panel"><h3>Les activités les plus demandées</h3><p class="muted" style="margin:0;font-size:.9rem">Nombre d'enfants qui ont choisi l'activité (% des enfants qui ont répondu).</p>${rank}</div>
      <div class="panel"><h3>Ils aiment venir ?</h3>${moodbar}</div></div>
    <div class="panel"><h3>➕ Autres activités demandées par les enfants</h3>
      ${(()=>{const L=list.filter(v=>v.autre);return L.length?`<div class="pcards">${L.slice(0,150).map(v=>`<article class="pcard"><div class="meta"><b>${esc(v.classe)}</b> · ${esc(momentLbl(v.moment))} · ${fdate(v.at)}</div><div class="txt">${esc(v.autre)}</div></article>`).join("")}</div>`
        :`<div class="empty">Pas encore d'autre activité proposée pour ces filtres.</div>`;})()}</div>
    <div class="panel"><h3>Réponses par classe et par moment</h3><p class="muted" style="margin:0;font-size:.9rem">Suit uniquement le filtre de période.</p>${table}</div>
    <div class="panel"><h3>Nouvelle période</h3><p class="muted" style="margin:0">Pour repartir de zéro (nouveau trimestre, nouvelles vacances), efface les envies affichées avec les filtres ci-dessus.</p>${confirm}</div></div>`;
}

function renderParoles(){
  const filters=`<div class="filters"><label>Espace ${sel("pt",adm.pt,[["all","Tous"],...Object.entries(PTYPES).map(([k,p])=>[k,p.pic+" "+p.lbl])])}</label>${fClasse()}${fPeriode()}<button class="btn" id="exportCsv">⬇️ Exporter (Excel)</button></div>`;
  if(loadState!=="ok") return `<div class="panel">${filters}<div class="empty">${stateMsg()}</div></div>`;
  const all=filteredParoles(false), list=filteredParoles();
  const cnt=k=>all.filter(p=>p.type===k).length;
  const tagRank=type=>{const L=all.filter(p=>p.type===type),c={};L.forEach(p=>(p.tags||[]).forEach(t=>c[t]=(c[t]||0)+1));
    return rankHtml(Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10),L.length||1,id=>tagById(type,id),PTYPES[type].col)||`<div class="empty">Pas encore de réponse.</div>`;};
  const card=p=>{const P=PTYPES[p.type]||PTYPES.libre;
    return `<article class="pcard">
      <div class="meta"><span class="pill" style="background:${P.col}">${P.pic} ${esc(P.lbl)}</span><b>${esc(p.classe)}</b> · ${fdate(p.at)}${p.moment?` · ${esc(momentLbl(p.moment))}`:""}</div>
      ${(p.tags||[]).length?`<div class="tg">${p.tags.map(t=>{const x=tagById(p.type,t);return `<span>${esc(x.e)} ${esc(x.l)}</span>`}).join("")}</div>`:""}
      ${typeof p.dessin==="string"&&p.dessin.startsWith("data:image/jpeg;base64,")?`<img src="${esc(p.dessin)}" alt="Dessin d'un enfant de ${esc(p.classe)}" loading="lazy">`:""}
      ${p.texte?`<div class="txt">${esc(p.texte)}</div>`:""}
      <div class="foot">${adm.delp===p.id?`<span class="muted" style="font-size:.85rem;align-self:center">Effacer ?</span><button class="btn small danger" data-delok="${esc(p.id)}">Oui</button><button class="btn small" data-delno="1">Non</button>`:`<button class="btn small" data-delp="${esc(p.id)}">Effacer</button>`}</div></article>`;};
  const confirm=adm.confirm?`<div class="confirm"><span>Effacer définitivement les <b>${list.length}</b> paroles affichées ?</span><button class="btn danger" id="doDel">Oui, effacer</button><button class="btn" id="noDel">Annuler</button></div>`
    :`<div><button class="btn danger" id="askDel" ${list.length?"":"disabled"}>Effacer ces ${list.length} paroles…</button></div>`;
  return `<div class="panel">${filters}
      <div class="kpis">${Object.entries(PTYPES).map(([k,p])=>`<div class="kpi"><b>${cnt(k)}</b><span>${p.pic} ${p.lbl}</span></div>`).join("")}</div></div>
    <div class="cols even">
      <div class="panel"><h3>🔧 Ce qu'ils changeraient</h3>${tagRank("ameliorer")}</div>
      <div class="panel"><h3>🧭 Ce qu'ils aimeraient découvrir</h3>${tagRank("explorer")}</div></div>
    <div class="panel"><h3>Ce qu'ils ont dit et dessiné</h3><p class="muted" style="margin:0;font-size:.9rem">Les plus récents d'abord.</p>
      ${list.length?`<div class="pcards">${list.slice(0,150).map(card).join("")}</div>`:`<div class="empty">Rien pour ces filtres. Les idées, textes et dessins des enfants apparaîtront ici.</div>`}</div>
    <div class="panel"><h3>Nouvelle période</h3><p class="muted" style="margin:0">Efface les paroles affichées avec les filtres ci-dessus.</p>${confirm}</div>`;
}
function filteredFamilles(useType=true){const st=periodStart();return familles.filter(r=>(!useType||adm.ft==="all"||r.type===adm.ft)&&(r.at||0)>=st);}
function renderFamilles(){
  const {TEMPS,ITEMS,NOTES,NOTE_COL,RECO,TAGS,TYPES}=window.FAM;
  const filters=`<div class="filters"><label>Partie ${sel("ft",adm.ft,[["all","Toutes"],...Object.entries(TYPES).map(([k,t])=>[k,t.pic+" "+t.lbl])])}</label>${fPeriode()}<button class="btn" id="exportCsv">⬇️ Exporter (Excel)</button></div>`;
  if(loadState!=="ok") return `<div class="panel">${filters}<div class="empty">${stateMsg()}</div></div>`;
  const all=filteredFamilles(false), list=filteredFamilles();
  const sat=all.filter(r=>r.type==="satisfaction");
  const pctSat=arr=>{const v=arr.filter(x=>x>0);return v.length?Math.round(v.filter(x=>x>=3).length/v.length*100):null;};
  const glob=pctSat(sat.map(r=>r.global||0));
  const reco=RECO.map(([id,e,l])=>({id,e,l,c:sat.filter(r=>r.recommande===id).length})); const rt=reco.reduce((a,b)=>a+b.c,0);
  const stack=vals=>{const v=vals.filter(x=>x>0),n=v.length; if(!n) return `<div class="stack"></div>`;
    return `<div class="stack">${[4,3,2,1].map(k=>{const c=v.filter(x=>x===k).length;return c?`<div style="width:${c/n*100}%;background:${NOTE_COL[k]}" title="${NOTES.find(x=>x[0]===k)[2]} : ${c}"></div>`:""}).join("")}</div>`;};
  const rows=[["global","Satisfaction générale",sat.map(r=>r.global||0)],...ITEMS.map(([id,l])=>[id,l,sat.map(r=>(r.notes||{})[id]||0)])];
  if(sat.some(r=>(r.precisions||{}).critere)) rows.push(["autre","➕ Autres points (voir commentaires)",sat.map(r=>(r.notes||{}).autre||0)]);
  const satHtml=sat.length?`<div class="fam-legend">${NOTES.map(([v,e,l])=>`<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${NOTE_COL[v]};vertical-align:-1px"></span> ${l}</span>`).join("")}<span>% = part de satisfaits (sans compter « sans avis »)</span></div>
    <div class="rank">${rows.map(([id,l,v])=>{const p=pctSat(v);return `<div class="srow"><span style="${id==="global"?"font-weight:700":""}">${esc(l)}</span>${stack(v)}<span class="v">${p===null?"–":p+" %"}</span></div>`}).join("")}</div>`
    :`<div class="empty">Pas encore de questionnaire de satisfaction.</div>`;
  const tc={}; all.filter(r=>r.type==="amelioration").forEach(r=>(r.tags||[]).forEach(t=>tc[t]=(tc[t]||0)+1));
  const nAm=all.filter(r=>r.type==="amelioration").length;
  const tagHtml=rankHtml(Object.entries(tc).sort((a,b)=>b[1]-a[1]),nAm||1,id=>{const t=TAGS.find(x=>x[0]===id)||["","•",id];return {e:t[1],l:t[2]};},"var(--peri)")||`<div class="empty">Pas encore de proposition d'amélioration.</div>`;
  const tps={}; sat.concat(all.filter(r=>r.type==="amelioration")).forEach(r=>(r.temps||[]).forEach(t=>tps[t]=(tps[t]||0)+1));
  const withText=list.filter(r=>r.texte||r.idees||r.savoir||r.contact||Object.keys(r.precisions||{}).length);
  const card=r=>{const T=TYPES[r.type]||TYPES.libre;
    const P=r.precisions||{};
    const tl=(r.temps||[]).map(t=>t==="autre"&&P.temps?"Autre : "+P.temps:(TEMPS.find(x=>x[0]===t)||[0,"",t])[2]).join(", ");
    return `<article class="pcard">
      <div class="meta"><span class="pill" style="background:${T.col}">${T.pic} ${esc(T.lbl)}</span>${fdate(r.at)}${r.global?` · ${NOTES.find(x=>x[0]===r.global)[1]}`:""}</div>
      ${tl||(r.niveaux||[]).length?`<div class="meta">${esc(tl)}${(r.niveaux||[]).length?` · ${esc(r.niveaux.join(", "))}`:""}</div>`:""}
      ${(r.tags||[]).length?`<div class="tg">${r.tags.map(t=>{const x=TAGS.find(y=>y[0]===t)||["","•",t];return `<span>${x[1]} ${esc(x[2])}</span>`}).join("")}</div>`:""}
      ${P.critere?`<div class="txt"><b>➕ Autre point noté :</b> ${esc(P.critere)} ${(r.notes||{}).autre?(NOTES.find(x=>x[0]===r.notes.autre)||[])[1]||"":""}</div>`:""}
      ${P.theme?`<div class="txt"><b>➕ Autre thème :</b> ${esc(P.theme)}</div>`:""}
      ${r.texte?`<div class="txt">${esc(r.texte)}</div>`:""}
      ${r.idees?`<div class="txt"><b>💡 Idées :</b> ${esc(r.idees)}</div>`:""}
      ${r.savoir?`<div class="txt"><b>🎁 Savoir-faire à partager :</b> ${esc(r.savoir)}</div>`:""}
      ${r.contact?`<div class="txt" style="background:var(--surface);border-radius:10px;padding:6px 10px"><b>📞 Souhaite une réponse :</b> ${esc(r.contact)}</div>`:""}
      <div class="foot">${adm.delp===r.id?`<span class="muted" style="font-size:.85rem;align-self:center">Effacer ?</span><button class="btn small danger" data-delok="${esc(r.id)}">Oui</button><button class="btn small" data-delno="1">Non</button>`:`<button class="btn small" data-delp="${esc(r.id)}">Effacer</button>`}</div></article>`;};
  const confirm=adm.confirm?`<div class="confirm"><span>Effacer définitivement les <b>${list.length}</b> réponses de familles affichées ?</span><button class="btn danger" id="doDel">Oui, effacer</button><button class="btn" id="noDel">Annuler</button></div>`
    :`<div><button class="btn danger" id="askDel" ${list.length?"":"disabled"}>Effacer ces ${list.length} réponses…</button></div>`;
  return `<div class="panel">${filters}
      <div class="kpis">${Object.entries(TYPES).map(([k,t])=>`<div class="kpi"><b>${all.filter(r=>r.type===k).length}</b><span>${t.pic} ${t.lbl}</span></div>`).join("")}
        <div class="kpi"><b>${glob===null?"–":glob+" %"}</b><span>de familles satisfaites</span></div>
        <div class="kpi"><b>${rt?Math.round(reco[0].c/rt*100)+" %":"–"}</b><span>recommanderaient le centre</span></div>
        <div class="kpi"><b>${all.filter(r=>r.contact).length}</b><span>attendent une réponse</span></div></div></div>
    <div class="panel"><h3>⭐ Satisfaction des familles</h3>${satHtml}
      ${rt?`<div class="muted" style="font-size:.9rem">Recommanderaient le centre : ${reco.map(r=>`${r.e} ${r.l} ${r.c}`).join(" · ")}</div>`:""}
      ${Object.keys(tps).length?`<div class="muted" style="font-size:.9rem">Temps fréquentés : ${TEMPS.map(([id,e,l])=>tps[id]?`${e} ${l} ${tps[id]}`:"").filter(Boolean).join(" · ")}</div>`:""}</div>
    <div class="panel"><h3>🔧 Ce que les familles veulent améliorer</h3>${tagHtml}</div>
    <div class="panel"><h3>Commentaires, idées et messages</h3><p class="muted" style="margin:0;font-size:.9rem">Les plus récents d'abord. Les coordonnées laissées servent uniquement à répondre.</p>
      ${withText.length?`<div class="pcards">${withText.slice(0,150).map(card).join("")}</div>`:`<div class="empty">Pas encore de commentaire pour ces filtres.</div>`}</div>
    <div class="panel"><h3>Nouvelle période</h3><p class="muted" style="margin:0">Efface les réponses de familles affichées avec les filtres ci-dessus.</p>${confirm}</div>`;
}
function filteredEmotions(){const st=periodStart();return emotions.filter(e=>byClasse(e)&&(e.at||0)>=st);}
function renderEmotions(){
  const filters=`<div class="filters">${fClasse()}${fPeriode()}<button class="btn" id="exportCsv">⬇️ Exporter (Excel)</button></div>`;
  if(loadState!=="ok") return `<div class="panel">${filters}<div class="empty">${stateMsg()}</div></div>`;
  if(!emoReady) return `<div class="panel">${filters}<div class="empty">L'espace émotions n'est pas encore activé dans la base de données (table « emotions » à créer, voir le README).</div></div>`;
  const list=filteredEmotions(), n=list.length;
  const todo=emotions.filter(e=>e.parler&&!e.traite);
  const when=t=>new Date(t).toLocaleString("fr-FR",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
  const causesTxt=e=>(e.causes||[]).map(c=>c==="autre"&&e.cause_autre?"Autre : "+e.cause_autre:(CAUSES.find(x=>x[0]===c)||[0,"",c])[2]).join(", ");
  const todoHtml=todo.length?`<div class="pcards">${todo.map(e=>{const [,ic,lb]=emoById(e.emotion);return `<article class="pcard" style="border:3px solid #FF5C5C">
      <div class="meta"><b style="font-size:1.1rem;color:var(--ink)">${e.prenom?esc(e.prenom):"Prénom non donné"}</b> · ${esc(e.classe)} · ${when(e.at)}</div>
      <div class="txt" style="font-size:1.2rem">${ic} ${esc(lb)}${e.intensite===2?" (beaucoup)":e.intensite===1?" (un peu)":""}</div>
      ${causesTxt(e)?`<div class="meta">À cause de : ${esc(causesTxt(e))}</div>`:""}
      ${e.texte?`<div class="txt">« ${esc(e.texte)} »</div>`:""}
      <div class="foot"><button class="btn primary small" data-traite="${esc(e.id)}">C'est fait ✓</button></div></article>`}).join("")}</div>`
    :`<div class="empty">Aucun enfant n'attend de discussion pour l'instant.</div>`;
  const cnt={}; list.forEach(e=>cnt[e.emotion]=(cnt[e.emotion]||0)+1);
  const max=Math.max(1,...Object.values(cnt));
  const bars=n?`<div class="rank">${EMOS.map(([id,ic,lb,col])=>{const c=cnt[id]||0;return `<div class="rk"><span class="e" aria-hidden="true">${ic}</span><span class="n">${lb}</span><span class="track"><span class="fill" style="width:${c/max*100}%;background:${col};filter:saturate(1.6) brightness(.92)"></span></span><span class="v">${c}<small>${Math.round(c/n*100)} %</small></span></div>`}).join("")}</div>`
    :`<div class="empty">Pas encore de réponse pour ces filtres.</div>`;
  const pos=list.filter(e=>EMO_POS.includes(e.emotion)).length;
  const neg=list.filter(e=>!EMO_POS.includes(e.emotion));
  const cc={}; neg.forEach(e=>(e.causes||[]).forEach(c=>cc[c]=(cc[c]||0)+1));
  const causeRank=rankHtml(Object.entries(cc).sort((a,b)=>b[1]-a[1]),neg.length||1,id=>{const c=CAUSES.find(x=>x[0]===id)||["","•",id];return {e:c[1],l:c[2]};},"#FF8A80")||`<div class="empty">Pas encore de cause indiquée pour les émotions difficiles.</div>`;
  const table=`<div class="tbl"><table><thead><tr><th>Classe</th>${EMOS.map(([id,ic,lb])=>`<th title="${lb}" style="font-size:1.2rem">${ic}</th>`).join("")}<th>Total</th></tr></thead><tbody>${CLASSES.map(c=>{const r=EMOS.map(([id])=>list.filter(e=>e.classe===c.id&&e.emotion===id).length);const tot=r.reduce((a,b)=>a+b,0);return tot?`<tr><td><b>${c.id}</b></td>${r.map(x=>`<td>${x||"–"}</td>`).join("")}<td><b>${tot}</b></td></tr>`:""}).join("")||`<tr><td colspan="10" class="muted">Pas encore de réponse.</td></tr>`}</tbody></table></div>`;
  const words=list.filter(e=>e.texte||e.cause_autre);
  const wordsHtml=words.length?`<div class="pcards">${words.slice(0,120).map(e=>{const [,ic,lb]=emoById(e.emotion);return `<article class="pcard"><div class="meta">${ic} ${esc(lb)} · <b>${esc(e.classe)}</b> · ${fdate(e.at)}</div>
      ${e.cause_autre?`<div class="meta">À cause de : ${esc(e.cause_autre)}</div>`:""}${e.texte?`<div class="txt">${esc(e.texte)}</div>`:""}
      <div class="foot">${adm.delp===e.id?`<span class="muted" style="font-size:.85rem;align-self:center">Effacer ?</span><button class="btn small danger" data-delok="${esc(e.id)}">Oui</button><button class="btn small" data-delno="1">Non</button>`:`<button class="btn small" data-delp="${esc(e.id)}">Effacer</button>`}</div></article>`}).join("")}</div>`:`<div class="empty">Pas encore de message.</div>`;
  const confirm=adm.confirm?`<div class="confirm"><span>Effacer définitivement les <b>${n}</b> réponses affichées ?</span><button class="btn danger" id="doDel">Oui, effacer</button><button class="btn" id="noDel">Annuler</button></div>`
    :`<div><button class="btn danger" id="askDel" ${n?"":"disabled"}>Effacer ces ${n} réponses…</button></div>`;
  return `<div class="panel" style="border:3px solid ${todo.length?"#FF5C5C":"var(--line)"}"><h3>🙋 Enfants qui veulent parler à un animateur</h3>
      <p class="muted" style="margin:0;font-size:.9rem">« C'est fait » retire l'enfant de cette liste et efface son prénom.</p>${todoHtml}</div>
    <div class="panel">${filters}
      <div class="kpis"><div class="kpi"><b>${n}</b><span>réponses</span></div>
        <div class="kpi"><b>${n?Math.round(pos/n*100)+" %":"–"}</b><span>de soulagement et de joie</span></div>
        <div class="kpi"><b>${todo.length}</b><span>enfants à voir</span></div></div></div>
    <div class="cols">
      <div class="panel"><h3>Comment se sentent les enfants</h3>${bars}</div>
      <div class="panel"><h3>Ce qui provoque les émotions difficiles</h3><p class="muted" style="margin:0;font-size:.9rem">Tristesse, peur, colère, honte.</p>${causeRank}</div></div>
    <div class="panel"><h3>Par classe</h3>${table}</div>
    <div class="panel"><h3>Ce qu'ils ont voulu dire</h3>${wordsHtml}</div>
    <div class="panel"><h3>Nouvelle période</h3><p class="muted" style="margin:0">Efface les réponses affichées avec les filtres ci-dessus.</p>${confirm}</div>`;
}
/* ---------------- Conservation limitée des données ---------------- */
const KEEP={prenomJours:7,emotionsJours:90,toutJours:400};
async function nettoyer(){
  if(!sb||!session) return;
  const avant=j=>new Date(Date.now()-j*864e5).toISOString();
  try{
    const r=await sb.rpc("nettoyage");               // fait tout côté base si la fonction existe
    if(r.error){                                     // sinon, l'essentiel depuis le compte animateur
      await sb.from("emotions").update({prenom:""}).neq("prenom","").lt("created_at",avant(KEEP.prenomJours));
      await sb.from("emotions").delete().lt("created_at",avant(KEEP.emotionsJours));
      for(const t of ["envies","paroles","familles"]) await sb.from(t).delete().lt("created_at",avant(KEEP.toutJours));
    }
  }catch(e){ console.warn(e); }
}

/* ---------------- Export Excel (CSV) ---------------- */
function downloadCsv(nom,entetes,lignes){
  const cell=v=>{ let t=v==null?"":String(v); if(/^[=+\-@\t\r]/.test(t)) t="'"+t; return '"'+t.replace(/"/g,'""')+'"'; };
  const csv="\uFEFF"+[entetes,...lignes].map(l=>l.map(cell).join(";")).join("\r\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  a.download=nom+"-"+new Date().toISOString().slice(0,10)+".csv"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000); toast(lignes.length+" lignes exportées.");
}
function exportTab(){
  const d=t=>new Date(t).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"});
  const F=window.FAM;
  if(adm.tab==="res"){
    const L=filteredVotes(); if(!L.length) return toast("Rien à exporter pour ces filtres.");
    return downloadCsv("envies",["Date","Classe","Moment","Activité 1","Activité 2","Activité 3","Autre activité","Aime venir"],
      L.map(v=>{const a=(v.activites||[]).map(id=>actById(id).l);return [d(v.at),v.classe,momentLbl(v.moment),a[0]||"",a[1]||"",a[2]||"",v.autre||"",(MOODS.find(m=>m.id===v.humeur)||{}).lbl||""];}));
  }
  if(adm.tab==="par"){
    const L=filteredParoles(); if(!L.length) return toast("Rien à exporter pour ces filtres.");
    return downloadCsv("paroles-enfants",["Date","Espace","Classe","Moment","Thèmes","Texte","Dessin"],
      L.map(p=>[d(p.at),(PTYPES[p.type]||{}).lbl||p.type,p.classe,p.moment?momentLbl(p.moment):"",(p.tags||[]).map(t=>tagById(p.type,t).l).join(", "),p.texte||"",p.dessin?"oui":""]));
  }
  if(adm.tab==="emo"){
    const L=filteredEmotions(); if(!L.length) return toast("Rien à exporter pour ces filtres.");
    return downloadCsv("emotions",["Date","Classe","Émotion","Intensité","Causes","Autre cause","Voulait parler","Vu par un animateur","Mot de l'enfant"],
      L.map(e=>[d(e.at),e.classe,emoById(e.emotion)[2],e.intensite===2?"beaucoup":e.intensite===1?"un peu":"",(e.causes||[]).map(c=>(CAUSES.find(x=>x[0]===c)||[0,0,c])[2]).join(", "),e.cause_autre||"",e.parler?"oui":"non",e.parler?(e.traite?"oui":"non"):"",e.texte||""]));
  }
  if(adm.tab==="fam"){
    const L=filteredFamilles(); if(!L.length) return toast("Rien à exporter pour ces filtres.");
    const note=n=>n?(F.NOTES.find(x=>x[0]===n)||[0,0,""])[2]:"";
    return downloadCsv("familles",["Date","Partie","Temps fréquentés","Classes","Satisfaction générale","Recommande",...F.ITEMS.map(i=>i[1]),"Autre point","Note autre point","Thèmes à améliorer","Commentaire","Idées","Savoir-faire","Contact"],
      L.map(r=>{const P=r.precisions||{},N=r.notes||{};return [d(r.at),(F.TYPES[r.type]||{}).lbl||r.type,
        (r.temps||[]).map(t=>t==="autre"&&P.temps?"Autre : "+P.temps:(F.TEMPS.find(x=>x[0]===t)||[0,0,t])[2]).join(", "),(r.niveaux||[]).join(", "),
        note(r.global),(F.RECO.find(x=>x[0]===r.recommande)||[0,0,""])[2],...F.ITEMS.map(i=>N[i[0]]===0?"sans avis":note(N[i[0]])),P.critere||"",P.critere?note(N.autre):"",
        (r.tags||[]).map(t=>t==="autre"&&P.theme?"Autre : "+P.theme:(F.TAGS.find(x=>x[0]===t)||[0,0,t])[2]).join(", "),r.texte||"",r.idees||"",r.savoir||"",r.contact||""];}));
  }
}
let calDraft=null;
function calStatus(ouv,cat){
  if(CAL.isOpen(ouv,cat)) return `<span class="pill" style="background:#55D68F;color:#fff">Ouvert aujourd'hui</span>`;
  const n=CAL.nextOpen(ouv,cat);
  return n?`<span class="pill" style="background:#FFB347">Ouvre le ${CAL.fmt(n)}</span>`:`<span class="pill" style="background:#D3DEE4">Fermé</span>`;
}
function renderCalendrier(){
  if(!calDraft) calDraft=JSON.parse(JSON.stringify(config.ouvertures||{}));
  const row=([id,ic,lb,qui])=>{const o=calDraft[id]||{mode:"toujours"};
    return `<div class="calrow"><div class="calname">${ic} <b>${esc(lb)}</b> ${calStatus(calDraft,id)}</div>
      <select data-calmode="${id}" aria-label="Ouverture : ${esc(lb)}">${[["toujours","Toujours ouvert"],["dates","Ouvert sur certaines périodes"],["ferme","Fermé"]].map(([v,l])=>`<option value="${v}" ${(o.mode||"toujours")===v?"selected":""}>${l}</option>`).join("")}</select>
      ${o.mode==="dates"?`<div class="periodes">${(o.periodes||[]).map((p,i)=>`<div class="periode">du <input type="date" data-calp="${id}" data-i="${i}" data-f="debut" value="${esc(p.debut||"")}" aria-label="Début"> au <input type="date" data-calp="${id}" data-i="${i}" data-f="fin" value="${esc(p.fin||"")}" aria-label="Fin">
        <button class="btn small" data-caldel="${id}" data-i="${i}" aria-label="Retirer cette période">✕</button></div>`).join("")}
        <button class="btn small" data-caladd="${id}">+ Ajouter une période</button></div>`:""}</div>`;};
  const grp=g=>CAL.CATS.filter(c=>c[3]===g).map(row).join("");
  const dirty=JSON.stringify(calDraft)!==JSON.stringify(config.ouvertures||{});
  return `<div class="panel"><h3>📅 Quand chaque espace est-il ouvert ?</h3>
      <p class="muted" style="margin:0">Un espace fermé disparaît de l'écran des enfants ou des familles. Les dates sont incluses (du premier au dernier jour).</p>
      <div class="calrow fixed"><div class="calname">😊 <b>Mes émotions</b> <span class="pill" style="background:#55D68F;color:#fff">Ouvert tous les jours</span></div><span class="muted">Toujours ouvert, mis en avant pour les enfants.</span></div>
      <h3 style="margin-top:6px">🧒 Enfants</h3>${grp("Enfants")}
      <h3 style="margin-top:6px">👨‍👩‍👧 Familles</h3>${grp("Familles")}
      <div class="tabs"><button class="btn primary" id="calSave" ${dirty?"":"disabled"}>Enregistrer le calendrier</button>${dirty?`<button class="btn" id="calReset">Annuler les changements</button><span class="muted" style="align-self:center">Modifications non enregistrées</span>`:""}</div></div>`;
}
function renderActsAdmin(){
  return MOMENTS.map(m=>`<div class="panel"><h3>${m.pic} ${m.lbl}</h3>
    <p class="muted" style="margin:0;font-size:.9rem">Touche une activité pour la cacher ou la remettre. Les activités ajoutées peuvent être retirées.</p>
    <div class="actlist">${activities(m.id).map(a=>`<span class="chip ${(config.hidden||[]).includes(a.id)?"off":""}" role="button" tabindex="0" data-toggle="${esc(a.id)}">${esc(a.e)} ${esc(a.l)}${a.custom?` <button class="muted" data-remove="${esc(a.id)}" aria-label="Retirer ${esc(a.l)}">✕</button>`:""}</span>`).join("")}</div>
    <div class="addrow"><input class="emo" id="e-${m.id}" maxlength="4" placeholder="🙂" aria-label="Pictogramme"><input id="l-${m.id}" maxlength="40" placeholder="Nouvelle activité (ex. Atelier cirque)" aria-label="Nom de l'activité"><button class="btn primary" data-add="${m.id}">Ajouter</button></div></div>`).join("");
}
function renderSettings(){
  const famUrl=new URL("familles.html",location.href).href;
  return `<div class="panel"><h3>👨‍👩‍👧 Lien de l'espace familles</h3>
    <p class="muted" style="margin:0">À envoyer aux parents (mail, ENT, affiche). Ils répondent depuis leur téléphone, sans compte.</p>
    <div class="famlink"><img class="qr" src="qr-familles.svg" alt="QR code de l'espace familles"><div style="display:flex;flex-direction:column;gap:8px;min-width:0">
      <code style="overflow-wrap:anywhere">${esc(famUrl)}</code><div class="tabs"><button class="btn" id="copyFam" data-url="${esc(famUrl)}">Copier le lien</button><a class="btn" href="familles.html" target="_blank" rel="noopener">Ouvrir</a><a class="btn primary" href="affiche-familles.pdf" target="_blank" rel="noopener">🖨️ Affiche A4 à imprimer</a></div>
      <small class="muted">Le QR code peut être imprimé sur une affiche : clic droit sur l'image › Enregistrer.</small></div></div></div>
  <div class="panel"><h3>🔊 Voix qui lit les questions</h3>
    <div class="tabs"><button class="btn primary" id="voiceTest">Tester la voix sur cet appareil</button></div>
    <small class="muted" id="voiceDiag">${esc(voiceDiag())}</small>
    <small class="muted">Voix enregistrée : voix de synthèse « siwis » (Piper), données SIWIS de l'Université d'Édimbourg, licence CC-BY 4.0.</small></div>
  <div class="panel"><h3>🔔 Alertes « un enfant veut parler »</h3>
    <p class="muted" style="margin:0">Tant que l'espace animateur est ouvert sur cet appareil, il vérifie toutes les 15 secondes : son, vibration et notification dès qu'un enfant demande un animateur.</p>
    <div class="tabs"><button class="btn primary" id="notifOn">Activer les notifications</button><button class="btn" id="notifTest">Tester l'alerte</button></div>
    <div class="ntfy">${acc.ntfy?.ntfy_topic?(()=>{const url="https://ntfy.sh/"+acc.ntfy.ntfy_topic;let qr="";
      try{const q=qrcode(0,"M");q.addData(url);q.make();qr=q.createSvgTag({cellSize:5,margin:2,scalable:true});}catch(e){}
      return `<b style="font-size:1.1rem">📱 Recevoir l'alerte sur son téléphone, même appli fermée (facultatif)</b>
      <div class="ntfy-steps"><div class="qrbox">${qr}</div><ol>
        <li><b>Installez l'appli gratuite « ntfy »</b> sur votre téléphone (Play Store ou App Store).</li>
        <li><b>Scannez ce QR code</b> avec l'appareil photo du téléphone (depuis un autre écran), puis touchez <b>« S'abonner »</b> (Subscribe).</li></ol></div>
      <div class="ntfy-phone"><b>Vous êtes déjà sur votre téléphone ?</b> Après avoir installé ntfy :
        <div class="tabs"><a class="btn primary" href="ntfy://ntfy.sh/${esc(acc.ntfy.ntfy_topic)}">📲 S'abonner depuis ce téléphone</a></div>
        <small class="muted">Si le bouton ne fait rien : touchez <b>Copier le nom du canal</b>, ouvrez ntfy, touchez <b>+</b>, collez le nom, puis <b>S'abonner</b>.</small></div>
      <div class="tabs"><button class="btn primary" id="ntfyTest" data-topic="${esc(acc.ntfy.ntfy_topic)}">Envoyer une alerte de test</button>
        <button class="btn" id="copyTopic" data-url="${esc(acc.ntfy.ntfy_topic)}">Copier le nom du canal</button></div>
      <small class="muted">Ce QR code est réservé à l'équipe. L'alerte dit seulement « Un enfant de CP demande un animateur » : ni prénom, ni émotion.</small>`;})()
      :`<small class="muted">📱 Alertes sur téléphone : pas encore activées.</small>`}</div>
    <small class="muted">${"Notification" in window?{granted:"✅ Notifications autorisées sur cet appareil.",denied:"⛔ Notifications bloquées : autorisez-les dans les réglages du navigateur pour ce site.",default:"Notifications pas encore autorisées sur cet appareil."}[Notification.permission]:"Ce navigateur ne gère pas les notifications : le son et le bandeau rouge restent actifs."} Sur iPhone/iPad, ajoutez d'abord l'appli à l'écran d'accueil.</small></div>
  <div class="panel"><h3>👥 Comptes animateurs</h3>
    <p class="muted" style="margin:0">Un collègue crée son compte avec « Pas encore de compte ? » sur l'écran de connexion, puis tu le valides ici. Seuls les comptes validés voient les réponses.</p>
    ${acc.pending.length?`<div class="actlist" style="flex-direction:column;align-items:stretch">${acc.pending.map(u=>`<div class="confirm" style="border-color:var(--peri)"><span style="flex:1;min-width:0;overflow-wrap:anywhere">⏳ <b>${esc(u.email)}</b> <small class="muted">demandé le ${fdate(u.created_at)}</small></span><button class="btn primary" data-valider="${esc(u.id)}">Valider</button><button class="btn danger" data-refuser="${esc(u.id)}">Refuser</button></div>`).join("")}</div>`:`<div class="muted">Aucun compte en attente.</div>`}
    <div><b>Validés :</b> ${acc.team.map(u=>esc(u.email)).join(", ")||"–"}</div></div>
  <div class="panel"><h3>🔑 Changer mon mot de passe</h3>
    <div class="addrow"><input id="newpass" type="password" minlength="8" autocomplete="new-password" placeholder="Nouveau mot de passe (8 caractères min.)" aria-label="Nouveau mot de passe" style="flex:1;min-width:0"><button class="btn primary" id="savePass">Changer</button></div></div>
  <div class="panel"><h3>Comment l'utiliser</h3><ol style="margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:6px">
    <li>Ouvre l'appli sur la tablette de la salle. Astuce : « Ajouter à l'écran d'accueil » dans le navigateur.</li>
    <li>L'enfant choisit sa classe, puis une des 4 portes : <b>Mes envies d'activités</b>, <b>J'améliore le centre</b>, <b>J'aimerais découvrir</b> ou <b>Je m'exprime</b> (texte ou dessin au doigt).</li>
    <li>Le bouton 🔊 lit les questions et les images : pratique pour les maternelles.</li>
    <li>Si le wifi coupe, les réponses sont gardées sur la tablette (⏳ en haut) et partent toutes seules quand la connexion revient.</li>
    <li>Les envies sont dans l'onglet 📊, les idées, textes et dessins dans l'onglet 💬.</li>
    <li><b>Conservation des données</b> : le prénom d'un enfant est effacé au bout de 7 jours (ou dès « C'est fait »), les émotions et les coordonnées des familles au bout de 3 mois, tout le reste au bout de 13 mois.</li>
    <li>Pense à <b>te déconnecter</b> avant de rendre la tablette aux enfants.</li>
    <li>Pour ajouter un animateur : il crée son compte depuis l'écran de connexion, puis tu le valides ci-dessus.</li></ol>
    <p class="muted" style="margin:0">Les réponses sont anonymes : on n'enregistre ni nom ni prénom.</p></div>`;
}
async function saveConfig(patch){
  const next={...config,...patch};
  const {error}=await sb.from("reglages").update({data:next,updated_at:new Date().toISOString()}).eq("id",1);
  if(error){ toast("Le réglage n'a pas été enregistré. Réessaie."); return; }
  config=next; render(); toast("C'est enregistré.");
}
async function deleteIds(table,ids){
  let ok=0;
  for(let i=0;i<ids.length;i+=100){
    const chunk=ids.slice(i,i+100);
    const {error}=await sb.from(table).delete().in("id",chunk);
    if(!error) ok+=chunk.length;
  }
  return ok;
}
async function deleteFiltered(){
  const table=adm.tab==="par"?"paroles":adm.tab==="fam"?"familles":adm.tab==="emo"?"emotions":"envies";
  const list=table==="paroles"?filteredParoles():table==="familles"?filteredFamilles():table==="emotions"?filteredEmotions():filteredVotes(); adm.confirm=false;
  toast("Effacement en cours…"); render();
  const ok=await deleteIds(table,list.map(v=>v.id));
  toast(ok+" effacées."); loadAll();
}
async function loadConfig(){
  if(!sb) return;
  const {data,error}=await sb.from("reglages").select("data").eq("id",1).maybeSingle();
  if(!error&&data?.data){ config={added:{peri:[],mer:[],midi:[]},hidden:[],...data.data}; if(["choix","hub"].includes(s.view)||(s.view==="adm"&&adm.tab!=="cal")) render(); }
}

/* ---------------- Événements ---------------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,[data-toggle]"); if(!t) return;
  const d=t.dataset;
  if(t.id==="fsBtn"){ if(isFs()){ setFsWanted(false); exitFs(); } else { setFsWanted(true); enterFs(); } majFsBtn(); return; }
  if(t.id==="voiceBtn"){voice=!voice;try{localStorage.setItem("envies-voice",voice?"on":"off")}catch(_){ } if(!voice)try{speechSynthesis.cancel()}catch(_){ } render();return;}
  if(t.id==="adultBtn"){
    if(s.view.startsWith("adm")){ if(!(remember&&session)) logout(); go("accueil"); }
    else if(session){ s.view="adm"; loadAll(); loadTeam(); render(); window.scrollTo({top:0}); }
    else {adm.err="";acc.msg="";acc.mode="login";s.view="adm-login";render();}
    return;}
  if(t.id==="logout"){ logout(); go("accueil"); toast("Déconnecté."); return; }
  if(t.id==="refresh"){ loadAll(); loadTeam(); return; }
  if(t.id==="exportCsv"){ exportTab(); return; }
  if(t.id==="switchMode"){ acc.mode=acc.mode==="signup"?"login":"signup"; adm.err=""; acc.msg=""; render(); return; }
  if(d.valider){ sb.rpc("valider_animateur",{uid:d.valider}).then(({error})=>{toast(error?"Validation impossible.":"Compte validé.");loadTeam();}); return; }
  if(d.refuser){ sb.rpc("refuser_compte",{uid:d.refuser}).then(({error})=>{toast(error?"Refus impossible.":"Compte supprimé.");loadTeam();}); return; }
  if(t.id==="copyTopic"){ navigator.clipboard?.writeText(d.url).then(()=>toast("Nom du canal copié."),()=>toast("Copie impossible : sélectionnez le nom à la main.")); return; }
  if(t.id==="ntfyTest"){ fetch("https://ntfy.sh/"+encodeURIComponent(d.topic),{method:"POST",body:"Test : les alertes « un enfant veut parler » arrivent bien sur ce téléphone.",headers:{Title:"Mes envies : test d'alerte",Tags:"white_check_mark"}})
      .then(r=>toast(r.ok?"Alerte de test envoyée : regardez votre téléphone.":"Envoi impossible."),()=>toast("Envoi impossible : vérifiez la connexion.")); return; }
  if(d.caladd){ const o=calDraft[d.caladd]; const t0=CAL.today(), t1=new Date(Date.now()+13*864e5); o.periodes=[...(o.periodes||[]),{debut:t0,fin:t1.getFullYear()+"-"+String(t1.getMonth()+1).padStart(2,"0")+"-"+String(t1.getDate()).padStart(2,"0")}]; render(); return; }
  if(d.caldel){ calDraft[d.caldel].periodes.splice(+d.i,1); render(); return; }
  if(t.id==="calReset"){ calDraft=null; render(); return; }
  if(t.id==="calSave"){ for(const [id,o] of Object.entries(calDraft)){ if(o.mode==="dates"){ o.periodes=(o.periodes||[]).filter(p=>p.debut&&p.fin);
        if(o.periodes.some(p=>p.fin<p.debut)) return toast("Une période se termine avant de commencer : corrigez les dates."); } }
    saveConfig({ouvertures:calDraft}).then(()=>{calDraft=null;render();}); return; }
  if(t.id==="voiceTest"){ say("Bonjour ! La voix fonctionne sur cet appareil.",true); setTimeout(()=>{const el=$("#voiceDiag"); if(el) el.textContent=voiceDiag();},1200); return; }
  if(t.id==="notifOn"){ unlockAlerts(); try{ Notification.requestPermission().then(()=>render()); }catch(e){ toast("Ce navigateur ne gère pas les notifications."); } return; }
  if(t.id==="notifTest"){ unlockAlerts(); setTimeout(()=>alertAnim([{id:"test"+Date.now(),classe:"GS",emotion:"tristesse",prenom:"Test"}]),300); return; }
  if(t.id==="savePass"){ const v=$("#newpass").value; if(v.length<8){toast("8 caractères minimum.");return;}
    sb.auth.updateUser({password:v}).then(({error})=>{ toast(error?"Mot de passe non changé : "+error.message:"Mot de passe changé."); if(!error) $("#newpass").value=""; }); return; }
  if(t.id==="copyFam"){ navigator.clipboard?.writeText(d.url).then(()=>toast("Lien copié."),()=>toast("Copie impossible : sélectionnez le lien à la main.")); return; }
  if(d.say){ say(d.say,true); return;}
  if(d.classe){s.classe=d.classe; go("hub"); return;}
  if(d.moment){s.moment=d.moment; s.choix=[]; s.autre=""; go("choix"); return;}
  if(d.act){const i=s.choix.indexOf(d.act);
    if(i>=0) s.choix.splice(i,1);
    else if(s.choix.length>=MAXCHOIX){ say("Tu as déjà choisi trois activités. Enlève-en une pour changer."); toast(`Tu as déjà ${MAXCHOIX} choix. Touche-en un pour l'enlever.`); return;}
    else {s.choix.push(d.act); say(d.act.endsWith(":autre")?"Autre chose. Dis à un grand quelle activité tu voudrais.":actById(d.act).l);}
    render(); if(d.act.endsWith(":autre")&&s.choix.includes(d.act)) setTimeout(()=>{const el=$("#autreTxt"); if(el){el.scrollIntoView({block:"center",behavior:"smooth"}); el.focus({preventScroll:true});}},50);
    return;}
  if(d.mood){s.humeur=s.humeur===d.mood?null:d.mood; if(s.humeur) say(MOODS.find(x=>x.id===d.mood).lbl); render(); return;}
  if(d.tag){const i=s.tags.indexOf(d.tag); if(i>=0) s.tags.splice(i,1); else {s.tags.push(d.tag); say(tagById(s.view,d.tag).l);} render(); return;}
  if(d.emo){ s.emo=s.emo===d.emo?null:d.emo; s.intensite=null; if(s.emo) say(emoById(s.emo)[2]+". "+(emoById(s.emo)[4]||"")); render(); return; }
  if(d.int){ const v=+d.int; s.intensite=s.intensite===v?null:v; if(s.intensite) say(v===1?"Un peu":"Beaucoup"); render(); return; }
  if(d.cause){ const i=s.causes.indexOf(d.cause); if(i>=0) s.causes.splice(i,1); else { s.causes.push(d.cause); say((CAUSES.find(c=>c[0]===d.cause)||[])[2]||""); } render(); return; }
  if(d.parler){ const v=d.parler==="oui"; s.parler=s.parler===v?null:v; if(s.parler!==null) say(v?"Oui. Écris ton prénom, ou demande à un grand.":"Non, ça va."); render(); if(s.parler===true) setTimeout(()=>$("#prenom")?.focus({preventScroll:false}),50); return; }
  if(t.id==="sendEmo"){ sendEmotion(); return; }
  if(t.id==="breathe"){ startBreathing(); return; }
  if(d.pmoment){s.pmoment=s.pmoment===d.pmoment?null:d.pmoment; if(s.pmoment) say(momentLbl(s.pmoment)); render(); return;}
  if(d.pen){pen=d.pen; render(); return;}
  if(t.id==="clearDraw"){s.dessin=null; render(); return;}
  if(d.go){go(d.go);return;}
  if(t.id==="send"){sendEnvies();return;}
  if(t.id==="sendP"){sendParole();return;}
  if(d.tab){calDraft=null;adm.tab=d.tab;adm.confirm=false;adm.delp=null;if(d.tab==="set")loadTeam();render();return;}
  if(t.id==="askDel"){adm.confirm=true;render();return;}
  if(t.id==="noDel"){adm.confirm=false;render();return;}
  if(t.id==="doDel"){deleteFiltered();return;}
  if(d.delp){adm.delp=d.delp;render();return;}
  if(d.traite){ const id=d.traite; sb.from("emotions").update({traite:true,prenom:""}).eq("id",id).then(({error})=>{ toast(error?"Pas enregistré. Réessaie.":"C'est noté. Le prénom a été effacé."); loadAll(); }); return; }
  if(d.delno){adm.delp=null;render();return;}
  if(d.delok){const id=d.delok; adm.delp=null; deleteIds(adm.tab==="fam"?"familles":adm.tab==="emo"?"emotions":"paroles",[id]).then(n=>{toast(n?"Effacé.":"Pas effacé. Réessaie.");loadAll();}); return;}
  if(d.remove){e.stopPropagation(); const added={...config.added}; for(const m in added) added[m]=(added[m]||[]).filter(a=>a.id!==d.remove); saveConfig({added,hidden:(config.hidden||[]).filter(h=>h!==d.remove)}); return;}
  if(d.toggle){const h=new Set(config.hidden||[]); h.has(d.toggle)?h.delete(d.toggle):h.add(d.toggle); saveConfig({hidden:[...h]}); return;}
  if(d.add){const m=d.add,l=$("#l-"+m).value.trim(),em=$("#e-"+m).value.trim()||"⭐"; if(!l){toast("Écris le nom de l'activité.");return;}
    const added={peri:[],mer:[],midi:[],...config.added}; added[m]=[...(added[m]||[]),{id:m+":c"+Date.now().toString(36),e:em,l:l.slice(0,40)}]; saveConfig({added}); return;}
});
document.addEventListener("keydown",e=>{ if((e.key==="Enter"||e.key===" ")&&e.target.dataset?.toggle){e.preventDefault();e.target.click();} });
document.addEventListener("change",e=>{
  const cd=e.target.dataset||{};
  if(cd.calmode){ const o=calDraft[cd.calmode]=calDraft[cd.calmode]||{}; o.mode=e.target.value; if(o.mode==="dates"&&!(o.periodes||[]).length){ const t1=new Date(Date.now()+13*864e5); o.periodes=[{debut:CAL.today(),fin:t1.getFullYear()+"-"+String(t1.getMonth()+1).padStart(2,"0")+"-"+String(t1.getDate()).padStart(2,"0")}]; } render(); return; }
  if(cd.calp){ calDraft[cd.calp].periodes[+cd.i][cd.f]=e.target.value; render(); return; } if(["fm","fc","fp","pt","ft"].includes(e.target.id)){adm[e.target.id]=e.target.value;adm.confirm=false;render();} });
window.addEventListener("online",flushQueue);

/* ---------------- Démarrage ---------------- */
if(CFG.nomCentre){ const t=`Mes envies à ${CFG.nomCentre}`; $("#appTitle").textContent=t; document.title=t; baseTitle=t; }
if(!configured){ const b=$("#setupBanner"); b.hidden=false; b.textContent="L'appli n'est pas encore reliée à Supabase : les réponses restent sur cette tablette en attendant. Remplis le fichier config.js (voir le README)."; }
render(); showQueue();
loadConfig(); flushQueue(); setInterval(flushQueue,60000); setInterval(loadConfig,5*60000);

/* ---------------- Plein écran et écran toujours allumé ---------------- */
/* Le plein écran ne peut s'ouvrir qu'après un toucher : si l'adulte l'a activé et qu'un enfant en sort,
   le toucher suivant le rétablit tout seul. L'écran reste allumé tant que l'appli est affichée. */
let fsWanted=false; try{ fsWanted=localStorage.getItem("envies-fs")==="1"; }catch(e){}
function setFsWanted(v){ fsWanted=v; try{ v?localStorage.setItem("envies-fs","1"):localStorage.removeItem("envies-fs"); }catch(e){} }
function isFs(){ return !!(document.fullscreenElement||document.webkitFullscreenElement); }
function enterFs(){ const el=document.documentElement; try{ const r=(el.requestFullscreen||el.webkitRequestFullscreen)?.call(el,{navigationUI:"hide"}); r?.catch?.(()=>{}); }catch(e){} }
function exitFs(){ try{ (document.exitFullscreen||document.webkitExitFullscreen)?.call(document)?.catch?.(()=>{}); }catch(e){} }
function majFsBtn(){ const b=$("#fsBtn"); if(!b) return;
  const ok=!!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen);
  b.hidden=!ok||s.view.startsWith("adm"); b.textContent=isFs()?"✕ Quitter le plein écran":"⛶ Plein écran"; }
document.addEventListener("fullscreenchange",majFsBtn); document.addEventListener("webkitfullscreenchange",majFsBtn);
document.addEventListener("pointerdown",e=>{ if(fsWanted&&!isFs()&&!s.view.startsWith("adm")&&e.target.id!=="fsBtn") enterFs(); },true);
let wakeLock=null;
async function keepAwake(){ try{ if("wakeLock" in navigator&&document.visibilityState==="visible"&&!wakeLock){ wakeLock=await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release",()=>{wakeLock=null;}); } }catch(e){ wakeLock=null; } }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") keepAwake(); });
document.addEventListener("pointerdown",keepAwake,{passive:true});
keepAwake(); majFsBtn();
/* connexion gardée (« Rester connecté ») : on la reprend sans redemander le mot de passe */
if(sb&&remember) sb.auth.getSession().then(async({data})=>{
  if(!data?.session){ setRemember(false); return; }
  const {data:ok}=await sb.rpc("is_animateur");
  if(ok===true){ session=data.session; nettoyer(); startRefresh(); render(); } else { await sb.auth.signOut(); setRemember(false); }
}).catch(()=>{});
