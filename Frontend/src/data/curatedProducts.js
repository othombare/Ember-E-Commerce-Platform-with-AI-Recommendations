import productImageOne from '../assets/home/product-1.png'
import productImageTwo from '../assets/home/product-2.png'
import productImageThree from '../assets/home/product-3.png'
import productImageFour from '../assets/home/product-4.png'

const baseCatalog = [
  {
    id: 'linen-orchid-shirt',
    name: 'Cotton Linen Stripes: Orchid',
    category: 'All-Shirts',
    image: productImageOne,
    price: 599,
    oldPrice: 999,
    rating: 4.8,
    reviews: 324,
    sold: 161,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['summer', 'minimal', 'office', 'genz'],
    shortDescription: 'Soft linen blend shirt with breathable weave and all-day comfort.',
  },
  {
    id: 'beige-classic-tee',
    name: 'Cotton Linen Beige: Orchid',
    category: 'T-Shirts',
    image: productImageTwo,
    price: 629,
    oldPrice: 1029,
    rating: 4.7,
    reviews: 297,
    sold: 213,
    isNew: true,
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['new', 'genz', 'streetwear'],
    shortDescription: 'Minimal beige tee made for lightweight layering and everyday fits.',
  },
  {
    id: 'night-sky-polo',
    name: 'Cotton Linen Night Sky',
    category: "Polo's",
    image: productImageThree,
    price: 749,
    oldPrice: 1199,
    rating: 4.6,
    reviews: 212,
    sold: 183,
    isNew: false,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    tags: ['smart-casual', 'ai-pick'],
    shortDescription: 'Structured polo silhouette in a rich tone for elevated daily wear.',
  },
  {
    id: 'monochrome-jogger',
    name: 'Monochrome Relaxed Jogger',
    category: 'Joggers',
    image: productImageFour,
    price: 779,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 256,
    sold: 204,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['comfort', 'weekend', 'genz'],
    shortDescription: 'Relaxed jogger cut with clean monochrome styling and premium stretch.',
  },
]

function createVariant(base, suffix, overrides = {}) {
  return {
    ...base,
    ...overrides,
    id: `${base.id}-${suffix}`,
  }
}

const catalogProducts = [
  ...baseCatalog,
  createVariant(baseCatalog[0], 'active', {
    category: 'Active Wear',
    price: 699,
    oldPrice: 1099,
    tags: ['active', 'new', 'ai-pick'],
    isNew: true,
  }),
  createVariant(baseCatalog[1], 'short', {
    category: 'Shorts',
    price: 589,
    oldPrice: 949,
    tags: ['genz', 'summer'],
  }),
  createVariant(baseCatalog[2], 'cargo', {
    category: 'Cargoes',
    price: 819,
    oldPrice: 1349,
    tags: ['streetwear', 'new'],
    isNew: true,
  }),
  createVariant(baseCatalog[3], 'hoodie', {
    category: 'Hoodies & Jackets',
    price: 1249,
    oldPrice: 1799,
    tags: ['winter', 'premium', 'ai-pick'],
  }),
  createVariant(baseCatalog[0], 'formal', {
    category: 'Formals',
    price: 899,
    oldPrice: 1449,
    tags: ['formal', 'office'],
  }),
  createVariant(baseCatalog[1], 'saree', {
    category: 'Sarees',
    price: 1099,
    oldPrice: 1699,
    sizes: ['S', 'M', 'L'],
    tags: ['women', 'new-collection'],
  }),
  createVariant(baseCatalog[2], 'kurtas', {
    category: 'Kurtas & Suits',
    price: 1199,
    oldPrice: 1849,
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['women', 'ethnic', 'new'],
  }),
  createVariant(baseCatalog[3], 'dupatta', {
    category: 'Dupatta',
    price: 459,
    oldPrice: 799,
    sizes: ['Free'],
    tags: ['women', 'ethnic'],
  }),
  createVariant(baseCatalog[0], 'jeans', {
    category: 'Jeans',
    price: 999,
    oldPrice: 1499,
    tags: ['kids', 'new'],
  }),
  createVariant(baseCatalog[1], 'shirts', {
    category: 'Shirts',
    price: 699,
    oldPrice: 1099,
    tags: ['kids', 'daily'],
  }),
  createVariant(baseCatalog[2], 'party', {
    category: 'Party Wear',
    price: 1149,
    oldPrice: 1699,
    tags: ['kids', 'occasion'],
  }),
  createVariant(baseCatalog[3], 'active-2', {
    category: 'Active Wear',
    price: 759,
    oldPrice: 1199,
    tags: ['active', 'genz'],
  }),
  createVariant(baseCatalog[0], 'new-2', {
    price: 649,
    oldPrice: 1039,
    isNew: true,
    tags: ['new', 'limited'],
  }),
  createVariant(baseCatalog[1], 'new-3', {
    category: 'All-Shirts',
    price: 669,
    oldPrice: 1049,
    tags: ['new', 'limited', 'ai-pick'],
    isNew: true,
  }),
  createVariant(baseCatalog[2], 'new-4', {
    category: 'T-Shirts',
    price: 729,
    oldPrice: 1169,
    tags: ['new', 'genz'],
    isNew: true,
  }),
  createVariant(baseCatalog[3], 'new-5', {
    category: 'Cargoes',
    price: 829,
    oldPrice: 1299,
    tags: ['new', 'streetwear', 'genz'],
    isNew: true,
  }),
  createVariant(baseCatalog[0], 'classic-2', {
    category: 'Polo\'s',
    price: 719,
    oldPrice: 1159,
    tags: ['classic'],
  }),
  createVariant(baseCatalog[1], 'classic-3', {
    category: 'Joggers',
    price: 799,
    oldPrice: 1249,
    tags: ['comfort', 'ai-pick'],
  }),
  createVariant(baseCatalog[2], 'classic-4', {
    category: 'Shorts',
    price: 579,
    oldPrice: 929,
    tags: ['summer', 'genz'],
  }),
  createVariant(baseCatalog[3], 'classic-5', {
    category: 'Hoodies & Jackets',
    price: 1349,
    oldPrice: 1899,
    tags: ['premium', 'winter'],
  }),
]

export const allCatalogProducts = catalogProducts

export const dashboardProducts = {
  newArrivals: catalogProducts.filter((item) => item.isNew).slice(0, 4),
  featured: catalogProducts.slice(4, 8),
  recommended: catalogProducts.filter((item) => item.tags.includes('ai-pick')).slice(0, 4),
  emberFavorites: catalogProducts.slice(8, 12),
}

export const genzProducts = catalogProducts.filter((item) => item.tags.includes('genz')).slice(0, 8)
export const newCollectionProducts = catalogProducts.filter((item) => item.isNew).slice(0, 8)
export const aiRecommendationProducts = catalogProducts.filter((item) => item.tags.includes('ai-pick')).slice(0, 8)

export function findProductById(productId) {
  return catalogProducts.find((item) => item.id === productId) ?? null
}

export function normalizeSize(size) {
  const cleanSize = String(size ?? '').trim().toUpperCase()
  if (!cleanSize) {
    return 'M'
  }
  return cleanSize
}

export function toCartSnapshot(product, size = 'M') {
  return {
    productId: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice,
    size: normalizeSize(size),
  }
}