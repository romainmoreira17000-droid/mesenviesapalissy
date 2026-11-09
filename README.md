# Mes envies à Palissy

Application pour recueillir les envies des enfants, de la maternelle au CM2, au centre de loisirs : périscolaire, mercredi et pause du midi.

Après avoir choisi sa classe, l'enfant a 4 portes :

- 🎯 **Mes envies d'activités** : le moment, puis jusqu'à 3 activités, puis « Tu aimes venir au centre ? »
- 🔧 **J'améliore le centre** : ce que l'enfant changerait (images, moment concerné, explication)
- 🧭 **J'aimerais découvrir** : ce que l'enfant voudrait essayer
- 💬 **Je m'exprime** : un dessin au doigt et/ou un texte libre
- 😊 **Mes émotions** : comment je me sens (8 émotions, un peu ou beaucoup), à cause de quoi, et « je veux en parler à un animateur » (prénom facultatif, effacé quand l'animateur clique « C'est fait »). Après une émotion difficile, exercice de respiration avec le renard.

Le bouton 🔊 lit les questions à voix haute pour les maternelles. Les réponses sont **anonymes**.

**Espace familles** (`familles.html`) : les parents répondent depuis leur téléphone, sans compte, à un questionnaire de satisfaction, proposent des améliorations et des idées, ou s'expriment librement. On y accède par le bouton « 👨‍👩‍👧 Espace familles » de l'accueil, ou par son lien direct (et le QR code `qr-familles.svg`) à envoyer aux familles :
https://romainmoreira17000-droid.github.io/mesenviesapalissy/familles.html

Les animateurs se connectent dans **Espace animateur** pour voir les résultats, filtrer par moment, classe et période, et gérer la liste des activités.

## Adresse de l'appli

https://romainmoreira17000-droid.github.io/mesenviesapalissy/

## Mise en route

La base Supabase **mesenviesapalissy** est créée et reliée (fichier `config.js`). Le premier compte animateur existe déjà.

1. **GitHub Pages** : Settings › Pages › Branch `main` / `(root)` › Save.
2. **Se connecter** : Espace animateur, puis l'e-mail et le mot de passe provisoire. Changez ensuite le mot de passe dans l'onglet ⚙️ Aide.
3. **Ajouter un collègue** : il touche « Pas encore de compte ? Créer mon compte » sur l'écran de connexion, puis un animateur valide son compte dans l'onglet ⚙️ Aide. Tant qu'un compte n'est pas validé, il ne voit aucune réponse.
4. Sur la tablette, ouvrez l'adresse de l'appli puis « Ajouter à l'écran d'accueil ».

### Activer l'espace émotions (une fois)

Dans Supabase › SQL Editor › New query, collez le contenu du fichier `supabase-emotions.sql`, puis cliquez sur **Run**. Tant que ce n'est pas fait, les émotions envoyées restent en attente sur la tablette (⏳) et partiront toutes seules ensuite.

### Alertes « un enfant veut parler »

- **Espace animateur ouvert** (téléphone, tablette, ordinateur) : vérification toutes les 15 secondes, avec son, vibration, notification et bandeau rouge. Réglage et test dans l'onglet ⚙️ Aide.
- **Sur téléphone, même appli fermée** : avec l'appli gratuite **ntfy**. Pour l'activer une fois, collez `supabase-alertes.sql` dans Supabase › SQL Editor, puis Run. Le nom du canal à suivre s'affiche ensuite dans l'onglet ⚙️ Aide. Le message ne contient ni prénom ni émotion.

## Qui peut faire quoi

| | Enfants et familles | Animateur validé |
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
