-- Alertes « Un enfant veut parler » envoyées dans les notifications de Suivi Palissy
-- (remplace les alertes ntfy). La base de Suivi Palissy ne reçoit que l'identifiant de la
-- demande ; sa fonction smart-api vérifie ici, avec alerte_a_envoyer(), que la demande est
-- réelle, récente et pas encore annoncée, et ne récupère que la classe.

alter table public.emotions add column if not exists alerte_envoyee boolean not null default false;

-- Appelée par Suivi Palissy (clé publique) : renvoie la classe à annoncer, ou rien.
-- Marque la demande comme annoncée, donc un second appel ne renvoie rien.
-- Pas plus d'une alerte par classe toutes les 2 minutes.
create or replace function public.alerte_a_envoyer(p_id uuid)
returns text language plpgsql security definer set search_path = ''
as $$
declare c text;
begin
  update public.emotions e set alerte_envoyee = true
   where e.id = p_id and e.parler and not e.alerte_envoyee and not e.traite
     and e.created_at > now() - interval '10 minutes'
     and not exists (select 1 from public.emotions o
                      where o.classe = e.classe and o.alerte_envoyee and o.id <> e.id
                        and o.created_at > now() - interval '2 minutes')
  returning e.classe into c;
  return c;
end $$;
revoke all on function public.alerte_a_envoyer(uuid) from public;
grant execute on function public.alerte_a_envoyer(uuid) to anon, authenticated;

-- Le déclencheur prévient Suivi Palissy (identifiant de la demande seulement).
create or replace function public.alerte_enfant_veut_parler()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  begin
    perform net.http_post(
      url := 'https://zkfdgxwfqdbtkvpmntdh.supabase.co/functions/v1/smart-api',
      body := jsonb_build_object('parole', new.id),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        -- clé publique (anon) de Suivi Palissy : elle ne donne aucun droit, elle passe seulement la porte d'entrée
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmRneHdmcWRidGt2cG1udGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzOTc1NjAsImV4cCI6MjEwMTk3MzU2MH0.l7n9J_dOWZDHaLPEojpIuF6tpLpe2vaTGV5Agy_ATDM',
        'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZmRneHdmcWRidGt2cG1udGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzOTc1NjAsImV4cCI6MjEwMTk3MzU2MH0.l7n9J_dOWZDHaLPEojpIuF6tpLpe2vaTGV5Agy_ATDM'));
  exception when others then
    null; -- l'alerte ne doit jamais empêcher l'enfant d'envoyer sa réponse
  end;
  return new;
end $$;
revoke all on function public.alerte_enfant_veut_parler() from public, anon, authenticated;

-- Les alertes ntfy sont arrêtées (le canal n'est plus utilisé).
update public.alertes_config set actif = false where id = 1;
