import { Router } from 'express'
import {
  createProductFromRequest,
  getProductDetails,
  listCollectionProducts,
  listProducts,
  uploadProductImage,
} from '../controllers/productController.js'
import { requireAuth } from '../utils/authMiddleware.js'
import { productImageUpload } from '../utils/upload.js'

const router = Router()

router.get('/', listProducts)
router.get('/collections/:collectionName', listCollectionProducts)
router.get('/:productId', getProductDetails)
router.post('/image-upload', requireAuth, productImageUpload.single('image'), uploadProductImage)
router.post('/', requireAuth, productImageUpload.single('image'), createProductFromRequest)

export default router
