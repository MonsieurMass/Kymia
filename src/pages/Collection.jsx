import { useState, useEffect } from 'react'
import { useSEO } from '../hooks/useSEO'
import { brand, products, getProductBySlug } from '../content/siteContent'
import { ProductCard } from '../components/ProductCard'

export function Collection({ onNavigate, onAddToCart, productSlug = null }) {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortBy, setSortBy] = useState('featured')

  useSEO({
    title: `Collection - ${brand.name}`,
    description: 'Decouvrez notre collection de pieces limitees et exclusives.',
    path: '/collection',
  })

  useEffect(() => {
    // If viewing specific product
    if (productSlug) {
      const product = getProductBySlug(productSlug)
      setSelectedProduct(product)
    }
  }, [productSlug])

  useEffect(() => {
    // Apply sorting
    let sorted = [...products]
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sorted.reverse()
        break
      default:
        // featured order
        break
    }
    setFilteredProducts(sorted)
  }, [sortBy])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    onNavigate(`/collection/${product.slug}`)
  }

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

  if (selectedProduct) {
    // Product detail view
    return (
      <main className="page page--product-detail">
        <div className="product-detail">
          <button className="back-button" onClick={() => onNavigate('/collection')}>
            ← Retour a la collection
          </button>

          <div className="product-detail__grid">
            <div className="product-detail__images">
              <img
                src={selectedProduct.heroImage}
                alt={selectedProduct.name}
                className="main-image"
              />
              {selectedProduct.secondaryImage && (
                <img
                  src={selectedProduct.secondaryImage}
                  alt={`${selectedProduct.name} - dos`}
                  className="secondary-image"
                />
              )}
            </div>

            <div className="product-detail__info">
              <div className="product-detail__header">
                <h1 className="product-detail__title">{selectedProduct.name}</h1>
                <span className="product-detail__family">{selectedProduct.familyName}</span>
              </div>

              <div className="product-detail__price">
                <span className="price">{selectedProduct.price}€</span>
                {selectedProduct.compareAt && (
                  <span className="compare-price">{selectedProduct.compareAt}€</span>
                )}
              </div>

              <p className="product-detail__lead">{selectedProduct.lead}</p>

              <button
                className="product-detail__cta"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Ajouter au panier
              </button>

              <div className="product-detail__specs">
                <h3>Details</h3>
                {selectedProduct.specs?.map(([key, value], idx) => (
                  <div key={idx} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>

              <div className="product-detail__story">
                <h3>Histoire</h3>
                <p>{selectedProduct.story}</p>
              </div>

              {selectedProduct.highlights && (
                <div className="product-detail__highlights">
                  <h3>Points forts</h3>
                  <ul>
                    {selectedProduct.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Collection grid view
  return (
    <main className="page page--collection">
      <section className="collection-header">
        <h1>Collection</h1>
        <p>Pieces limitees. Fortes. Memorables.</p>
      </section>

      <section className="collection-controls">
        <div className="sort-control">
          <label htmlFor="sort">Trier par:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Recommandes</option>
            <option value="price-low">Prix: bas → haut</option>
            <option value="price-high">Prix: haut → bas</option>
            <option value="newest">Nouveautes</option>
          </select>
        </div>
        <div className="product-count">{filteredProducts.length} pieces</div>
      </section>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-grid-item">
            <ProductCard
              product={product}
              onSelect={() => handleProductSelect(product)}
            />
            <button
              className="product-action-button"
              onClick={() => handleAddToCart(product)}
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <p>Aucune piece ne correspond a vos criteres.</p>
          <button onClick={() => setSortBy('featured')}>Reinitialiser les filtres</button>
        </div>
      )}
    </main>
  )
}
