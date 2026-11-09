// Réglages de connexion à Supabase.
// Où les trouver : Supabase > votre projet > Project Settings > API Keys (et Data API pour l'URL).
// La clé "publishable" (ou "anon") est faite pour être publique : elle ne donne accès
// qu'à ce que le fichier supabase-setup.sql autorise (les enfants peuvent seulement AJOUTER des réponses).
// Ne mettez JAMAIS ici la clé "secret" ou "service_role".
window.ENVIES_CONFIG = {
  nomCentre: "Palissy",
  supabaseUrl: "https://whwsyufgsxuutocskphz.supabase.co",
  supabaseKey: "sb_publishable_KKXUNjH000ksLubE9KM66g_Pb19Qzns"
};
