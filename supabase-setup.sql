-- =====================================================================
-- Mes Envies au Centre : création de la base Supabase
-- À coller en entier dans Supabase > SQL Editor > New query, puis "Run".
-- On peut le relancer sans risque : il ne supprime aucune réponse.
-- =====================================================================

-- 1. Les envies d'activités
create table if not exists public.envies (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  classe     text not null check (classe in ('PS','MS','GS','CP','CE1','CE2','CM1','CM2')),
  cycle      text not null check (cycle in ('mat','elem')),
  moment     text not null check (moment in ('peri','mer','midi')),
  activites  text[] not null check (cardinality(activites) between 1 and 3),
  humeur     text check (humeur in ('top','bof','non'))
);

-- 2. Les paroles : "J'améliore le centre", "J'aimerais découvrir", "Je m'exprime"
create table if not exists public.paroles (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type       text not null check (type in ('ameliorer','explorer','libre')),
  classe     text not null check (classe in ('PS','MS','GS','CP','CE1','CE2','CM1','CM2')),
  cycle      text not null check (cycle in ('mat','elem')),
  tags       text[] not null default '{}' check (cardinality(tags) <= 20),
  texte      text not null default '' check (char_length(texte) <= 500),
  moment     text check (moment in ('peri','mer','midi','tous')),
  dessin     text check (dessin is null or (char_length(dessin) <= 400000 and dessin like 'data:image/jpeg;base64,%'))
);

