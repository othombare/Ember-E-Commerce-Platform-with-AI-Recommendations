import { createOrder, getOrdersByUser } from '../models/orderModel.js'

export async function createOrderEntry(req, res) {
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  if (items.length === 0) {
    res.status(400).json({
      message: 'Order must contain at least one item.',
    })
    return
  }

  const shippingAddress = req.body?.shippingAddress
  if (!shippingAddress || typeof shippingAddress !== 'object') {
    res.status(400).json({
      message: 'Shipping address is required before checkout.',
    })
    return
  }

  const payment = req.body?.payment
  if (!payment || typeof payment !== 'object' || !payment.method) {
    res.status(400).json({
      message: 'Payment method is required before checkout.',
    })
    return
  }

  const order = await createOrder({
    user: {
      id: req.user?.id,
      email: req.user?.email,
      name: req.user?.name,
    },
    items,
    subtotal: req.body?.subtotal,
    shipping: req.body?.shipping,
    tax: req.body?.tax,
    total: req.body?.total,
    shippingAddress: req.body?.shippingAddress,
    payment: req.body?.payment,
    notes: req.body?.notes,
  })

  res.status(201).json({
    message: 'Order placed successfully.',
    order,
  })
}

export async function listMyOrders(req, res) {
  const orders = await getOrdersByUser(req.user?.id)
  res.json({
    total: orders.length,
    orders,
  })
}
