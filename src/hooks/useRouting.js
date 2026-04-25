import { useState, useEffect } from 'react'

/**
 * Custom hook to manage client-side routing
 * Returns current route and navigation function
 */
export function useRouting() {
  const [route, setRoute] = useState(null)

  useEffect(() => {
    const resolveRoute = () => {
      const path = window.location.pathname
      // Map paths to route names
      if (path === '/') return 'home'
      if (path.startsWith('/collection')) return 'collection'
      if (path.startsWith('/house')) return 'house'
      if (path.startsWith('/journal')) return 'journal'
      if (path.startsWith('/checkout')) return 'checkout'
      if (path.startsWith('/access')) return 'access'
      if (path.startsWith('/success')) return 'success'
      return 'home'
    }

    setRoute(resolveRoute())
  }, [])

  const navigate = (path) => {
    window.history.pushState(null, '', path)
    setRoute(path === '/' ? 'home' : path.replace('/', ''))
  }

  return { route, navigate }
}
