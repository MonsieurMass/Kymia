# Connexion au CRM KYMIA

## Destination vérifiée

- Espace : Kymia Music’s Space.
- Base existante : [KYMIA World | Pipeline commercial](https://app.notion.com/p/dcf3abce3d9d8236a1a101edcdf655a8).
- Source : `8953abce-3d9d-826b-b387-879e4c24d7bf`.
- Intégration interne existante : Kymia CRM. Ses capacités existantes n’ont pas été changées. Accès au pipeline ajouté, sans partage de la page générale KYMIA OS ni des autres bases métier.
- Le jeton a été copié via l’interface officielle Notion dans `.env.local`, permissions 0600, ignoré par Git et exclu des archives. Il n’est pas transmis au navigateur.

## Mapping sans modification du CRM

| Formulaire | Propriété Notion |
|---|---|
| Artiste + type de projet | Opportunité : « Artiste — EP », par exemple |
| Courriel | Contact |
| Service demandé | Offre envisagée |
| Statut initial | Phase = À qualifier |
| Structure | Segment existant : Association, Label, Artiste ou Autre |
| Origine | Source acquisition = Inbound |
| Description, maturité, budget, calendrier, lien, consentement et référence | Notes |
| Suivi initial | Prochaine action = Examiner la demande et préparer un premier échange |

Le budget du projet n’est jamais utilisé comme montant estimé, signé, facturé ou encaissé d’une prestation KYMIA. Aucun responsable n’est attribué arbitrairement. Les demandes n’alimentent pas les bases de projets stratégiques ou d’artistes : le pipeline commercial est le point d’entrée.

## Réception et reprise

1. Validation du formulaire et de la notice `notion-v1`.
2. Sauvegarde locale chiffrée avec référence stable.
3. Recherche dans Notes du marqueur `KYMIA-WEB:<référence>` avant création.
4. Création dans le pipeline ; sauvegarde privée de l’ID Notion et de la date de confirmation.
5. En cas d’échec ou de réponse réseau ambiguë, conservation de la demande et état pending. Temporisation de 60 secondes puis recul progressif jusqu’à une heure ; respect du Retry-After.
6. Reprise toutes les 30 secondes tant que le serveur Node est en marche, puis au prochain démarrage. Après une réponse ambiguë, nouvelle recherche avant toute création.

Les reçus `*.delivery.json` ne contiennent pas le formulaire. Verrou local par référence contre les envois concurrents ; reprise d’un verrou abandonné après cinq minutes. Aucun statut commercial n’est écrasé après synchronisation. Une demande retransmise avec la même référence n’est pas recréée. Une nouvelle référence constitue une nouvelle demande : pas de déduplication arbitraire par nom d’artiste.

Le client distingue les états transmis, transmission en attente et configuration absente. Il ne voit ni erreur technique Notion ni jeton. Les anciennes demandes qui avaient accepté seulement un stockage local ne sont pas transférées.

## Commandes

```sh
npm run notion:check
npm run notion:sync
```

Variables serveur dans `.env.local` : `NOTION_TOKEN`, `NOTION_DATA_SOURCE_ID`, `KYMIA_NOTION_WORKER=true`. Changement de variable : redémarrer le serveur. Une copie source de l’archive nécessite sa propre configuration de jeton.

## Limites d’exploitation

Cette livraison fonctionne sur le serveur local avec disque persistant. Si le Mac ou le serveur est arrêté, il ne reçoit pas de demandes et la reprise attend le redémarrage. Pour Vercel, remplacer le stockage local et le timer par une base/outbox durable et un ordonnanceur avant publication. L’API Notion n’impose pas de contrainte d’unicité : les verrous et recherches réduisent les doublons, sans garantie universelle exactly-once lors de pannes prolongées ou d’instances sur des disques séparés. Une clé perdue empêche la récupération locale. Pas de notification e-mail ajoutée.

Sources : API Notion versionnée `2025-09-03`, https://developers.notion.com/reference/post-page et documentation officielle du modèle de sources de données : https://developers.notion.com/docs/upgrade-guide-2025-09-03 .
