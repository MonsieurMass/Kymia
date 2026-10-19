# KYMIA WORLD — vitrine

Next.js / React / TypeScript. Identité graphique conservée ; Sprint 02 : formulaire versionné, reprise Notion et adaptateur PostgreSQL serverless. Rapport détaillé : [docs/SPRINT02.md](docs/SPRINT02.md).

## Local

Node 24 recommandé. `npm ci`, `npm run build`, `npm start` (port 3100). Les anciennes données locales sont préservées ; aucune migration automatique. Sans DATABASE_URL, le stockage reste chiffré sur disque local. Sur Vercel, aucun repli vers le disque n’est autorisé.

## Validation isolée

`npm test` : tests Node et PostgreSQL PGlite en mémoire, sans réseau Notion réel. `npm run typecheck` et `npm run build`.

Pour le navigateur, démarrer le serveur avec KYMIA_TEST_MODE=true et KYMIA_NOTION_WORKER=false puis exécuter `npm run test:browser` et `node tests/sprint02-browser.mjs`. Les soumissions sont interceptées par Playwright et n’alimentent aucun CRM. Installer le Chromium correspondant à Playwright si nécessaire.

## PostgreSQL / Preview

Voir `.env.preview.example`. Configurer une base isolée, une clé de chiffrement de 32 octets au format hexadécimal et un secret opérateur d’au moins 32 caractères. Initialiser explicitement avec `npm run storage:init` dans l’environnement voulu. Aucune migration de données historique sans validation. La Preview doit utiliser un namespace `preview-*` et un jeton Notion exclusivement limité au bac à sable. Le pipeline commercial est refusé en Preview. Les variables serveur ne portent jamais le préfixe NEXT_PUBLIC.

Non-indexation forcée en Preview. Les contacts et informations juridiques restent configurables ; `npm run legal:check` liste les éléments manquants. Aucun paiement ni courriel automatique.

## Exploitation

`npm run queue:status` : compteurs de file. `npm run queue:retry` : reprise manuelle. Les endpoints `/api/operations/health` et `/api/operations/retry` exigent OPERATIONS_SECRET en Bearer et ne renvoient pas de données de demande.

`npm run backup -- /chemin/prive/backup.json` : export chiffré, sans clé. `npm run restore -- /chemin/prive/backup.json` : destination PostgreSQL vide et isolée uniquement, après validation ; aucun écrasement. Garder la clé hors sauvegarde et hors Git. Ne jamais importer de données réelles en Preview.

La Preview nécessite un ordonnanceur externe pour la reprise sans trafic ; Vercel Cron ne s’exécute pas sur les Preview. Aucun service payant d’ordonnancement ni canal d’alerte n’est activé. L’état de ces prérequis est décrit dans le rapport de livraison, sans présumer que l’infrastructure distante est disponible.
