import duoFloatingTransparent from '../assets/shoot/duo-floating-transparent.png'
import emeraldBackTransparent from '../assets/shoot/emerald-back-transparent.png'
import emeraldFrontTransparent from '../assets/shoot/emerald-front-transparent.png'
import emeraldWearBack from '../assets/shoot/emerald-wear-back.png'
import emeraldWearFront from '../assets/shoot/emerald-wear-front.png'
import emeraldMirrorWear from '../assets/shoot/emerald-mirror-wear.png'
import emeraldPackaging from '../assets/shoot/emerald-packaging.png'
import emeraldSideTransparent from '../assets/shoot/emerald-side-transparent.png'
import emeraldThreeQuarterStudio from '../assets/shoot/emerald-three-quarter-studio.png'
import emeraldWearProfile from '../assets/shoot/emerald-wear-profile.png'
import rooftopCampaign from '../assets/shoot/rooftop-campaign.png'
import rubyBackTransparent from '../assets/shoot/ruby-back-transparent.png'
import rubyFrontTransparent from '../assets/shoot/ruby-front-transparent.png'
import rubyMacroCross from '../assets/shoot/ruby-macro-cross.png'
import rubySideTransparent from '../assets/shoot/ruby-side-transparent.png'
import rubyThreeQuarterStudio from '../assets/shoot/ruby-three-quarter-studio.png'
import rubyWearFront from '../assets/shoot/ruby-wear-front.png'
import rubyWearProfile from '../assets/shoot/ruby-wear-profile.png'

export const siteUrl = 'https://kymia.fr'

export const brand = {
  name: 'Kymia',
  uppercaseName: 'KYMIA',
  statement: 'Rare comme toi.',
  tagline: 'Streetwear chic. Série courte. Présence immédiate.',
  description:
    'Kymia imagine des pièces nettes, courtes et désirables, pensées pour faire entrer la rue dans un registre de maison.',
  email: 'concierge@kymia.fr',
  phone: '+33 1 89 71 20 26',
  address: '12 rue du Faubourg Saint-Honoré, 75008 Paris',
  founded: '2026',
  social: [
    { label: 'Instagram', url: 'https://instagram.com/kymia', handle: '@kymia' },
    { label: 'TikTok', url: 'https://tiktok.com/@kymia', handle: '@kymia' },
    { label: 'Pinterest', url: 'https://pinterest.com/kymia', handle: '@kymia' },
  ],
}

export const navigation = [
  { label: 'Collection', path: '/collection' },
  { label: 'Maison', path: '/house' },
]

export const shippingFee = 5
export const shippingFreeThreshold = 50

export const promoCodes = {
  WELCOME10: {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    label: '10 % de bienvenue',
    minSubtotal: 0,
  },
  KYMIA5: {
    code: 'KYMIA5',
    type: 'amount',
    value: 5,
    label: '5 € offerts',
    minSubtotal: 35,
  },
  FONDATEUR: {
    code: 'FONDATEUR',
    type: 'percent',
    value: 15,
    label: '15 % cercle fondateur',
    minSubtotal: 80,
  },
}

export function resolvePromoCode(input) {
  if (!input) return null
  const key = String(input).trim().toUpperCase()
  return promoCodes[key] ?? null
}

export function computePromoDiscount(promo, subtotal) {
  if (!promo) return 0
  if (subtotal < (promo.minSubtotal ?? 0)) return 0
  if (promo.type === 'percent') {
    return Math.round(subtotal * (promo.value / 100))
  }
  if (promo.type === 'amount') {
    return Math.min(promo.value, subtotal)
  }
  return 0
}

export const announcement = 'Drop 01 · Crown Series · Livraison offerte dès 50 € · Retours 30 jours'

export const announcementRotation = [
  'Livraison offerte dès 50 € · Expédition sous 24 à 48 h',
  'Paiement en 4× sans frais · Retours 30 jours encadrés',
]

export const trustMetrics = [
  { value: '24', label: 'Pièces — série Emerald' },
  { value: '48h', label: 'Préparation moyenne' },
  { value: '4×', label: 'Paiement fractionné' },
  { value: '30j', label: 'Retours encadrés' },
]

