# Mes envies à Palissy

Application pour recueillir les envies des enfants, de la maternelle au CM2, au centre de loisirs : périscolaire, mercredi et pause du midi.

Après avoir choisi sa classe, l'enfant a 4 portes :

- 🎯 **Mes envies d'activités** : le moment, puis jusqu'à 3 activités, puis « Tu aimes venir au centre ? »
- 🔧 **J'améliore le centre** : ce que l'enfant changerait (images, moment concerné, explication)
- 🧭 **J'aimerais découvrir** : ce que l'enfant voudrait essayer
- 💬 **Je m'exprime** : un dessin au doigt et/ou un texte libre

Le bouton 🔊 lit les questions à voix haute pour les maternelles. Les réponses sont **anonymes**.

**Espace familles** (`familles.html`) : les parents répondent depuis leur téléphone, sans compte, à un questionnaire de satisfaction, proposent des améliorations et des idées, ou s'expriment librement. On y accède par le bouton « 👪 Espace familles » de l'accueil, ou par son lien direct (et le QR code `qr-familles.svg`) à envoyer aux familles :
https://romainmoreira17000-droid.github.io/mesenviesapalissy/familles.html

Les animateurs se connectent dans **Espace animateur** pour voir les résultats, filtrer par moment, classe et période, et gérer la liste des activités.

## Adresse de l'appli

https://romainmoreira17000-droid.github.io/mesenviesapalissy/

## Mise en route (une seule fois)

La base Supabase **mesenviesapalissy** est déjà créée et reliée (fichier `config.js`).

1. **Activer GitHub Pages** : sur GitHub, ouvrez le dépôt, puis Settings › Pages. Sous « Branch », choisissez `main` et `/ (root)`, puis Save. Attendez 1 à 2 minutes.
2. **Bloquer les inscriptions** (important) : dans Supabase, ouvrez le projet *mesenviesapalissy*, puis Authentication › Sign In / Providers. Désactivez **« Allow new users to sign up »** et enregistrez. Sans ça, n'importe qui pourrait se créer un compte et lire les réponses.
3. **Créer le compte animateur** : dans Supabase, ouvrez Authentication › Users › Add user › Create new user. Saisissez l'e-mail et le mot de passe, cochez **Auto Confirm User**, puis validez. Faites de même pour chaque collègue.
4. Sur la tablette, ouvrez l'adresse de l'appli, puis « Ajouter à l'écran d'accueil ».

## Qui peut faire quoi

| | Tablette des enfants | Animateur connecté |
|---|---|---|
| Envoyer une réponse | ✅ | ✅ |
| Lire les réponses | ❌ | ✅ |
| Effacer des réponses | ❌ | ✅ |
| Modifier la liste des activités | ❌ | ✅ |

Ces règles sont dans la base (voir `supabase-setup.sql`). La clé du fichier `config.js` est une clé *publishable*, faite pour être publique.

Si le wifi coupe, les réponses restent sur la tablette (⏳ en haut de l'écran) et partent toutes seules au retour de la connexion.

## Fichiers

- `index.html`, `style.css`, `app.js` : l'application
- `familles.html`, `familles.js`, `familles-data.js` : l'espace familles ; `qr-familles.svg` : son QR code
- `config.js` : nom du centre et connexion à Supabase
- `supabase-setup.sql` : création des tables et des droits (déjà appliqué ; on peut le relancer sans risque)
- `vendor/supabase.js` : bibliothèque Supabase 2.118.0 (licence MIT)
