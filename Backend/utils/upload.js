import fs from 'fs/promises'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productsUploadDirectory = path.join(__dirname, '..', 'uploads', 'products')

export async function ensureUploadDirectories() {
  await fs.mkdir(productsUploadDirectory, { recursive: true })
}

function sanitizeFileName(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, productsUploadDirectory)
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg'
    const baseName = path.basename(file.originalname || 'product-image', extension)
    const safeBaseName = sanitizeFileName(baseName) || 'product-image'
    callback(null, `${Date.now()}-${safeBaseName}${extension}`)
  },
})

function imageOnlyFilter(req, file, callback) {
  if (!file.mimetype.startsWith('image/')) {
    callback(new Error('Only image file uploads are allowed.'))
    return
  }

  callback(null, true)
}

export const productImageUpload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
