# Sprint 02 — fiabilisation et préparation Preview

## État initial vérifié

La vitrine livrée dans `outputs/kymia-world` n’était pas un dépôt Git : pas de branche, de remote, d’état de travail Git ou de liaison Vercel. Framework : Next.js 16 / React 19 / TypeScript. Commandes : npm ci, npm run build, npm start.

Le compte GitHub accessible possède `MonsieurMass/Kymia`, qui contient une boutique React/Vite. Ce code n’est pas celui de la vitrine. La branche de Sprint isole la vitrine dans `vitrine/` et conserve le reste du dépôt. Le dépôt est public : aucun secret, donnée de demande, fichier .env.local, sauvegarde ou build n’est inclus dans la branche.

Vercel : compte monsieurmass, scope monsieurmass-projects (`team_kRI1GNI5PEwGCTTdtj5WqHhk`). Les projets existants kymia, kymia.store, kymia-music et kymia-music-redesign sont distincts. Nouveau projet isolé créé : `kymia-world-preview`, ID `prj_OA9ncbVGQZUOiomgdm1bdOImZxuu`. Aucun domaine ni environnement de production existant modifié.

## Corrections

- Clé stable par demande, révision augmentée seulement si le contenu envoyé change. Une réponse perdue peut être réessayée sans nouvelle fiche ; une correction met à jour la même demande et la même fiche Notion. Les anciennes révisions sont refusées. Le statut commercial n’est pas écrasé lors d’une correction.
- Garde synchrone contre le double envoi, paramètres de service repris, avertissement de rechargement/sortie, copie de brouillon sur demande, modification directe par section, focus erreur et confirmation. La navigation historique bénéficie de la Navigation API lorsqu’elle est disponible ; contrôle manuel Safari requis pour ce comportement.
- Introduction mobile compacte ; identité visuelle et architecture éditoriale conservées.
- Validation partagée des listes, limites, montants et URL ; erreurs lisibles et associées aux champs.
- Trois niveaux financement explicites : orientation immédiate et premier examen gratuit, analyse humaine sur proposition avec périmètre, prix et délai à confirmer, montage/suivi sur devis. FAQ tarifaire retirée des autres services. Aucun diagnostic instantané, délai ou courriel automatique promis.
- Contrôle Vercel effectué avant tout accès disque. Aucune configuration de clé ne permet de réactiver le stockage local sur Vercel.

## Persistance

Adaptateur PostgreSQL via pg, compatible Neon. Demande chiffrée AES-256-GCM et état de livraison stockés ensemble dans `kw_vitrine_leads`. Clé primaire (namespace, id), révisions et bail de traitement pour sérialiser les mises à jour. La création du schéma est une commande explicite ; le build ne migre pas de données. Les anciens fichiers locaux ne sont ni supprimés ni migrés automatiquement.

Plan actif : Neon `free_v3` gratuit, région Francfort, authentification applicative Neon désactivée, connexion exclusivement Preview. Après acceptation des conditions par le propriétaire, la base a été provisionnée ; le schéma, la persistance distante et les lectures sont vérifiés. Aucun compte ou plan payant souscrit.

Les tests SQL utilisent un moteur PostgreSQL PGlite isolé en mémoire. Ils vérifient les requêtes et la logique ; ils ne remplacent pas une recette du pool pg/TLS avec la base distante.

## Notion et isolation

Le pipeline commercial existant et son jeton local sont préservés ; vérification de schéma en lecture seule. Les tests navigateur interceptent leurs soumissions ; les tests serveur utilisent un fetch simulé et une base temporaire/en mémoire. Aucun test ordinaire n’écrit dans le CRM réel.

Un bac à sable vide a été créé dans Notion : `TESTS TECHNIQUES — KYMIA WORLD Preview`, base `99b39047889c40d984132e288c8610f3`, source `46261257-1e72-4759-bb31-4da584898580`. Ce n’est pas un second CRM commercial. Aucun prospect réel importé.

La Preview exige un namespace preview-*, refuse le pipeline commercial connu et nécessite KYMIA_NOTION_MODE=preview pour activer un jeton de test. Sans jeton dédié au bac à sable, conserver KYMIA_NOTION_MODE=disabled. Le jeton local du CRM réel ne doit pas être copié dans Vercel Preview. Une intégration Notion dédiée est configurée, limitée au bac à sable. Son accès au CRM commercial a été testé et refusé.

## Supervision et reprise

Endpoints privés Bearer OPERATIONS_SECRET : GET /api/operations/health et POST /api/operations/retry. Ils exposent uniquement des compteurs et erreurs d’accès, jamais le contenu des demandes. Commandes opérateur : npm run queue:status, npm run queue:retry. Les erreurs d’accès persistantes sont distinguées. Les alertes externes ne sont pas configurées sans canal officiel.

La réception tente une synchronisation puis une reprise après réponse. En local, le worker peut reprendre toutes les 30 s. Sur Vercel Preview, ne pas utiliser setInterval : la reprise sans trafic doit appeler l’endpoint privé via un ordonnanceur externe. Vercel Cron ne déclenche pas les Preview. Aucun abonnement d’ordonnancement créé ; l’ordonnanceur reste une condition d’exploitation. Le journal persistant permet la reprise manuelle pendant la recette.

## Sauvegarde/restauration

Exécuter avec l’environnement de la destination explicitement chargé : npm run backup -- /chemin/prive/backup.json. La sauvegarde contient les enveloppes chiffrées et les reçus, pas la clé. Conserver la clé dans un coffre séparé, tester la restauration sur une destination isolée.

