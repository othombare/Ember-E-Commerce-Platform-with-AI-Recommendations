import { nanoid } from 'nanoid'
import { ordersFilePath, readCollection, writeCollection } from './dataStore.js'

export async function getOrders() {
  return readCollection(ordersFilePath, [])
}

function sanitizeText(value) {
  return String(value ?? '').trim()
}

function toSafeAmount(value) {
  return Math.max(0, Number(value) || 0)
}

function toSafeQuantity(value) {
  return Math.max(1, Number(value) || 1)
}

function normalizeOrderItems(items) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .filter((item) => item && item.id && item.name)
    .map((item) => ({
      id: sanitizeText(item.id),
      productId: sanitizeText(item.productId ?? item.id),
      name: sanitizeText(item.name),
      image: sanitizeText(item.image) || null,
      category: sanitizeText(item.category) || 'General',
      size: sanitizeText(item.size) || 'M',
      price: toSafeAmount(item.price),
      oldPrice: toSafeAmount(item.oldPrice),
      quantity: toSafeQuantity(item.quantity),
    }))
}

function normalizeShippingAddress(address) {
  if (!address || typeof address !== 'object') {
    return null
  }

  const normalized = {
    id: sanitizeText(address.id) || `ship_${nanoid(8)}`,
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

  if (!normalized.line1 || !normalized.city || !normalized.state || !normalized.pincode) {
    return null
  }

  return normalized
}

function normalizePayment(payload) {
  const method = sanitizeText(payload?.method).toUpperCase()
  const channel = sanitizeText(payload?.channel).toUpperCase()
  const transactionRef = sanitizeText(payload?.transactionRef)
  const gateway = payload?.gateway && typeof payload.gateway === 'object' ? payload.gateway : null
  const gatewayProvider = sanitizeText(gateway?.provider).toUpperCase()
  const gatewayOrderId = sanitizeText(gateway?.orderId)
  const gatewayPaymentId = sanitizeText(gateway?.paymentId)
  const gatewaySignature = sanitizeText(gateway?.signature)

  if (method === 'COD') {
    return {
      method: 'COD',
      channel: 'COD',
      status: 'pending',
      transactionRef: null,
      paidAt: null,
      gateway: null,
    }
  }

  if (method === 'ONLINE') {
    const safeChannel = channel || 'UPI'

    return {
      method: 'ONLINE',
      channel: safeChannel,
      status: 'paid',
      transactionRef: transactionRef || gatewayPaymentId || `TXN-${nanoid(10).toUpperCase()}`,
      paidAt: new Date().toISOString(),
      gateway: {
        provider: gatewayProvider || safeChannel || 'RAZORPAY',
        orderId: gatewayOrderId || null,
        paymentId: gatewayPaymentId || null,
        signature: gatewaySignature || null,
      },
    }
  }

  return {
    method: 'COD',
    channel: 'COD',
    status: 'pending',
    transactionRef: null,
    paidAt: null,
    gateway: null,
  }
}

export async function createOrder(payload) {
  const orders = await getOrders()
  const now = new Date().toISOString()
  const orderItems = normalizeOrderItems(payload.items)
  const itemCount = orderItems.reduce((count, item) => count + item.quantity, 0)
  const payment = normalizePayment(payload.payment)

  const nextOrder = {
    id: `EMBER-${nanoid(10).toUpperCase()}`,
    user: payload.user ?? null,
    items: orderItems,
    itemCount,
    subtotal: toSafeAmount(payload.subtotal),
    shipping: toSafeAmount(payload.shipping),
    tax: toSafeAmount(payload.tax),
    total: toSafeAmount(payload.total),
    shippingAddress: normalizeShippingAddress(payload.shippingAddress),
    payment,
    notes: sanitizeText(payload.notes) || null,
    status: payment.method === 'ONLINE' ? 'Confirmed' : 'Placed',
    createdAt: now,
    updatedAt: now,
  }

  orders.unshift(nextOrder)
  await writeCollection(ordersFilePath, orders)
  return nextOrder
}

export async function getOrdersByUser(userId) {
  const orders = await getOrders()
  const normalizedId = String(userId ?? '').trim()
  return orders.filter((order) => String(order?.user?.id ?? '').trim() === normalizedId)
}
