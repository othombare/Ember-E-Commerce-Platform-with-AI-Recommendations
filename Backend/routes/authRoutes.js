import { Router } from 'express'
import {
  forgotPassword,
  me,
  signin,
  signup,
  submitSellerApplication,
  updateProfile,
} from '../controllers/authController.js'
import { requireAuth } from '../utils/authMiddleware.js'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/forgot-password', forgotPassword)
router.get('/me', requireAuth, me)
router.patch('/me', requireAuth, updateProfile)
router.patch('/me/seller', requireAuth, submitSellerApplication)

export default router