function buildMediaPlan(colorFrench, colorEnglish) {
  return {
    wear: {
      label: 'Porté mannequin',
      count: 5,
      copy: 'Prévu : face, 3/4, profil, 3/4 dos et dos pour projeter la silhouette.',
      prompts: [
        {
          label: 'Face',
          usage: 'Hero campagne / ouverture PDP',
          prompt: `Front portrait of male model wearing ${colorEnglish} premium baseball cap, luxury streetwear editorial photography, clean mineral ivory background, calm strong expression, premium styling, ultra realistic, 85mm lens`,
        },
        {
          label: 'Trois-quarts',
          usage: 'Galerie portée / projection silhouette',
          prompt: `Three-quarter portrait of male model wearing ${colorEnglish} premium baseball cap, visible brim curve and side patch, luxury streetwear campaign image, mineral ivory background, ultra realistic`,
        },
        {
          label: 'Profil et dos',
          usage: 'Preuve porté / construction',
          prompt: `Side profile and back portrait series of male model wearing ${colorEnglish} premium baseball cap, clean mineral ivory background, luxury streetwear editorial image, visible cap structure and rear strap, ultra realistic`,
        },
      ],
    },
    detail: {
      label: 'Macros détails',
      count: 3,
      copy: 'Prévu : broderie, croix perlées et patch côté pour lire la pièce de près.',
      prompts: [
        {
          label: 'Broderie',
          usage: 'Section détails PDP',
          prompt: `Extreme macro shot of white gothic embroidery on a luxury baseball cap, rich thread texture, couture stitching detail, soft directional editorial light, ultra realistic`,
        },
        {
          label: 'Croix perlées',
          usage: 'Section détails PDP / preuve qualité',
          prompt: `Extreme macro luxury product shot of jeweled cross detail on premium baseball cap, pearl and rhinestone embellishment, subtle gold reflections, ultra realistic couture accessory photography`,
        },
        {
          label: 'Patch côté',
          usage: 'Section détails PDP / construction',
          prompt: `Macro close-up of embroidered side patch on premium baseball cap, high stitch detail, textured twill fabric, soft editorial lighting, ultra realistic`,
        },
      ],
    },
    spin: {
      label: 'Rotation 360',
      count: 8,
      copy: 'Prévu : série studio multi-angles pour faire tourner la casquette proprement.',
      prompts: [
        {
          label: 'Template 360',
          usage: 'Module rotation produit',
          prompt: `Luxury studio product photography of a ${colorEnglish} premium baseball cap, angle [0/45/90/135/180/225/270/315 degrees], white gothic embroidery, jeweled cross details, clean mineral ivory seamless background, same centered framing, same lighting, same shadow, ultra realistic, e-commerce spin set consistency`,
        },
      ],
    },
  }
}

