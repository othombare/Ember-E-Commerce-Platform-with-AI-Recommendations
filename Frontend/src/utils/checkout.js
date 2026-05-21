export const CHECKOUT_SHIPPING_FEE = 99
export const CHECKOUT_TAX_RATE = 0.08

function toSafeAmount(value) {
  return Math.max(0, Number(value) || 0)
}

function toSafeQuantity(value) {
  return Math.max(1, Number(value) || 1)
}

export function getCartPricing(cartItems) {
  const items = Array.isArray(cartItems) ? cartItems : []
  const itemCount = items.reduce((count, item) => count + toSafeQuantity(item.quantity), 0)

  const subtotal = items.reduce((total, item) => {
    const price = toSafeAmount(item.price)
    const quantity = toSafeQuantity(item.quantity)
    return total + price * quantity
  }, 0)

  const shipping = itemCount > 0 ? CHECKOUT_SHIPPING_FEE : 0
  const tax = Math.round(subtotal * CHECKOUT_TAX_RATE)
  const total = subtotal + shipping + tax

  return {
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
  }
}
