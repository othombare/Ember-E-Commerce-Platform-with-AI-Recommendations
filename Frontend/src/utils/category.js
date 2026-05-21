const categoryLookup = {
  't shirts': 'T-Shirts',
  tshirts: 'T-Shirts',
  't shirt': 'T-Shirts',
  'tee shirts': 'T-Shirts',
  tees: 'T-Shirts',
  joggers: 'Joggers',
  'polo s': "Polo's",
  polos: "Polo's",
  shorts: 'Shorts',
  'all shirts': 'All Shirts',
  'all shirts regular fit': 'All Shirts',
  cargoes: 'Cargoes',
  cargos: 'Cargoes',
  formals: 'Formals',
  'active wear': 'Active Wear',
  'active wears': 'Active Wear',
  'hoodies jackets': 'Hoodies & Jackets',
  'hoodies and jackets': 'Hoodies & Jackets',
  hoodies: 'Hoodies & Jackets',
  jackets: 'Hoodies & Jackets',
  sarees: 'Sarees',
  'saree s': 'Sarees',
  'kurtas suits': 'Kurtas & Suits',
  'kurtas and suits': 'Kurtas & Suits',
  kurtas: 'Kurtas & Suits',
  dupatta: 'Dupatta',
  dupattas: 'Dupatta',
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