export const products = [
  {
    id: 'emerald',
    groupId: 'crown-series',
    slug: 'emerald-crown',
    sku: 'KYM-CRWN-EMR',
    name: 'Emerald Crown',
    familyName: 'Crown Series',
    color: 'Vert impérial',
    colorCode: 'green',
    hex: '#1a4d3a',
    badge: 'Signature',
    status: 'Disponible',
    price: 25,
    compareAt: 30,
    deliveredPrice: 30,
    inventory: 24,
    rating: 4.9,
    reviewCount: 127,
    heroImage: emeraldFrontTransparent,
    secondaryImage: emeraldBackTransparent,
    seoText:
      'Casquette premium verte Kymia, broderie signature et détails joaillerie.',
    tagline: 'La plus calme. La plus luxueuse.',
    lead:
      'Vert profond, broderie signature, présence calme. La pièce la plus silencieuse de la Crown Series.',
    story:
      "Emerald Crown est faite pour durer. Couture renforcée, monogramme brodé, structure nette et couleur profonde qui change selon la lumière. C'est une pièce de rue pensée avec une logique de maison : présence sobre de loin, détails plus riches de près.",
    chips: ['Fait main', 'Série 24', 'Twill premium', 'Broderie main', 'Accès privé'],
    highlights: [
      'Face structurée pour porter le monogramme sans mollesse.',
      'Croix perlées et broderie surélevée pour une lecture franche.',
      'Fermeture ajustable et silhouette propre à 360 degrés.',
    ],
    specs: [
      ['Matière', 'Twill premium 100% coton'],
      ['Broderie', 'Fil de soie, applique main'],
      ['Ajustement', 'Taille unique ajustable (56–60 cm)'],
      ['Porté', 'Silhouette nette, légèrement haute'],
      ['Fabrication', 'Atelier partenaire — Portugal'],
      ['Entretien', 'Nettoyage localisé à froid'],
    ],
    gallery: [
      {
        id: 'front',
        mode: 'studio',
        label: 'Face',
        title: 'Lecture frontale',
        text: 'Le monogramme et les croix perlées installent immédiatement le code Kymia.',
        usage: 'Collection, hero produit, fiche produit',
        image: emeraldFrontTransparent,
        alt: 'Casquette Kymia Emerald Crown vue de face',
      },
      {
        id: 'three-quarter',
        mode: 'studio',
        label: '3/4',
        title: 'Angle signature',
        text: 'Le meilleur angle pour lire la courbe de visière, le volume de la face et le patch côté.',
        usage: 'Hero produit, collection, fiche produit',
        image: emeraldThreeQuarterStudio,
        alt: 'Casquette Kymia Emerald Crown vue en trois-quarts',
      },
      {
        id: 'side',
        mode: 'studio',
        label: 'Profil',
        title: 'Patch latéral',
        text: 'Le profil montre la construction, le patch maison et la tenue du twill.',
        usage: 'Fiche produit, preuve construction',
        image: emeraldSideTransparent,
        alt: 'Casquette Kymia Emerald Crown vue de profil',
      },
      {
        id: 'back',
        mode: 'studio',
        label: 'Dos',
        title: 'Ligne arrière',
        text: 'Une ligne arrière propre, réglable et cohérente avec la lecture premium du produit.',
        usage: 'Fiche produit, preuve construction, rotation future',
        image: emeraldBackTransparent,
        alt: 'Casquette Kymia Emerald Crown vue de dos',
      },
      {
        id: 'wear-front',
        mode: 'wear',
        label: 'Face',
        title: 'Porté frontal',
        text: 'La lecture la plus directe du produit sur silhouette réelle.',
        usage: 'PDP porté, projection silhouette',
        image: emeraldWearFront,
        alt: 'Modèle portant la casquette Kymia Emerald Crown de face',
      },
      {
        id: 'wear-profile',
        mode: 'wear',
        label: 'Profil',
        title: 'Porté latéral',
        text: 'Le profil valide la courbe de visière, la tenue et la lecture du patch côté.',
        usage: 'PDP porté, projection silhouette',
        image: emeraldWearProfile,
        alt: 'Modèle portant la casquette Kymia Emerald Crown de profil',
      },
      {
        id: 'wear-back',
        mode: 'wear',
        label: 'Dos',
        title: 'Porté arrière',
        text: 'La vue dos confirme la ligne arrière, le réglage et la signature discrète.',
        usage: 'PDP porté, preuve construction',
        image: emeraldWearBack,
        alt: 'Modèle portant la casquette Kymia Emerald Crown vue de dos',
      },
      {
        id: 'wear-mirror',
        mode: 'wear',
        label: 'Miroir',
        title: 'Lecture miroir',
        text: 'Un porté plus éditorial, proche du geste client au quotidien.',
        usage: 'PDP porté, projection silhouette, maison',
        image: emeraldMirrorWear,
        alt: 'Modèle portant la casquette Kymia Emerald Crown face à un miroir',
      },
    ],
    plannedMedia: buildMediaPlan('Vert impérial', 'emerald green'),
    reviews: [
      {
        author: 'Adèle M.',
        role: 'Paris — 8ᵉ',
        rating: 5,
        date: '2026-03-18',
        quote: "La pièce a une vraie tenue. On n'est pas sur une simple casquette logo.",
      },
      {
        author: 'Stylist note',
        role: 'Editorial sample',
        rating: 5,
        date: '2026-03-11',
        quote: 'Le vert fonctionne immédiatement avec denim, cuir ou tailoring léger.',
      },
      {
        author: 'Karim L.',
        role: 'Lyon',
        rating: 5,
        date: '2026-02-27',
        quote: "Finitions au niveau d'une maison, prix beaucoup plus doux. Achat rare.",
      },
    ],
  },
  {
    id: 'ruby',
    groupId: 'crown-series',
    slug: 'ruby-crown',
    sku: 'KYM-CRWN-RBY',
    name: 'Ruby Crown',
    familyName: 'Crown Series',
    color: 'Rouge royal',
    colorCode: 'red',
    hex: '#8b1a2b',
    badge: 'Drop 01',
    status: 'Stock bas',
    price: 25,
    compareAt: 30,
    deliveredPrice: 30,
    inventory: 18,
    rating: 4.8,
    reviewCount: 94,
    heroImage: rubyFrontTransparent,
    secondaryImage: rubyBackTransparent,
    seoText:
      'Casquette premium rouge Kymia, luxe urbain, broderie statement et finitions exclusives.',
    tagline: 'La plus magnétique. La plus audacieuse.',
    lead:
      'Rouge dense, contraste direct, impact frontal. La lecture la plus visible de la Crown Series.',
    story:
      "Ruby est un choix, pas un accessoire. La teinte est pensée pour tenir à distance, mais rester premium en main. Elle fonctionne comme une déclaration nette : plus directe, plus visuelle, plus mémorisable. Après ce drop, cette couleur ne reviendra pas telle quelle.",
    chips: ['Fait main', 'Drop 01', 'Série 18', 'Broderie main', 'Collector'],
    highlights: [
      'Coloris fort pour la photo, la silhouette et la présence.',
      'Énergie streetwear avec une construction premium.',
      'Lisibilité immédiate à distance.',
    ],
    specs: [
      ['Matière', 'Twill premium 100% coton'],
      ['Broderie', 'Fil de soie, applique main'],
      ['Ajustement', 'Taille unique ajustable (56–60 cm)'],
      ['Porté', 'Statement frontal'],
      ['Fabrication', 'Atelier partenaire — Portugal'],
      ['Entretien', 'Nettoyage localisé à froid'],
    ],
    gallery: [
      {
        id: 'front',
        mode: 'studio',
        label: 'Face',
        title: 'Statement frontal',
        text: 'Le rouge accentue le contraste du monogramme et donne au produit une lecture plus directe.',
        usage: 'Collection, hero alternatif, fiche produit',
        image: rubyFrontTransparent,
        alt: 'Casquette Kymia Ruby Crown vue de face',
      },
      {
        id: 'three-quarter',
        mode: 'studio',
        label: '3/4',
        title: 'Angle statement',
        text: 'Le trois-quarts garde toute la force du rouge et ouvre la lecture du patch côté.',
        usage: 'Collection, hero alternatif, fiche produit',
        image: rubyThreeQuarterStudio,
        alt: 'Casquette Kymia Ruby Crown vue en trois-quarts',
      },
      {
        id: 'side',
        mode: 'studio',
        label: 'Profil',
        title: 'Patch latéral',
        text: 'Le profil montre le patch maison, la croix latérale et la tenue du rouge royal.',
        usage: 'Fiche produit, preuve construction',
        image: rubySideTransparent,
        alt: 'Casquette Kymia Ruby Crown vue de profil',
      },
      {
        id: 'back',
        mode: 'studio',
        label: 'Dos',
        title: 'Construction arrière',
        text: 'La vue dos montre l’ajustement, la boucle et la signature KYMIA brodée.',
        usage: 'Fiche produit, preuve construction, rotation future',
        image: rubyBackTransparent,
        alt: 'Casquette Kymia Ruby Crown vue de dos',
      },
      {
        id: 'wear-front',
        mode: 'wear',
        label: 'Face',
        title: 'Porté frontal',
        text: 'Le rouge prend de la force au porté tout en gardant une lecture premium.',
        usage: 'PDP porté, projection silhouette',
        image: rubyWearFront,
        alt: 'Modèle portant la casquette Kymia Ruby Crown de face',
      },
      {
        id: 'wear-profile',
        mode: 'wear',
        label: 'Profil',
        title: 'Porté latéral',
        text: 'Le profil confirme la présence du coloris et la lecture du patch côté.',
        usage: 'PDP porté, projection silhouette',
        image: rubyWearProfile,
        alt: 'Modèle portant la casquette Kymia Ruby Crown de profil',
      },
      {
        id: 'detail-cross',
        mode: 'detail',
        label: 'Macro',
        title: 'Croix perlée',
        text: 'La macro révèle la qualité joaillière du détail, entre perles, métal doré et strass.',
        usage: 'PDP détails, preuve qualité',
        image: rubyMacroCross,
        alt: 'Macro de la croix perlée sur la casquette Kymia Ruby Crown',
      },
    ],
    plannedMedia: buildMediaPlan('Rouge royal', 'ruby red'),
    reviews: [
      {
        author: 'Noé T.',
        role: 'Marseille',
        rating: 5,
        date: '2026-03-22',
        quote: "La couleur est forte mais la pièce reste premium. C'est ce qui fait la différence.",
      },
      {
        author: 'Style desk',
        role: 'Campaign note',
        rating: 5,
        date: '2026-03-09',
        quote: 'Très efficace avec gris chiné, noir profond et denim lavé clair.',
      },
      {
        author: 'Inès D.',
        role: 'Bordeaux',
        rating: 4,
        date: '2026-02-19',
        quote: 'Présence immédiate sans être vulgaire. Le bon dosage.',
      },
    ],
  },
]

