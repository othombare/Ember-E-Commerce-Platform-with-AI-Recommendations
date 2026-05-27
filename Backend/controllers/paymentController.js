import crypto from 'crypto'

function sanitizeText(value) {
  return String(value ?? '').trim()
}

function toSafeAmount(value) {
  return Math.max(0, Math.round(Number(value) || 0))
}

function getRazorpayCredentials() {
  const keyId = sanitizeText(process.env.RAZORPAY_KEY_ID)
  const keySecret = sanitizeText(process.env.RAZORPAY_KEY_SECRET)

  if (!keyId || !keySecret) {
    return null
  }

  return { keyId, keySecret }
}

export async function createRazorpayOrder(req, res) {
  const credentials = getRazorpayCredentials()
  if (!credentials) {
    res.status(500).json({
      message: 'Razorpay credentials are not configured on the server.',
    })
    return
  }

  const amount = toSafeAmount(req.body?.amount)
  if (amount <= 0) {
    res.status(400).json({
      message: 'A valid payment amount is required.',
    })
    return
  }

  const currency = sanitizeText(req.body?.currency).toUpperCase() || 'INR'
  const receipt = sanitizeText(req.body?.receipt) || `ember_${Date.now()}`
  const notes = req.body?.notes && typeof req.body.notes === 'object' ? req.body.notes : {}

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    res.status(502).json({
      message: payload?.error?.description || payload?.error?.reason || 'Could not create Razorpay order.',
      details: payload ?? null,
    })
    return
  }

  res.status(201).json({
    keyId: credentials.keyId,
    order: payload,
  })
}

export async function verifyRazorpayPayment(req, res) {
  const credentials = getRazorpayCredentials()
  if (!credentials) {
    res.status(500).json({
      message: 'Razorpay credentials are not configured on the server.',
    })
    return
  }

  const orderId = sanitizeText(req.body?.orderId)
  const razorpayPaymentId = sanitizeText(req.body?.razorpayPaymentId)
  const razorpaySignature = sanitizeText(req.body?.razorpaySignature)

  if (!orderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400).json({
      message: 'Razorpay order id, payment id, and signature are required.',
    })
    return
  }

  const generatedSignature = crypto
    .createHmac('sha256', credentials.keySecret)
    .update(`${orderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (generatedSignature !== razorpaySignature) {
    res.status(400).json({
      message: 'Razorpay payment signature verification failed.',
    })
    return
  }

  res.json({
    verified: true,
    orderId,
    razorpayPaymentId,
    razorpaySignature,
  })
}
