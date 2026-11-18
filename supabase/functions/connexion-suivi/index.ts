/* Connexion à l'espace animateur avec un compte Suivi Palissy.
   Suivi Palissy (déjà connecté) envoie son jeton de session. On vérifie auprès de
   Suivi Palissy que le compte existe et qu'il est « actif », puis on rend une clé
   à usage unique (lien magique) qui ouvre une session ici. Aucun mot de passe,
   aucun secret à copier entre les deux bases. Déployée avec verify_jwt = false :
   le jeton reçu est celui de Suivi Palissy, vérifié ci-dessous. */
const PAL_URL = "https://zkfdgxwfqdbtkvpmntdh.supabase.co";
const PAL_CLE = "sb_publishable_76NNTWzzhfIGHinkhpyAhQ_trkR8lzK";
const ORIGINES = ["https://suivieheuresagentpalissy.netlify.app", "http://localhost:4173"];
const ICI = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function cors(req: Request): Record<string, string> {
  const o = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ORIGINES.includes(o) ? o : ORIGINES[0],
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
const rep = (req: Request, status: number, corps: unknown) =>
  new Response(JSON.stringify(corps), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const admin = (chemin: string, init: RequestInit = {}) => fetch(ICI + chemin, { ...init,
  headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", ...(init.headers || {}) } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return rep(req, 405, { erreur: "methode" });
  const jeton = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!jeton) return rep(req, 401, { erreur: "pas de session Suivi Palissy" });

  /* 1. Qui est-ce, côté Suivi Palissy ? */
  const u = await fetch(PAL_URL + "/auth/v1/user", { headers: { apikey: PAL_CLE, Authorization: "Bearer " + jeton } });
  if (!u.ok) return rep(req, 401, { erreur: "session Suivi Palissy refusée" });
  const user = await u.json();
  const id = String(user?.id || "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return rep(req, 401, { erreur: "compte illisible" });

  /* 2. Compte actif ? (lu avec son propre jeton : la RLS lui montre sa ligne) */
  const p = await fetch(`${PAL_URL}/rest/v1/profils?id=eq.${id}&select=nom,statut`,
    { headers: { apikey: PAL_CLE, Authorization: "Bearer " + jeton } });
  const profil = p.ok ? (await p.json())[0] : null;
  if (!profil || profil.statut !== "actif") return rep(req, 403, { erreur: "compte Suivi Palissy non actif" });
  const nom = String(profil.nom || "").slice(0, 60);

  /* 3. Compte miroir ici (sans mot de passe, adresse qui ne reçoit rien) */
  const email = `suivi-${id}@palissy.invalid`;
  const c = await admin("/auth/v1/admin/users", { method: "POST",
    body: JSON.stringify({ email, email_confirm: true, user_metadata: { source: "suivi-palissy", nom } }) });
  if (!c.ok && c.status !== 422) return rep(req, 500, { erreur: "création du compte" });

  /* 4. Clé à usage unique */
  const g = await admin("/auth/v1/admin/generate_link", { method: "POST", body: JSON.stringify({ type: "magiclink", email }) });
  if (!g.ok) return rep(req, 500, { erreur: "clé" });
  const lien = await g.json();
  const cle = lien?.properties?.hashed_token || lien?.hashed_token;
  const uid = lien?.id || lien?.user?.id;
  if (!cle || !uid) return rep(req, 500, { erreur: "clé illisible" });

  /* 5. Animateur validé (vérifié aujourd'hui ; valable 30 jours sans nouvelle vérification) */
  const a = await admin("/rest/v1/animateurs?on_conflict=user_id", { method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: uid, email, nom, palissy_id: id, verifie_le: new Date().toISOString() }) });
  if (!a.ok) return rep(req, 500, { erreur: "validation" });

  return rep(req, 200, { cle });
});