export const bundles = [
  {
    id: 'double-crown',
    slug: 'double-crown-set',
    name: 'Double Crown Set',
    badge: 'Best seller',
    image: duoFloatingTransparent,
    price: 50,
    compareAt: 60,
    deliveredPrice: 50,
    products: ['emerald', 'ruby'],
    description:
      'Emerald + Ruby. Calme + déclaration. Deux lectures de la même signature, réunies dans le set fondateur.',
    perks: [
      '10 € d\'économies, livraison incluse',
      '50 € livrés en France métropolitaine',
      'Silhouette complète signée Kymia',
      'Carte de maison et pochette textile',
    ],
  },
]

export const houseVisuals = [
  {
    id: 'rooftop-campaign',
    image: rooftopCampaign,
    eyebrow: 'Campagne',
    title: 'La pièce dans la ville.',
    text: 'Deux lectures de Crown Series dans une lumière de fin de jour. La marque gagne en désir quand elle sort du simple studio.',
    alt: 'Deux modèles portant les casquettes Kymia sur un rooftop au coucher du soleil',
  },
  {
    id: 'packaging',
    image: emeraldPackaging,
    eyebrow: 'Expérience',
    title: 'Le produit continue à la réception.',
    text: 'Packaging, carte maison et poche textile prolongent la perception premium au-delà de la page produit.',
    alt: 'Casquette Kymia Emerald Crown dans son packaging premium',
  },
]

