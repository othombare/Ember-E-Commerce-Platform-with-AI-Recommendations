import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import productRoutes from './routes/productRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.FRONTEND_URL ?? true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Ember backend is running and DB connection is healthy.',
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/payments', paymentRoutes)
  app.use('/api/orders', orderRoutes)

  app.use((req, res) => {
    res.status(404).json({
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    })
  })

  app.use((error, req, res, next) => {
    const statusCode = error.statusCode ?? 500
    const message = error.message ?? 'Internal server error'

    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }

    res.status(statusCode).json({
      message,
      ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
    })
  })

  return app
}

export default createApp
