import { Router } from 'express'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js'
import { requireAuth } from '../utils/authMiddleware.js'

const router = Router()

router.post('/razorpay/orders', requireAuth, createRazorpayOrder)
router.post('/razorpay/verify', requireAuth, verifyRazorpayPayment)

export default router
