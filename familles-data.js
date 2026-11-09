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
    ["inscriptions","Les inscriptions et les démarches"],
    ["tarifs","Les tarifs"]],
  NOTES: [[4,"😄","Très satisfait"],[3,"🙂","Satisfait"],[2,"😕","Peu satisfait"],[1,"😞","Pas satisfait"]],
  NOTE_COL: {4:"var(--mer)",3:"#9BD3A8",2:"var(--peri)",1:"var(--mat)"},
  RECO: [["oui","👍","Oui"],["peutetre","🤔","Peut-être"],["non","👎","Non"]],
  TAGS: [["communication","📣","Communication"],["activites","🎨","Activités"],["sorties","🚌","Sorties"],["horaires","⏰","Horaires"],
    ["repas","🍽️","Repas"],["locaux","🏠","Locaux et matériel"],["inscriptions","📝","Inscriptions"],["tarifs","💶","Tarifs"],
    ["equipe","🤝","Échanges avec l'équipe"],["besoins","💛","Enfants à besoins particuliers"],["autre","➕","Autre"]],
  TYPES: {
    satisfaction:{pic:"⭐",lbl:"Satisfaction",col:"var(--elem)"},
    amelioration:{pic:"🔧",lbl:"Améliorations et idées",col:"var(--peri)"},
    libre:{pic:"💬",lbl:"Expression libre",col:"var(--midi)"}}
};
