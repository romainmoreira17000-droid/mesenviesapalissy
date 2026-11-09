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
