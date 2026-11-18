-- Connexion à l'espace animateur avec un compte Suivi Palissy.
-- La fonction edge « connexion-suivi » crée un compte miroir (suivi-<id>@palissy.invalid)
-- et l'inscrit ici comme animateur, après avoir vérifié que le compte Suivi Palissy est actif.
-- Un compte miroir n'est animateur que 30 jours après sa dernière vérification :
-- un compte mis en pause ou supprimé dans Suivi Palissy perd l'accès au plus tard 30 jours après.
alter table public.animateurs add column if not exists nom text;
alter table public.animateurs add column if not exists palissy_id uuid unique;
alter table public.animateurs add column if not exists verifie_le timestamptz;

create or replace function public.is_animateur()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.animateurs a where a.user_id = auth.uid()
  and (a.palissy_id is null or a.verifie_le > now() - interval '30 days')) $$;
revoke all on function public.is_animateur() from public, anon;
grant execute on function public.is_animateur() to authenticated;
