const categoryLookup = {
  't shirts': 'T-shirts',
  tshirts: 'T-shirts',
  joggers: 'Joggers',
  'polo s': "Polo's",
  polos: "Polo's",
  shorts: 'Shorts',
  'all shirts': 'All-Shirts',
  cargoes: 'Cargoes',
  formals: 'Formals',
  'active wear': 'Active Wear',
  'active wears': 'Active Wear',
  'hoodies jackets': 'Hoodies & Jackets',
  'hoodies and jackets': 'Hoodies & Jackets',
  sarees: 'Sarees',
  'saree s': 'Sarees',
  'kurtas suits': 'Kurtas & Suits',
  'kurtas and suits': 'Kurtas & Suits',
  dupatta: 'Dupatta',
  jeans: 'Jeans',
  shirts: 'Shirts',
  'party wear': 'Party Wear',
  'party wears': 'Party Wear',
}

function sanitizeCategoryLabel(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['"]/g, '')
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeCategoryLabel(value) {
  const decoded = decodeURIComponent(String(value ?? '').trim())
  const sanitized = sanitizeCategoryLabel(decoded)
  return categoryLookup[sanitized] ?? decoded
}

export function toCategoryRoute(label) {
  const normalized = normalizeCategoryLabel(label)
  return `/category/${encodeURIComponent(normalized)}`
}
