import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { normalizeSize } from '../data/curatedProducts'

const CART_STORAGE_KEY = 'ember-cart-storage'

function toCartItemId(productId, size) {
  return `${productId}::${normalizeSize(size)}`
}

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: ({ product, quantity = 1, size = 'M' }) => {
        if (!product || !product.id) {
          return
        }

        const safeQuantity = Math.max(1, Number(quantity) || 1)
        const normalizedSize = normalizeSize(size)
        const itemId = toCartItemId(product.id, normalizedSize)

        set((state) => {
          const match = state.items.find((entry) => entry.id === itemId)

          if (match) {
            return {
              items: state.items.map((entry) =>
                entry.id === itemId ? { ...entry, quantity: entry.quantity + safeQuantity } : entry,
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                productId: product.id,
                name: product.name,
                image: product.image,
                category: product.category,
                price: product.price,
                oldPrice: product.oldPrice,
                size: normalizedSize,
                quantity: safeQuantity,
              },
            ],
          }
        })
      },
      removeFromCart: (itemId) => {
        set((state) => ({ items: state.items.filter((entry) => entry.id !== itemId) }))
      },
      updateCartItemQuantity: (itemId, quantity) => {
        const safeQuantity = Math.max(1, Number(quantity) || 1)
        set((state) => ({
          items: state.items.map((entry) => (entry.id === itemId ? { ...entry, quantity: safeQuantity } : entry)),
        }))
      },
      clearCart: () => set({ items: [] }),
      cartItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export default useCartStore