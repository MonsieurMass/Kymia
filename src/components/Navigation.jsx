import { navigation, brand } from '../content/siteContent'

export function Navigation({ currentRoute, onNavigate, cartCount = 0 }) {
  const isActive = (path) => {
    const routeMap = {
      '/': 'home',
      '/collection': 'collection',
      '/house': 'house',
      '/journal': 'journal',
      '/access': 'access',
    }
    return routeMap[path] === currentRoute
  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => onNavigate('/')}>
          <h1 className="logo">{brand.uppercaseName}</h1>
        </div>

        <ul className="navbar-menu">
          {navigation.map((item) => (
            <li key={item.path}>
              <button
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            className="cart-icon"
            onClick={() => onNavigate('/checkout')}
            title="Panier"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  )
}
