/**
 * Reusable product card component
 */
export function ProductCard({ product, onSelect, variant = 'grid' }) {
  const price = product.price
  const compareAt = product.compareAt
  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0

  return (
    <div
      className={`product-card product-card--${variant}`}
      onClick={() => onSelect && onSelect(product)}
    >
      <div className="product-card__image-container">
        <img
          src={product.heroImage}
          alt={product.name}
          className="product-card__image"
        />
        {discount > 0 && <div className="product-card__discount">-{discount}%</div>}
      </div>

      <div className="product-card__content">
        <div className="product-card__header">
          <h3 className="product-card__name">{product.name}</h3>
          {product.badge && <span className="product-card__badge">{product.badge}</span>}
        </div>

        <p className="product-card__color">{product.color}</p>

        <div className="product-card__pricing">
          <span className="product-card__price">{product.price}€</span>
          {compareAt && (
            <span className="product-card__compare-price">{compareAt}€</span>
          )}
        </div>

        <div className="product-card__status">
          <span className={`status status--${product.status.toLowerCase().replace(' ', '-')}`}>
            {product.status}
          </span>
        </div>

        {product.chips && (
          <div className="product-card__chips">
            {product.chips.slice(0, 2).map((chip, idx) => (
              <span key={idx} className="chip">
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
