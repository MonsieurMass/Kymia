import {
  brand,
  bundles,
  faqGroups,
  navigation,
  products,
  seoDefaults,
  shippingFee,
  siteUrl,
} from '../content/siteContent'

function canonical(path) {
  return `${siteUrl}${path === '/' ? '' : path}`
}

function breadcrumbItems(route, activeProduct) {
  const crumbs = [{ name: 'Accueil', path: '/' }]

  if (route.page === 'collection') {
    crumbs.push({ name: 'Collection', path: '/collection' })
  }

  if (route.page === 'product' && activeProduct) {
    crumbs.push({ name: 'Collection', path: '/collection' })
    crumbs.push({ name: activeProduct.name, path: `/caps/${activeProduct.slug}` })
  }

  if (route.page === 'house') {
    crumbs.push({ name: 'Maison', path: '/house' })
  }

  if (route.page === 'journal') {
    crumbs.push({ name: 'Journal', path: '/journal' })
  }

  if (route.page === 'access') {
    crumbs.push({ name: 'Accès privé', path: '/access' })
  }

  if (route.page === 'shipping') {
    crumbs.push({ name: 'Livraison & retours', path: '/shipping' })
  }

  if (route.page === 'faq') {
    crumbs.push({ name: 'FAQ', path: '/faq' })
  }

  if (route.page === 'checkout') {
    crumbs.push({ name: 'Checkout', path: '/checkout' })
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  }
}

function organizationSchema() {
  return {
    '@type': 'Organization',
    name: brand.uppercaseName,
    url: siteUrl,
    logo: `${siteUrl}/brand-logo.png`,
    description: brand.description,
    email: brand.email,
    telephone: brand.phone,
    sameAs: brand.social.map((entry) => entry.url),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: brand.phone,
        email: brand.email,
        contactType: 'customer service',
        availableLanguage: ['fr', 'en'],
      },
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'FR',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  }
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    name: brand.uppercaseName,
    url: siteUrl,
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/collection?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

function collectionSchema() {
  return {
    '@type': 'CollectionPage',
    name: 'Collection Kymia',
    url: canonical('/collection'),
    hasPart: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: canonical(`/caps/${product.slug}`),
        name: product.name,
      })),
    },
  }
}

function bundlesSchema() {
  return {
    '@type': 'ItemList',
    name: 'Bundles Kymia',
    itemListElement: bundles.map((bundle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: bundle.name,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: bundle.price,
          availability: 'https://schema.org/InStock',
          url: canonical('/collection'),
        },
      },
    })),
  }
}

function productGroupSchema(activeProduct) {
  return {
    '@type': 'ProductGroup',
    name: activeProduct.familyName,
    description:
      'Casquettes premium Kymia conçues comme une pièce de présence entre rue et maison.',
    brand: {
      '@type': 'Brand',
      name: brand.uppercaseName,
    },
    productGroupID: activeProduct.groupId,
    variesBy: ['https://schema.org/color'],
    hasVariant: products.map((product) => ({
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      color: product.color,
      image: `${siteUrl}${product.heroImage}`,
      description: product.lead,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: product.price,
        availability:
          product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: canonical(`/caps/${product.slug}`),
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'FR',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 14,
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: String(shippingFee),
            currency: 'EUR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'FR',
          },
        },
      },
    })),
  }
}

function activeProductSchema(activeProduct) {
  return {
    '@type': 'Product',
    name: activeProduct.name,
    sku: activeProduct.sku,
    color: activeProduct.color,
    image: activeProduct.gallery.map((item) => `${siteUrl}${item.image}`),
    description: activeProduct.lead,
    brand: {
      '@type': 'Brand',
      name: brand.uppercaseName,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: activeProduct.price,
      availability:
        activeProduct.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonical(`/caps/${activeProduct.slug}`),
    },
  }
}

function faqSchema() {
  return {
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    ),
  }
}

function journalSchema() {
  return {
    '@type': 'CollectionPage',
    name: 'Journal Kymia',
    url: canonical('/journal'),
  }
}