export const serviceHighlights = [
  {
    title: 'Livraison soignée',
    text: '5 € en France, puis offerte dès 50 € d\'achat avec suivi propre et préparation méticuleuse.',
    icon: 'shipping',
  },
  {
    title: 'Retours encadrés',
    text: 'Un cadre clair, sans friction inutile, pour acheter avec plus de sérénité. 30 jours.',
    icon: 'returns',
  },
  {
    title: 'Paiements multiples',
    text: 'Carte, PayPal, Apple Pay ou paiement fractionné 4× selon le rythme souhaité.',
    icon: 'payment',
  },
  {
    title: 'Accès privé',
    text: 'Préventes, alertes de réappro et messages réservés aux membres avant le public.',
    icon: 'access',
  },
]

export const lookbookStories = [
  {
    title: 'Campaign 01',
    subtitle: 'Monochrome authority',
    text: 'Une présence qui ne négocie rien : angle propre, contraste fort, lecture immédiate.',
  },
  {
    title: 'Studio Close-Up',
    subtitle: 'Texture & sign',
    text: 'Les détails sont le langage. Matière, relief et signe doivent se voir sans effort.',
  },
  {
    title: 'Street Formal',
    subtitle: 'Tailoring meets cap',
    text: 'Quand denim croise couture. Quand la rue rencontre enfin une logique d\'atelier.',
  },
]

export const testimonials = [
  {
    quote: 'Le produit doit tenir dans la main avant de tenir dans l\'image.',
    attribution: 'House note',
  },
  {
    quote: 'Peu de pièces. Fortes. Mémorables. C\'est comme ça qu\'une signature se construit.',
    attribution: 'Studio memo',
  },
  {
    quote: 'Chaque détail compte parce que la rue lit tout, même à distance.',
    attribution: 'Creative direction',
  },
]

export const clientReviews = [
  {
    id: 'r1',
    quote: 'La broderie est nette, la matière tient vraiment dans le temps. On sent l\'attention au détail.',
    author: 'Inès L.',
    role: 'Paris · commande Emerald',
    rating: 5,
  },
  {
    id: 'r2',
    quote: 'Livraison rapide, packaging soigné, la pièce est encore plus belle que sur le site.',
    author: 'Jonas M.',
    role: 'Lyon · set fondateur',
    rating: 5,
  },
  {
    id: 'r3',
    quote: 'Kymia est devenu la casquette que je porte tous les jours. Propre, forte, passe-partout.',
    author: 'Sofia R.',
    role: 'Bruxelles · commande Ruby',
    rating: 5,
  },
]

