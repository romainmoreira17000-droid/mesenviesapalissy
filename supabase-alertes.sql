-- Alertes téléphone (appli ntfy) quand un enfant demande à parler à un animateur.
-- À coller dans Supabase > SQL Editor > New query, puis « Run » (après supabase-emotions.sql).
-- Le message envoyé ne contient ni prénom ni émotion : seulement la classe.
create extension if not exists pg_net with schema extensions;

create table if not exists public.alertes_config (
  id         int primary key default 1 check (id = 1),
  ntfy_topic text not null,
  actif      boolean not null default true
);
alter table public.alertes_config enable row level security;
revoke all on public.alertes_config from anon, authenticated;
grant select on public.alertes_config to authenticated;
drop policy if exists "animateurs lisent alertes" on public.alertes_config;
create policy "animateurs lisent alertes" on public.alertes_config for select to authenticated using (public.is_animateur());
-- nom de canal secret, tiré au hasard
insert into public.alertes_config (id, ntfy_topic)
values (1, 'palissy-anim-' || encode(extensions.gen_random_bytes(9), 'hex'))
on conflict (id) do nothing;

create or replace function public.alerte_enfant_veut_parler()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare cfg record;
begin
  select ntfy_topic, actif into cfg from public.alertes_config where id = 1;
  if cfg.ntfy_topic is null or not cfg.actif then return new; end if;
  begin
    perform net.http_post(
      url := 'https://ntfy.sh',
      body := jsonb_build_object(
        'topic', cfg.ntfy_topic,
        'title', 'Un enfant veut parler à un animateur',
        'message', 'Un enfant de ' || new.classe || ' demande un animateur. Ouvrez l''espace animateur, onglet Émotions.',
        'priority', 5,
        'tags', jsonb_build_array('raising_hand'),
        'click', 'https://romainmoreira17000-droid.github.io/mesenviesapalissy/'),
      headers := '{"Content-Type":"application/json"}'::jsonb);
  exception when others then
    null; -- l'alerte ne doit jamais empêcher l'enfant d'envoyer sa réponse
  end;
  return new;
end $$;
revoke all on function public.alerte_enfant_veut_parler() from public, anon, authenticated;

drop trigger if exists alerte_parler on public.emotions;
create trigger alerte_parler after insert on public.emotions
  for each row when (new.parler) execute function public.alerte_enfant_veut_parler();
