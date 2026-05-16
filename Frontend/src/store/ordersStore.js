import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const ORDERS_STORAGE_KEY = 'ember-orders-storage'

function toOrderAmount(value) {
  return Math.max(0, Number(value) || 0)
}

function toOrderQuantity(value) {
  return Math.max(1, Number(value) || 1)
}

function createOrderId() {
  const now = new Date()
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `EMBER-${datePart}-${timePart}-${randomPart}`
}

function toOrderItems(items) {
  return (items ?? [])
    .filter((item) => item && item.id && item.name)
    .map((item) => ({
      id: item.id,
      productId: item.productId ?? item.id,
      name: item.name,
      image: item.image ?? null,
      category: item.category ?? 'General',
      size: item.size ?? 'M',
      price: toOrderAmount(item.price),
      oldPrice: toOrderAmount(item.oldPrice),
      quantity: toOrderQuantity(item.quantity),
    }))
}

function doesOrderBelongToUser(order, user) {
  const userId = String(user?.id ?? '').trim()
  const userEmail = String(user?.email ?? '').trim().toLowerCase()
  const orderUserId = String(order?.user?.id ?? '').trim()
  const orderUserEmail = String(order?.user?.email ?? '').trim().toLowerCase()

  if (userId && orderUserId) {
    return userId === orderUserId
  }

  if (userEmail && orderUserEmail) {
    return userEmail === orderUserEmail
  }

  return false
}

const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: ({ items, user, subtotal = 0, shipping = 0, tax = 0, total = 0 }) => {
        const orderItems = toOrderItems(items)
        if (orderItems.length === 0) {
          return null
        }

        const nextOrder = {
          id: createOrderId(),
          createdAt: new Date().toISOString(),
          status: 'Placed',
          user: {
            id: user?.id ?? null,
            name: user?.name ?? 'Shopper',
            email: user?.email ?? null,
          },
          items: orderItems,
          itemCount: orderItems.reduce((count, item) => count + item.quantity, 0),
          subtotal: toOrderAmount(subtotal),
          shipping: toOrderAmount(shipping),
          tax: toOrderAmount(tax),
          total: toOrderAmount(total),
        }

        set((state) => ({ orders: [nextOrder, ...state.orders] }))
        return nextOrder.id
      },
      clearOrders: () => set({ orders: [] }),
      getOrdersByUser: (user) => get().orders.filter((order) => doesOrderBelongToUser(order, user)),
    }),
    {
      name: ORDERS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
)

export default useOrdersStore