export const pressMentions = [
  { name: 'Hypebeast', quote: 'Une proposition nette dans un marché saturé.' },
  { name: 'Highsnobiety', quote: 'L\'art d\'un drop court, pensé comme une maison.' },
  { name: 'GQ France', quote: 'Le streetwear français passe en mode chic.' },
  { name: 'L\'Officiel', quote: 'Peu de pièces, beaucoup de présence.' },
]

export const journalArticles = [
  {
    slug: 'styling-crown-series',
    category: 'Styling',
    title: 'Porter Crown Series avec tension luxe.',
    excerpt:
      'Associations nettes, contrastes utiles et silhouettes qui laissent la Crown respirer.',
    readingTime: '4 min',
    date: '15 avril 2026',
  },
  {
    slug: 'inside-the-drop',
    category: 'Drop',
    title: 'Pourquoi un premier drop doit déjà poser la maison.',
    excerpt:
      'Comment une capsule courte peut installer le désir, le rythme et la répétition.',
    readingTime: '5 min',
    date: '08 avril 2026',
  },
  {
    slug: 'care-and-presence',
    category: 'Care',
    title: 'Entretenir la pièce sans perdre sa tenue.',
    excerpt:
      'Soin, rangement et gestes simples qui prolongent la présence du produit.',
    readingTime: '3 min',
    date: '29 mars 2026',
  },
]

export const membershipPerks = [
  'Accès 24h avant le public',
  'Alertes de retour stock',
  'Invitations showroom privé',
  'Sélections curatoriales mensuelles',
  'Concierge dédié',
  'Cadeau d\'anniversaire maison',
]

export const faqGroups = [
  {
    title: 'Produit',
    items: [
      {
        question: 'La casquette est-elle ajustable ?',
        answer:
          'Oui. Chaque pièce est pensée pour un porté ajustable (56–60 cm), propre et confortable, avec une silhouette qui reste nette sur différents profils.',
      },
      {
        question: 'Comment entretenir la pièce ?',
        answer:
          "Nettoyage doux localisé à froid, rangement propre et éviter d'écraser la face avant pour préserver la tenue. Ne pas laver en machine.",
      },
      {
        question: 'D\'où vient la fabrication ?',
        answer:
          "Les pièces Kymia sont fabriquées au Portugal par un atelier partenaire spécialisé dans la broderie premium.",
      },
    ],
  },
  {
    title: 'Commande',
    items: [
      {
        question: "Quel est le délai d'expédition ?",
        answer: 'Comptez en général 24 à 72 h ouvrées pour une expédition standard selon la destination.',
      },
      {
        question: 'Puis-je retourner ma commande ?',
        answer:
          'Oui, sous 30 jours. Les retours sont traités sous 5 jours ouvrés après réception. Frais de retour offerts en France.',
      },
      {
        question: 'Livrez-vous à l\'international ?',
        answer:
          "Oui, Union européenne et international avec suivi complet. Taxes et frais affichés clairement au checkout.",
      },
    ],
  },
  {
    title: 'Maison',
    items: [
      {
        question: 'La collection est-elle limitée ?',
        answer:
          'Oui. Kymia est pensée en logique de drops : peu de pièces, plus de désir, plus de retour sur le site.',
      },
      {
        question: 'Aurez-vous d\'autres catégories ?',
        answer:
          "Oui. Le vestiaire est pensé pour s'ouvrir ensuite au textile, aux accessoires et aux capsules éditoriales.",
      },
      {
        question: 'Comment rejoindre l\'accès privé ?',
        answer:
          "L'accès est gratuit sur inscription. Préventes, réassorts et invitations sont réservés aux membres 24 h avant le public.",
      },
    ],
  },
]

export const shippingModules = [
  {
    title: 'Préparation',
    text: 'Préparation en 24 à 48h. Chaque pièce part avec un niveau de soin cohérent avec la marque.',
  },
  {
    title: 'Livraison France',
    text: '5 € par commande en France métropolitaine, puis offerte dès 50 € d\'achat, avec suivi et présentation propre à réception.',
  },
  {
    title: 'International',
    text: 'UE à partir de 12 €, international à partir de 18 €, avec suivi complet et taxes affichées clairement au checkout.',
  },
]

export const returnSteps = [
  'Demande simple depuis le compte ou via le concierge (concierge@kymia.fr).',
  "Validation rapide et étiquette retour si la demande est conforme.",
  'Contrôle puis remboursement ou échange sous 5 jours ouvrés.',
  'Retours gratuits en France. Frais de retour à la charge du client à l\'international.',
]

