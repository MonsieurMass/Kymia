import { useEffect } from 'react'
import { siteUrl, seoDefaults } from '../content/siteContent'

/**
 * Custom hook to manage SEO metadata
 */
export function useSEO(options = {}) {
  const {
    title = seoDefaults.title,
    description = seoDefaults.description,
    image = seoDefaults.image,
    path = '/',
    product = null,
  } = options

  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    updateMeta('description', description)
    updateMeta('og:title', title)
    updateMeta('og:description', description)
    updateMeta('og:image', image)
    updateMeta('og:url', `${siteUrl}${path}`)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${siteUrl}${path}`

    // Structured data for products
    if (product) {
      const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.heroImage,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      }
      let jsonLd = document.querySelector('script[type="application/ld+json"]')
      if (!jsonLd) {
        jsonLd = document.createElement('script')
        jsonLd.type = 'application/ld+json'
        document.head.appendChild(jsonLd)
      }
      jsonLd.textContent = JSON.stringify(structuredData)
    }
  }, [title, description, image, path, product])
}
