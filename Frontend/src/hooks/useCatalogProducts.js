import { useCallback, useEffect, useMemo } from 'react'
import useProductsStore from '../store/productsStore'

function hasTag(product, tag) {
  return (product.tags ?? []).includes(tag)
}

export default function useCatalogProducts() {
  const products = useProductsStore((state) => state.products)
  const status = useProductsStore((state) => state.status)
  const error = useProductsStore((state) => state.error)
  const fetchProducts = useProductsStore((state) => state.fetchProducts)

  useEffect(() => {
    if (status === 'idle') {
      fetchProducts()
    }
  }, [status, fetchProducts])

  const productLookup = useMemo(() => new Map(products.map((product) => [product.id, product])), [products])
  const newCollectionProducts = useMemo(() => products.filter((product) => product.isNew), [products])
  const genzProducts = useMemo(() => products.filter((product) => hasTag(product, 'genz')), [products])
  const aiRecommendationProducts = useMemo(() => products.filter((product) => hasTag(product, 'ai-pick')), [products])

  const findProductById = useCallback((productId) => productLookup.get(productId) ?? null, [productLookup])

  return {
    products,
    status,
    error,
    fetchProducts,
    findProductById,
    newCollectionProducts,
    genzProducts,
    aiRecommendationProducts,
  }
}
