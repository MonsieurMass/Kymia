import { useState, useCallback, useEffect } from 'react'
import { shippingFee, shippingFreeThreshold } from '../content/siteContent'

/**
 * Custom hook to manage shopping cart state and operations
 */
export function useCart() {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kymia-cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kymia-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.variant === item.variant)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.variant === item.variant
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId, variant) => {
    setCart((prev) => prev.filter((i) => !(i.id === itemId && i.variant === variant)))
  }, [])

  const updateQuantity = useCallback((itemId, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, variant)
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.id === itemId && i.variant === variant ? { ...i, quantity } : i
        )
      )
    }
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  // Compute cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const shipping = subtotal >= shippingFreeThreshold ? 0 : shippingFee
  const total = subtotal + shipping
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
    itemCount,
  }
}
