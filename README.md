# itknowledge.ma

Site web d'ITKnowledge Maroc — site vitrine bilingue (français par défaut, anglais),
statique, construit avec [Hugo](https://gohugo.io/), déployé sur Cloudflare Pages.

## Structure

```
site/                 Projet Hugo
  hugo.toml           Configuration (langues, paramètres SEO)
  data/site.yaml      Identité : logo, email et adresse
  data/fr/home.yaml   Contenus de la page d'accueil (français)
  data/en/home.yaml   Contenus de la page d'accueil (anglais)
  i18n/               Libellés d'interface (navigation, contact, 404)
  layouts/            Gabarits (accueil, 404, composants d'en-tête, pied et icônes)
  assets/css/         Système visuel sombre/clair, responsive, minifié et fingerprinté
  assets/js/          Thème, navigation mobile et soumission du formulaire
functions/api/        Pages Function qui valide le formulaire et transmet l'e-mail
tests/                Tests Node du traitement des demandes
archive/              Miroir figé de l'ancien site (version 2017) — référence, ne pas modifier
deploy/               Scripts de déploiement
docs/                 Documents de conception
```

## Développement

```sh
brew install hugo          # une seule fois (v0.170+)
hugo server -s site        # http://localhost:1313 (fr) et /en/ (anglais)
```

Build de production :

```sh
hugo --source site --gc --minify     # sortie : site/public/
```

Tests du formulaire :

```sh
npm test
```

Pour servir le site avec la Pages Function locale après le build :

```sh
npx wrangler pages dev site/public
```

## Modifier le contenu

- Textes de la page : `site/data/fr/home.yaml` et `site/data/en/home.yaml`
  (hero, services IA agentique, méthode, socle technique, connaissance et contact).
- Coordonnées : `site/data/site.yaml`.
- Libellés d'interface : `site/i18n/fr.toml`, `site/i18n/en.toml`.

## Déploiement (Cloudflare Pages)

Le DNS d'itknowledge.ma est déjà chez Cloudflare.

**Option A — intégration Git (recommandée)** : connecter le dépôt GitHub
`ITKnowledge/itknowledge.ma` dans Cloudflare Pages avec :

- Build command : `hugo --source site --gc --minify`
- Build output directory : `site/public`
- Variable d'environnement : `HUGO_VERSION = 0.170.1`

Le formulaire `/api/contact` utilise Cloudflare Pages Functions et l'API
Resend. Dans les variables et secrets du projet Pages, configurer :

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL` — facultatif, `ITKnowledge Website <website@itknowledge.ma>` par défaut
- `CONTACT_TO_EMAIL` — facultatif, `contact@itknowledge.ma` par défaut

Le domaine d'envoi `itknowledge.ma` doit être vérifié dans Resend. Les
enregistrements Resend utilisent des sous-domaines dédiés et ne remplacent pas
les MX de Google Workspace. Ne jamais stocker la clé API dans le dépôt.

**Option B — upload direct** :

```sh
export CLOUDFLARE_ACCOUNT_ID=…
export CLOUDFLARE_API_TOKEN=…     # token avec droit "Pages: Edit"
deploy/cloudflare-pages.sh
```

Puis attacher le domaine `www.itknowledge.ma` (et `itknowledge.ma` en redirection)
au projet Pages.

## Principes de la refonte

- Site vitrine bilingue, responsive et sombre par défaut, avec thème clair persistant.
- Focus éditorial sur les services d'IA agentique et les capacités techniques livrables.
- Interface sans framework ni dépendance JavaScript d'exécution.
- Ressources CSS et JS minifiées et fingerprintées par Hugo.
- Trackers, téléphones et liens sociaux supprimés.
- Aucun nom de personne ou de fournisseur dans les sections publiques.
- `humans.txt` reste disponible sans lien visible dans le pied de page.
