/* Espace familles : questionnaire de satisfaction, améliorations et idées, expression libre. */
const {TEMPS,NIVEAUX,ITEMS,NOTES,RECO,TAGS,TYPES}=window.FAM;
const CFG=window.ENVIES_CONFIG||{};
const sb=(CFG.supabaseUrl&&CFG.supabaseKey&&window.supabase)?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{persistSession:false}}):null;
const $=(q,el=document)=>el.querySelector(q);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,3500);}

const blank=()=>({temps:[],niveaux:[],notes:{},global:null,recommande:null,tags:[],texte:"",idees:"",savoir:"",contact:"",prec:{temps:"",critere:"",theme:""}});
let f=blank(), view="accueil", busy=false;
let famConf={}, confLoaded=false;
const open=k=>CAL.isOpen(famConf.ouvertures,"fam_"+k);
const VIEWS=["accueil","satisfaction","amelioration","libre","merci"];

function chips(name,list,selected,multi=true){
  return `<div class="mini">${list.map(([id,e,l])=>`<button type="button" class="chip" data-chip="${name}" data-v="${esc(id)}" data-multi="${multi}" aria-pressed="${multi?selected.includes(id):selected===id}">${e?e+" ":""}${esc(l)}</button>`).join("")}</div>`;
}
const field=(id,label,hint,max,ph,rows)=>`<div class="idea"><label for="${id}">${label}</label>${hint?`<small>${hint}</small>`:""}<textarea id="${id}" data-field="${id}" maxlength="${max}" placeholder="${esc(ph)}" ${rows?`style="min-height:${rows}px"`:""}>${esc(f[id])}</textarea></div>`;
const contactBlock=()=>`<div class="idea fam-contact"><label for="contact">Vous souhaitez une réponse ? <span class="muted">(facultatif)</span></label>
  <small>Laissez un e-mail ou un téléphone. Il servira uniquement à vous répondre. Laissez vide pour rester anonyme.</small>
  <input id="contact" data-field="contact" maxlength="200" autocomplete="email" value="${esc(f.contact)}" placeholder="exemple@mail.fr ou 06…"></div>`;
const prec=(k,label,ph)=>`<label class="prec" for="prec-${k}"><span>${label}</span><input id="prec-${k}" data-prec="${k}" maxlength="120" value="${esc(f.prec[k])}" placeholder="${esc(ph)}"></label>`;
const context=()=>`<div class="idea"><span class="lab">Votre enfant vient au centre :</span>${chips("temps",TEMPS,f.temps)}
  ${f.temps.includes("autre")?prec("temps","Précisez :","Par exemple : les vacances scolaires"):""}</div>
  <div class="idea"><span class="lab">Sa classe <span class="muted" style="font-weight:400">(facultatif, plusieurs choix si vous avez plusieurs enfants)</span></span>${chips("niveaux",NIVEAUX.map(n=>[n,"",n]),f.niveaux)}</div>`;

