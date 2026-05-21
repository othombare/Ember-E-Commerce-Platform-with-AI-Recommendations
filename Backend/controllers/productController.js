import { createProduct, findProductById, getProducts } from '../models/productModel.js'

function parseNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value
  }

  const normalized = String(value ?? '').trim().toLowerCase()
  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return fallback
}

function parseArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    const cleanValue = value.trim()
    if (!cleanValue) {
      return fallback
    }

    if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
      try {
        const parsed = JSON.parse(cleanValue)
        if (Array.isArray(parsed)) {
          return parsed.map((entry) => String(entry).trim()).filter(Boolean)
        }
      } catch {
        // Fall through to comma split.
      }
    }

    return cleanValue
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
  }

  return fallback
}

function sanitizeProductPayload(payload, file, req) {
  const backendPublicUrl = (process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
  const uploadedImagePath = file ? `${backendPublicUrl}/uploads/products/${file.filename}` : null
  const defaultImage = `${backendPublicUrl}/uploads/products/men-item-1.png`
  const rawImage = String(payload.image ?? '').trim()

  return {
    name: String(payload.name ?? '').trim(),
    category: String(payload.category ?? 'General').trim(),
    image: uploadedImagePath || rawImage || defaultImage,
    price: parseNumber(payload.price, 0),
    oldPrice: parseNumber(payload.oldPrice, parseNumber(payload.price, 0)),
    rating: parseNumber(payload.rating, 4.2),
    reviews: parseNumber(payload.reviews, 0),
    sold: parseNumber(payload.sold, 0),
    isNew: parseBoolean(payload.isNew, false),
    sizes: parseArray(payload.sizes, ['M']),
    tags: parseArray(payload.tags, []),
    shortDescription: String(payload.shortDescription ?? '').trim(),
    description: String(payload.description ?? '').trim(),
    stock: parseNumber(payload.stock, 0),
  }
}

function applyProductFilters(products, query) {
  let filtered = [...products]

  const search = String(query.search ?? '').trim().toLowerCase()
  const category = String(query.category ?? '').trim().toLowerCase()
  const tag = String(query.tag ?? '').trim().toLowerCase()
  const minPrice = query.minPrice === undefined ? null : parseNumber(query.minPrice, 0)
  const maxPrice = query.maxPrice === undefined ? null : parseNumber(query.maxPrice, Number.MAX_SAFE_INTEGER)
  const isNew = query.isNew === undefined ? null : parseBoolean(query.isNew, false)

  if (search) {
    filtered = filtered.filter((product) =>
      [product.name, product.category, ...(product.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(search),
    )
  }

  if (category) {
    filtered = filtered.filter((product) => String(product.category).toLowerCase() === category)
  }

  if (tag) {
    filtered = filtered.filter((product) => (product.tags ?? []).map((entry) => String(entry).toLowerCase()).includes(tag))
  }

  if (minPrice !== null) {
    filtered = filtered.filter((product) => Number(product.price) >= minPrice)
  }

  if (maxPrice !== null) {
    filtered = filtered.filter((product) => Number(product.price) <= maxPrice)
  }

  if (isNew !== null) {
    filtered = filtered.filter((product) => Boolean(product.isNew) === isNew)
  }

  const sortBy = String(query.sort ?? '').trim().toLowerCase()
  if (sortBy === 'price-low-high') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high-low') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'best-sellings') {
    filtered.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
  } else if (sortBy === 'new-arrivals') {
    filtered.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
  } else if (sortBy === 'top-rated') {
    filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  }

  return filtered
}

export async function listProducts(req, res) {
  const products = await getProducts()
  const filteredProducts = applyProductFilters(products, req.query)
  const limit = Math.max(1, parseInt(req.query.limit ?? String(filteredProducts.length), 10))

  res.json({
    total: filteredProducts.length,
    products: filteredProducts.slice(0, limit),
  })
}

export async function getProductDetails(req, res) {
  const productId = req.params.productId
  const product = await findProductById(productId)

  if (!product) {
    res.status(404).json({
      message: 'Product not found.',
    })
    return
  }

  res.json({ product })
}

export async function listCollectionProducts(req, res) {
  const collectionName = String(req.params.collectionName ?? '').trim().toLowerCase()
  const allProducts = await getProducts()
  let products = allProducts

  if (collectionName === 'new') {
    products = allProducts.filter((product) => Boolean(product.isNew))
  } else if (collectionName === 'genz') {
    products = allProducts.filter((product) => (product.tags ?? []).includes('genz'))
  } else if (collectionName === 'recommended') {
    products = allProducts.filter((product) => (product.tags ?? []).includes('ai-pick'))
  } else {
    res.status(404).json({
      message: `Unknown collection: ${collectionName}`,
    })
    return
  }

  res.json({
    total: products.length,
    products,
  })
}

export async function uploadProductImage(req, res) {
  if (!req.file) {
    res.status(400).json({
      message: 'Image file is required.',
    })
    return
  }

  const backendPublicUrl = (process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')
  const imageUrl = `${backendPublicUrl}/uploads/products/${req.file.filename}`

  res.status(201).json({
    message: 'Image uploaded successfully.',
    imageUrl,
  })
}

export async function createProductFromRequest(req, res) {
  const payload = sanitizeProductPayload(req.body ?? {}, req.file, req)

  if (!payload.name) {
    res.status(400).json({
      message: 'Product name is required.',
    })
    return
  }

  if (!payload.category) {
    res.status(400).json({
      message: 'Product category is required.',
    })
    return
  }

  const product = await createProduct(payload)
  res.status(201).json({
    message: 'Product created successfully.',
    product,
  })
}
