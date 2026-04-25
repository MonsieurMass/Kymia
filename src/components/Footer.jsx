import { brand, membershipPerks, paymentMethods } from '../content/siteContent'

export function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{brand.uppercaseName}</h3>
          <p className="footer-tagline">{brand.statement}</p>
          <div className="footer-contact">
            <p>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </p>
            <p>
              <a href={`tel:${brand.phone}`}>{brand.phone}</a>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Acces Prive</h4>
          <ul>
            {membershipPerks.map((perk, idx) => (
              <li key={idx}>{perk}</li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Paiements</h4>
          <div className="payment-methods">
            {paymentMethods.map((method, idx) => (
              <span key={idx} className="payment-badge">
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h4>Suivre</h4>
          <ul className="social-links">
            {brand.social.map((social) => (
              <li key={social.label}>
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {brand.founded}-2026 {brand.uppercaseName}. Tous droits reserves.</p>
      </div>
    </footer>
  )
}