function render(){
  const app=$("#app");
  if(view==="accueil"){
    const door=(k,cls,sub)=>`<a class="big door ${cls}" href="#${k}"><span class="pic" aria-hidden="true">${TYPES[k].pic}</span><span class="lbl">${TYPES[k].lbl}</span><span class="sub">${sub}</span></a>`;
    app.innerHTML=`<div class="wrap">
      <div class="fam-intro"><h2>Bonjour !</h2><p>Votre avis nous aide à améliorer l'accueil de vos enfants au périscolaire, le mercredi et à la pause du midi. Cela prend 2 à 5 minutes.</p></div>
      ${!confLoaded?`<div class="empty">Chargement…</div>`:["satisfaction","amelioration","libre"].some(open)?`<div class="grid hub">
        ${open("satisfaction")?door("satisfaction","env","Le questionnaire : notez ce qui vous plaît, ou moins"):""}
        ${open("amelioration")?door("amelioration","ame","Vos propositions, vos idées d'activités"):""}
        ${open("libre")?door("libre","lib","Dites-nous ce que vous voulez"):""}
      </div>`:`<div class="fam-intro"><h2>Merci de votre visite !</h2><p>Les questionnaires sont fermés pour le moment.${(()=>{const n=["satisfaction","amelioration","libre"].map(k=>CAL.nextOpen(famConf.ouvertures,"fam_"+k)).filter(Boolean).sort()[0];return n?` Ils rouvriront le <b>${CAL.fmt(n)}</b>.`:" Revenez bientôt.";})()}</p></div>`}
      ${document.referrer.includes("index.html")||new URLSearchParams(location.search).has("app")?`<div><a class="back" href="index.html">← Accueil (Enfants / Familles)</a></div>`:""}</div>`;
    return;
  }
  if(view==="merci"){
    app.innerHTML=`<div class="merci"><div class="pic" aria-hidden="true">💐</div><h2>Merci !</h2>
      <p style="font-size:1.2rem;max-width:34ch">Votre avis a bien été envoyé à l'équipe d'animation.</p>
      <div class="row"><a class="go" href="#accueil">Donner un autre avis</a></div></div>`;
    return;
  }
  if(confLoaded&&!open(view)){ location.hash="accueil"; return; }
  const T=TYPES[view];
  let body="";
  if(view==="satisfaction"){
    body=`${context()}
      <div class="panel fam-grid"><h3>Êtes-vous satisfait de…</h3>
        <div class="fam-legend">${NOTES.map(([v,e,l])=>`<span>${e} ${l}</span>`).join("")}<span>— Sans avis</span></div>
        ${ITEMS.map(([id,l])=>`<div class="fam-row"><span class="fam-q">${esc(l)}</span><div class="fam-faces" role="group" aria-label="${esc(l)}">
          ${NOTES.map(([v,e,lab])=>`<button type="button" class="face" data-note="${id}" data-v="${v}" aria-pressed="${f.notes[id]===v}" aria-label="${lab}" title="${lab}">${e}</button>`).join("")}
          <button type="button" class="face na" data-note="${id}" data-v="0" aria-pressed="${f.notes[id]===0}" aria-label="Sans avis" title="Sans avis">—</button></div></div>`).join("")}
        <div class="fam-row"><span class="fam-q"><label for="prec-critere" style="display:block">➕ Autre chose ? <span class="muted" style="font-weight:400">(facultatif)</span></label>
          <input id="prec-critere" data-prec="critere" maxlength="120" value="${esc(f.prec.critere)}" placeholder="Précisez : par exemple, les goûters" style="width:100%;margin-top:6px;border-width:2px;padding:8px 10px"></span>
          <div class="fam-faces" role="group" aria-label="Note pour l'autre point">${NOTES.map(([v,e,lab])=>`<button type="button" class="face" data-note="autre" data-v="${v}" aria-pressed="${f.notes.autre===v}" aria-label="${lab}" title="${lab}">${e}</button>`).join("")}</div></div>
      </div>
      <div class="idea"><span class="lab">Dans l'ensemble, êtes-vous satisfait du centre ?</span>
        <div class="mini">${NOTES.map(([v,e,l])=>`<button type="button" class="chip" data-global="${v}" aria-pressed="${f.global===v}">${e} ${l}</button>`).join("")}</div></div>
      <div class="idea"><span class="lab">Recommanderiez-vous le centre à d'autres familles ?</span>${chips("recommande",RECO,f.recommande,false)}</div>
      ${field("texte","Un commentaire ?","",2000,"Ce qui vous plaît, ce qui pourrait aller mieux…")}`;
  }
  if(view==="amelioration"){
    body=`${context()}
      <div class="idea"><span class="lab">Sur quoi aimeriez-vous des améliorations ?</span>${chips("tags",TAGS,f.tags)}
        ${f.tags.includes("autre")?prec("theme","Précisez :","Par exemple : l'accueil du matin"):""}</div>
      ${field("texte","Vos propositions d'amélioration","Soyez aussi précis que possible : cela nous aide à agir.",2000,"Par exemple : recevoir le programme du mercredi une semaine à l'avance")}
      ${field("idees","Des idées d'activités, de sorties ou de projets ?","",1000,"Par exemple : un atelier jardinage, une sortie à la ferme…",90)}
      ${field("savoir","Vous avez un savoir-faire ou une passion à partager avec les enfants ?","Musique, cuisine, métier, sport… Laissez vos coordonnées plus bas si vous voulez qu'on vous recontacte.",500,"Par exemple : je suis apiculteur",80)}
      ${contactBlock()}`;
  }
  if(view==="libre"){
    body=`${field("texte","Votre message","Une remarque, un remerciement, une inquiétude, une question… Écrivez librement.",2000,"Écrivez ici",180)}${contactBlock()}`;
  }
  app.innerHTML=`<div class="wrap"><div class="crumbs"><a class="chip" href="#accueil">← Espace familles</a></div>
    <div class="q"><div><h2>${T.pic} ${T.lbl}</h2></div></div>${body}
    <div class="bar"><a class="back" href="#accueil">Annuler</a><button class="go" id="send" ${busy?"disabled":""}>${busy?"Envoi…":"Envoyer"}</button></div></div>`;
}

