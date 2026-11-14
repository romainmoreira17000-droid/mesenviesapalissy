# Ma parole compte ! (mesenviesapalissy)

## But
App du centre de loisirs Palissy (La Rochelle) pour recueillir la parole des enfants (PS → CM2) et des familles :
envies d'activités, idées d'amélioration, découvertes, expression libre (dessin/texte), émotions, carnaval.
Réponses **anonymes**. Les animateurs validés consultent les résultats dans « Espace animateur ».

- Enfants : sur une tablette au centre (PWA « Ajouter à l'écran d'accueil »).
- Familles : `familles.html`, sur leur téléphone (lien direct ou QR code `qr-familles.svg`).
- Animateurs : connexion e-mail / mot de passe, compte validé par un autre animateur.

En ligne : https://romainmoreira17000-droid.github.io/mesenviesapalissy/

## Stack (ancien format, à respecter)
- HTML + JS vanilla, **sans build ni npm** : `index.html`, `app.js`, `style.css`. Pas de React, pas de Vite.
- Ne pas réécrire dans la stack standard sans demande explicite de Romain.
- Librairies copiées dans `vendor/` (supabase-js 2.118.0, qrcode).
- Pas de service worker. Le cache est cassé par les paramètres `?v=...` dans `index.html` : **les changer à chaque modif de JS/CSS**.
- Audio pré-enregistré dans `audio/` (voix Piper « siwis », CC-BY 4.0), nommé par hash du texte.

## Structure
- `index.html`, `app.js`, `style.css` : app enfants + espace animateur
- `familles.html`, `familles.js`, `familles-data.js` : espace familles (questions et listes dans `familles-data.js`)
- `config.js` : nom du centre, URL Supabase, clé **publishable** (publique par conception)
- `img/` (illustrations webp, `img/act/` activités, `img/carn/` carnaval), `audio/`, `vendor/`
- `supabase-*.sql` : schéma et droits, à coller à la main dans Supabase › SQL Editor (pas de dossier `supabase/migrations`)
- `affiche-familles.html/.pdf` : affiche à imprimer
- `.github/workflows/entretien.yml` : visite quotidienne de la base (anti-pause) + RPC `nettoyage`

## Supabase (projet `whwsyufgsxuutocskphz`)
RLS activée partout. Règle générale : `anon` **insère** seulement, les animateurs validés (`is_animateur()`) lisent et effacent.

| Table | anon | animateur validé |
|---|---|---|
| `envies`, `paroles`, `familles`, `carnaval` | insert | select, delete |
| `emotions` | insert (`traite = false`) | select, delete, update (`traite`, `prenom`) |
| `reglages` (id=1, activités ajoutées/cachées, calendrier) | select | update |
| `animateurs`, `alertes_config` | rien | via fonctions |

Fonctions : `is_animateur`, `comptes_en_attente`, `valider_animateur`, `refuser_compte`, `nettoyage`, `alerte_enfant_veut_parler` (notif ntfy sans prénom ni émotion).

Données personnelles : prénom d'un enfant seulement s'il veut parler à un animateur (effacé à « C'est fait », 7 jours max).
Conservation : émotions et coordonnées des familles 3 mois, le reste 13 mois (`supabase-nettoyage.sql`).

## Déploiement
GitHub Pages depuis la branche `main`, racine (`.nojekyll`). **Un merge sur `main` = mise en prod** (build en ~1 min).
Vérifier : `gh api repos/romainmoreira17000-droid/mesenviesapalissy/pages/builds/latest -q .status`.

## Tests
Pas de suite de tests automatisés. Vérification manuelle avec Playwright : `python -m http.server 8765` à la racine,
puis http://localhost:8765/. Attention : en local l'app parle à la **base de prod** — ne rien envoyer sans l'accord de Romain
(anon ne peut pas effacer ce qu'il envoie).

## Pièges connus
- Des commits « Aperçu (non publié) » arrivent directement sur `main` depuis un autre outil : toujours `git pull` avant de brancher.
- « Non publié » ≠ hors ligne : tout ce qui est sur `main` est servi. Les espaces se ferment via l'onglet 📅 Calendrier.
- `app.js` dépasse largement 200 lignes (ancien format) : ne pas le découper sans demande.
- Ce dépôt est **public** et GitHub Pages sert tous les fichiers, y compris ces `.md` : n'y écrire aucun secret ni donnée réelle.