Restauration : npm run restore -- /chemin/prive/backup.json, uniquement vers un namespace PostgreSQL vide, après validation du propriétaire. Le script vérifie le déchiffrement avant écriture, refuse les destinations non vides et l’import de données réelles dans un namespace Preview. L’insertion de l’ensemble est atomique. Une sauvegarde chiffrée contenant une seule demande fictive a été restaurée et vérifiée dans preview-restore-sprint02. Aucune migration historique ni restauration de données réelles.

## Informations manquantes exactes

La commande npm run legal:check produit la liste des champs et leur état, sans inventer de valeurs : identité/raison sociale, forme juridique, adresse du siège, SIREN/registre, responsable de publication, courriel officiel et exercice des droits, nom/adresse/contact hébergeur, responsable de traitement, base légale, durée/critères de conservation, destinataires/sous-traitants, transferts/garanties, TVA/régime à confirmer, délai opérationnel de réponse. WhatsApp reste absent sans numéro officiel.

Les propriétés sont configurables côté serveur via lib/legal.mjs. Les mentions affichent uniquement les valeurs fournies ou l’état « À confirmer avant publication ». Les contenus juridiques restent préparatoires. Le périmètre, le prix et le délai de l’analyse humaine nécessitent encore une décision commerciale.

## Environnement Preview

Voir .env.preview.example. DATABASE_URL, LEAD_ENCRYPTION_KEY et OPERATIONS_SECRET sont serveur et requis pour une Preview fonctionnelle. Namespace séparé. Jeton Notion de test uniquement. KYMIA_NOTION_WORKER=false, SITE_INDEXABLE=false. Meta robots et robots.txt interdisent l’indexation en Preview même si SITE_INDEXABLE est mal réglé. Utiliser la protection d’accès Vercel du projet isolé. Ne jamais promouvoir cette Preview en production dans ce sprint.

## Limites restantes

Neon free_v3 en région Francfort est actif ; persistance distante, connexion Notion de test et restauration isolée sont vérifiées. Restent : configuration d’un ordonnanceur Preview et d’une alerte réelle, recette Safari/téléphones physiques, confirmation des informations juridiques et commerciales. Aucune promesse de production ou de migration complète.

## Recette en ligne vérifiée

Vercel confirme la cible Preview et l’état Ready. Le formulaire est affiché en Chromium mobile sur la Preview protégée, sans erreur JavaScript. Les appels distants vérifient : création 201 avec livraison Notion, répétition 200 avec la même référence, correction 201 avec la même référence, endpoint opérateur sans autorisation 401. Santé finale de recette : quatre demandes fictives, quatre synchronisées, zéro en attente et zéro erreur d’accès. Robots interdit l’indexation ; les URL générées utilisent le domaine du déploiement. Treize tests serveur passent, dont la reprise après cent fiches déjà livrées.

Incident de préparation : une première tentative API a été classée production par Vercel ; elle a été annulée en cours de build, avant disponibilité et sans alias attribué. Les déploiements livrés utilisent explicitement Preview. Aucun site de production existant ni domaine n’a été modifié.

## Suite produit — 20 octobre 2026

La vitrine devient la porte d’entrée du système de label services sans reconstruire son identité visuelle. L’accueil présente trois besoins concrets : préparer une sortie, explorer les financements et organiser le back-office. Le formulaire commence par le projet ; le profil et les coordonnées arrivent seulement après la qualification du besoin.

Pour un besoin de financement, une orientation indicative apparaît avant toute demande de nom ou d’adresse e-mail. Elle expose les pistes potentielles, les critères manquants et les prochaines actions, sans annoncer d’éligibilité ni promettre un financement. Le prospect choisit ensuite entre conserver l’aperçu sans relance ou demander un premier examen humain. Ce choix reste transmis avec la demande et exploitable dans le suivi commercial.

Les nouvelles catégories du formulaire couvrent préparation de sortie, financement, montage de dossier, back-office, distribution, accompagnement, administration et stratégie. « Distribution » qualifie un besoin ; elle ne suppose ni partenaire, ni contrat, ni mise en ligne automatique. Les intitulés envoyés restent compatibles avec la propriété texte « Offre envisagée » du CRM.

Validation finale locale : 20 tests serveur réussis, typecheck et build réussis, 12 pages contrôlées sur 6 largeurs sans débordement, scénarios Sprint 02 réussis, et parcours financement réussi sur Chromium et WebKit avec zéro violation axe détectée sur les pages contrôlées. Le test mobile couvre 120 rendus, dont 430 × 932, sans erreur navigateur.

## Plan de projet immédiat — 20 octobre 2026

Tous les parcours produisent désormais une synthèse avant les coordonnées : éléments déjà cadrés, points à verrouiller et trois prochaines actions adaptées au service choisi. Le financement ajoute ensuite les pistes officielles et leurs limites. Le résultat peut être téléchargé en Markdown pour rester lisible et devenir plus tard la source d’une page privée ou d’un e-mail transactionnel.

Cette synthèse est calculée à partir des réponses. Elle ne prétend pas provenir d’une IA ou d’un manager humain. Aucun e-mail ni abonnement marketing n’est activé. Validation : 23 tests serveur, typecheck et build réussis ; parcours complet, export Markdown et quatre variantes financement réussis sur Chromium et WebKit ; 120 rendus mobiles sans débordement ni erreur navigateur.