function valid(){
  if(view==="satisfaction") return f.global||Object.keys(f.notes).length||f.texte.trim()?"":"Répondez à au moins une question avant d'envoyer.";
  if(view==="amelioration") return f.tags.length||f.texte.trim()||f.idees.trim()||f.savoir.trim()?"":"Choisissez un thème ou écrivez une proposition avant d'envoyer.";
  if(view==="libre") return f.texte.trim()?"":"Écrivez votre message avant d'envoyer.";
  return "";
}
function precisions(){
  const o={}, t=v=>(v||"").trim().slice(0,120);
  if(view!=="libre"&&f.temps.includes("autre")&&t(f.prec.temps)) o.temps=t(f.prec.temps);
  if(view==="satisfaction"&&t(f.prec.critere)) o.critere=t(f.prec.critere);
  if(view==="amelioration"&&f.tags.includes("autre")&&t(f.prec.theme)) o.theme=t(f.prec.theme);
  return o;
}
async function send(){
  const err=valid(); if(err){toast(err);return;}
  if(!sb){toast("L'envoi n'est pas encore possible : l'appli n'est pas reliée à sa base de données.");return;}
  const row={type:view,temps:view==="libre"?[]:f.temps,niveaux:view==="libre"?[]:f.niveaux,
    notes:view==="satisfaction"?Object.fromEntries(Object.entries(f.notes).filter(([k])=>k!=="autre"||(f.prec.critere||"").trim())):{},global:view==="satisfaction"?f.global:null,recommande:view==="satisfaction"?f.recommande:null,
    tags:view==="amelioration"?f.tags:[],texte:f.texte.trim().slice(0,2000),
    idees:view==="amelioration"?f.idees.trim().slice(0,1000):"",savoir:view==="amelioration"?f.savoir.trim().slice(0,500):"",
    contact:view==="satisfaction"?"":f.contact.trim().slice(0,200),precisions:precisions()};
  busy=true; render();
  const {error}=await sb.from("familles").insert(row);
  busy=false;
  if(error){ render(); toast(!navigator.onLine||/fetch|network/i.test(error.message||"")?"Pas de connexion internet. Vos réponses sont gardées sur cette page : réessayez dans un instant.":"L'envoi a été refusé. Réessayez ou parlez-en à l'équipe."); return; }
  f=blank(); location.hash="merci"; window.scrollTo({top:0});
}

document.addEventListener("click",e=>{
  const t=e.target.closest("button"); if(!t) return;
  const d=t.dataset;
  if(d.chip){const k=d.chip;
    if(d.multi==="true"){const a=f[k],i=a.indexOf(d.v); i>=0?a.splice(i,1):a.push(d.v);} else f[k]=f[k]===d.v?null:d.v;
    render(); return;}
  if(d.note){const v=+d.v; if(f.notes[d.note]===v) delete f.notes[d.note]; else f.notes[d.note]=v; render(); return;}
  if(d.global){const v=+d.global; f.global=f.global===v?null:v; render(); return;}
  if(t.id==="send"){send();return;}
});
document.addEventListener("input",e=>{ const k=e.target.dataset?.field; if(k) f[k]=e.target.value; const pk=e.target.dataset?.prec; if(pk) f.prec[pk]=e.target.value; });
function route(){ const h=location.hash.slice(1); view=VIEWS.includes(h)?h:"accueil"; render(); window.scrollTo({top:0}); }
window.addEventListener("hashchange",route);

if(CFG.nomCentre){ const t=`Espace familles · ${CFG.nomCentre}`; $("#famTitle").textContent=t; document.title=t; }
if(!sb){ const b=$("#setupBanner"); b.hidden=false; b.textContent="L'appli n'est pas encore reliée à sa base de données (fichier config.js)."; }
route();
if(sb) sb.from("reglages").select("data").eq("id",1).maybeSingle().then(({data})=>{ famConf=data?.data||{}; confLoaded=true; route(); },()=>{ confLoaded=true; route(); });
else confLoaded=true;
