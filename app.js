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
const PENS=["#1F2B3A","#E53935","#FB8C00","#FDD835","#43A047","#1E88E5","#8E24AA","#8D6E63"];

/* ---------------- Connexion Supabase ---------------- */
const CFG=window.ENVIES_CONFIG||{};
const configured=!!(CFG.supabaseUrl&&CFG.supabaseKey&&window.supabase);
const sb=configured?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{persistSession:false,autoRefreshToken:true}}):null;

/* ---------------- État ---------------- */
let voice=true, pen=PENS[0], session=null;
let votes=[], paroles=[], familles=[], loadState="idle", lastLoad=0, refreshTimer=null;
let config={added:{peri:[],mer:[],midi:[]},hidden:[]};
const fresh=()=>({choix:[],humeur:null,moment:null,tags:[],texte:"",dessin:null,pmoment:null});
let s={view:"accueil",classe:null,...fresh()};
let acc={mode:"login",msg:"",pending:[],team:[]};
let adm={tab:"res",fm:"all",fc:"all",fp:"all",pt:"all",ft:"all",confirm:false,delp:null,err:"",busy:false};
let timer=null;
try{ if(localStorage.getItem("envies-voice")==="off") voice=false; }catch(e){}

const $=(sel,el=document)=>el.querySelector(sel);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,3000);}
function say(t,force){ if(!voice&&!force) return; try{ const u=new SpeechSynthesisUtterance(t); u.lang="fr-FR"; u.rate=.95; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
function activities(m){
  const base=BASE[m].map(([id,e,l])=>({id:m+":"+id,e,l,custom:false}));
  const add=(config.added?.[m]||[]).map(a=>({id:a.id,e:a.e,l:a.l,custom:true}));
  return [...base,...add];
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
const isNetworkError=err=>!navigator.onLine||!err?.code&&/fetch|network|load failed|timeout/i.test(err?.message||"");
let flushing=false;
async function flushQueue(){
  if(!sb||flushing) return; flushing=true;
  try{
    let q=readQueue();
    while(q.length){
      const {table,row}=q[0];
      const {error}=await sb.from(table).insert(row);
      if(error&&isNetworkError(error)) break;
      q.shift(); writeQueue(q);           // envoyé, ou refusé définitivement : on le retire
    }
  }finally{flushing=false; showQueue();}
}

/* ---------------- Le renard mascotte (dessin vectoriel) ---------------- */
function fox(pose="wave",cls="fox"){
  const O="#F28A2E",C="#FFF4E6",B="#4A2A17",D="#3B2314";
  const happy=pose==="cheer";
  const eyes=happy
    ?`<path d="M70 84q10-12 20 0M110 84q10-12 20 0" stroke="${D}" stroke-width="6" fill="none" stroke-linecap="round"/>`
    :`<ellipse cx="80" cy="84" rx="9" ry="11" fill="${D}"/><ellipse cx="120" cy="84" rx="9" ry="11" fill="${D}"/><circle cx="83" cy="79" r="3.5" fill="#fff"/><circle cx="123" cy="79" r="3.5" fill="#fff"/>`;
  const head=`<path d="M44 62 L36 6 L88 38Z" fill="${O}"/><path d="M50 54 L44 20 L76 42Z" fill="${B}"/>
    <path d="M156 62 L164 6 L112 38Z" fill="${O}"/><path d="M150 54 L156 20 L124 42Z" fill="${B}"/>
    <ellipse cx="100" cy="82" rx="66" ry="52" fill="${O}"/>
    <path d="M34 86 Q62 82 100 102 Q138 82 166 86 Q152 134 100 136 Q48 134 34 86Z" fill="${C}"/>
    ${eyes}
    <ellipse cx="100" cy="102" rx="10" ry="7" fill="${D}"/>
    <path d="M86 112 Q100 132 114 112Z" fill="#B23A3A" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M93 121 Q100 128 107 121" fill="#FF8C8C"/>
    <circle cx="62" cy="106" r="9" fill="#FF9AA2" opacity=".55"/><circle cx="138" cy="106" r="9" fill="#FF9AA2" opacity=".55"/>`;
  if(pose==="peek"){
    return `<svg class="${cls}" viewBox="0 0 200 150" aria-hidden="true">${head}<ellipse cx="62" cy="140" rx="16" ry="10" fill="${B}"/><ellipse cx="138" cy="140" rx="16" ry="10" fill="${B}"/></svg>`;
  }
  const arm=(d,px,py)=>`<path d="${d}" stroke="${O}" stroke-width="17" stroke-linecap="round" fill="none"/><circle cx="${px}" cy="${py}" r="11" fill="${B}"/>`;
  const arms=happy
    ? arm("M66 152 Q40 132 34 102",34,98)+arm("M134 152 Q160 132 166 102",166,98)
    : arm("M64 154 Q46 172 54 192",54,196)+arm("M136 150 Q166 132 170 100",170,96);
  return `<svg class="${cls}" viewBox="0 0 210 232" aria-hidden="true">
    <path d="M136 214 C196 206 206 136 176 112 C184 156 166 184 128 190Z" fill="${O}"/>
    <path d="M176 112 C190 126 192 146 184 158 C178 138 172 124 176 112Z" fill="${C}"/>
    <ellipse cx="100" cy="176" rx="46" ry="46" fill="${O}"/>
    <ellipse cx="100" cy="184" rx="27" ry="32" fill="${C}"/>
    <path d="M70 140 Q74 178 72 210" stroke="#2F6FD6" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M130 140 Q126 178 128 210" stroke="#2F6FD6" stroke-width="10" fill="none" stroke-linecap="round"/>
    ${arms}
    <ellipse cx="80" cy="220" rx="17" ry="10" fill="${B}"/><ellipse cx="120" cy="220" rx="17" ry="10" fill="${B}"/>
    ${head}</svg>`;
}
const STEP={classe:1,hub:2,moment:3,ameliorer:3,explorer:3,libre:3,choix:4,humeur:4};
const BACK={classe:"accueil",hub:"classe",moment:"hub",choix:"moment",humeur:"choix",ameliorer:"hub",explorer:"hub",libre:"hub"};
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
  if(s.view==="adm-login") return renderLogin(app);
  if(s.view==="adm") return renderAdmin(app);

  if(s.view==="accueil"){
    app.innerHTML=`<div class="wrap kid">
      <div class="hero">${fox("wave")}<div class="sign">Bonjour !<br>Qui es-tu ?<button class="speak" data-say="Bonjour ! Qui es-tu ? Enfants, ou familles ?" aria-label="Écouter">🔊</button></div></div>
      <div class="grid choose">
        <button class="big who kids" data-go="classe"><span class="pic" aria-hidden="true">🧒</span><span class="lbl">Enfants</span><span class="sub">Je donne mes envies et mes idées</span></button>
        <a class="big who fams" href="familles.html?app"><span class="pic duo" aria-hidden="true">👩🧒</span><span class="lbl">Familles</span><span class="sub">Parents : votre avis sur le centre</span></a>
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
        ${door("env","moment","🎯","Mes envies d'activités","Choisir ce que j'ai envie de faire")}
        ${Object.entries(PTYPES).map(([k,p])=>door(p.cls,k,p.pic,p.lbl,p.sub)).join("")}
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
      <div class="bar"><button class="back" data-go="moment">← Retour</button>
        <span class="count" aria-label="${n} choix sur ${MAXCHOIX}">${n} / ${MAXCHOIX}</span>
        <button class="go" data-go="humeur" ${n?"":"disabled"}>J'ai fini ! ✓</button></div></div>`;
  }
  else if(s.view==="humeur"){
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

const SPEAK={accueil:"Bonjour ! Qui es-tu ? Enfants, ou familles ?",classe:"Tu es dans quelle classe ?",hub:"Qu'est-ce que tu veux faire ? Mes envies d'activités, j'améliore le centre, j'aimerais découvrir, ou je m'exprime.",
  moment:"C'est pour quel moment ?",choix:"Qu'est-ce que tu as envie de faire ? Choisis jusqu'à trois activités.",humeur:"Tu aimes venir au centre ?",
  ameliorer:"Qu'est-ce que tu changerais au centre ?",explorer:"Qu'est-ce que tu aimerais découvrir ?",libre:"Dis ou dessine ce que tu veux !",merci:"Bravo ! C'est bien arrivé chez les animateurs !"};
function go(view){
  clearTimeout(timer);
  if(view==="classe"||view==="accueil") s={view,classe:null,...fresh()};
  if(view==="hub") Object.assign(s,fresh());
  if(PTYPES[view]&&s.view==="hub") Object.assign(s,fresh());
  s.view=view; render(); window.scrollTo({top:0});
  if(SPEAK[view]) say(SPEAK[view]);
}

async function save(table,row,btn){
  const label=btn.textContent; btn.disabled=true; btn.textContent="Envoi…";
  let queued=false;
  if(!sb){ queued=true; }
  else{
    const {error}=await sb.from(table).insert(row);
    if(error){
      if(isNetworkError(error)) queued=true;
      else{ btn.disabled=false; btn.textContent=label; console.error(error); toast("L'envoi a été refusé. Préviens un animateur."); return; }
    }
  }
  if(queued){
    const qq=readQueue(); qq.push({table,row});
    if(!writeQueue(qq)){ btn.disabled=false; btn.textContent=label; toast("Pas de connexion et pas de place pour garder la réponse. Réessaie plus tard."); return; }
    showQueue();
  }
  go("merci");
  timer=setTimeout(()=>{ if(s.view==="merci") go("hub"); },7000);
}
function sendEnvies(){
  save("envies",{classe:s.classe,cycle:cycleOf(s.classe),moment:s.moment,activites:s.choix.slice(),humeur:s.humeur||null},$("#send"));
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
    <div class="err" role="alert">${esc(adm.err)}</div>
    ${acc.msg?`<div class="banner">${esc(acc.msg)}</div>`:""}
    <button class="btn primary" type="submit" ${adm.busy?"disabled":""}>${adm.busy?"Patiente…":signup?"Créer mon compte":"Se connecter"}</button>
    <button class="btn" type="button" id="switchMode">${signup?"J'ai déjà un compte : me connecter":"Pas encore de compte ? Créer mon compte"}</button></form></div>`;
  $("#loginForm").addEventListener("submit",async e=>{
    e.preventDefault(); const email=e.target.lemail.value.trim(), password=e.target.lpass.value;
    adm.busy=true; adm.err=""; acc.msg=""; render();
    if(signup){
      const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.href.split("#")[0]}});
      adm.busy=false;
      if(error){ adm.err=/registered|exists/i.test(error.message)?"Ce compte existe déjà : connecte-toi.":/password/i.test(error.message)?"Mot de passe trop faible : 8 caractères minimum.":"Création impossible : "+error.message; render(); return; }
      if(data.session) await sb.auth.signOut();
      acc.mode="login"; acc.msg="Compte créé. Si tu reçois un e-mail de confirmation, clique sur le lien. Demande ensuite à un animateur de valider ton compte dans l'onglet Aide.";
      render(); return;
    }
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error){ adm.busy=false; adm.err=/confirm/i.test(error.message)?"Confirme d'abord ton adresse avec le lien reçu par e-mail.":/invalid/i.test(error.message)?"E-mail ou mot de passe incorrect.":"Connexion impossible : "+error.message; render(); return; }
    const {data:ok}=await sb.rpc("is_animateur");
    adm.busy=false;
    if(ok!==true){ await sb.auth.signOut(); adm.err="Ton compte n'est pas encore validé. Demande à un animateur de le valider dans l'onglet Aide."; render(); return; }
    session=data.session; s.view="adm"; loadAll(); loadTeam(); startRefresh(); render();
  });
}
async function loadTeam(){
  if(!sb||!session) return;
  const [p,t]=await Promise.all([sb.rpc("comptes_en_attente"),sb.from("animateurs").select("user_id,email,created_at").order("created_at")]);
  acc.pending=p.data||[]; acc.team=t.data||[];
  if(s.view==="adm"&&adm.tab==="set") render();
}
async function logout(){ try{await sb?.auth.signOut();}catch(e){} session=null; votes=[]; paroles=[]; familles=[]; acc.pending=[]; acc.team=[]; loadState="idle"; stopRefresh(); }

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
    [votes,paroles,familles]=await Promise.all([fetchAll("envies"),fetchAll("paroles"),fetchAll("familles")]);
    loadState="ok"; lastLoad=Date.now();
  }catch(e){ console.error(e); loadState="err"; }
  if(s.view==="adm") render();
}
function startRefresh(){ stopRefresh(); refreshTimer=setInterval(()=>{ if(s.view==="adm"&&!adm.confirm&&!adm.delp) loadAll(); },60000); }
function stopRefresh(){ clearInterval(refreshTimer); refreshTimer=null; }

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
  const tabs=`<div class="adminbar"><div class="tabs">
    <button class="chip" data-tab="res" aria-pressed="${adm.tab==="res"}">📊 Envies d'activités</button>
    <button class="chip" data-tab="par" aria-pressed="${adm.tab==="par"}">💬 Paroles des enfants</button>
    <button class="chip" data-tab="fam" aria-pressed="${adm.tab==="fam"}">👨‍👩‍👧 Familles</button>
    <button class="chip" data-tab="acts" aria-pressed="${adm.tab==="acts"}">🧩 Activités proposées</button>
    <button class="chip" data-tab="set" aria-pressed="${adm.tab==="set"}">⚙️ Aide</button></div>
    <div class="tabs"><span class="muted" style="font-size:.85rem;align-self:center">Mis à jour à ${upd}</span><button class="chip" id="refresh">↻ Actualiser</button><button class="chip" id="logout">Se déconnecter</button></div></div>`;
  if(adm.tab==="acts") return app.innerHTML=`<div class="wrap">${tabs}${renderActsAdmin()}</div>`;
  if(adm.tab==="set") return app.innerHTML=`<div class="wrap">${tabs}${renderSettings()}</div>`;
  if(adm.tab==="par") return app.innerHTML=`<div class="wrap">${tabs}${renderParoles()}</div>`;
  if(adm.tab==="fam") return app.innerHTML=`<div class="wrap">${tabs}${renderFamilles()}</div>`;

  const filters=`<div class="filters"><label>Moment ${sel("fm",adm.fm,[["all","Tous les moments"],...MOMENTS.map(m=>[m.id,m.lbl])])}</label>${fClasse()}${fPeriode()}</div>`;
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
    <div class="panel"><h3>Réponses par classe et par moment</h3><p class="muted" style="margin:0;font-size:.9rem">Suit uniquement le filtre de période.</p>${table}</div>
    <div class="panel"><h3>Nouvelle période</h3><p class="muted" style="margin:0">Pour repartir de zéro (nouveau trimestre, nouvelles vacances), efface les envies affichées avec les filtres ci-dessus.</p>${confirm}</div></div>`;
}

function renderParoles(){
  const filters=`<div class="filters"><label>Espace ${sel("pt",adm.pt,[["all","Tous"],...Object.entries(PTYPES).map(([k,p])=>[k,p.pic+" "+p.lbl])])}</label>${fClasse()}${fPeriode()}</div>`;
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
  const filters=`<div class="filters"><label>Partie ${sel("ft",adm.ft,[["all","Toutes"],...Object.entries(TYPES).map(([k,t])=>[k,t.pic+" "+t.lbl])])}</label>${fPeriode()}</div>`;
  if(loadState!=="ok") return `<div class="panel">${filters}<div class="empty">${stateMsg()}</div></div>`;
  const all=filteredFamilles(false), list=filteredFamilles();
  const sat=all.filter(r=>r.type==="satisfaction");
  const pctSat=arr=>{const v=arr.filter(x=>x>0);return v.length?Math.round(v.filter(x=>x>=3).length/v.length*100):null;};
  const glob=pctSat(sat.map(r=>r.global||0));
  const reco=RECO.map(([id,e,l])=>({id,e,l,c:sat.filter(r=>r.recommande===id).length})); const rt=reco.reduce((a,b)=>a+b.c,0);
  const stack=vals=>{const v=vals.filter(x=>x>0),n=v.length; if(!n) return `<div class="stack"></div>`;
    return `<div class="stack">${[4,3,2,1].map(k=>{const c=v.filter(x=>x===k).length;return c?`<div style="width:${c/n*100}%;background:${NOTE_COL[k]}" title="${NOTES.find(x=>x[0]===k)[2]} : ${c}"></div>`:""}).join("")}</div>`;};
  const rows=[["global","Satisfaction générale",sat.map(r=>r.global||0)],...ITEMS.map(([id,l])=>[id,l,sat.map(r=>(r.notes||{})[id]||0)])];
  const satHtml=sat.length?`<div class="fam-legend">${NOTES.map(([v,e,l])=>`<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${NOTE_COL[v]};vertical-align:-1px"></span> ${l}</span>`).join("")}<span>% = part de satisfaits (sans compter « sans avis »)</span></div>
    <div class="rank">${rows.map(([id,l,v])=>{const p=pctSat(v);return `<div class="srow"><span style="${id==="global"?"font-weight:700":""}">${esc(l)}</span>${stack(v)}<span class="v">${p===null?"–":p+" %"}</span></div>`}).join("")}</div>`
    :`<div class="empty">Pas encore de questionnaire de satisfaction.</div>`;
  const tc={}; all.filter(r=>r.type==="amelioration").forEach(r=>(r.tags||[]).forEach(t=>tc[t]=(tc[t]||0)+1));
  const nAm=all.filter(r=>r.type==="amelioration").length;
  const tagHtml=rankHtml(Object.entries(tc).sort((a,b)=>b[1]-a[1]),nAm||1,id=>{const t=TAGS.find(x=>x[0]===id)||["","•",id];return {e:t[1],l:t[2]};},"var(--peri)")||`<div class="empty">Pas encore de proposition d'amélioration.</div>`;
  const tps={}; sat.concat(all.filter(r=>r.type==="amelioration")).forEach(r=>(r.temps||[]).forEach(t=>tps[t]=(tps[t]||0)+1));
  const withText=list.filter(r=>r.texte||r.idees||r.savoir||r.contact);
  const card=r=>{const T=TYPES[r.type]||TYPES.libre;
    const tl=(r.temps||[]).map(t=>(TEMPS.find(x=>x[0]===t)||[0,"",t])[2]).join(", ");
    return `<article class="pcard">
      <div class="meta"><span class="pill" style="background:${T.col}">${T.pic} ${esc(T.lbl)}</span>${fdate(r.at)}${r.global?` · ${NOTES.find(x=>x[0]===r.global)[1]}`:""}</div>
      ${tl||(r.niveaux||[]).length?`<div class="meta">${esc(tl)}${(r.niveaux||[]).length?` · ${esc(r.niveaux.join(", "))}`:""}</div>`:""}
      ${(r.tags||[]).length?`<div class="tg">${r.tags.map(t=>{const x=TAGS.find(y=>y[0]===t)||["","•",t];return `<span>${x[1]} ${esc(x[2])}</span>`}).join("")}</div>`:""}
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
      <code style="overflow-wrap:anywhere">${esc(famUrl)}</code><div class="tabs"><button class="btn" id="copyFam" data-url="${esc(famUrl)}">Copier le lien</button><a class="btn" href="familles.html" target="_blank" rel="noopener">Ouvrir</a></div>
      <small class="muted">Le QR code peut être imprimé sur une affiche : clic droit sur l'image › Enregistrer.</small></div></div></div>
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
  const table=adm.tab==="par"?"paroles":adm.tab==="fam"?"familles":"envies";
  const list=table==="paroles"?filteredParoles():table==="familles"?filteredFamilles():filteredVotes(); adm.confirm=false;
  toast("Effacement en cours…"); render();
  const ok=await deleteIds(table,list.map(v=>v.id));
  toast(ok+" effacées."); loadAll();
}
async function loadConfig(){
  if(!sb) return;
  const {data,error}=await sb.from("reglages").select("data").eq("id",1).maybeSingle();
  if(!error&&data?.data){ config={added:{peri:[],mer:[],midi:[]},hidden:[],...data.data}; if(["choix","adm"].includes(s.view)) render(); }
}

/* ---------------- Événements ---------------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,[data-toggle]"); if(!t) return;
  const d=t.dataset;
  if(t.id==="voiceBtn"){voice=!voice;try{localStorage.setItem("envies-voice",voice?"on":"off")}catch(_){ } if(!voice)try{speechSynthesis.cancel()}catch(_){ } render();return;}
  if(t.id==="adultBtn"){ if(s.view.startsWith("adm")){ logout(); go("accueil"); } else {adm.err="";acc.msg="";acc.mode="login";s.view="adm-login";render();} return;}
  if(t.id==="logout"){ logout(); go("accueil"); toast("Déconnecté."); return; }
  if(t.id==="refresh"){ loadAll(); loadTeam(); return; }
  if(t.id==="switchMode"){ acc.mode=acc.mode==="signup"?"login":"signup"; adm.err=""; acc.msg=""; render(); return; }
  if(d.valider){ sb.rpc("valider_animateur",{uid:d.valider}).then(({error})=>{toast(error?"Validation impossible.":"Compte validé.");loadTeam();}); return; }
  if(d.refuser){ sb.rpc("refuser_compte",{uid:d.refuser}).then(({error})=>{toast(error?"Refus impossible.":"Compte supprimé.");loadTeam();}); return; }
  if(t.id==="savePass"){ const v=$("#newpass").value; if(v.length<8){toast("8 caractères minimum.");return;}
    sb.auth.updateUser({password:v}).then(({error})=>{ toast(error?"Mot de passe non changé : "+error.message:"Mot de passe changé."); if(!error) $("#newpass").value=""; }); return; }
  if(t.id==="copyFam"){ navigator.clipboard?.writeText(d.url).then(()=>toast("Lien copié."),()=>toast("Copie impossible : sélectionnez le lien à la main.")); return; }
  if(d.say){ say(d.say,true); return;}
  if(d.classe){s.classe=d.classe; go("hub"); return;}
  if(d.moment){s.moment=d.moment; s.choix=[]; go("choix"); return;}
  if(d.act){const i=s.choix.indexOf(d.act);
    if(i>=0) s.choix.splice(i,1);
    else if(s.choix.length>=MAXCHOIX){ say("Tu as déjà choisi trois activités. Enlève-en une pour changer."); toast(`Tu as déjà ${MAXCHOIX} choix. Touche-en un pour l'enlever.`); return;}
    else {s.choix.push(d.act); say(actById(d.act).l);}
    render(); return;}
  if(d.mood){s.humeur=s.humeur===d.mood?null:d.mood; if(s.humeur) say(MOODS.find(x=>x.id===d.mood).lbl); render(); return;}
  if(d.tag){const i=s.tags.indexOf(d.tag); if(i>=0) s.tags.splice(i,1); else {s.tags.push(d.tag); say(tagById(s.view,d.tag).l);} render(); return;}
  if(d.pmoment){s.pmoment=s.pmoment===d.pmoment?null:d.pmoment; if(s.pmoment) say(momentLbl(s.pmoment)); render(); return;}
  if(d.pen){pen=d.pen; render(); return;}
  if(t.id==="clearDraw"){s.dessin=null; render(); return;}
  if(d.go){go(d.go);return;}
  if(t.id==="send"){sendEnvies();return;}
  if(t.id==="sendP"){sendParole();return;}
  if(d.tab){adm.tab=d.tab;adm.confirm=false;adm.delp=null;if(d.tab==="set")loadTeam();render();return;}
  if(t.id==="askDel"){adm.confirm=true;render();return;}
  if(t.id==="noDel"){adm.confirm=false;render();return;}
  if(t.id==="doDel"){deleteFiltered();return;}
  if(d.delp){adm.delp=d.delp;render();return;}
  if(d.delno){adm.delp=null;render();return;}
  if(d.delok){const id=d.delok; adm.delp=null; deleteIds(adm.tab==="fam"?"familles":"paroles",[id]).then(n=>{toast(n?"Effacé.":"Pas effacé. Réessaie.");loadAll();}); return;}
  if(d.remove){e.stopPropagation(); const added={...config.added}; for(const m in added) added[m]=(added[m]||[]).filter(a=>a.id!==d.remove); saveConfig({added,hidden:(config.hidden||[]).filter(h=>h!==d.remove)}); return;}
  if(d.toggle){const h=new Set(config.hidden||[]); h.has(d.toggle)?h.delete(d.toggle):h.add(d.toggle); saveConfig({hidden:[...h]}); return;}
  if(d.add){const m=d.add,l=$("#l-"+m).value.trim(),em=$("#e-"+m).value.trim()||"⭐"; if(!l){toast("Écris le nom de l'activité.");return;}
    const added={peri:[],mer:[],midi:[],...config.added}; added[m]=[...(added[m]||[]),{id:m+":c"+Date.now().toString(36),e:em,l:l.slice(0,40)}]; saveConfig({added}); return;}
});
document.addEventListener("keydown",e=>{ if((e.key==="Enter"||e.key===" ")&&e.target.dataset?.toggle){e.preventDefault();e.target.click();} });
document.addEventListener("change",e=>{ if(["fm","fc","fp","pt","ft"].includes(e.target.id)){adm[e.target.id]=e.target.value;adm.confirm=false;render();} });
window.addEventListener("online",flushQueue);

/* ---------------- Démarrage ---------------- */
if(CFG.nomCentre){ const t=`Mes envies à ${CFG.nomCentre}`; $("#appTitle").textContent=t; document.title=t; }
if(!configured){ const b=$("#setupBanner"); b.hidden=false; b.textContent="L'appli n'est pas encore reliée à Supabase : les réponses restent sur cette tablette en attendant. Remplis le fichier config.js (voir le README)."; }
render(); showQueue();
loadConfig(); flushQueue(); setInterval(flushQueue,60000);
