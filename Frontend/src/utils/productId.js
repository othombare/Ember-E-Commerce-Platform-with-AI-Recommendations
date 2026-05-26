export function normalizeProductId(productId) {
  return String(productId ?? '').trim()
}

export function normalizeProductIds(productIds) {
  if (!Array.isArray(productIds)) {
    return []
  }

  return [...new Set(productIds.map((productId) => normalizeProductId(productId)).filter(Boolean))]
}
