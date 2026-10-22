# Boussole Formation Ia

Construis un site éditorial en français : « Le Guide Formation IA », un blog de conseils sur la formation à l'IA et au no-code (métiers, reconversion, outils, financement). Il sera publié sur https://formation-ia.optimatt.fr. Objectif n°1 : SEO (Google) et citabilité par les IA (ChatGPT, Perplexity, Claude). Le site doit être rendu côté serveur (SSR) pour que toutes les pages soient lisibles sans JavaScript.

## Source des données : Airtable (lecture seule, côté serveur uniquement)
Les articles et les liens ne sont PAS stockés dans une base Lovable/Supabase : le site lit Airtable via son API REST, uniquement côté serveur (server functions / loaders). Ne crée aucune table de base de données pour les articles.
- Secret : `AIRTABLE_TOKEN` (je l'ajouterai moi-même dans les secrets). Ne jamais exposer ce token au navigateur. Tant que le secret est absent, le site doit s'afficher normalement avec un état vide propre (« Les premiers articles arrivent bientôt »), sans planter.
- Base : `app6gtf0nc4rI82yH`
- Mets en cache les réponses Airtable côté serveur pendant 5 minutes (l'API Airtable est limitée à 5 requêtes/seconde). Gère la pagination Airtable (`offset`).

### Table « Articles » (`tblG61pdKCFtR0eJY`)
Afficher uniquement les enregistrements dont `Statut` = « Publié ». Champs :
- `Titre` (H1), `Slug` (URL), `Statut`, `Publié le` (date), `Mis à jour le` (date)
- `Catégorie` (choix unique parmi : Métier & reconversion, Outils & vibe coding, IA en entreprise, Growth & marketing, Financement)
- `Mot-clé cible`, `Intention`, `Masterclass source` (internes, non affichés)
- `Lien principal`, `Lien secondaire` : liens vers des enregistrements de la table « Liens Cube » (tableau d'IDs, prendre le premier)
- `Meta title`, `Meta description`, `Extrait`
- `Contenu` : corps de l'article en Markdown (titres ##/###, listes, tableaux, gras, liens)
- `FAQ` : texte au format « ### Question » suivi de la réponse, une paire par bloc
- `Sources` : texte Markdown (liste de sources)

### Table « Liens Cube » (`tblmEC5w2FEWaOwLV`)
Champs : `Libellé`, `Type` (programme, rdv, communaute, ressources, evenement), `URL`, `Thème`, `Actif` (case à cocher), `Expire le` (date), `Notes`.
Un lien est valide si `Actif` est coché ET (`Expire le` vide OU date d'expiration ≥ aujourd'hui, fuseau Europe/Paris).

## Résolution des liens partenaires (essentiel)
Dans le Markdown du champ `Contenu`, les liens partenaires sont écrits avec des balises : `[texte de l'ancre](cube:principal)` et `[texte de l'ancre](cube:secondaire)`.
Au rendu, remplace `cube:principal` par l'URL du `Lien principal` de l'article et `cube:secondaire` par celle du `Lien secondaire`. Si le lien concerné est absent, inactif ou expiré, utilise à la place l'URL de l'enregistrement « Liens Cube » de type `ressources` (lien de secours).
Tous les liens partenaires sont rendus avec `rel="sponsored noopener"` et `target="_blank"`, et un style de bouton/lien discret mais visible. Les liens Markdown ordinaires (sources externes) gardent `rel="noopener"`.
Ne jamais afficher d'URL brute en dur : tout passe par cette résolution.

## Pages
1. **Accueil** `/` : en-tête avec le nom du site et une promesse claire (« Choisir sa formation IA et no-code, sans se tromper »), les 5 catégories, les derniers articles (cartes : catégorie, titre, extrait, date de mise à jour, temps de lecture estimé).
2. **Catégorie** `/categorie/{slug-de-la-categorie}` : liste des articles de la catégorie.
3. **Article** `/{slug}` :
   - fil d'Ariane (Accueil › Catégorie › Article)
   - H1, date « Mis à jour le … » bien visible, temps de lecture
   - encadré de transparence en haut : « Cet article contient des liens partenaires vers l'École Cube. Si vous vous inscrivez via ces liens, ce site peut percevoir une commission, sans surcoût pour vous. »
   - sommaire automatique à partir des H2
   - contenu Markdown avec résolution des liens partenaires
   - section FAQ (accordéon) à partir du champ `FAQ`
   - section « Sources » en fin d'article
   - 3 articles liés (même catégorie)
   - 404 propre si le slug n'existe pas ou n'est pas publié
4. **À propos** `/a-propos` : page éditoriale sobre expliquant la ligne du site (guides pratiques sur la formation IA/no-code, sources citées et datées, liens partenaires signalés). Aucun nom de personne, aucune photo.
5. **Mentions légales** `/mentions-legales` : hébergeur (Lovable) et une section éditeur avec des champs à compléter plus tard (laisse des marqueurs clairs « À COMPLÉTER »). Section sur les liens partenaires et les cookies (aucun cookie de suivi).
6. Pied de page : liens vers catégories, À propos, Mentions légales, et la mention « Liens partenaires signalés ».

## SEO / AEO (exigences)
- URL canonique absolue sur chaque page (base `https://formation-ia.optimatt.fr`).
- `<title>` = `Meta title` (sinon `Titre`), meta description = `Meta description` (sinon `Extrait`), balises Open Graph et Twitter par page.
- Image Open Graph par défaut générée par catégorie (simple, aux couleurs du site, avec le titre).
- Données structurées JSON-LD : `Article` (headline, datePublished, dateModified, author et publisher = Organization « Le Guide Formation IA », jamais une personne), `FAQPage` quand une FAQ existe, `BreadcrumbList`, et `WebSite` sur l'accueil.
- `/sitemap.xml` dynamique (accueil, catégories, articles publiés avec `lastmod` = `Mis à jour le`).
- `/robots.txt` qui autorise tout, y compris explicitement GPTBot, ClaudeBot, PerplexityBot, Google-Extended, et qui pointe vers le sitemap.
- `/llms.txt` dynamique listant les articles publiés (titre, URL, extrait).
- Un seul H1 par page, hiérarchie de titres correcte, attribut `lang="fr"`, textes alternatifs.

## Design
Éditorial, sobre et très lisible : typographie confortable pour la lecture longue (largeur de colonne ~70 caractères), beaucoup d'espace, une couleur d'accent unique (violet profond), mode sombre automatique selon le système. Mobile en priorité. Performances : pas de bibliothèque lourde inutile, pas de traqueur ni d'outil d'analytics pour l'instant.

## Contraintes
- Aucun nom de personne, aucun pseudonyme, aucune signature d'auteur nulle part sur le site.
- Retire le badge « Edit with Lovable ».
- Pas d'authentification, pas de formulaire, pas de base de données.
- Tout le texte de l'interface en français.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/58c0503f-1806-469c-8eab-ef2cc00bc62a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
