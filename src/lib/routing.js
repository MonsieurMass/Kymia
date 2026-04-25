import { getProductBySlug } from '../content/siteContent'

/**
 * Normalize pathname (remove trailing slashes)
 */
export function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

/**
 * Resolve the current route and extract parameters
 */
export function resolveRoute(pathname) {
  const path = normalizePath(pathname)

  // Main pages
  if (path === '/') return { page: 'home', path }
  if (path === '/collection') return { page: 'collection', path }
  if (path === '/house') return { page: 'house', path }
  if (path === '/journal') return { page: 'journal', path }
  if (path === '/access') return { page: 'access', path }
  if (path === '/checkout') return { page: 'checkout', path }
  if (path === '/checkout/success') return { page: 'success', path }

  // Info pages
  if (path === '/shipping') return { page: 'shipping', path }
  if (path === '/faq') return { page: 'faq', path }

  // Product detail page
  const productMatch = path.match(/^\/collection\/([^/]+)$/) || path.match(/^\/caps\/([^/]+)$/)
  if (productMatch) {
    const product = getProductBySlug(productMatch[1])
    if (product) {
      return { page: 'product', path, product }
    }
  }

  return { page: 'notFound', path }
}
