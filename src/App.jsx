import { startTransition, useEffect, useRef, useState } from 'react'
import './App.css'
import brandLogo from './assets/brand/logo-store-kymia.png'
import {
  announcementRotation,
  brand,
  bundles,
  cartUrgencyText,
  clientReviews,
  commercePromises,
  computePromoDiscount,
  emailCaptureCTA,
  faqGroups,
  getBundleProducts,
  getProductById,
  getProductBySlug,
  houseSections,
  houseVisuals,
  houseTimeline,
  journalArticles,
  membershipPerks,
  navigation,
  paymentMethods,
  products,
  resolvePromoCode,
  returnSteps,
  shippingFee,
  shippingFreeThreshold,
  shippingModules,
  trustSignals,
} from './content/siteContent'
import { trackEvent } from './lib/analytics'
import { buildSeo } from './lib/seo'

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function hexToRgbChannels(hex) {
  const raw = String(hex ?? '').replace('#', '')
  const normalized =
    raw.length === 3 ? raw.split('').map((char) => `${char}${char}`).join('') : raw

  const value = Number.parseInt(normalized, 16)
  if (Number.isNaN(value)) {
    return '201 169 97'
  }

  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`
}

function handleInteractiveSurfaceMove(event) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height

  event.currentTarget.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`)
  event.currentTarget.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`)
  event.currentTarget.style.setProperty('--pointer-rotate-x', `${((0.5 - y) * 8).toFixed(2)}deg`)
  event.currentTarget.style.setProperty('--pointer-rotate-y', `${((x - 0.5) * 10).toFixed(2)}deg`)
  event.currentTarget.style.setProperty('--pointer-shift-x', `${((x - 0.5) * 12).toFixed(2)}px`)
  event.currentTarget.style.setProperty('--pointer-shift-y', `${((y - 0.5) * 12).toFixed(2)}px`)
}

function handleInteractiveSurfaceLeave(event) {
  event.currentTarget.style.setProperty('--pointer-x', '50%')
  event.currentTarget.style.setProperty('--pointer-y', '50%')
  event.currentTarget.style.setProperty('--pointer-rotate-x', '0deg')
  event.currentTarget.style.setProperty('--pointer-rotate-y', '0deg')
  event.currentTarget.style.setProperty('--pointer-shift-x', '0px')
  event.currentTarget.style.setProperty('--pointer-shift-y', '0px')
}

function useHeroMotion(ref, motionKey) {
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frame = 0

    const applyMotion = (clientX, clientY) => {
      const rect = root.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height

      root.style.setProperty('--hero-pointer-x', `${(x * 100).toFixed(2)}%`)
      root.style.setProperty('--hero-pointer-y', `${(y * 100).toFixed(2)}%`)
      root.style.setProperty('--hero-rotate-x', `${((0.5 - y) * 12).toFixed(2)}deg`)
      root.style.setProperty('--hero-rotate-y', `${((x - 0.5) * 16).toFixed(2)}deg`)
      root.style.setProperty('--hero-shift-x', `${((x - 0.5) * 36).toFixed(2)}px`)
      root.style.setProperty('--hero-shift-y', `${((y - 0.5) * 26).toFixed(2)}px`)
    }

    const resetMotion = () => {
      root.style.setProperty('--hero-pointer-x', '50%')
      root.style.setProperty('--hero-pointer-y', '50%')
      root.style.setProperty('--hero-rotate-x', '0deg')
      root.style.setProperty('--hero-rotate-y', '0deg')
      root.style.setProperty('--hero-shift-x', '0px')
      root.style.setProperty('--hero-shift-y', '0px')
    }

    const handlePointerMove = (event) => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      frame = window.requestAnimationFrame(() => {
        applyMotion(event.clientX, event.clientY)
      })
    }

    resetMotion()
    root.addEventListener('pointermove', handlePointerMove)
    root.addEventListener('pointerleave', resetMotion)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      root.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', resetMotion)
    }
  }, [ref, motionKey])
}

function useSectionScrollProgress(ref, progressName, dependencyKey = '') {
  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const progress = Math.min(
        Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
        1,
      )

      node.style.setProperty(progressName, progress.toFixed(3))
    }

    const scheduleUpdate = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [ref, progressName, dependencyKey])
}

function useReveal(pathname, productId) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [pathname, productId])
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function resolveRoute(pathname) {
  const path = normalizePath(pathname)

  if (path === '/') return { page: 'home', path }
  if (path === '/collection') return { page: 'collection', path }
  if (path === '/house') return { page: 'house', path }
  if (path === '/journal') return { page: 'journal', path }
  if (path === '/access') return { page: 'access', path }
  if (path === '/shipping') return { page: 'shipping', path }
  if (path === '/faq') return { page: 'faq', path }
  if (path === '/checkout') return { page: 'checkout', path }
  if (path === '/checkout/success') return { page: 'success', path }

  const productMatch = path.match(/^\/caps\/([^/]+)$/)
  if (productMatch) {
    const product = getProductBySlug(productMatch[1])
    if (product) {
      return { page: 'product', path, product }
    }
  }

  return { page: 'notFound', path }
}

function setMeta(selector, content) {
  const node = document.querySelector(selector)
  if (node) {
    node.setAttribute('content', content)
  }
}

function setCanonical(url) {
  let node = document.querySelector('link[rel="canonical"]')
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', 'canonical')
    document.head.appendChild(node)
  }

  node.setAttribute('href', url)
}

function setStructuredData(data) {
  let script = document.getElementById('kymia-schema')
  if (!script) {
    script = document.createElement('script')
    script.id = 'kymia-schema'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

function isModifiedEvent(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

function AppLink({ to, navigate, children, className, onClick, ...props }) {
  return (
    <a
      {...props}
      className={className}
      href={to}
      onClick={(event) => {
        onClick?.(event)

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          isModifiedEvent(event) ||
          props.target === '_blank'
        ) {
          return
        }

        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 720)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      aria-label="Remonter en haut de page"
      className="scroll-to-top"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
        <path d="M12 4 L12 20 M12 4 L6 10 M12 4 L18 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function AnnouncementTicker({ messages }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return undefined
    const interval = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 4500)
    return () => window.clearInterval(interval)
  }, [messages.length])

  return (
    <div aria-live="polite" className="announcement-ticker">
      <div className="announcement-ticker__track">
        {messages.map((message, i) => (
          <span
            key={message}
            aria-hidden={i !== index}
            className={`announcement-ticker__item${i === index ? ' is-visible' : ''}`}
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}

function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar__content">
        {trustSignals.slice(0, 4).map((signal) => (
          <div className="trust-bar__item" key={signal.title}>
            <span className="trust-bar__icon">{signal.icon}</span>
            <span>{signal.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmailCapture({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return

    trackEvent('email_capture', { method: 'newsletter' })
    onSubmit?.(email)
    setEmail('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="email-capture">
      {submitted ? (
        <div className="email-capture__success">
          {emailCaptureCTA.successMessage}
        </div>
      ) : (
        <>
          <h3 className="email-capture__headline">{emailCaptureCTA.headline}</h3>
          <p className="email-capture__subheadline">{emailCaptureCTA.subheadline}</p>
          <form className="email-capture__form" onSubmit={handleSubmit}>
            <input
              className="email-capture__input"
              type="email"
              placeholder={emailCaptureCTA.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="email-capture__button" type="submit">
              {emailCaptureCTA.buttonText}
            </button>
          </form>
        </>
      )}
    </section>
  )
}

function CheckoutProgress({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Panier' },
    { number: 2, label: 'Infos' },
    { number: 3, label: 'Paiement' },
  ]

  return (
    <div className="checkout-progress">
      {steps.map((step, index) => (
        <div key={step.number}>
          <div className={`checkout-progress__step ${currentStep >= step.number ? 'active' : ''}`}>
            <div className="checkout-progress__number">{step.number}</div>
            <span>{step.label}</span>
          </div>
          {index < steps.length - 1 && <div className="checkout-progress__divider" />}
        </div>
      ))}
    </div>
  )
}

function FreeShippingMeter({ subtotal }) {
  const shipping = subtotal === 0 ? 0 : subtotal >= shippingFreeThreshold ? 0 : shippingFee
  const total = subtotal + shipping
  const progress = Math.min((subtotal / shippingFreeThreshold) * 100, 100)

  if (subtotal >= shippingFreeThreshold) {
    return (
      <div className="free-shipping-meter free-shipping-meter--complete">
        <div className="free-shipping-meter__copy">
          <strong>Livraison offerte active</strong>
          <span>Total estime : {euro.format(total)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="free-shipping-meter">
      <div className="free-shipping-meter__copy">
        <strong>{cartUrgencyText(subtotal)}</strong>
        <span>Total estime avec livraison : {euro.format(total)}</span>
      </div>
      <div aria-hidden="true" className="free-shipping-meter__track">
        <span className="free-shipping-meter__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function ProductStickyBar({ currentQuantity, onAdd, onCheckout, product }) {
  return (
    <div className="product-sticky-bar">
      <div className="product-sticky-bar__copy">
        <strong>{product.name}</strong>
        <span>
          {euro.format(product.price)} · {euro.format(product.deliveredPrice)} livree
          {currentQuantity > 0 ? ` · ${currentQuantity} dans le panier` : ''}
        </span>
      </div>
      <div className="product-sticky-bar__actions">
        <button className="button button--secondary" type="button" onClick={onCheckout}>
          Commander
        </button>
        <button className="button button--primary" type="button" onClick={onAdd}>
          Ajouter
        </button>
      </div>
    </div>
  )
}

function ProductOfferRail({ product }) {
  return (
    <div className="offer-rail">
      <div className="offer-rail__item">
        <span>La piece</span>
        <strong>{euro.format(product.deliveredPrice)} livree</strong>
      </div>
      <div className="offer-rail__item">
        <span>Deux pieces</span>
        <strong>{euro.format(bundles[0].deliveredPrice)} livrees</strong>
      </div>
      <div className="offer-rail__item">
        <span>Expedition</span>
        <strong>24 a 48h</strong>
      </div>
    </div>
  )
}

function CartFeedback({ message }) {
  if (!message) {
    return null
  }

  return (
    <div aria-live="polite" className="cart-feedback" role="status">
      <strong>Ajoute au panier</strong>
      <span>{message}</span>
    </div>
  )
}

function MagneticIntro({ active = true, imageSrc, onDone }) {
  const canvasRef = useRef(null)
  const [isSkipping, setIsSkipping] = useState(false)

  useEffect(() => {
    if (!active || !isSkipping) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      onDone?.()
    }, 320)

    return () => window.clearTimeout(timeout)
  }, [active, isSkipping, onDone])

  useEffect(() => {
    if (!active) {
      return undefined
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone?.()
      return undefined
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')
    if (!context) {
      onDone?.()
      return undefined
    }

    let frame = 0
    let disposed = false
    let particles = []
    let introStart = performance.now()

    const image = new window.Image()
    image.decoding = 'async'
    image.src = imageSrc

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (image.complete && image.naturalWidth > 0) {
        particles = createParticles(width, height)
      }
    }

    const createParticles = (width, height) => {
      const sampleCanvas = document.createElement('canvas')
      const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true })
      if (!sampleContext) {
        return []
      }

      const sampleWidth = 280
      const sampleHeight = 280
      sampleCanvas.width = sampleWidth
      sampleCanvas.height = sampleHeight

      const scale = Math.min(sampleWidth / image.naturalWidth, sampleHeight / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const drawX = (sampleWidth - drawWidth) / 2
      const drawY = (sampleHeight - drawHeight) / 2

      sampleContext.clearRect(0, 0, sampleWidth, sampleHeight)
      sampleContext.drawImage(image, drawX, drawY, drawWidth, drawHeight)

      const { data } = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight)
      const points = []
      const step = 5
      const spread = Math.min(width, height) * 0.22

      for (let y = 0; y < sampleHeight; y += step) {
        for (let x = 0; x < sampleWidth; x += step) {
          const alpha = data[(y * sampleWidth + x) * 4 + 3]
          if (alpha > 32) {
            const targetX = width * 0.5 + ((x - sampleWidth / 2) / sampleWidth) * spread * 1.45
            const targetY = height * 0.44 + ((y - sampleHeight / 2) / sampleHeight) * spread * 1.18

            points.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 3.2,
              vy: (Math.random() - 0.5) * 3.2,
              targetX,
              targetY,
              radius: Math.random() * 1.6 + 0.6,
              color:
                Math.random() > 0.72
                  ? 'rgba(201, 169, 97, 0.88)'
                  : Math.random() > 0.4
                    ? 'rgba(255, 255, 255, 0.94)'
                    : Math.random() > 0.2
                      ? 'rgba(214, 224, 235, 0.84)'
                      : 'rgba(196, 214, 200, 0.76)',
            })
          }
        }
      }

      return points.slice(0, 1700)
    }

    const render = (now) => {
      if (disposed) {
        return
      }

      if (!particles.length) {
        frame = window.requestAnimationFrame(render)
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      const elapsed = now - introStart
      const gatherProgress = Math.min(elapsed / 2200, 1)
      const fadeProgress = Math.max((elapsed - 2300) / 1100, 0)
      const opacity = 1 - Math.min(fadeProgress, 1)
      const lineOpacity = Math.min(Math.max((elapsed - 700) / 1200, 0), 1) * opacity

      context.clearRect(0, 0, width, height)
      const backdrop = context.createLinearGradient(0, 0, 0, height)
      backdrop.addColorStop(0, 'rgba(252, 250, 245, 0.78)')
      backdrop.addColorStop(0.55, 'rgba(244, 239, 230, 0.68)')
      backdrop.addColorStop(1, 'rgba(233, 227, 216, 0.84)')
      context.fillStyle = backdrop
      context.fillRect(0, 0, width, height)

      context.save()
      context.globalAlpha = Math.max(opacity * 0.35, 0)
      const glow = context.createRadialGradient(
        width * 0.5,
        height * 0.44,
        0,
        width * 0.5,
        height * 0.44,
        width * 0.18,
      )
      glow.addColorStop(0, 'rgba(201, 169, 97, 0.34)')
      glow.addColorStop(1, 'rgba(201, 169, 97, 0)')
      context.fillStyle = glow
      context.beginPath()
      context.arc(width * 0.5, height * 0.44, width * 0.18, 0, Math.PI * 2)
      context.fill()
      context.restore()

      const linkedParticles = particles.slice(0, 160)
      context.save()
      context.globalAlpha = lineOpacity * 0.5
      context.strokeStyle = 'rgba(201, 169, 97, 0.26)'
      context.lineWidth = 0.7

      for (let i = 0; i < linkedParticles.length; i += 1) {
        const a = linkedParticles[i]
        const b = linkedParticles[(i + 13) % linkedParticles.length]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const distance = Math.hypot(dx, dy)
        if (distance < 80) {
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }
      context.restore()

      for (const particle of particles) {
        const spring = 0.028 + gatherProgress * 0.04
        particle.vx += (particle.targetX - particle.x) * spring
        particle.vy += (particle.targetY - particle.y) * spring
        particle.vx *= 0.86
        particle.vy *= 0.86

        if (fadeProgress > 0) {
          particle.vx += (particle.x - width * 0.5) * 0.0009
          particle.vy -= 0.022 + fadeProgress * 0.05
        }

        particle.x += particle.vx
        particle.y += particle.vy

        context.beginPath()
        context.fillStyle = particle.color.replace(/[\d.]+\)$/, `${Math.max(opacity, 0)})`)
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }

      context.save()
      context.globalAlpha = Math.max(opacity * 0.8, 0)
      context.strokeStyle = 'rgba(201, 169, 97, 0.2)'
      context.lineWidth = 1
      context.beginPath()
      context.ellipse(width * 0.5, height * 0.44, width * 0.16, width * 0.038, 0, 0, Math.PI * 2)
      context.stroke()
      context.beginPath()
      context.ellipse(width * 0.5, height * 0.44, width * 0.11, width * 0.026, 0, 0, Math.PI * 2)
      context.stroke()
      context.restore()

      if (elapsed >= 3400) {
        setIsSkipping(true)
        return
      }

      if (isSkipping) {
        return
      }

      frame = window.requestAnimationFrame(render)
    }

    image.onload = () => {
      resizeCanvas()
      introStart = performance.now()
      frame = window.requestAnimationFrame(render)
    }

    image.onerror = () => setIsSkipping(true)

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      disposed = true
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [active, imageSrc, isSkipping, onDone])

  if (!active) {
    return null
  }

  return (
    <div className={`magnetic-intro${isSkipping ? ' is-skipping' : ''}`} aria-hidden="true">
      <canvas className="magnetic-intro__canvas" ref={canvasRef} />
      <div className="magnetic-intro__scene">
        <div className="magnetic-intro__globe-shell">
          <div className="magnetic-intro__globe">
            <span className="magnetic-intro__globe-ring magnetic-intro__globe-ring--equator" />
            <span className="magnetic-intro__globe-ring magnetic-intro__globe-ring--meridian" />
            <span className="magnetic-intro__globe-ring magnetic-intro__globe-ring--latitude" />
            <span className="magnetic-intro__globe-core" />
          </div>
          <div className="magnetic-intro__orbit magnetic-intro__orbit--one">
            <img alt="" className="magnetic-intro__cap magnetic-intro__cap--hero" src={imageSrc} />
          </div>
          <div className="magnetic-intro__orbit magnetic-intro__orbit--two">
            <span className="magnetic-intro__pearl magnetic-intro__pearl--gold" />
          </div>
          <div className="magnetic-intro__orbit magnetic-intro__orbit--three">
            <span className="magnetic-intro__pearl magnetic-intro__pearl--ivory" />
          </div>
        </div>
      </div>
      <div className="magnetic-intro__frame magnetic-intro__frame--top" />
      <div className="magnetic-intro__frame magnetic-intro__frame--bottom" />
      <div className="magnetic-intro__scanline" />
      <div className="magnetic-intro__copy">
        <span>World reveal</span>
        <strong>Une couronne urbaine tourne autour du monde.</strong>
        <small>KYMIA · Crown Series · Aube minerale</small>
      </div>
      <button className="magnetic-intro__skip" type="button" onClick={() => setIsSkipping(true)}>
        Passer
      </button>
    </div>
  )
}

function BrandWordmark({ size = 'default' }) {
  return (
    <div className={`brand-lockup brand-lockup--${size}`}>
      <span className="brand-lockup__image-frame">
        <img
          alt={`${brand.uppercaseName} logo`}
          className="brand-lockup__image"
          src={brandLogo}
        />
      </span>
    </div>
  )
}

function Header({ cartCount, cartPulse, navigate, openCart, path }) {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const mobileNavLinks = [
    ...navigation,
    { label: 'Acces prive', path: '/access' },
    { label: 'Livraison', path: '/shipping' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [path])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__announcement">
        <AnnouncementTicker messages={announcementRotation} />
      </div>

      <div className="site-header__inner">
        <AppLink aria-label="Retour à l'accueil" className="brand-link" navigate={navigate} to="/">
          <BrandWordmark />
        </AppLink>

        <nav aria-label="Navigation principale" className="site-nav">
          {navigation.map((item) => {
            const isActive =
              item.path === '/'
                ? path === '/'
                : path === item.path || (item.path === '/collection' && path.startsWith('/caps/'))

            return (
              <AppLink
                key={item.path}
                className={`site-nav__link${isActive ? ' is-active' : ''}`}
                navigate={navigate}
                to={item.path}
              >
                {item.label}
              </AppLink>
            )
          })}
        </nav>

        <div className="header-actions">
          <button
            aria-expanded={isMobileNavOpen}
            aria-label={isMobileNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={`burger-btn${isMobileNavOpen ? ' is-open' : ''}`}
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            <span className="burger-btn__lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
          <AppLink className="button button--secondary" navigate={navigate} to="/access">
            Acces prive
          </AppLink>
          <button
            className={`button button--primary cart-button${cartPulse ? ' is-bumping' : ''}`}
            type="button"
            onClick={openCart}
          >
            Panier ({cartCount})
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isMobileNavOpen}
        className={`mobile-nav${isMobileNavOpen ? ' is-open' : ''}`}
      >
        <div className="mobile-nav__head">
          <BrandWordmark />
          <button
            aria-label="Fermer le menu"
            className="icon-button"
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
          >
            Fermer
          </button>
        </div>
        <div className="mobile-nav__body">
          {mobileNavLinks.map((item) => {
            const isActive =
              path === item.path || (item.path === '/collection' && path.startsWith('/caps/'))

            return (
              <AppLink
                key={item.path}
                className={isActive ? 'is-active' : ''}
                navigate={navigate}
                to={item.path}
              >
                {item.label}
              </AppLink>
            )
          })}
        </div>
        <div className="mobile-nav__footer">
          <span>{brand.tagline}</span>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </div>
    </header>
  )
}

function Footer({ navigate }) {
  const footerPrimary = [
    { label: 'Collection', path: '/collection' },
    { label: 'Maison', path: '/house' },
  ]
  const footerSupport = [
    { label: 'Livraison & retours', path: '/shipping' },
    { label: 'FAQ', path: '/faq' },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <BrandWordmark size="large" />
          <p>{brand.description}</p>
          <div className="site-footer__socials">
            {brand.social.map((entry) => (
              <a key={entry.label} href={entry.url} rel="noreferrer" target="_blank">
                {entry.label}
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__column">
          <span>Boutique</span>
          {footerPrimary.map((link) => (
            <AppLink key={link.path + link.label} navigate={navigate} to={link.path}>
              {link.label}
            </AppLink>
          ))}
        </div>

        <div className="site-footer__column">
          <span>Service</span>
          {footerSupport.map((link) => (
            <AppLink key={link.path + link.label} navigate={navigate} to={link.path}>
              {link.label}
            </AppLink>
          ))}
        </div>
      </div>
    </footer>
  )
}

function CartDrawer({
  cartItems,
  closeCart,
  decrementItem,
  feedbackMessage,
  incrementItem,
  isOpen,
  navigate,
  removeItem,
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 ? 0 : subtotal >= shippingFreeThreshold ? 0 : shippingFee
  const total = subtotal + shipping
  const hasItems = cartItems.length > 0

  return (
    <>
      <button
        aria-label="Fermer le panier"
        className={`cart-backdrop${isOpen ? ' is-visible' : ''}`}
        type="button"
        onClick={closeCart}
      />

      <aside
        aria-hidden={!isOpen}
        aria-labelledby="cart-drawer-title"
        aria-modal="true"
        className={`cart-drawer${isOpen ? ' is-open' : ''}`}
        role="dialog"
      >
        <div className="cart-drawer__header">
          <div>
            <p className="eyebrow">Panier</p>
            <h2 id="cart-drawer-title">
              {hasItems ? `${cartItems.length} ligne${cartItems.length > 1 ? 's' : ''}` : 'Selection vide'}
            </h2>
          </div>
          <button className="icon-button" type="button" onClick={closeCart}>
            Fermer
          </button>
        </div>

        <div className="cart-drawer__body">
          {!hasItems ? (
            <div className="empty-state">
              <h3>Le panier est vide.</h3>
              <p>Commence par la piece signature ou par le set fondateur.</p>
              <AppLink className="button button--primary" navigate={navigate} to="/collection">
                Voir la collection
              </AppLink>
            </div>
          ) : (
            <>
              {feedbackMessage ? <p className="cart-drawer__signal">{feedbackMessage}</p> : null}
              <FreeShippingMeter subtotal={subtotal} />
              {subtotal > 0 && subtotal < shippingFreeThreshold ? (
                <p className="cart-drawer__assist">
                  Deux casquettes suffisent pour declencher la livraison offerte.
                </p>
              ) : null}
              <ul className="cart-list">
                {cartItems.map((item) => (
                  <li className="cart-item" key={item.id}>
                    <div className="cart-item__media">
                      <img alt={item.title} loading="lazy" src={item.image} />
                    </div>
                    <div className="cart-item__copy">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                      <div className="quantity-inline">
                        <button type="button" onClick={() => decrementItem(item.id)}>
                          −
                        </button>
                        <small>{item.quantity}</small>
                        <button type="button" onClick={() => incrementItem(item.id)}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item__meta">
                      <strong>{euro.format(item.price * item.quantity)}</strong>
                      <button className="text-button" type="button" onClick={() => removeItem(item.id)}>
                        Retirer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {hasItems ? (
          <div className="cart-drawer__footer">
            <div className="summary-row">
              <span>Sous-total</span>
              <strong>{euro.format(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <strong>{shipping === 0 ? 'Offerte' : euro.format(shipping)}</strong>
            </div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <strong>{euro.format(total)}</strong>
            </div>

            <div className="cart-drawer__cta-row">
              <AppLink className="button button--secondary button--full" navigate={navigate} to="/collection">
                Continuer mes achats
              </AppLink>
              <button
                className="button button--primary button--full"
                type="button"
                onClick={() => {
                  trackEvent('begin_checkout', { currency: 'EUR', value: total })
                  closeCart()
                  navigate('/checkout')
                }}
              >
                Valider la commande
              </button>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}

function SectionIntro({ eyebrow, title, copy, align = 'left' }) {
  return (
    <div className={`section-intro section-intro--${align}`} data-reveal>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  )
}

function ProductCard({ product, onPreview, onQuickAdd }) {
  return (
    <article
      className="product-card"
      data-reveal
      style={{ '--card-rgb': hexToRgbChannels(product.hex) }}
      onPointerLeave={handleInteractiveSurfaceLeave}
      onPointerMove={handleInteractiveSurfaceMove}
    >
      <div className="product-card__media">
        <div className="product-card__badges">
          <span className="pill">{product.badge}</span>
          {product.inventory <= 24 ? (
            <span className="product-card__urgency">Édition limitée</span>
          ) : null}
        </div>
        <img alt={product.seoText} loading="lazy" src={product.heroImage} />
      </div>
      <div className="product-card__body">
        <div className="product-card__header">
          <div className="product-card__title">
            <h3>{product.name}</h3>
            <small>{product.color}</small>
          </div>
          <div className="product-card__price">
            <strong>{euro.format(product.price)}</strong>
            {product.compareAt ? <small>{euro.format(product.compareAt)}</small> : null}
          </div>
        </div>
        <p className="product-card__tagline">{product.tagline}</p>
        <div className="product-card__micro">
          <span>{product.status}</span>
          <span>
            <span className="dot" />
            {euro.format(product.deliveredPrice)} livrée
          </span>
          <span>
            <span className="dot" />
            {product.inventory} pièces
          </span>
        </div>
        <div className="product-card__chips">
          {product.chips.slice(0, 3).map((chip) => (
            <span className="product-card__chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <div className="product-card__rating">
          <span className="stars" aria-hidden="true">★★★★★</span>
          <small>
            {product.rating} · {product.reviewCount} avis
          </small>
        </div>
        <div className="product-card__actions">
          <button className="button button--secondary" type="button" onClick={() => onPreview(product)}>
            Voir la fiche
          </button>
          <button className="button button--primary" type="button" onClick={() => onQuickAdd(product)}>
            Ajouter
          </button>
        </div>
      </div>
    </article>
  )
}

function BundleCard({ bundle, onQuickAdd }) {
  const bundleProducts = getBundleProducts(bundle)

  return (
    <article
      className="bundle-card"
      data-reveal
      onPointerLeave={handleInteractiveSurfaceLeave}
      onPointerMove={handleInteractiveSurfaceMove}
    >
      {bundle.image ? (
        <div className="bundle-card__visual">
          <img alt={bundle.name} loading="lazy" src={bundle.image} />
        </div>
      ) : null}
      <div className="bundle-card__header">
        <div>
          <p className="eyebrow">{bundle.badge}</p>
          <h3>{bundle.name}</h3>
        </div>
        <div className="bundle-card__price">
          <strong>{euro.format(bundle.price)}</strong>
          <small>{euro.format(bundle.compareAt)}</small>
        </div>
      </div>
      <p className="bundle-card__description">{bundle.description}</p>
      <div className="bundle-card__products">
        {bundleProducts.map((product) => (
          <div className="bundle-card__product" key={product.id}>
            <img alt={product.name} loading="lazy" src={product.heroImage} />
            <div>
              <strong>{product.name}</strong>
              <span>{product.color}</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="bundle-card__perks">
        {bundle.perks.map((perk) => (
          <li key={perk}>{perk}</li>
        ))}
      </ul>
      <button className="button bundle-card__cta" type="button" onClick={() => onQuickAdd(bundle)}>
        Ajouter le set
      </button>
    </article>
  )
}

function HomePage({ activeProduct, navigate, onPreview, onQuickAdd, onQuickAddBundle, setHeroProductId }) {
  const heroRef = useRef(null)
  const [showIntro, setShowIntro] = useState(() =>
    typeof window === 'undefined'
      ? false
      : !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
          window.sessionStorage.getItem('kymia-magnetic-intro-seen') !== '1',
  )
  const manifesto = "Les rois portaient des couronnes. La rue porte des casquettes. Nous, on a fait les deux."
  const founderBundle = bundles[0]
  const alternateProduct = products.find((product) => product.id !== activeProduct.id) ?? activeProduct
  const showroomObjects = [
    {
      key: `${activeProduct.id}-secondary`,
      product: activeProduct,
      image: activeProduct.secondaryImage,
      label: 'Studio angle',
      modifier: 'north-west',
    },
    {
      key: `${alternateProduct.id}-front`,
      product: alternateProduct,
      image: alternateProduct.heroImage,
      label: alternateProduct.name,
      modifier: 'north-east',
    },
    {
      key: `${alternateProduct.id}-rear`,
      product: alternateProduct,
      image: alternateProduct.secondaryImage,
      label: 'Orbit detail',
      modifier: 'south-west',
    },
    {
      key: `${activeProduct.id}-front`,
      product: activeProduct,
      image: activeProduct.heroImage,
      label: 'Main orbit',
      modifier: 'south-east',
    },
  ]
  const heroSignals = [
    {
      label: 'Serie courte',
      value: `${activeProduct.inventory} pieces`,
      modifier: 'north-west',
    },
    {
      label: 'Lecture',
      value: activeProduct.color,
      modifier: 'north-east',
    },
    {
      label: 'Maison note',
      value: activeProduct.tagline,
      modifier: 'south-west',
    },
    {
      label: 'Avis',
      value: `${activeProduct.rating} · ${activeProduct.reviewCount} avis`,
      modifier: 'south-east',
    },
  ]
  const motionPhrases = [
    `${activeProduct.name} · ${activeProduct.color}`,
    `${founderBundle.name} · ${euro.format(founderBundle.deliveredPrice)} livrees`,
    'Rare comme toi',
    'Livraison offerte des 50 EUR',
    'Presence immediate',
  ]
  const gravityDust = Array.from({ length: 18 }, (_, index) => ({
    left: `${(index * 13) % 96}%`,
    top: `${((index * 29) % 74) + 6}%`,
    size: `${index % 3 === 0 ? 7 : index % 3 === 1 ? 4 : 2}px`,
    delay: `-${(index * 0.6).toFixed(1)}s`,
    duration: `${9 + (index % 5) * 2}s`,
  }))
  const gravityPearls = [
    { angle: '8deg', radius: '35%', size: '0.95rem', delay: '0s', duration: '16s' },
    { angle: '56deg', radius: '43%', size: '0.85rem', delay: '-2.1s', duration: '18s' },
    { angle: '102deg', radius: '38%', size: '0.7rem', delay: '-4.4s', duration: '15s' },
    { angle: '154deg', radius: '46%', size: '0.8rem', delay: '-1.7s', duration: '19s' },
    { angle: '208deg', radius: '34%', size: '0.6rem', delay: '-6.2s', duration: '14s' },
    { angle: '254deg', radius: '44%', size: '0.9rem', delay: '-3.8s', duration: '17s' },
    { angle: '304deg', radius: '37%', size: '0.72rem', delay: '-5.4s', duration: '13s' },
    { angle: '336deg', radius: '42%', size: '0.62rem', delay: '-7.4s', duration: '20s' },
  ]
  const heroStyle = {
    '--hero-rgb': hexToRgbChannels(activeProduct.hex),
  }
  const experienceStyle = {
    '--home-rgb': hexToRgbChannels(activeProduct.hex),
  }

  useHeroMotion(heroRef, activeProduct.id)
  useSectionScrollProgress(heroRef, '--hero-scroll-progress', activeProduct.id)

  return (
    <div className="page page--home">
      <MagneticIntro
        active={showIntro}
        imageSrc={activeProduct.heroImage}
        onDone={() => {
          setShowIntro(false)
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('kymia-magnetic-intro-seen', '1')
          }
        }}
      />
      <div className="gravity-stage">
      <section className="hero hero--launch hero--gravity" data-reveal ref={heroRef} style={heroStyle}>
        <div aria-hidden="true" className="hero__atmosphere">
          <span className="hero__orb hero__orb--gold" />
          <span className="hero__orb hero__orb--accent" />
          <span className="hero__orb hero__orb--ink" />
          <span className="hero__gridline hero__gridline--vertical" />
          <span className="hero__gridline hero__gridline--horizontal" />
          <span className="hero__spotlight" />
          <div className="hero__dust-field">
            {gravityDust.map((dust, index) => (
              <span
                className="hero__dust"
                key={`${dust.left}-${dust.top}-${index}`}
                style={{
                  '--dust-left': dust.left,
                  '--dust-top': dust.top,
                  '--dust-size': dust.size,
                  '--dust-delay': dust.delay,
                  '--dust-duration': dust.duration,
                }}
              />
            ))}
          </div>
        </div>
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__eyebrow-row">
              <p className="eyebrow">Drop 01 · Crown Series</p>
              <span className="hero__live-pill">Live board</span>
            </div>
            <h1>
              <span className="hero__headline-line">Rare comme</span>
              <span className="hero__headline-line">
                <em>toi.</em>
              </span>
            </h1>
            <p className="hero__lede">
              Une pièce à 25 EUR. Deux pièces à 50 EUR livrées. Kymia rend la décision simple
              et garde la sensation de maison.
            </p>
            <p className="hero__manifesto">{manifesto}</p>
            <div className="hero__cta-row">
              <AppLink className="button button--primary" navigate={navigate} to="/collection">
                Explorer la collection
              </AppLink>
              <button className="button button--secondary" type="button" onClick={() => onPreview(activeProduct)}>
                Ouvrir la fiche
              </button>
            </div>
            <div className="hero__motion-track" aria-label="Atelier Kymia en mouvement">
              <div className="hero__motion-strip">
                {[...motionPhrases, ...motionPhrases].map((phrase, index) => (
                  <span className="hero__motion-pill" key={`${phrase}-${index}`}>
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__scene">
              <div className="hero__showroom">
                {showroomObjects.map((object) => (
                  <button
                    key={object.key}
                    className={`hero__showroom-card hero__showroom-card--${object.modifier}${
                      object.product.id === activeProduct.id ? ' is-active' : ''
                    }`}
                    type="button"
                    onClick={() => setHeroProductId(object.product.id)}
                  >
                    <img alt="" aria-hidden="true" src={object.image} />
                    <span>{object.label}</span>
                  </button>
                ))}
              </div>
              <div className="hero__pearl-field">
                {gravityPearls.map((pearl, index) => (
                  <span
                    className="hero__pearl"
                    key={`${pearl.angle}-${index}`}
                    style={{
                      '--pearl-angle': pearl.angle,
                      '--pearl-radius': pearl.radius,
                      '--pearl-size': pearl.size,
                      '--pearl-delay': pearl.delay,
                      '--pearl-duration': pearl.duration,
                    }}
                  />
                ))}
              </div>
              <div className="hero__scene-ring hero__scene-ring--outer" />
              <div className="hero__scene-ring hero__scene-ring--inner" />
              <div className="hero__trail hero__trail--one" />
              <div className="hero__trail hero__trail--two" />
              <div className="hero__scene-shell">
                <img
                  alt=""
                  aria-hidden="true"
                  className="hero__ghost hero__ghost--rear"
                  src={activeProduct.secondaryImage}
                />
                <img
                  alt=""
                  aria-hidden="true"
                  className="hero__ghost hero__ghost--echo"
                  src={alternateProduct.heroImage}
                />
                <div className="hero__product-shadow" />
                <img
                  key={activeProduct.id}
                  alt={activeProduct.seoText}
                  className="hero__primary-image"
                  fetchPriority="high"
                  src={activeProduct.heroImage}
                />
              </div>
              {heroSignals.map((signal) => (
                <div className={`hero__signal hero__signal--${signal.modifier}`} key={signal.label}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </div>
              ))}
              <div className="hero__stamp">
                <span>Drop 01 · Édition limitée</span>
              </div>
              <div className="hero__micro-card hero__micro-card--fabric">
                <span>Texture</span>
                <strong>{activeProduct.specs[0]?.[1] ?? 'Twill premium'}</strong>
              </div>
              <div className="hero__micro-card hero__micro-card--tempo">
                <span>Tempo</span>
                <strong>24 a 48h · France</strong>
              </div>
              <div className="hero__variant-selector">
                {products.map((product) => (
                  <button
                    key={product.id}
                    aria-label={product.name}
                    className={`hero__variant-btn${product.id === activeProduct.id ? ' is-active' : ''}`}
                    data-color={product.colorCode}
                    type="button"
                    onClick={() => setHeroProductId(product.id)}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero__meta-strip">
          <div className="hero__meta-item">
            <strong>25 EUR</strong>
            <small>La pièce signature</small>
          </div>
          <div className="hero__meta-item">
            <strong>50 EUR</strong>
            <small>Deux pièces livrées</small>
          </div>
          <div className="hero__meta-item">
            <strong>24-48h</strong>
            <small>Expédition moyenne</small>
          </div>
          <div className="hero__meta-item">
            <strong>30 jours</strong>
            <small>Retours encadrés</small>
          </div>
        </div>
      </section>
      </div>

      <div className="home-experience" style={experienceStyle}>
        <div aria-hidden="true" className="home-experience__atmosphere">
          <span className="home-experience__glow home-experience__glow--one" />
          <span className="home-experience__glow home-experience__glow--two" />
          <span className="home-experience__glow home-experience__glow--three" />
        </div>

      <section className="section">
        <SectionIntro
          eyebrow="Collection signature"
          title="Deux coloris, une decision rapide."
          copy="Emerald pour la retenue. Ruby pour la declaration. Une home plus directe, un choix plus simple."
        />
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              onPreview={onPreview}
              onQuickAdd={onQuickAdd}
              product={product}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card-grid card-grid--two home-focus-grid">
          <article className="editorial-panel editorial-panel--dark" data-reveal>
            <p className="eyebrow">Direction</p>
            <h2>A chacun sa couronne.</h2>
            <p>
              Kymia n&apos;essaie pas de faire beaucoup. Kymia essaie de faire juste, court,
              fort et memorisable. Une silhouette nette. Une matiere propre. Un signe qui reste.
            </p>
            <div className="button-row">
              <AppLink className="button button--primary" navigate={navigate} to="/house">
                Voir la maison
              </AppLink>
              <button className="button button--secondary" type="button" onClick={() => onQuickAddBundle(founderBundle)}>
                Ajouter le set
              </button>
            </div>
          </article>

          {bundles.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.id} onQuickAdd={onQuickAddBundle} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionIntro
          eyebrow="Preuve rapide"
          title="Ce qu on comprend en quelques secondes."
          copy="Le produit doit convaincre vite : desir, confiance, execution. Pas besoin de huit sections pour ca."
        />
        <div className="card-grid card-grid--two">
          {clientReviews.slice(0, 2).map((review) => (
            <article className="review-card" data-reveal key={review.id}>
              <div aria-label={`${review.rating} étoiles sur 5`} className="review-card__rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < review.rating ? 'is-filled' : ''}>
                    ★
                  </span>
                ))}
              </div>
              <p className="review-card__quote">« {review.quote} »</p>
              <footer>
                <strong>{review.author}</strong>
                <small>{review.role}</small>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div>
          <p className="eyebrow">Suite logique</p>
          <h2>La home a fait son travail. Le reste se joue dans la collection.</h2>
          <p>Choisis une lecture, ouvre la fiche, puis passe au panier. Le site doit t y mener vite.</p>
        </div>
        <div className="button-row">
          <AppLink className="button button--primary" navigate={navigate} to="/collection">
            Voir la collection
          </AppLink>
          <AppLink className="button button--secondary" navigate={navigate} to="/house">
            Voir la maison
          </AppLink>
        </div>
      </section>
      </div>
    </div>
  )
}

function CollectionPage({ navigate, onPreview, onQuickAdd, onQuickAddBundle }) {
  const founderBundle = bundles[0]
  const collectionRgb = hexToRgbChannels(products[0].hex)
  const collectionStyle = { '--collection-rgb': collectionRgb, '--page-rgb': collectionRgb }

  return (
    <div className="page page--collection" style={collectionStyle}>
      <div aria-hidden="true" className="page-atmosphere page-atmosphere--collection">
        <span className="page-atmosphere__cloud page-atmosphere__cloud--one" />
        <span className="page-atmosphere__cloud page-atmosphere__cloud--two" />
        <span className="page-atmosphere__cloud page-atmosphere__cloud--three" />
      </div>

      <div className="collection-experience">
        <section className="page-hero page-hero--collection" data-reveal>
          <div className="page-hero__inner">
            <p className="eyebrow">Collection</p>
            <h1>Crown Series.</h1>
            <p>
              Deux pieces signatures, un set fondateur et une lecture claire du vestiaire Kymia.
              Tout ce qui est ici a vocation a durer, pas a remplir un catalogue.
            </p>
          </div>
        </section>

        <div className="collection-layout">
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                onPreview={onPreview}
                onQuickAdd={onQuickAdd}
                product={product}
              />
            ))}
          </div>
          <aside className="collection-sidebar" data-reveal>
            <div className="collection-comparison">
              <div>
                <span>Une piece</span>
                <strong>30 EUR livree</strong>
              </div>
              <div>
                <span>Deux pieces</span>
                <strong>50 EUR livrees</strong>
              </div>
            </div>
            <p className="eyebrow">Set fondateur</p>
            <h3>{founderBundle.name}</h3>
            <p>
              Emerald + Ruby. Deux lectures de la meme signature, reunies pour construire une
              silhouette plus forte et faire monter le panier sans forcer.
            </p>
            <div className="collection-note">
              <strong>{euro.format(founderBundle.price)}</strong>
              <span>au lieu de {euro.format(founderBundle.compareAt)}</span>
            </div>
            <ul className="feature-list">
              {founderBundle.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <button className="button button--primary button--full" type="button" onClick={() => onQuickAddBundle(founderBundle)}>
              Ajouter le set
            </button>
            <AppLink className="button button--secondary button--full" navigate={navigate} to="/shipping">
              Livraison & retours
            </AppLink>
          </aside>
        </div>

        <EmailCapture
          onSubmit={() => {
            trackEvent('email_subscription', { source: 'collection' })
          }}
        />
      </div>
    </div>
  )
}

function ProductPage({
  activeGallery,
  activeProduct,
  currentQuantity,
  decrementItem,
  incrementItem,
  navigate,
  onCheckout,
  onPreview,
  onQuickAdd,
  onQuickAddBundle,
  selectGallery,
}) {
  const relatedProducts = products.filter((product) => product.id !== activeProduct.id)
  const mainBundle = bundles[0]
  const activeGalleryPanelId = `gallery-panel-${activeProduct.id}`
  const featuredReview = activeProduct.reviews[0]
  const productRgb = hexToRgbChannels(activeProduct.hex)
  const productExperienceStyle = { '--product-rgb': productRgb, '--page-rgb': productRgb }
  const [mediaMode, setMediaMode] = useState('studio')
  const productChapters = [
    {
      label: 'Presence',
      value: activeProduct.tagline,
    },
    {
      label: 'Matiere',
      value: activeProduct.specs[0]?.[1] ?? 'Twill premium',
    },
    {
      label: 'Tempo',
      value: '24 a 48h',
    },
  ]
  const groupedGallery = activeProduct.gallery.reduce((groups, item) => {
    const key = item.mode ?? 'studio'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
    return groups
  }, {})
  const plannedMedia = activeProduct.plannedMedia ?? {}
  const resolveMediaMode = (key, label) => {
    if (groupedGallery[key]?.length) {
      return { key, label, count: groupedGallery[key].length, kind: 'available' }
    }
    if (plannedMedia[key]) {
      return { key, label, count: plannedMedia[key].count, kind: 'planned' }
    }
    return null
  }
  const mediaModes = [
    resolveMediaMode('studio', 'Studio'),
    resolveMediaMode('wear', 'Porte'),
    resolveMediaMode('detail', 'Details'),
    resolveMediaMode('spin', '360'),
  ].filter(Boolean)
  const mediaItems = groupedGallery[mediaMode] ?? []
  const displayGallery =
    mediaItems.find((item) => item.id === activeGallery.id) ?? mediaItems[0] ?? activeGallery
  const activeMediaMode = mediaModes.find((mode) => mode.key === mediaMode)
  const plannedPanel = activeMediaMode?.kind === 'planned' ? plannedMedia[mediaMode] : null
  const studioAssets = groupedGallery.studio ?? []
  const retainedAssets = mediaMode === 'studio' ? studioAssets : mediaItems

  useEffect(() => {
    setMediaMode('studio')
  }, [activeProduct.id])

  return (
    <div className="page page--product" style={productExperienceStyle}>
      <div aria-hidden="true" className="page-atmosphere page-atmosphere--product">
        <span className="page-atmosphere__cloud page-atmosphere__cloud--one" />
        <span className="page-atmosphere__cloud page-atmosphere__cloud--two" />
        <span className="page-atmosphere__cloud page-atmosphere__cloud--three" />
      </div>

      <div className="product-experience">
        <div className="breadcrumbs">
          <AppLink navigate={navigate} to="/">Accueil</AppLink>
          <span>/</span>
          <AppLink navigate={navigate} to="/collection">Collection</AppLink>
          <span>/</span>
          <strong>{activeProduct.name}</strong>
        </div>

        <section className="product-layout">
          <div className="product-layout__media" data-reveal>
            <div className="product-media-switcher" role="tablist" aria-label="Modes media produit">
              {mediaModes.map((mode) => (
                <button
                  key={mode.key}
                  aria-selected={mediaMode === mode.key}
                  className={mediaMode === mode.key ? 'is-active' : ''}
                  role="tab"
                  type="button"
                  onClick={() => {
                    setMediaMode(mode.key)
                    if (mode.kind === 'available' && groupedGallery[mode.key]?.[0]) {
                      startTransition(() => selectGallery(groupedGallery[mode.key][0].id))
                    }
                  }}
                >
                  <span>{mode.label}</span>
                  <small>{mode.count}</small>
                </button>
              ))}
            </div>
            <div
              aria-labelledby={`gallery-tab-${activeProduct.id}-${displayGallery.id}`}
              className="product-stage"
              id={activeGalleryPanelId}
              role="tabpanel"
            >
              <div aria-hidden="true" className="product-stage__atmosphere">
                <span className="product-stage__halo" />
                <span className="product-stage__ring product-stage__ring--outer" />
                <span className="product-stage__ring product-stage__ring--inner" />
                {productChapters.map((chapter, index) => (
                  <div
                    className={`product-stage__marker product-stage__marker--${index + 1}`}
                    key={chapter.label}
                  >
                    <span>{chapter.label}</span>
                    <strong>{chapter.value}</strong>
                  </div>
                ))}
              </div>
              {plannedPanel ? (
                <div className="product-stage__planned">
                  <small>{plannedPanel.label}</small>
                  <strong>{plannedPanel.count} vues prévues</strong>
                  <p>{plannedPanel.copy}</p>
                </div>
              ) : (
                <img alt={displayGallery.alt} fetchPriority="high" key={displayGallery.id} src={displayGallery.image} />
              )}
            </div>
            {plannedPanel ? (
              <div className="product-planned-grid">
                {plannedPanel.prompts?.map((item) => (
                  <details className="product-prompt-card" key={item.label}>
                    <summary>
                      <span>{item.label}</span>
                      <strong>{item.usage}</strong>
                    </summary>
                    <p>{item.prompt}</p>
                  </details>
                ))}
              </div>
            ) : (
              <>
                <div className="gallery-tabs" role="tablist" aria-label="Angles produit">
                  {mediaItems.map((item) => (
                    <button
                      key={item.id}
                      aria-selected={item.id === displayGallery.id}
                      aria-controls={activeGalleryPanelId}
                      className={item.id === displayGallery.id ? 'is-active' : ''}
                      id={`gallery-tab-${activeProduct.id}-${item.id}`}
                      role="tab"
                      tabIndex={item.id === displayGallery.id ? 0 : -1}
                      type="button"
                      onClick={() => startTransition(() => selectGallery(item.id))}
                    >
                      <span>{item.label}</span>
                      <small>{item.title}</small>
                    </button>
                  ))}
                </div>

                <div className="product-planned-grid">
                  {retainedAssets.map((item) => (
                    <article className="product-planned-card product-planned-card--retained" key={item.id}>
                      <span>Retenu</span>
                      <strong>{item.label}</strong>
                      <p>{item.usage ?? item.title}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="product-layout__buybox" data-reveal>
            <p className="eyebrow">Crown Series</p>
            <h1>{activeProduct.name}</h1>
            <p className="product-layout__color">{activeProduct.color}</p>

            <div className="price-line">
              <strong>{euro.format(activeProduct.price)}</strong>
              <span>{euro.format(activeProduct.deliveredPrice)} livree</span>
            </div>

            <p className="product-layout__lead">{activeProduct.lead}</p>
            <ProductOfferRail product={activeProduct} />
            <p className="buybox-note">{plannedPanel ? plannedPanel.copy : displayGallery.text}</p>

            <div className="stock-line">
              <span>{activeProduct.inventory} pieces restantes</span>
              <span>Livraison offerte des {euro.format(shippingFreeThreshold)}</span>
            </div>

            <div className="chip-row">
              {activeProduct.chips.map((chip) => (
                <span className="chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>

            <div className="variant-switcher">
              {products.map((product) => (
                <button
                  key={product.id}
                  className={product.id === activeProduct.id ? 'is-active' : ''}
                  type="button"
                  onClick={() => onPreview(product)}
                >
                  <span>{product.name}</span>
                  <small>{product.color}</small>
                </button>
              ))}
            </div>

            <div className="button-stack">
              <button className="button button--primary button--full" type="button" onClick={() => onQuickAdd(activeProduct)}>
                Ajouter au panier
              </button>
              <button className="button button--secondary button--full" type="button" onClick={onCheckout}>
                Commander cette piece
              </button>
            </div>

            <div className="buybox-upsell">
              <div>
                <span>Option la plus rentable</span>
                <strong>Deux casquettes pour 50 EUR livrees</strong>
              </div>
              <button className="text-button" type="button" onClick={() => onQuickAddBundle(mainBundle)}>
                Passer au set fondateur
              </button>
            </div>

            <div className="quantity-box">
              <div className="quantity-box__copy">
                <span>Quantite dans le panier</span>
                <strong>{currentQuantity} piece{currentQuantity > 1 ? 's' : ''}</strong>
              </div>
              <div className="quantity-box__controls">
                <button type="button" onClick={() => decrementItem(activeProduct.id, true)}>−</button>
                <span className="quantity-box__count">{currentQuantity}</span>
                <button type="button" onClick={() => incrementItem(activeProduct.id, true)}>+</button>
              </div>
            </div>
            <p className="quantity-box__note">
              {currentQuantity > 0
                ? 'Ajuste la quantite sans quitter la fiche.'
                : 'Ajoute la piece puis ajuste ici si besoin.'}
            </p>

            <ul className="buybox-service-list">
              <li>Preparation soignee sous 24 a 48h.</li>
              <li>Retours encadres sous 30 jours.</li>
              <li>Concierge disponible avant et apres commande.</li>
            </ul>

            <article className="buybox-review">
              <p>"{featuredReview.quote}"</p>
              <strong>{featuredReview.author}</strong>
              <small>{featuredReview.role}</small>
            </article>
          </aside>
        </section>

        <section className="section section--product-chapter">
          <div className="product-chapter">
            <article className="product-chapter__manifesto" data-reveal>
              <p className="eyebrow">Lecture editoriale</p>
              <h2>{activeProduct.name} ne cherche pas le bruit. Elle cherche la presence.</h2>
              <p>
                {activeProduct.story} La lecture Kymia reste simple : une silhouette nette,
                une matiere propre, un signe qui tient meme quand tout le reste bouge.
              </p>
            </article>

            <div className="product-chapter__rail" data-reveal>
              {productChapters.map((chapter, index) => (
                <article className="product-chapter__card" key={chapter.label}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <span>{chapter.label}</span>
                  <strong>{chapter.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Detail"
            title="Matiere, tenue et lecture produit."
            copy="Une piece de ce niveau doit convaincre de pres, au porte, et dans le temps."
          />
          <div className="product-story-grid">
            <article className="spec-card spec-card--story" data-reveal>
              <span>Story</span>
              <p>{activeProduct.story}</p>
            </article>

            <article className="spec-card" data-reveal>
              <span>Specifications</span>
              <div className="spec-list">
                {activeProduct.specs.map(([label, value]) => (
                  <div className="spec-row" key={label}>
                    <strong>{label}</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="spec-card" data-reveal>
              <span>Pourquoi elle tient</span>
              <ul className="feature-list">
                {activeProduct.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Preuve"
            title="Retours, set fondateur et autres lectures."
            copy="Le role de la fiche n'est pas juste d'informer. Elle doit aussi faciliter la decision et ouvrir le panier moyen."
          />
          <div className="card-grid card-grid--three">
            {activeProduct.reviews.map((review) => (
              <article className="quote-card" data-reveal key={review.author + review.role}>
                <p>"{review.quote}"</p>
                <strong>{review.author}</strong>
                <small>{review.role}</small>
              </article>
            ))}

            <article className="quote-card quote-card--bundle" data-reveal>
              <p>{mainBundle.description}</p>
              <strong>{mainBundle.name}</strong>
              <button className="button button--primary" type="button" onClick={() => onQuickAddBundle(mainBundle)}>
                Ajouter le set
              </button>
            </article>
          </div>
        </section>

        <section className="section">
          <SectionIntro
            eyebrow="Autres pieces"
            title="Continuer la silhouette."
            copy="Une autre lecture de la Crown Series, avec le meme niveau de tenue."
          />
          <div className="product-grid">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                onPreview={onPreview}
                onQuickAdd={onQuickAdd}
                product={product}
              />
            ))}
          </div>
        </section>
      </div>

      <ProductStickyBar
        currentQuantity={currentQuantity}
        onAdd={() => onQuickAdd(activeProduct)}
        onCheckout={onCheckout}
        product={activeProduct}
      />
    </div>
  )
}

function HousePage({ navigate }) {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">Maison</p>
        <h1>Une maison courte, nette et reconnaissable.</h1>
        <p>
          Kymia construit un vestiaire qui prefere peu de pieces bien tenues a beaucoup
          de bruit. Chaque drop doit renforcer la signature, pas la diluer.
        </p>
      </section>

      <section className="section">
        <div className="card-grid card-grid--three">
          {houseSections.map((item) => (
            <article className="info-card" data-reveal key={item.title}>
              <span>{item.title}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="visual-story-grid">
          {houseVisuals.map((item) => (
            <article className="visual-story-card" data-reveal key={item.id}>
              <div className="visual-story-card__media">
                <img alt={item.alt} loading="lazy" src={item.image} />
              </div>
              <div className="visual-story-card__body">
                <p className="eyebrow">{item.eyebrow}</p>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionIntro
          eyebrow="Roadmap"
          title="Les prochains drops doivent ajouter du desir, pas du bruit."
          copy="La suite s'ecrit par capsules courtes, services solides et gestes de marque repetables."
        />
        <div className="timeline" data-reveal>
          {houseTimeline.map((step, index) => (
            <article className="timeline__step" key={step.label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div>
          <p className="eyebrow">Collection</p>
          <h2>Voir les pieces qui portent deja le code Kymia.</h2>
        </div>
        <AppLink className="button button--primary" navigate={navigate} to="/collection">
          Voir la collection
        </AppLink>
      </section>
    </div>
  )
}

function JournalPage({ navigate }) {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">Journal</p>
        <h1>Style, matiere et coulisses.</h1>
        <p>
          Le journal prolonge la desirabilite de la piece : comment porter, comment conserver,
          et comment comprendre l'intention derriere chaque drop.
        </p>
      </section>

      <div className="card-grid card-grid--three">
        {journalArticles.map((article) => (
          <article className="journal-card" data-reveal key={article.slug}>
            <span>{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <small>{article.readingTime}</small>
          </article>
        ))}
      </div>

      <section className="cta-band" data-reveal>
        <div>
          <p className="eyebrow">Acces prive</p>
          <h2>Recevoir les prochains sujets et les prochains drops en premier.</h2>
        </div>
        <AppLink className="button button--secondary" navigate={navigate} to="/access">
          Rejoindre la liste
        </AppLink>
      </section>
    </div>
  )
}

function AccessPage({ email, emailSubmitted, onEmailChange, onEmailSubmit }) {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">Acces prive</p>
        <h1>Voir le drop avant le public.</h1>
        <p>
          Reassorts, preventes, bundles reserves et messages de concierge. La liste privee
          existe pour ceux qui veulent entrer avant l'ouverture.
        </p>
      </section>

      <section className="access-layout">
        <article className="signup-card" data-reveal>
          <span>Liste prioritaire</span>
          <h3>Recevoir l'acces avant tout le monde.</h3>
          <p>Prevente, alertes de retour stock, capsules et invitations reservees aux membres.</p>
          <form className="signup-form" onSubmit={onEmailSubmit}>
            <label className="sr-only" htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              placeholder="Adresse e-mail"
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
            <button className="button button--primary" type="submit">
              Rejoindre
            </button>
          </form>
          {emailSubmitted ? <p className="success-note">Adresse enregistree. Tu seras prevenu avant le public.</p> : null}
        </article>

        <div className="card-grid">
          <article className="info-card" data-reveal>
            <span>Avantages</span>
            <ul className="feature-list">
              {membershipPerks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </article>

          <article className="info-card" data-reveal>
            <span>Concierge</span>
            <p>{brand.email}</p>
            <p>{brand.phone}</p>
          </article>
        </div>
      </section>
    </div>
  )
}

function ShippingPage({ navigate }) {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">Livraison & retours</p>
        <h1>Des regles claires, une execution propre.</h1>
        <p>
          Expedition, suivi, retours et paiements doivent rassurer immediatement, sans enlever
          le sentiment de maison.
        </p>
      </section>

      <section className="section">
        <div className="card-grid card-grid--three">
          {shippingModules.map((module) => (
            <article className="info-card" data-reveal key={module.title}>
              <span>{module.title}</span>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card-grid card-grid--two">
          <article className="spec-card" data-reveal>
            <span>Retours</span>
            <ul className="feature-list">
              {returnSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>

          <article className="spec-card" data-reveal>
            <span>Paiements</span>
            <ul className="feature-list">
              {paymentMethods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div>
          <p className="eyebrow">Besoin d'aide</p>
          <h2>Tout ce qu'il faut savoir avant de commander.</h2>
        </div>
        <AppLink className="button button--primary" navigate={navigate} to="/faq">
          Voir la FAQ
        </AppLink>
      </section>
    </div>
  )
}

function FaqPage() {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">FAQ</p>
        <h1>Les questions qu'on pose avant d'acheter.</h1>
        <p>
          Taille, expedition, retour, reapprovisionnement : tout ce qui doit etre simple avant
          la commande est deja la.
        </p>
      </section>

      <div className="faq-groups">
        {faqGroups.map((group) => (
          <section className="faq-group" data-reveal key={group.title}>
            <h2>{group.title}</h2>
            <div className="faq-list">
              {group.items.map((item, index) => (
                <details className="faq-card" key={item.question} open={index === 0}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const POSTAL_REGEX = /^[A-Za-z0-9\s-]{3,10}$/
const PHONE_REGEX = /^[+0-9\s().-]{8,20}$/

function validateCheckoutForm(values) {
  const errors = {}
  if (!values.firstName?.trim()) errors.firstName = 'Prénom requis.'
  if (!values.lastName?.trim()) errors.lastName = 'Nom requis.'
  if (!EMAIL_REGEX.test(values.email ?? '')) errors.email = 'Adresse e-mail invalide.'
  if (!PHONE_REGEX.test(values.phone ?? '')) errors.phone = 'Numéro de téléphone invalide.'
  if (!values.address?.trim()) errors.address = 'Adresse requise.'
  if (!POSTAL_REGEX.test(values.postalCode ?? '')) errors.postalCode = 'Code postal invalide.'
  if (!values.city?.trim()) errors.city = 'Ville requise.'
  if (!values.country?.trim()) errors.country = 'Pays requis.'
  return errors
}

function CheckoutPage({ cartItems, decrementItem, incrementItem, navigate, onSubmitOrder, removeItem }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'France',
    note: '',
    payment: paymentMethods[0],
  })
  const [errors, setErrors] = useState({})
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  const discount = computePromoDiscount(promo, subtotal)
  const subtotalAfterDiscount = Math.max(subtotal - discount, 0)
  const shipping =
    subtotalAfterDiscount === 0 ? 0 : subtotalAfterDiscount >= shippingFreeThreshold ? 0 : shippingFee
  const total = subtotalAfterDiscount + shipping
  const hasItems = cartItems.length > 0
  const shippingMessage =
    shipping === 0
      ? 'Livraison offerte active sur cette commande.'
      : `Encore ${shippingFreeThreshold - subtotalAfterDiscount} EUR pour activer la livraison offerte.`

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleApplyPromo = (event) => {
    event.preventDefault()
    const resolved = resolvePromoCode(promoInput)
    if (!resolved) {
      setPromo(null)
      setPromoError('Code inconnu.')
      return
    }
    if (subtotal < (resolved.minSubtotal ?? 0)) {
      setPromo(null)
      setPromoError(`Code valable dès ${resolved.minSubtotal} €.`)
      return
    }
    setPromo(resolved)
    setPromoError('')
    trackEvent('apply_promo', { code: resolved.code, value: resolved.value })
  }

  const handleRemovePromo = () => {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateCheckoutForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstError = document.querySelector('[data-invalid="true"]')
      if (firstError && typeof firstError.scrollIntoView === 'function') {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    onSubmitOrder({
      customer: { ...values },
      promo: promo ? { code: promo.code, label: promo.label, discount } : null,
      totals: { subtotal, discount, shipping, total },
    })
  }

  return (
    <div className="page">
      <CheckoutProgress currentStep={2} />

      <section className="page-hero page-hero--compact" data-reveal>
        <p className="eyebrow">Checkout</p>
        <h1>Derniere etape avant Kymia.</h1>
        <p>Coordonnees, livraison, paiement et recapitulatif dans un parcours court et lisible.</p>
      </section>

      {!hasItems ? (
        <section className="checkout-empty" data-reveal>
          <article className="checkout-summary">
            <div className="checkout-summary__head">
              <p className="eyebrow">Resume</p>
              <h2>Selection vide</h2>
            </div>
            <div className="empty-state">
              <h3>Le panier est vide.</h3>
              <p>Ajoute au moins une piece avant de continuer vers la commande.</p>
              <div className="button-row">
                <AppLink className="button button--primary" navigate={navigate} to="/collection">
                  Retour collection
                </AppLink>
                <AppLink className="button button--secondary" navigate={navigate} to="/access">
                  Acces prive
                </AppLink>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="checkout-layout">
          <form className="checkout-form" noValidate onSubmit={handleFormSubmit}>
            <div className="checkout-promise-row" data-reveal>
              {commercePromises.slice(0, 3).map((item) => (
                <div className="checkout-promise" key={item}>
                  <span />
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <article className="checkout-card" data-reveal>
              <span>Coordonnees</span>
              <div className="checkout-grid">
                <div className="field">
                  <input
                    autoComplete="given-name"
                    data-invalid={Boolean(errors.firstName)}
                    name="firstName"
                    placeholder="Prenom"
                    value={values.firstName}
                    onChange={handleChange('firstName')}
                  />
                  {errors.firstName ? <small className="field__error">{errors.firstName}</small> : null}
                </div>
                <div className="field">
                  <input
                    autoComplete="family-name"
                    data-invalid={Boolean(errors.lastName)}
                    name="lastName"
                    placeholder="Nom"
                    value={values.lastName}
                    onChange={handleChange('lastName')}
                  />
                  {errors.lastName ? <small className="field__error">{errors.lastName}</small> : null}
                </div>
                <div className="field checkout-grid__full">
                  <input
                    autoComplete="email"
                    data-invalid={Boolean(errors.email)}
                    name="email"
                    placeholder="Adresse e-mail"
                    type="email"
                    value={values.email}
                    onChange={handleChange('email')}
                  />
                  {errors.email ? <small className="field__error">{errors.email}</small> : null}
                </div>
                <div className="field checkout-grid__full">
                  <input
                    autoComplete="tel"
                    data-invalid={Boolean(errors.phone)}
                    name="phone"
                    placeholder="Telephone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange('phone')}
                  />
                  {errors.phone ? <small className="field__error">{errors.phone}</small> : null}
                </div>
              </div>
            </article>

            <article className="checkout-card" data-reveal>
              <span>Livraison</span>
              <div className="checkout-grid">
                <div className="field checkout-grid__full">
                  <input
                    autoComplete="street-address"
                    data-invalid={Boolean(errors.address)}
                    name="address"
                    placeholder="Adresse"
                    value={values.address}
                    onChange={handleChange('address')}
                  />
                  {errors.address ? <small className="field__error">{errors.address}</small> : null}
                </div>
                <div className="field">
                  <input
                    autoComplete="postal-code"
                    data-invalid={Boolean(errors.postalCode)}
                    inputMode="numeric"
                    name="postalCode"
                    placeholder="Code postal"
                    value={values.postalCode}
                    onChange={handleChange('postalCode')}
                  />
                  {errors.postalCode ? <small className="field__error">{errors.postalCode}</small> : null}
                </div>
                <div className="field">
                  <input
                    autoComplete="address-level2"
                    data-invalid={Boolean(errors.city)}
                    name="city"
                    placeholder="Ville"
                    value={values.city}
                    onChange={handleChange('city')}
                  />
                  {errors.city ? <small className="field__error">{errors.city}</small> : null}
                </div>
                <div className="field">
                  <input
                    autoComplete="country-name"
                    data-invalid={Boolean(errors.country)}
                    name="country"
                    placeholder="Pays"
                    value={values.country}
                    onChange={handleChange('country')}
                  />
                  {errors.country ? <small className="field__error">{errors.country}</small> : null}
                </div>
                <input
                  className="checkout-grid__full"
                  name="note"
                  placeholder="Instructions (optionnel)"
                  value={values.note}
                  onChange={handleChange('note')}
                />
              </div>
            </article>

            <article className="checkout-card" data-reveal>
              <span>Paiement</span>
              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <label key={method}>
                    <input
                      checked={values.payment === method}
                      name="payment"
                      type="radio"
                      value={method}
                      onChange={() => setValues((prev) => ({ ...prev, payment: method }))}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </article>

            <button className="button button--primary button--full" type="submit">
              Payer et confirmer
            </button>
            <p className="checkout-submit-note">
              Validation en une fois, confirmation immediate et suivi envoye des expedition.
            </p>
          </form>

          <aside className="checkout-summary" data-reveal>
            <div className="checkout-summary__head">
              <p className="eyebrow">Resume</p>
              <h2>{cartItems.length} ligne{cartItems.length > 1 ? 's' : ''}</h2>
            </div>

            <FreeShippingMeter subtotal={subtotalAfterDiscount} />

            <ul className="checkout-list">
              {cartItems.map((item) => (
                <li className="checkout-item" key={item.id}>
                  <div className="checkout-item__media">
                    <img alt={item.title} loading="lazy" src={item.image} />
                  </div>
                  <div className="checkout-item__copy">
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                    <div className="quantity-inline">
                      <button type="button" onClick={() => decrementItem(item.id)}>−</button>
                      <small>{item.quantity}</small>
                      <button type="button" onClick={() => incrementItem(item.id)}>+</button>
                    </div>
                  </div>
                  <div className="checkout-item__meta">
                    <strong>{euro.format(item.price * item.quantity)}</strong>
                    <button className="text-button" type="button" onClick={() => removeItem(item.id)}>
                      Retirer
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="checkout-promo">
              {promo ? (
                <div className="checkout-promo__applied">
                  <div>
                    <strong>{promo.code}</strong>
                    <span> · {promo.label}</span>
                  </div>
                  <button className="text-button" type="button" onClick={handleRemovePromo}>
                    Retirer
                  </button>
                </div>
              ) : (
                <form className="checkout-promo__form" onSubmit={handleApplyPromo}>
                  <input
                    aria-label="Code promo"
                    name="promoCode"
                    placeholder="Code promo"
                    value={promoInput}
                    onChange={(event) => {
                      setPromoInput(event.target.value)
                      if (promoError) setPromoError('')
                    }}
                  />
                  <button className="button button--secondary" type="submit">
                    Appliquer
                  </button>
                </form>
              )}
              {promoError ? <small className="field__error">{promoError}</small> : null}
            </div>

            <div className="checkout-totals">
              <div className="summary-row">
                <span>Sous-total</span>
                <strong>{euro.format(subtotal)}</strong>
              </div>
              {discount > 0 ? (
                <div className="summary-row summary-row--discount">
                  <span>Réduction {promo ? `· ${promo.code}` : ''}</span>
                  <strong>− {euro.format(discount)}</strong>
                </div>
              ) : null}
              <div className="summary-row">
                <span>Livraison</span>
                <strong>{shipping === 0 ? 'Offerte' : euro.format(shipping)}</strong>
              </div>
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <strong>{euro.format(total)}</strong>
              </div>
            </div>

            <p className="checkout-savings">{shippingMessage}</p>

            <ul className="buybox-service-list checkout-summary__trust">
              <li>Preparation soignee sous 24 a 48h.</li>
              <li>Suivi transmis au moment de la validation.</li>
              <li>Retours encadres sous 30 jours.</li>
            </ul>
          </aside>
        </section>
      )}
    </div>
  )
}

function SuccessPage({ lastOrder, navigate }) {
  if (!lastOrder) {
    return (
      <div className="page">
        <section className="page-hero" data-reveal>
          <p className="eyebrow">Confirmation</p>
          <h1>Commande confirmee.</h1>
          <p>Ta Crown entre en preparation. Le recapitulatif et le suivi peuvent maintenant prendre le relais.</p>
          <div className="button-row">
            <AppLink className="button button--primary" navigate={navigate} to="/collection">
              Retour collection
            </AppLink>
            <AppLink className="button button--secondary" navigate={navigate} to="/access">
              Voir l'acces prive
            </AppLink>
          </div>
        </section>
      </div>
    )
  }

  const { orderNumber, customer, items, totals, promo, createdAt } = lastOrder
  const orderDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="page">
      <CheckoutProgress currentStep={3} />

      <section className="page-hero page-hero--compact" data-reveal>
        <p className="eyebrow">Confirmation · {orderNumber}</p>
        <h1>Merci {customer.firstName}. Commande confirmée.</h1>
        <p>
          Un récapitulatif part sur <strong>{customer.email}</strong>. Préparation soignée sous 24 à 48&nbsp;h,
          suivi transmis dès expédition.
        </p>
      </section>

      <section className="checkout-layout" data-reveal>
        <article className="checkout-card">
          <span>Récapitulatif</span>
          <ul className="checkout-list">
            {items.map((item) => (
              <li className="checkout-item" key={item.id}>
                <div className="checkout-item__media">
                  <img alt={item.title} loading="lazy" src={item.image} />
                </div>
                <div className="checkout-item__copy">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                  <small>Quantité · {item.quantity}</small>
                </div>
                <div className="checkout-item__meta">
                  <strong>{euro.format(item.price * item.quantity)}</strong>
                </div>
              </li>
            ))}
          </ul>

          <div className="checkout-totals">
            <div className="summary-row">
              <span>Sous-total</span>
              <strong>{euro.format(totals.subtotal)}</strong>
            </div>
            {promo && totals.discount > 0 ? (
              <div className="summary-row summary-row--discount">
                <span>Réduction · {promo.code}</span>
                <strong>− {euro.format(totals.discount)}</strong>
              </div>
            ) : null}
            <div className="summary-row">
              <span>Livraison</span>
              <strong>{totals.shipping === 0 ? 'Offerte' : euro.format(totals.shipping)}</strong>
            </div>
            <div className="summary-row summary-row--total">
              <span>Total payé</span>
              <strong>{euro.format(totals.total)}</strong>
            </div>
          </div>
        </article>

        <aside className="checkout-summary">
          <div className="checkout-summary__head">
            <p className="eyebrow">Livraison</p>
            <h2>{customer.firstName} {customer.lastName}</h2>
          </div>
          <address className="order-address">
            {customer.address}
            <br />
            {customer.postalCode} {customer.city}
            <br />
            {customer.country}
          </address>
          <div className="order-meta">
            <div>
              <span>Commande</span>
              <strong>{orderNumber}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{orderDate}</strong>
            </div>
            <div>
              <span>Paiement</span>
              <strong>{customer.payment}</strong>
            </div>
          </div>

          <ul className="buybox-service-list checkout-summary__trust">
            <li>Préparation soignée sous 24 à 48&nbsp;h.</li>
            <li>Suivi envoyé par e-mail dès expédition.</li>
            <li>Retours encadrés sous 30 jours.</li>
          </ul>

          <div className="button-row">
            <AppLink className="button button--primary" navigate={navigate} to="/collection">
              Retour collection
            </AppLink>
            <AppLink className="button button--secondary" navigate={navigate} to="/access">
              Accès privé
            </AppLink>
          </div>
        </aside>
      </section>
    </div>
  )
}

function NotFoundPage({ navigate }) {
  return (
    <div className="page">
      <section className="page-hero" data-reveal>
        <p className="eyebrow">404</p>
        <h1>Cette page a quitte la scene.</h1>
        <p>Reviens vers l'accueil, la collection ou la maison.</p>
        <div className="button-row">
          <AppLink className="button button--primary" navigate={navigate} to="/">
            Retour accueil
          </AppLink>
          <AppLink className="button button--secondary" navigate={navigate} to="/collection">
            Voir la collection
          </AppLink>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname),
  )

  const initialRoute = resolveRoute(typeof window === 'undefined' ? '/' : window.location.pathname)
  const initialProductId =
    initialRoute.page === 'product' && initialRoute.product ? initialRoute.product.id : products[0].id

  const [selectedProductId, setSelectedProductId] = useState(initialProductId)
  const [selectedGalleryId, setSelectedGalleryId] = useState(products[0].gallery[0].id)
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartFeedback, setCartFeedback] = useState('')
  const [cartPulse, setCartPulse] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const route = resolveRoute(path)
  const selectedProduct = getProductById(selectedProductId) ?? products[0]
  const activeProduct =
    route.page === 'product' && route.product ? route.product : selectedProduct
  const activeGallery =
    activeProduct.gallery.find((item) => item.id === selectedGalleryId) ?? activeProduct.gallery[0]

  useReveal(path, activeProduct.id)

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (route.page === 'product' && route.product && route.product.id !== selectedProductId) {
      setSelectedProductId(route.product.id)
    }
  }, [route.page, route.product, selectedProductId])

  useEffect(() => {
    const firstGallery = activeProduct.gallery[0]
    if (firstGallery && firstGallery.id !== selectedGalleryId) {
      setSelectedGalleryId(firstGallery.id)
    }
  }, [activeProduct, selectedGalleryId])

  useEffect(() => {
    const raw = window.localStorage.getItem('kymia-cart')
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setCartItems(
          parsed.map((item) => ({
            id: item.id,
            itemType: item.itemType ?? 'product',
            referenceId: item.referenceId ?? item.productId ?? item.id,
            title: item.title ?? item.name ?? 'Produit',
            subtitle: item.subtitle ?? item.color ?? '',
            image: item.image,
            price: item.price,
            quantity: item.quantity ?? 1,
          })),
        )
      }
    } catch {
      window.localStorage.removeItem('kymia-cart')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('kymia-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  useEffect(() => {
    if (!isCartOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCartOpen])

  useEffect(() => {
    const seo = buildSeo(route, activeProduct)
    document.title = seo.title
    setMeta('meta[name="description"]', seo.description)
    setMeta('meta[property="og:title"]', seo.title)
    setMeta('meta[property="og:description"]', seo.description)
    setMeta('meta[property="og:url"]', seo.canonical)
    setMeta('meta[property="og:image"]', seo.image)
    setMeta('meta[name="twitter:title"]', seo.title)
    setMeta('meta[name="twitter:description"]', seo.description)
    setMeta('meta[name="twitter:image"]', seo.image)
    setMeta('meta[name="theme-color"]', '#ffffff')
    setCanonical(seo.canonical)
    setStructuredData(seo.structuredData)
  }, [route, activeProduct])

  useEffect(() => {
    trackEvent('page_view', { page_path: path })
  }, [path])

  useEffect(() => {
    if (route.page !== 'product') {
      return
    }

    trackEvent('view_item', {
      currency: 'EUR',
      item_id: activeProduct.sku,
      item_name: activeProduct.name,
      value: activeProduct.price,
    })
  }, [route.page, activeProduct])

  useEffect(() => {
    if (!cartFeedback) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setCartFeedback('')
    }, 2600)

    return () => window.clearTimeout(timeout)
  }, [cartFeedback])

  useEffect(() => {
    if (!cartPulse) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setCartPulse(false)
    }, 650)

    return () => window.clearTimeout(timeout)
  }, [cartPulse])

  const navigate = (nextPath) => {
    const normalized = normalizePath(nextPath)
    if (isCartOpen) {
      setIsCartOpen(false)
    }
    if (normalized !== path) {
      window.history.pushState({}, '', normalized)
      setPath(normalized)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const triggerCartMotion = (message, openCart = true) => {
    setCartFeedback(message)
    setCartPulse(true)

    if (openCart) {
      setIsCartOpen(true)
    }
  }

  const addItem = (payload) => {
    setCartItems((items) => {
      const existing = items.find(
        (item) => item.itemType === payload.itemType && item.referenceId === payload.referenceId,
      )

      if (existing) {
        return items.map((item) =>
          item.itemType === payload.itemType && item.referenceId === payload.referenceId
            ? { ...item, quantity: item.quantity + payload.quantity }
            : item,
        )
      }

      return [...items, payload]
    })
  }

  const addProductToCart = (product, quantity = 1) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      itemType: 'product',
      referenceId: product.id,
      title: product.name,
      subtitle: product.color,
      image: product.heroImage,
      price: product.price,
      quantity,
    })
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: product.price * quantity,
      item_id: product.sku,
      item_name: product.name,
    })
  }

  const handleProductAdd = (product, { openCart = true, quantity = 1 } = {}) => {
    addProductToCart(product, quantity)
    triggerCartMotion(`${product.name} ajoutee au panier`, openCart)
  }

  const handleBundleAdd = (bundle, { openCart = true } = {}) => {
    addBundleToCart(bundle)
    triggerCartMotion(`${bundle.name} ajoute au panier`, openCart)
  }

  const addBundleToCart = (bundle) => {
    const bundleProducts = getBundleProducts(bundle)
    addItem({
      id: `${bundle.id}-${Date.now()}`,
      itemType: 'bundle',
      referenceId: bundle.id,
      title: bundle.name,
      subtitle: bundleProducts.map((product) => product.name).join(' + '),
      image: bundleProducts[0]?.heroImage ?? products[0].heroImage,
      price: bundle.price,
      quantity: 1,
    })
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: bundle.price,
      item_id: bundle.slug,
      item_name: bundle.name,
    })
  }

  const incrementItem = (itemId, byActiveProduct = false) => {
    if (byActiveProduct) {
      addProductToCart(activeProduct, 1)
      return
    }

    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  const decrementItem = (itemId, byActiveProduct = false) => {
    if (byActiveProduct) {
      setCartItems((items) =>
        items
          .map((item) =>
            item.itemType === 'product' && item.referenceId === activeProduct.id
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      )
      return
    }

    setCartItems((items) =>
      items
        .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (itemId) => {
    setCartItems((items) => {
      const itemToRemove = items.find((item) => item.id === itemId)

      if (itemToRemove) {
        trackEvent('remove_from_cart', {
          currency: 'EUR',
          value: itemToRemove.price * itemToRemove.quantity,
          item_name: itemToRemove.title,
        })
      }

      return items.filter((item) => item.id !== itemId)
    })
  }

  const previewProduct = (product) => {
    startTransition(() => {
      setSelectedProductId(product.id)
      setSelectedGalleryId(product.gallery[0].id)
      navigate(`/caps/${product.slug}`)
    })
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const getReferenceQuantity = (referenceId, itemType = 'product') =>
    cartItems.reduce((sum, item) => {
      if (item.itemType === itemType && item.referenceId === referenceId) {
        return sum + item.quantity
      }

      return sum
    }, 0)
  const activeProductQuantity = getReferenceQuantity(activeProduct.id)
  const currentYear = new Date().getFullYear()

  let page = null

  if (route.page === 'home') {
    page = (
      <HomePage
        activeProduct={activeProduct}
        navigate={navigate}
        onPreview={previewProduct}
        onQuickAdd={(product) => {
          handleProductAdd(product)
        }}
        onQuickAddBundle={(bundle) => {
          handleBundleAdd(bundle)
        }}
        setHeroProductId={setSelectedProductId}
      />
    )
  } else if (route.page === 'collection') {
    page = (
      <CollectionPage
        navigate={navigate}
        onPreview={previewProduct}
        onQuickAdd={(product) => {
          handleProductAdd(product)
        }}
        onQuickAddBundle={(bundle) => {
          handleBundleAdd(bundle)
        }}
      />
    )
  } else if (route.page === 'product' && activeProduct) {
    page = (
      <ProductPage
        activeGallery={activeGallery}
        activeProduct={activeProduct}
        currentQuantity={activeProductQuantity}
        decrementItem={decrementItem}
        incrementItem={incrementItem}
        navigate={navigate}
        onCheckout={() => {
          if (activeProductQuantity === 0) {
            handleProductAdd(activeProduct, { openCart: false })
          }
          navigate('/checkout')
        }}
        onPreview={previewProduct}
        onQuickAdd={(product) => {
          handleProductAdd(product)
        }}
        onQuickAddBundle={(bundle) => {
          handleBundleAdd(bundle)
        }}
        selectGallery={setSelectedGalleryId}
      />
    )
  } else if (route.page === 'house') {
    page = <HousePage navigate={navigate} />
  } else if (route.page === 'journal') {
    page = <JournalPage navigate={navigate} />
  } else if (route.page === 'access') {
    page = (
      <AccessPage
        email={email}
        emailSubmitted={emailSubmitted}
        onEmailChange={(value) => {
          setEmail(value)
          if (emailSubmitted) {
            setEmailSubmitted(false)
          }
        }}
        onEmailSubmit={(event) => {
          event.preventDefault()
          if (!email.trim()) {
            return
          }
          trackEvent('generate_lead', { method: 'waitlist', email_domain: email.split('@')[1] ?? '' })
          setEmail('')
          setEmailSubmitted(true)
        }}
      />
    )
  } else if (route.page === 'shipping') {
    page = <ShippingPage navigate={navigate} />
  } else if (route.page === 'faq') {
    page = <FaqPage />
  } else if (route.page === 'checkout') {
    page = (
      <CheckoutPage
        cartItems={cartItems}
        decrementItem={decrementItem}
        incrementItem={incrementItem}
        navigate={navigate}
        onSubmitOrder={({ customer, promo, totals }) => {
          if (cartItems.length === 0) {
            return
          }

          const orderNumber = `KYM-${Date.now().toString(36).toUpperCase().slice(-6)}`
          const order = {
            orderNumber,
            createdAt: new Date().toISOString(),
            customer,
            promo,
            totals,
            items: cartItems,
          }

          trackEvent('purchase', {
            currency: 'EUR',
            transaction_id: orderNumber,
            value: totals.total,
            tax: 0,
            shipping: totals.shipping,
            coupon: promo?.code,
            items: cartItems.map((item) => ({
              item_name: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          })
          setLastOrder(order)
          setCartItems([])
          navigate('/checkout/success')
        }}
        removeItem={removeItem}
      />
    )
  } else if (route.page === 'success') {
    page = <SuccessPage lastOrder={lastOrder} navigate={navigate} />
  } else {
    page = <NotFoundPage navigate={navigate} />
  }

  return (
    <div className="app-shell">
      <CartFeedback message={cartFeedback} />
      <CartDrawer
        cartItems={cartItems}
        closeCart={() => setIsCartOpen(false)}
        decrementItem={decrementItem}
        feedbackMessage={cartFeedback}
        incrementItem={incrementItem}
        isOpen={isCartOpen}
        navigate={navigate}
        removeItem={removeItem}
      />

      <Header
        cartCount={cartCount}
        cartPulse={cartPulse}
        navigate={navigate}
        openCart={() => setIsCartOpen(true)}
        path={path}
      />
      <TrustBar />

      <main className="main-shell" key={route.page + (route.product?.id ?? '')}>
        {page}
      </main>

      <Footer navigate={navigate} />

      <div className="site-legal">© {currentYear} {brand.name}. Tous droits reserves.</div>
      <ScrollToTop />
    </div>
  )
}

export default App
