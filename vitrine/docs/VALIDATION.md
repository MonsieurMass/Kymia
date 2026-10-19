# Validation locale — 19 octobre 2026

Build de production Next.js et TypeScript : PASS. Tests Node : 2/2 PASS (validation serveur, chiffrement, idempotence et conflit). Audit npm à l’installation : 0 vulnérabilité signalée.

12 pages : HTTP 200. Formulaire six étapes : réception locale et téléchargement vérifiés. Menu mobile : ouverture et navigation vérifiées. Aucun débordement horizontal sur 320, 375, 390, 430, 768 et 1440 px. Captures desktop/mobile inspectées. Aucun test sur iPhone ou Android physique ; vérifications navigateur Chromium uniquement.

axe : zéro violation détectée sur accueil, formulaire initial et financement pour les règles WCAG A/AA 2.0/2.1/2.2 disponibles. Cela ne constitue pas une certification d’accessibilité ni un audit manuel exhaustif.

| Profil Lighthouse | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| mobile | 98 | 100 | 100 | 66 |
| desktop | 100 | 100 | 100 | 66 |

Le SEO à 66 est dû à l’interdiction d’indexation volontaire (meta noindex et robots Disallow). L’objectif SEO ≥95 ne peut pas être déclaré atteint pour cette configuration. Les autres objectifs de laboratoire sont atteints sur l’accueil. Les rapports JSON conservent les mesures et détails. Les Core Web Vitals en trafic réel restent non mesurés.

Aucun déploiement, envoi de notification, écriture Notion ni service payant activé. Les demandes de recette utilisent example.invalid et ont été retirées après validation. L’application historique n’a pas été modifiée.

## Francisation

Titres, expertises, étapes, navigation légale et image de partage traduits. Noms de marque conservés. Build et recette navigateur relancés : 12 pages, formulaire, six formats responsive et contrôles axe réussis. Les scores Lighthouse ci-dessus correspondent à la version précédente et n’ont pas été remesurés après traduction.

## Connexion Notion vérifiée — 19 octobre 2026

7 tests Node réussis, typecheck et build production réussis. Recette navigateur relancée : 12 pages, six formats, formulaire complet et contrôles axe sans violation détectée sur les trois pages contrôlées.

Le formulaire réel a transmis une demande explicitement TEST TECHNIQUE via l’API serveur : référence `3b9a37e2ff609b0b183230f9`, fiche Notion `3fd3abce-3d9d-8190-969c-fd4ef9c7e6af`. Relecture via l’API et le connecteur Notion : artiste/projet, contact, service Financement et Phase À qualifier confirmés. Une reprise après perte simulée du reçu a retrouvé la même fiche ; une seule fiche correspondait à la référence. La fiche de test a été archivée de manière réversible après contrôle.

L’intégration existante Kymia CRM est configurée dans le serveur local. Reprise automatique activée pendant son fonctionnement. Aucun déploiement de production ni notification e-mail ajouté. Les demandes locales antérieures à la notice Notion restent exclues. Voir NOTION.md et notion-live-verification.json.
