export const specialHeaderRoutes = {
  genz: '/genz',
  'new-collections': '/new-collections',
  'ai-recommendations': '/ai-recommendations',
}

export function getSpecialHeaderRoute(navId) {
  return specialHeaderRoutes[navId] ?? null
}

export function toSearchResultsRoute(searchText, fallback = 'cotton') {
  const query = String(searchText ?? '').trim() || fallback
  return `/search-results?q=${encodeURIComponent(query)}`
}