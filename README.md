# Site de présentation de Bacly

C'est une page unique en HTML, CSS et JavaScript. Elle n'a besoin d'aucun serveur et se met en ligne sur Vercel, comme les autres sites.

Elle garde l'esprit du site Bâti-Pro (fond à motifs, objets en relief, bande sombre, animations), mais avec une identité propre à Bacly :

- les couleurs « Lagon » et le logo de l'app ;
- les titres en Instrument Serif, la police de l'app ;
- un fond de petits dessins « école + numérique » (livre, π, équerre, ordinateur, téléphone, chronomètre…) ;
- des objets d'école : copies d'examen, règle, étagère de classeurs par matière, horloge de salle d'examen, page de cahier.

## Ce qu'il y a dans le dossier

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `404.html` | La page affichée quand une adresse n'existe pas |
| `assets/js/config.js` | **Les liens à remplir : c'est le seul fichier à modifier** |
| `assets/css/style.css` | Couleurs, polices et mise en page |
| `assets/js/site.js` | Menu, choix de l'appareil, fiche annotée, horloge du chrono, formulaire |
| `assets/img/fond-clair.svg`, `fond-sombre.svg` | Le fond de dessins |
| `assets/fonts/` | Les polices Instrument Serif et Instrument Sans, hébergées avec le site |

## 1. Remplir les liens

Ouvre `assets/js/config.js` avec le Bloc-notes et remplis :

- **`apk`** : le lien de téléchargement de l'APK Android. Par exemple le lien du build Expo, ou un lien Google Drive.
- **`web`** : l'adresse de la version web de Bacly, par exemple `https://bacly-app.vercel.app`. Elle sert pour l'iPhone et l'ordinateur, et c'est vers elle que mènent les classeurs des matières.
- **`whatsapp`** : le numéro en chiffres seulement, par exemple `"22670000000"`. Il active :
  - le bouton « Demander sur WhatsApp » ;
  - le formulaire « Écris-nous » ;
  - le bouton rond de la barre du bas sur téléphone.
- **`email`** : facultatif. Il sert seulement s'il n'y a pas de numéro WhatsApp.

Tant qu'un lien est vide, le bouton affiche « bientôt disponible ».

## 2. Mettre en ligne (GitHub + Vercel)

1. Crée un dépôt vide sur github.com, par exemple `bacly-site`, sans cocher « Add a README ».
2. Dans PowerShell, depuis le dossier `bacly-site`, lance :
   ```
   git init
   git add .
   git commit -m "Site de présentation Bacly"
   git branch -M main
   git remote add origin https://github.com/mandestephane5-creator/bacly-site.git
   git push -u origin main
   ```
3. Sur vercel.com, clique sur **Add New → Project**, choisis `bacly-site`, puis **Deploy**.

## Bon à savoir

- **Choix de l'appareil** : la page choisit toute seule Android, iPhone ou Ordinateur, selon l'appareil du visiteur. Le bouton principal s'adapte : il propose l'APK sur Android, la version web sur iPhone et sur ordinateur.
- **Chrono d'épreuve** : l'horloge de la page est une démonstration (épreuve de 8 h à 2 h, 3 h ou 4 h plus tard). Elle tourne vraiment : la trotteuse avance et l'arc corail montre le temps restant.
- **Fiche du sujet** : sur ordinateur, survoler une explication éclaire la partie correspondante de l'écran.
- **Écrans de l'app, copie d'examen et conversation** : ce sont des illustrations ; la conversation est marquée « exemple ».
