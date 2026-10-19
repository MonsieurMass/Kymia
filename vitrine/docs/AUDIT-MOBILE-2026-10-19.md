# KYMIA WORLD — audit et corrections mobiles

19 octobre 2026. Cible prioritaire : simulation Pro Max 440 × 956 pixels CSS, interaction tactile et densité ×3. Cette recette n’est pas une inspection sur un iPhone 17 Pro Max physique.

## Constats et corrections

| Constat mesuré avant correction | Intervention |
|---|---|
| Accueil : zone principale forcée à 640 px, longue zone vide après les liens | Hauteur dictée par le contenu ; environ 507 px au format cible, soit 133 px de moins |
| Disque placé derrière le contenu et les actions | Disque déplacé vers le bord droit, masque progressif ; contraste et titre préservés |
| Liens de pied de page de 18 px, liens secondaires de 21 à 27 px | Zones tactiles de 44 px minimum ; actions principales de 52 px minimum |
| Formulaire à environ 399 px du haut | Introduction plus courte et carte à environ 346 px ; continuer visible dans le premier écran au format cible |
| Menu disparaissant lors du défilement, sans fermeture extérieure | En-tête mobile sticky, fermeture par toucher extérieur, Échap ou lien ; hauteur du menu limitée au viewport dynamique |
| Titres de services longs et tailles imposées | Typographie fluide, interlignage et retours recalibrés, actions sur toute la largeur utile |
| Changement d’étape peu confortable après défilement | Repositionnement de la carte, focus au titre sans couvrir le contenu par l’en-tête |
| Zones sûres iOS non prises en compte | viewport-fit cover, marges safe-area et bas de page adaptés ; zoom utilisateur conservé |
| Expression « diagnostic préliminaire » encore présente | Alignement sur « premier examen gratuit » |

Les couleurs noir, papier et cobalt, Barlow Condensed / DM Sans, le disque, les animations et la structure éditoriale sont conservés. Aucun script publicitaire, paiement ou nouvelle dépendance applicative ajouté. WebKit a été installé uniquement comme outil gratuit de recette locale.

## Vérifications

Rapport détaillé des deux moteurs : `report.json`. Captures avant/après dans ce dossier. Tests du parcours soumis à une interception locale : aucune donnée de test au CRM commercial.

- Chromium et WebKit : contrôle de 12 pages aux formats 320 × 740, 375 × 812, 390 × 844, 440 × 956 et 956 × 440.
- Contrôle des débordements, menu tactile et clavier, focus après changement d’étape, formulaire complet et correction depuis le récapitulatif.
- Hauteur de viewport réduite pour une étape du formulaire afin de vérifier l’accès aux champs et actions ; cela ne simule pas intégralement le clavier logiciel iOS.
- Axe sur accueil, formulaire et financement ; ce contrôle ne constitue pas une certification WCAG.
- Tests existants serveur, formulaire avec réponse perdue, et navigateur général relancés.

## Limites à vérifier sur téléphone

Sur un véritable iPhone : clavier Apple et autofill, déplacement des barres Safari, Dynamic Island, gestes de retour, VoiceOver et texte agrandi dans les réglages système. Aucun test automatisé ne valide à lui seul ces comportements matériels.

Les exigences de publication du Sprint 02 restent applicables : informations juridiques et commerciales à confirmer, supervision continue à organiser, Preview réservée aux données fictives, non-indexation et protection d’accès conservées.

Méthode : [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), audit du code et mesures navigateur. Les observations ci-dessus sont propres au projet, pas une simple application déclarative de la checklist.

Résultats obtenus : 120 contrôles de mise en page réussis (60 par moteur), aucun débordement horizontal, parcours complet et menu réussis sur les deux moteurs, zéro violation axe sur les trois pages contrôlées pour chacun. Les 13 tests serveur et les suites navigateur existantes passent. TypeScript et build de production vérifiés.
