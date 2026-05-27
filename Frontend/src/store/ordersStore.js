import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const ORDERS_STORAGE_KEY = 'ember-orders-storage'

function toOrderAmount(value) {
  return Math.max(0, Number(value) || 0)
}

function toOrderQuantity(value) {
  return Math.max(1, Number(value) || 1)
}

function sanitizeText(value) {
  return String(value ?? '').trim()
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

function normalizeOrderAddress(address) {
  if (!address || typeof address !== 'object') {
    return null
  }

  const normalizedAddress = {
    id: sanitizeText(address.id),
    label: sanitizeText(address.label) || 'Delivery Address',
    fullName: sanitizeText(address.fullName),
    phone: sanitizeText(address.phone),
    line1: sanitizeText(address.line1),
    line2: sanitizeText(address.line2),
    city: sanitizeText(address.city),
    state: sanitizeText(address.state),
    pincode: sanitizeText(address.pincode),
    country: sanitizeText(address.country) || 'India',
  }

  if (!normalizedAddress.line1 || !normalizedAddress.city || !normalizedAddress.state || !normalizedAddress.pincode) {
    return null
  }

  return normalizedAddress
}

function normalizeOrderPayment(payment) {
  const method = sanitizeText(payment?.method).toUpperCase()
  const channel = sanitizeText(payment?.channel).toUpperCase()
  const transactionRef = sanitizeText(payment?.transactionRef)
  const status = sanitizeText(payment?.status)
  const gateway = payment?.gateway && typeof payment.gateway === 'object' ? payment.gateway : null
  const gatewayProvider = sanitizeText(gateway?.provider).toUpperCase()
  const gatewayOrderId = sanitizeText(gateway?.orderId)
  const gatewayPaymentId = sanitizeText(gateway?.paymentId)
  const gatewaySignature = sanitizeText(gateway?.signature)

  if (method === 'ONLINE') {
    return {
      method: 'ONLINE',
      channel: channel || 'UPI',
      status: status || 'paid',
      transactionRef: transactionRef || gatewayPaymentId || null,
      gateway: {
        provider: gatewayProvider || channel || 'RAZORPAY',
        orderId: gatewayOrderId || null,
        paymentId: gatewayPaymentId || null,
        signature: gatewaySignature || null,
      },
    }
  }

  return {
    method: 'COD',
    channel: 'COD',
    status: status || 'pending',
    transactionRef: null,
    gateway: null,
  }
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
      placeOrder: ({
        items,
        user,
        subtotal = 0,
        shipping = 0,
        tax = 0,
        total = 0,
        shippingAddress = null,
        payment = null,
        notes = '',
      }) => {
        const orderItems = toOrderItems(items)
        if (orderItems.length === 0) {
          return null
        }
        const paymentDetails = normalizeOrderPayment(payment)

        const nextOrder = {
          id: createOrderId(),
          createdAt: new Date().toISOString(),
          status: paymentDetails.method === 'ONLINE' ? 'Confirmed' : 'Placed',
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
          shippingAddress: normalizeOrderAddress(shippingAddress),
          payment: paymentDetails,
          notes: sanitizeText(notes) || null,
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
