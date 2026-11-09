-- Conservation limitée des données. À coller dans Supabase > SQL Editor > New query, puis « Run ».
-- Appelée chaque jour par GitHub (fichier .github/workflows/entretien.yml) et à chaque connexion d'un animateur.
--   prénom d'un enfant : 7 jours        émotions : 3 mois
--   coordonnées des familles : 3 mois   tout le reste : 13 mois
create or replace function public.nettoyage()
returns void language sql security definer set search_path = ''
as $$
  update public.emotions set prenom = '' where prenom <> '' and created_at < now() - interval '7 days';
  delete from public.emotions where created_at < now() - interval '90 days';
  update public.familles set contact = '' where contact <> '' and created_at < now() - interval '90 days';
  delete from public.envies   where created_at < now() - interval '400 days';
  delete from public.paroles  where created_at < now() - interval '400 days';
  delete from public.familles where created_at < now() - interval '400 days';
$$;
revoke all on function public.nettoyage() from public;
grant execute on function public.nettoyage() to anon, authenticated;
