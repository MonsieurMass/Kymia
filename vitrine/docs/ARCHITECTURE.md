# Audit, conception et exploitation

## Existant observé

Le dossier de la conversation était vide. Le projet historique identifié est `/Users/ossema/Documents/Codex/Kymia_World_Local/kymia-world-starter`. Lecture de ses instructions, README et docs avant création. Il contient Next.js 15, une application métier, PostgreSQL/PGlite, migrations, authentification, RBAC, catalogue versionné, dossiers, paiements test et agents désactivés. Ses données, accès, configurations et fichiers n’ont pas été modifiés. Aucun secret n’a été lu ni copié. Aucun appel à ses services externes.

Réutilisable conceptuellement : séparation catalogue/diagnostic, consentement, devis humain à 49 €, incertitude des aides, validation humaine. L’authentification et le CRM ne sont pas recopiés : la vitrine n’en a pas besoin. Aucun test de non-régression de l’application historique n’a été exécuté, puisqu’elle n’a pas été modifiée.

## Décision

Projet Next.js 16 / React 19 / TypeScript indépendant. Pages statiques et endpoint Node de réception. CSS natif centralisé, plutôt que Tailwind : pas de dépendance nécessaire pour ces tokens. Pas de Motion/GSAP : entrée du disque et survols en CSS suffisent, et sont désactivés avec les préférences de mouvement réduit. Les composants serveur portent le contenu ; seuls la navigation mobile et le formulaire sont interactifs.

12 pages demandées, erreurs 404, sitemap, robots, métadonnées uniques, canoniques et image Open Graph. L’indexation reste bloquée par défaut. Les données structurées d’organisation seront ajoutées après validation de l’identité et de l’URL officielles, pour ne pas publier des coordonnées fictives.

## Direction et design system

Noir #090909, blanc cassé #F4F2ED, charbon #202020. Trois accents considérés : orange (trop événementiel), citron (trop logiciel), cobalt #374DFF retenu pour le lien avec l’objet disque et l’infrastructure musicale. Le ton clair #9CAAFF appartient au même accent et assure la lisibilité sur noir. Signature : disque orbital dessiné en CSS, sans portrait ni faux client. Barlow Condensed 700 pour l’affiche, DM Sans 400/500 pour la lecture ; fichiers auto-hébergés via Fontsource, licences OFL incluses dans les paquets. Aucun appel Google Fonts navigateur.

Tokens dans `app/globals.css`. Grille 3 colonnes expertises, 4 étapes, passage en une ou deux colonnes sur mobile. Boutons rectangulaires, règles fines, grands titres, légendes compactes. Le manifeste présente la conviction, le financement la conversion prioritaire, l’écosystème les périmètres. Aucun chiffre de réussite ni témoignage.

## Intégration Notion

Le pipeline existant a été lu et son schéma vérifié via le connecteur puis l’API serveur. Le mapping, les identifiants et la reprise sont documentés dans `NOTION.md`. Aucune base, propriété ou liste de statuts n’a été créée. L’intégration existante Kymia CRM est réutilisée. Les demandes nouvelles consenties sont transmises ; les demandes antérieures à la notice Notion restent exclues.

## Sécurité et données

Validation navigateur et serveur, taille limitée pendant lecture, origine vérifiée, honeypot, limite de débit en mémoire, idempotence par référence et conflit de contenu refusé. Limites : le rate limit est mono-processus ; les identifiants d’envoi différents peuvent produire des doublons sémantiques ; le chiffrement local ne remplace pas un serveur et une gestion de clés sécurisés ; pas de SLA ni certification RGPD/WCAG. Pas de cookie, traceur, consentement marketing ni stockage navigateur du formulaire. Pas de pièces jointes.

## Préparation Vercel

Build `npm run build`, framework Next.js, Node 22+. Domaine et URL à confirmer. Remplacer le stockage local par une base/outbox durable avant activation, puis tester reprise, doublons, droits, notifications et sauvegarde. Définir les secrets uniquement dans l’environnement serveur. Valider les mentions et durées de conservation, offres et contacts. Faire une prévisualisation privée puis une recette humaine. Aucun déploiement automatique n’est configuré.

## Sources techniques consultées le 19 octobre 2026

- https://nextjs.org/docs/app/getting-started/route-handlers
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://fontsource.org/fonts/barlow-condensed/about

Les scores Lighthouse sont des mesures de laboratoire locales, pas une garantie de Core Web Vitals en trafic réel.
