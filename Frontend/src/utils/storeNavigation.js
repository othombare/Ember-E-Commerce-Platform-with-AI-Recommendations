export const specialHeaderRoutes = {
  genz: '/genz',
  'new-collections': '/new-collections',
  'ai-recommendations': '/ai-recommendations',
}

export function getSpecialHeaderRoute(navId) {
  return specialHeaderRoutes[navId] ?? null
}

export function toSearchResultsRoute(searchText) {
  const query = String(searchText ?? '').trim()
  return query ? `/search-results?q=${encodeURIComponent(query)}` : '/search-results'
}
