import { create } from 'zustand'
import api from '../api/axios'
import { allCatalogProducts } from '../data/curatedProducts'

function normalizeApiProduct(product, fallbackBaseUrl = '') {
  const rawImage = String(product?.image ?? '').trim()
  let image = rawImage

  if (rawImage.startsWith('/')) {
    image = `${fallbackBaseUrl}${rawImage}`
  }

  return {
    id: product?.id,
    name: product?.name ?? 'Unnamed Product',
    category: product?.category ?? 'General',
    image: image || allCatalogProducts[0]?.image || '',
    price: Number(product?.price) || 0,
    oldPrice: Number(product?.oldPrice) || Number(product?.price) || 0,
    rating: Number(product?.rating) || 4,
    reviews: Number(product?.reviews) || 0,
    sold: Number(product?.sold) || 0,
    isNew: Boolean(product?.isNew),
    sizes: Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : ['M'],
    tags: Array.isArray(product?.tags) ? product.tags : [],
    shortDescription: product?.shortDescription ?? '',
    description: product?.description ?? product?.shortDescription ?? '',
    stock: Number(product?.stock) || 0,
  }
}

const useProductsStore = create((set, get) => ({
  products: allCatalogProducts,
  status: 'idle',
  error: null,
  lastFetchedAt: null,
  fetchProducts: async () => {
    const currentStatus = get().status
    if (currentStatus === 'loading') {
      return
    }

    set({ status: 'loading', error: null })

    try {
      const response = await api.get('/api/products', {
        params: {
          limit: 200,
        },
      })
      const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000').replace(/\/$/, '')
      const products = Array.isArray(response.data?.products)
        ? response.data.products.map((product) => normalizeApiProduct(product, baseUrl))
        : []

      set({
        products: products.length > 0 ? products : allCatalogProducts,
        status: 'success',
        error: null,
        lastFetchedAt: Date.now(),
      })
    } catch (error) {
      set({
        status: 'error',
        error: error.message ?? 'Failed to load products.',
      })
    }
  },
  prependProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products.filter((entry) => entry.id !== product.id)],
    })),
}))

export default useProductsStore
