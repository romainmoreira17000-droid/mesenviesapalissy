/* Données de l'espace familles, partagées par familles.html et l'espace animateur. */
window.FAM = {
  TEMPS: [["matin","🌅","Périscolaire du matin"],["soir","🌇","Périscolaire du soir"],["midi","🍽️","Pause du midi"],["mer","🎒","Mercredi"],["autre","➕","Autre"]],
  NIVEAUX: ["PS","MS","GS","CP","CE1","CE2","CM1","CM2"],
  ITEMS: [
    ["accueil","L'accueil et l'écoute de l'équipe"],
    ["enfant","Le plaisir de votre enfant à venir"],
    ["activites","Les activités proposées"],
    ["securite","La sécurité et le bien-être de votre enfant"],
    ["info","L'information (programmes, sorties, changements)"],
    ["repas","Le temps du repas et la pause du midi"],
    ["locaux","Les locaux et le matériel"],
    ["horaires","Les horaires"],
    ["inscriptions","Les inscriptions et les démarches"]],
  NOTES: [[4,"😄","Très satisfait"],[3,"🙂","Satisfait"],[2,"😕","Peu satisfait"],[1,"😞","Pas satisfait"]],
  NOTE_COL: {4:"var(--mer)",3:"#9BD3A8",2:"var(--peri)",1:"var(--mat)"},
  RECO: [["oui","👍","Oui"],["peutetre","🤔","Peut-être"],["non","👎","Non"]],
  TAGS: [["communication","📣","Communication"],["activites","🎨","Activités"],["sorties","🚌","Sorties"],["horaires","⏰","Horaires"],
    ["repas","🍽️","Repas"],["locaux","🏠","Locaux et matériel"],["inscriptions","📝","Inscriptions"],
    ["equipe","🤝","Échanges avec l'équipe"],["besoins","💛","Enfants à besoins particuliers"],["autre","➕","Autre"]],
  TYPES: {
    satisfaction:{pic:"⭐",lbl:"Satisfaction",col:"var(--elem)"},
    amelioration:{pic:"🔧",lbl:"Améliorations et idées",col:"var(--peri)"},
    libre:{pic:"💬",lbl:"Expression libre",col:"var(--midi)"}}
};

/* Calendrier d'ouverture des espaces (réglé par les animateurs, onglet 📅 Calendrier). */
window.CAL = {
  CATS: [["env","🎯","Mes envies d'activités","Enfants"],["ameliorer","🔧","J'améliore le centre","Enfants"],["explorer","🧭","J'aimerais découvrir","Enfants"],
    ["libre","💬","Je m'exprime","Enfants"],["fam_satisfaction","⭐","Satisfaction","Familles"],["fam_amelioration","🔧","Améliorations et idées","Familles"],["fam_libre","💬","Expression libre","Familles"]],
  today(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); },
  isOpen(ouv,cat){ const o=(ouv||{})[cat]; if(!o||o.mode!=="ferme"&&o.mode!=="dates") return true; if(o.mode==="ferme") return false;
    const t=this.today(); return (o.periodes||[]).some(p=>p.debut&&p.fin&&p.debut<=t&&t<=p.fin); },
  nextOpen(ouv,cat){ const o=(ouv||{})[cat]; if(!o||o.mode!=="dates") return null; const t=this.today();
    const f=(o.periodes||[]).filter(p=>p.debut&&p.debut>t).map(p=>p.debut).sort(); return f[0]||null; },
  fmt(d){ const [y,m,j]=d.split("-").map(Number); return new Date(y,m-1,j).toLocaleDateString("fr-FR",{day:"numeric",month:"long"}); }
};
