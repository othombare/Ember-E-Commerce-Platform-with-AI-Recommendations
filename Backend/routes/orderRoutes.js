import { Router } from 'express'
import { createOrderEntry, listMyOrders } from '../controllers/orderController.js'
import { requireAuth } from '../utils/authMiddleware.js'

const router = Router()

router.get('/me', requireAuth, listMyOrders)
router.post('/', requireAuth, createOrderEntry)

export default router