-- 3. Les réglages (activités ajoutées ou cachées par les animateurs)
create table if not exists public.reglages (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.reglages (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- 4. Sécurité : qui a le droit de faire quoi
--    anon          = la tablette des enfants (sans connexion) : peut seulement AJOUTER une réponse
--    authenticated = un animateur connecté : peut lire, effacer, et changer les réglages
alter table public.envies   enable row level security;
alter table public.paroles  enable row level security;
alter table public.reglages enable row level security;

revoke all on public.envies, public.paroles, public.reglages from anon, authenticated;
grant insert          on public.envies, public.paroles to anon, authenticated;
grant select, delete  on public.envies, public.paroles to authenticated;
grant select          on public.reglages to anon, authenticated;
grant update          on public.reglages to authenticated;

drop policy if exists "enfants ajoutent des envies"     on public.envies;
drop policy if exists "animateurs lisent les envies"    on public.envies;
drop policy if exists "animateurs effacent les envies"  on public.envies;
create policy "enfants ajoutent des envies"    on public.envies for insert to anon, authenticated with check (true);
create policy "animateurs lisent les envies"   on public.envies for select to authenticated using (true);
create policy "animateurs effacent les envies" on public.envies for delete to authenticated using (true);

drop policy if exists "enfants ajoutent des paroles"     on public.paroles;
drop policy if exists "animateurs lisent les paroles"    on public.paroles;
drop policy if exists "animateurs effacent les paroles"  on public.paroles;
create policy "enfants ajoutent des paroles"    on public.paroles for insert to anon, authenticated with check (true);
create policy "animateurs lisent les paroles"   on public.paroles for select to authenticated using (true);
create policy "animateurs effacent les paroles" on public.paroles for delete to authenticated using (true);

drop policy if exists "tout le monde lit les réglages"      on public.reglages;
drop policy if exists "animateurs modifient les réglages"   on public.reglages;
create policy "tout le monde lit les réglages"    on public.reglages for select to anon, authenticated using (true);
create policy "animateurs modifient les réglages" on public.reglages for update to authenticated using (true) with check (true);

create index if not exists envies_created_at_idx  on public.envies  (created_at desc);
create index if not exists paroles_created_at_idx on public.paroles (created_at desc);

-- =====================================================================
-- 5. Espace familles (questionnaire de satisfaction, améliorations, expression libre)
-- =====================================================================
create table if not exists public.familles (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null check (type in ('satisfaction','amelioration','libre')),
  temps       text[] not null default '{}' check (cardinality(temps) <= 6),
  niveaux     text[] not null default '{}' check (cardinality(niveaux) <= 8),
  notes       jsonb not null default '{}'::jsonb check (jsonb_typeof(notes) = 'object' and octet_length(notes::text) <= 2000),
  global      int check (global between 1 and 4),
  recommande  text check (recommande in ('oui','peutetre','non')),
  tags        text[] not null default '{}' check (cardinality(tags) <= 20),
  texte       text not null default '' check (char_length(texte) <= 2000),
  idees       text not null default '' check (char_length(idees) <= 1000),
  savoir      text not null default '' check (char_length(savoir) <= 500),
  contact     text not null default '' check (char_length(contact) <= 200)
);

alter table public.familles enable row level security;
revoke all on public.familles from anon, authenticated;
grant insert         on public.familles to anon, authenticated;
grant select, delete on public.familles to authenticated;

drop policy if exists "familles envoient"            on public.familles;
drop policy if exists "animateurs lisent familles"   on public.familles;
drop policy if exists "animateurs effacent familles" on public.familles;
create policy "familles envoient"            on public.familles for insert to anon, authenticated with check (true);
create policy "animateurs lisent familles"   on public.familles for select to authenticated using (true);
create policy "animateurs effacent familles" on public.familles for delete to authenticated using (true);

create index if not exists familles_created_at_idx on public.familles (created_at desc);

-- =====================================================================
-- 6. Animateurs validés : seuls les comptes de cette liste lisent les réponses.
--    (Un compte créé depuis l'appli doit être validé par un animateur, onglet Aide.)
-- =====================================================================
create table if not exists public.animateurs (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);
alter table public.animateurs enable row level security;
revoke all on public.animateurs from anon, authenticated;

create or replace function public.is_animateur()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.animateurs a where a.user_id = auth.uid()) $$;
revoke all on function public.is_animateur() from public, anon;
grant execute on function public.is_animateur() to authenticated;

grant select on public.animateurs to authenticated;
drop policy if exists "animateurs voient la liste" on public.animateurs;
create policy "animateurs voient la liste" on public.animateurs for select to authenticated using (public.is_animateur());

drop policy if exists "animateurs lisent les envies"    on public.envies;
drop policy if exists "animateurs effacent les envies"  on public.envies;
create policy "animateurs lisent les envies"   on public.envies for select to authenticated using (public.is_animateur());
create policy "animateurs effacent les envies" on public.envies for delete to authenticated using (public.is_animateur());
drop policy if exists "animateurs lisent les paroles"   on public.paroles;
drop policy if exists "animateurs effacent les paroles" on public.paroles;
create policy "animateurs lisent les paroles"   on public.paroles for select to authenticated using (public.is_animateur());
create policy "animateurs effacent les paroles" on public.paroles for delete to authenticated using (public.is_animateur());
drop policy if exists "animateurs lisent familles"   on public.familles;
drop policy if exists "animateurs effacent familles" on public.familles;
create policy "animateurs lisent familles"   on public.familles for select to authenticated using (public.is_animateur());
create policy "animateurs effacent familles" on public.familles for delete to authenticated using (public.is_animateur());
drop policy if exists "animateurs modifient les réglages" on public.reglages;
create policy "animateurs modifient les réglages" on public.reglages for update to authenticated using (public.is_animateur()) with check (public.is_animateur());

create or replace function public.comptes_en_attente()
returns table (id uuid, email text, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_animateur() then raise exception 'réservé aux animateurs'; end if;
  return query select u.id, u.email::text, u.created_at from auth.users u
    where not exists (select 1 from public.animateurs a where a.user_id = u.id) order by u.created_at desc;
end $$;

create or replace function public.valider_animateur(uid uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_animateur() then raise exception 'réservé aux animateurs'; end if;
  insert into public.animateurs (user_id, email) select u.id, u.email from auth.users u where u.id = uid
  on conflict (user_id) do nothing;
end $$;

create or replace function public.refuser_compte(uid uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_animateur() then raise exception 'réservé aux animateurs'; end if;
  if uid = auth.uid() then raise exception 'impossible de se retirer soi-même'; end if;
  delete from auth.users u where u.id = uid;
end $$;

revoke all on function public.comptes_en_attente(), public.valider_animateur(uuid), public.refuser_compte(uuid) from public, anon;
grant execute on function public.comptes_en_attente(), public.valider_animateur(uuid), public.refuser_compte(uuid) to authenticated;

-- Le tout premier animateur s'ajoute à la main, après avoir créé son compte :
-- insert into public.animateurs (user_id, email) select id, email from auth.users where email = 'VOTRE@EMAIL';

-- =====================================================================
-- 7. Activité « Autre chose » : l'enfant précise laquelle
-- =====================================================================
alter table public.envies add column if not exists autre text not null default '' check (char_length(autre) <= 200);

-- =====================================================================
-- 8. Familles : précisions des choix « Autre » (temps, critère de satisfaction, thème)
-- =====================================================================
alter table public.familles add column if not exists precisions jsonb not null default '{}'::jsonb
  check (jsonb_typeof(precisions) = 'object' and octet_length(precisions::text) <= 600);

-- =====================================================================
-- 9. Espace émotions des enfants
--    Le prénom n'est demandé que si l'enfant veut parler à un animateur ;
--    il est effacé quand l'animateur clique « C'est fait ».
-- =====================================================================
create table if not exists public.emotions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  classe      text not null check (classe in ('PS','MS','GS','CP','CE1','CE2','CM1','CM2')),
  cycle       text not null check (cycle in ('mat','elem')),
  emotion     text not null check (emotion in ('joie','tristesse','colere','peur','surprise','degout','calme','fierte','fatigue')),
  intensite   smallint check (intensite in (1,2)),
  causes      text[] not null default '{}' check (cardinality(causes) <= 10),
  cause_autre text not null default '' check (char_length(cause_autre) <= 120),
  parler      boolean not null default false,
  prenom      text not null default '' check (char_length(prenom) <= 40),
  texte       text not null default '' check (char_length(texte) <= 300),
  traite      boolean not null default false
);
alter table public.emotions enable row level security;
revoke all on public.emotions from anon, authenticated;
grant insert on public.emotions to anon, authenticated;
grant select, delete on public.emotions to authenticated;
grant update (traite, prenom) on public.emotions to authenticated;
drop policy if exists "enfants envoient emotions"     on public.emotions;
drop policy if exists "animateurs lisent emotions"    on public.emotions;
drop policy if exists "animateurs effacent emotions"  on public.emotions;
drop policy if exists "animateurs traitent emotions"  on public.emotions;
create policy "enfants envoient emotions"    on public.emotions for insert to anon, authenticated with check (traite = false);
create policy "animateurs lisent emotions"   on public.emotions for select to authenticated using (public.is_animateur());
create policy "animateurs effacent emotions" on public.emotions for delete to authenticated using (public.is_animateur());
create policy "animateurs traitent emotions" on public.emotions for update to authenticated using (public.is_animateur()) with check (public.is_animateur());
create index if not exists emotions_created_at_idx on public.emotions (created_at desc);
