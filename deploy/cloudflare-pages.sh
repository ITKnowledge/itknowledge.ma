#!/usr/bin/env bash
# Build and deploy itknowledge.ma to Cloudflare Pages via Wrangler direct upload.
# Auth: CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN (Pages: Edit), or an
# interactive `npx wrangler login` session.
set -euo pipefail

cd "$(dirname "$0")/.."

hugo --source site --gc --minify

PROJECT="${CF_PAGES_PROJECT:-itknowledge-ma}"
exec npx --yes wrangler pages deploy site/public --project-name "$PROJECT" --branch main