export function buildSeo(route, activeProduct) {
  const meta = {
    title: seoDefaults.title,
    description: seoDefaults.description,
    canonical: canonical(route.path),
    image: seoDefaults.image,
  }

  if (route.page === 'collection') {
    meta.title = 'Collection Kymia · Crown Series et bundles'
    meta.description =
      'Découvre Crown Series, les variantes fondatrices, les bundles et les pièces signature Kymia.'
  }

  if (route.page === 'product' && activeProduct) {
    meta.title = `${activeProduct.name} · ${brand.uppercaseName}`
    meta.description = activeProduct.seoText
  }

  if (route.page === 'house') {
    meta.title = 'Maison Kymia · Streetwear chic'
    meta.description =
      'Les codes Kymia, le rythme des drops et la vision streetwear chic qui porte la maison.'
  }

  if (route.page === 'journal') {
    meta.title = 'Journal Kymia · Styling, drops et maison'
    meta.description =
      'Conseils de style, soin de piece et coulisses de maison autour des collections Kymia.'
  }

  if (route.page === 'access') {
    meta.title = 'Accès privé Kymia · Préventes et réassorts'
    meta.description =
      'Inscris-toi pour recevoir les préventes, réassorts, invitations et annonces Kymia avant le public.'
  }

  if (route.page === 'shipping') {
    meta.title = 'Livraison et retours Kymia'
    meta.description =
      'Toutes les informations sur la préparation, la livraison, les retours et les paiements Kymia.'
  }

  if (route.page === 'faq') {
    meta.title = 'FAQ Kymia'
    meta.description =
      'Questions fréquentes sur les produits, commandes, retours, drops et accès privé Kymia.'
  }

  if (route.page === 'checkout') {
    meta.title = 'Checkout Kymia'
    meta.description = 'Finalise ta commande Kymia avec un parcours de paiement clair et premium.'
  }

  if (route.page === 'success') {
    meta.title = 'Commande confirmée · Kymia'
    meta.description = 'Confirmation de commande Kymia et récapitulatif de la sélection.'
  }

  if (route.page === 'notFound') {
    meta.title = 'Page introuvable · Kymia'
    meta.description = "La page demandée n'existe pas. Reviens à la collection ou à la maison Kymia."
  }

  const graph = [
    {
      '@context': 'https://schema.org',
      ...organizationSchema(),
    },
    {
      '@context': 'https://schema.org',
      ...websiteSchema(),
    },
    {
      '@context': 'https://schema.org',
      ...breadcrumbItems(route, activeProduct),
    },
  ]

  if (route.page === 'home') {
    graph.push({
      '@context': 'https://schema.org',
      ...collectionSchema(),
    })
    graph.push({
      '@context': 'https://schema.org',
      ...bundlesSchema(),
    })
  }

  if (route.page === 'collection') {
    graph.push({
      '@context': 'https://schema.org',
      ...collectionSchema(),
    })
    graph.push({
      '@context': 'https://schema.org',
      ...bundlesSchema(),
    })
  }

  if (route.page === 'product' && activeProduct) {
    graph.push({
      '@context': 'https://schema.org',
      ...productGroupSchema(activeProduct),
    })
    graph.push({
      '@context': 'https://schema.org',
      ...activeProductSchema(activeProduct),
    })
  }

  if (route.page === 'journal') {
    graph.push({
      '@context': 'https://schema.org',
      ...journalSchema(),
    })
  }

  if (route.page === 'faq') {
    graph.push({
      '@context': 'https://schema.org',
      ...faqSchema(),
    })
  }

  return { ...meta, structuredData: graph }
}

export const staticRoutes = [
  '/',
  '/collection',
  '/house',
  '/journal',
  '/access',
  '/shipping',
  '/faq',
  ...products.map((product) => `/caps/${product.slug}`),
]

export const footerLinks = {
  shop: [
    { label: 'Collection', path: '/collection' },
    { label: 'Bundles', path: '/collection' },
    { label: 'Checkout', path: '/checkout' },
  ],
  help: [
    { label: 'Livraison & retours', path: '/shipping' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Accès privé', path: '/access' },
  ],
  discover: navigation,
}