export const paymentMethods = ['Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay', '4× sans frais']

export const houseSections = [
  {
    title: 'Produit icône',
    text: "Une seule catégorie forte pour commencer. Cela concentre le désir et fixe la lecture de la marque.",
  },
  {
    title: 'Merchandising court',
    text: 'Peu de références, des lectures claires, des sets utiles et des éditions qui gardent leur tension.',
  },
  {
    title: 'Rythme de maison',
    text: 'Des gestes répétables : drops, accès privé, service fiable et contenus qui prolongent la désirabilité.',
  },
]

export const houseTimeline = [
  { label: 'Drop 01', period: 'Avril 2026', text: 'Crown Series et set fondateur.' },
  { label: 'Drop 02', period: 'Été 2026', text: 'Nouveaux coloris et première pièce textile compagne.' },
  { label: 'Drop 03', period: 'Automne 2026', text: 'Capsule éditoriale, gifting et montée du panier moyen.' },
  { label: 'Drop 04', period: 'Hiver 2026', text: 'Collaboration studio, séries ultra-courtes et pièce signature.' },
]

export const seoDefaults = {
  title: 'Kymia · Maison de streetwear chic',
  description:
    'Kymia, maison de streetwear chic : casquettes premium, set fondateur, journal de marque et expérience e-commerce haut de gamme.',
  image: `${siteUrl}/brand-logo.png`,
}

export const commercePromises = [
  'Paiement sécurisé',
  'Retours sous 30 jours',
  'Livraison soignée',
  'Concierge disponible',
]

export const emailCaptureCTA = {
  headline: 'Entrer avant le public',
  subheadline: 'Accès privé 24h avant les drops, alertes de réappro et sélections réservées.',
  buttonText: "S'inscrire",
  placeholder: 'Votre e-mail',
  successMessage: 'C\'est noté. Vous verrez les drops avant les autres.',
}

export const sizeGuide = {
  title: 'Guide des tailles',
  intro: 'Les casquettes Kymia sont conçues en taille unique ajustable. Pour un porté net, mesurez le tour de tête à 1 cm au-dessus des sourcils.',
  table: [
    { size: 'S / M', cm: '54–57 cm', note: 'Ajustement serré' },
    { size: 'M / L', cm: '57–59 cm', note: 'Porté signature' },
    { size: 'L / XL', cm: '59–61 cm', note: 'Porté détendu' },
  ],
}

export const cartUrgencyText = (subtotal) => {
  if (subtotal <= 0) {
    return 'Ajoutez une pièce pour calculer la livraison'
  }

  if (subtotal < shippingFreeThreshold) {
    return `Plus que ${shippingFreeThreshold - subtotal} € pour la livraison offerte`
  }

  return 'Livraison offerte active'
}

export const exitIntentOffer = {
  headline: 'Vous repartez sans une Crown ?',
  description: 'Code KYMIA10 — 10 % sur votre première commande. Valide 24h.',
  code: 'KYMIA10',
  cta: 'Réclamer le code',
}

export const trustSignals = [
  {
    icon: '24H',
    title: 'Préparation rapide',
    description: 'Préparation soignée sous 24 à 48h avant expédition.'
  },
  {
    icon: '30J',
    title: 'Retours encadrés',
    description: 'Une politique claire pour acheter avec plus de sérénité.'
  },
  {
    icon: 'VIP',
    title: 'Accès privé',
    description: 'Les prochains drops se voient avant le public.'
  },
  {
    icon: '4×',
    title: 'Paiement flexible',
    description: 'Carte, PayPal, Apple Pay et paiement fractionné.'
  }
]

export const pressQuotes = [
  { source: 'Numéro', quote: 'Kymia réussit le pari rare : faire du streetwear une discipline de maison.' },
  { source: 'Highsnobiety', quote: 'Une première collection qui respire la retenue et la maîtrise.' },
  { source: 'L\'Officiel', quote: 'Le détail compte, la silhouette tient — Kymia pose sa signature.' },
]

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug) ?? null
}

export function getProductById(id) {
  return products.find((product) => product.id === id) ?? null
}

export function getBundleById(id) {
  return bundles.find((bundle) => bundle.id === id) ?? null
}

export function getBundleProducts(bundle) {
  return bundle.products.map((id) => getProductById(id)).filter(Boolean)
}
