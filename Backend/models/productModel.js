import { nanoid } from 'nanoid'
import { productsFilePath, readCollection, writeCollection } from './dataStore.js'

function toSlug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeProduct(product) {
  const now = new Date().toISOString()
  const generatedId = toSlug(product.name) || `product-${nanoid(8)}`
  const id = toSlug(product.id) || generatedId

  return {
    id,
    name: String(product.name ?? '').trim(),
    category: String(product.category ?? 'General').trim(),
    image: String(product.image ?? '').trim(),
    price: Number(product.price) || 0,
    oldPrice: Number(product.oldPrice) || Number(product.price) || 0,
    rating: Number(product.rating) || 4.2,
    reviews: Number(product.reviews) || 0,
    sold: Number(product.sold) || 0,
    isNew: Boolean(product.isNew),
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : ['M'],
    tags: Array.isArray(product.tags) ? product.tags : [],
    shortDescription: String(product.shortDescription ?? '').trim(),
    description: String(product.description ?? product.shortDescription ?? '').trim(),
    stock: Math.max(0, Number(product.stock) || 0),
    createdAt: product.createdAt ?? now,
    updatedAt: now,
  }
}

export async function getProducts() {
  return readCollection(productsFilePath, [])
}

export async function findProductById(productId) {
  const normalizedId = String(productId ?? '').trim()
  if (!normalizedId) {
    return null
  }

  const products = await getProducts()
  return products.find((product) => product.id === normalizedId) ?? null
}

export async function createProduct(payload) {
  const products = await getProducts()
  const nextProduct = normalizeProduct(payload)

  const hasDuplicateId = products.some((product) => product.id === nextProduct.id)
  if (hasDuplicateId) {
    nextProduct.id = `${nextProduct.id}-${nanoid(4).toLowerCase()}`
  }

  products.unshift(nextProduct)
  await writeCollection(productsFilePath, products)

  return nextProduct
}
