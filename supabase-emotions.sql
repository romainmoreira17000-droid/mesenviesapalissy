-- Espace émotions : à coller dans Supabase > SQL Editor > New query, puis « Run ».
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
