# itknowledge.ma

Site web d'ITKnowledge Maroc — site vitrine bilingue (français par défaut, anglais),
statique, construit avec [Hugo](https://gohugo.io/), déployé sur Cloudflare Pages.

## Structure

```
site/                 Projet Hugo
  hugo.toml           Configuration (langues, paramètres SEO)
  data/site.yaml      Identité : logo, email, adresse, réseaux sociaux
  data/fr/home.yaml   Contenus de la page d'accueil (français)
  data/en/home.yaml   Contenus de la page d'accueil (anglais)
  i18n/               Libellés d'interface (navigation, contact, 404)
  layouts/            Gabarits (page unique, 404, header/footer)
  assets/css/         Feuille de style (minifiée + fingerprintée par Hugo)
  static/             Logo, favicon, humans.txt, robots.txt
archive/              Miroir figé de l'ancien site (version 2017) — référence, ne pas modifier
deploy/               Scripts de déploiement
docs/               Documents de conception
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

## Modifier le contenu

- Textes de la page : `site/data/fr/home.yaml` et `site/data/en/home.yaml`
  (hero, services, expertise, devise, à propos, contact).
- Coordonnées : `site/data/site.yaml`.
- Libellés d'interface : `site/i18n/fr.toml`, `site/i18n/en.toml`.

## Déploiement (Cloudflare Pages)

Le DNS d'itknowledge.ma est déjà chez Cloudflare.

**Option A — intégration Git (recommandée)** : connecter le dépôt GitHub
`ITKnowledge/itknowledge.ma` dans Cloudflare Pages avec :

- Build command : `hugo --source site --gc --minify`
- Build output directory : `site/public`
- Variable d'environnement : `HUGO_VERSION = 0.170.1`

**Option B — upload direct** :

```sh
export CLOUDFLARE_ACCOUNT_ID=…
export CLOUDFLARE_API_TOKEN=…     # token avec droit "Pages: Edit"
deploy/cloudflare-pages.sh
```

Puis attacher le domaine `www.itknowledge.ma` (et `itknowledge.ma` en redirection)
au projet Pages.

## Différences avec l'ancien site (2017)

- Refonte complète : une page, responsive, sans dépendance JS, sans framework CSS.
- Trackers supprimés : Google Tag Manager, Drift, Olark, SumoMe, Segment.
- Widget Twitter supprimé (liens simples conservés).
- Contenus éditorialisés : focus sur les services d'IA agentique.
- Aucun nom de personne ni de fournisseur dans les sections publiques.
