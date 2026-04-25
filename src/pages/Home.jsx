import { useEffect, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { brand, announcement, products, products as allProducts, bundles } from '../content/siteContent'
import { ProductCard } from '../components/ProductCard'

export function Home({ onNavigate, onAddToCart }) {
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [bundles, setBundles] = useState([])

  useSEO({
    title: `${brand.name} - ${brand.tagline}`,
    description: brand.description,
    path: '/',
  })

  useEffect(() => {
    // Set featured product
    if (allProducts.length > 0) {
      setFeaturedProduct(allProducts[0])
    }
    setBundles(bundles)
  }, [])

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.heroImage,
      })
    }
  }

  return (
    <main className="page page--home">
      {/* Announcement Banner */}
      <div className="announcement-banner">
        <p>{announcement}</p>
      </div>

      {/* Hero Section */}
      {featuredProduct && (
        <section className="hero">
          <div className="hero__content">
            <h1 className="hero__title">{brand.statement}</h1>
            <p className="hero__subtitle">{brand.tagline}</p>
            <button
              className="hero__cta"
              onClick={() => onNavigate('/collection')}
            >
              Decouvrir la collection
            </button>
          </div>
          <div className="hero__image">
            <img src={featuredProduct.heroImage} alt={featuredProduct.name} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2>Collection actuelle</h2>
          <button className="link-button" onClick={() => onNavigate('/collection')}>
            Voir tout →
          </button>
        </div>

        <div className="product-grid">
          {allProducts.slice(0, 4).map((product) => (
            <div key={product.id}>
              <ProductCard
                product={product}
                onSelect={() => onNavigate(`/collection/${product.slug}`)}
              />
              <button
                className="product-card__action"
                onClick={() => handleAddToCart(product)}
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="bundles-section">
          <h2>Sets recommandes</h2>
          <div className="bundles-grid">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="bundle-card">
                <h3>{bundle.name}</h3>
                <p>{bundle.description}</p>
                <div className="bundle-price">{bundle.price}€</div>
                <button
                  className="bundle-cta"
                  onClick={() => handleAddToCart(bundle)}
                >
                  Ajouter le set
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
