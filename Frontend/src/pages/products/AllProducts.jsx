import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import menCategory1 from '../../assets/categories/men/item-1.png'
import menCategory2 from '../../assets/categories/men/item-2.png'
import menCategory3 from '../../assets/categories/men/item-3.png'
import menCategory4 from '../../assets/categories/men/item-4.png'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import { toCategoryRoute } from '../../utils/category'

const categoryFilters = ['T-Shirts', 'Joggers', "Polo's", 'Shorts', 'All-Shirts', 'Cargoes', 'Active Wear', 'Hoodies & Jackets']
const sizeFilters = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const ratingFilters = [5, 4, 3, 2, 1]

const priceRanges = [
  { id: 'all', label: 'All', min: 0, max: null },
  { id: 'under-500', label: 'Less than Rs. 500', min: 0, max: 499 },
  { id: '500-1000', label: 'Rs. 500 - 1,000', min: 500, max: 1000 },
  { id: '1000-1500', label: 'Rs. 1,000 - 1,500', min: 1000, max: 1500 },
  { id: '1500-2000', label: 'Rs. 1,500 - 2,000', min: 1500, max: 2000 },
  { id: '2000-plus', label: 'More than Rs. 2,000', min: 2001, max: null },
]

const sortOptions = [
  { id: 'all', label: 'All' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'best-sellings', label: 'Best Sellings' },
  { id: 'price-low-high', label: 'Price Low to High' },
  { id: 'price-high-low', label: 'Price High to Low' },
]

const baseProducts = [
  {
    image: menCategory1,
    name: 'Cotton Linen Stripes: Orchid',
    category: 'All-Shirts',
    price: 599,
    oldPrice: 999,
    rating: 4.8,
    reviews: 324,
    sold: 161,
    isNew: true,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    image: menCategory2,
    name: 'Cotton Linen Beige: Orchid',
    category: 'T-Shirts',
    price: 599,
    oldPrice: 999,
    rating: 4.6,
    reviews: 285,
    sold: 220,
    isNew: true,
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    image: menCategory3,
    name: 'Cotton Linen Night Sky: Orchid',
    category: "Polo's",
    price: 599,
    oldPrice: 999,
    rating: 4.7,
    reviews: 190,
    sold: 243,
    isNew: false,
    sizes: ['M', 'L', 'XL', '2XL'],
  },
  {
    image: menCategory4,
    name: 'Cotton Linen Monochrome: Orchid',
    category: 'Joggers',
    price: 599,
    oldPrice: 999,
    rating: 4.5,
    reviews: 144,
    sold: 132,
    isNew: false,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
]

const listingProducts = Array.from({ length: 24 }, (_, index) => {
  const source = baseProducts[index % baseProducts.length]
  const extraPrice = [0, 70, 120, 180][index % 4]
  const normalizedPrice = source.price + extraPrice

  return {
    ...source,
    id: `listing-${index + 1}`,
    price: normalizedPrice,
    oldPrice: normalizedPrice + 400,
    rating: Number((source.rating - ((index + 1) % 3) * 0.1).toFixed(1)),
    reviews: source.reviews + index * 9,
    sold: source.sold + index * 11,
    isNew: source.isNew || index < 6,
  }
})

function AllProducts() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('price-low-high')
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

  const sortLabel = sortOptions.find((option) => option.id === selectedSort)?.label ?? 'All'

  const filteredProducts = useMemo(() => {
    let items = listingProducts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase().trim()))

    if (selectedCategories.length > 0) {
      items = items.filter((item) => selectedCategories.includes(item.category))
    }

    if (selectedSizes.length > 0) {
      items = items.filter((item) => selectedSizes.some((entry) => item.sizes.includes(entry)))
    }

    if (selectedRating > 0) {
      items = items.filter((item) => item.rating >= selectedRating)
    }

    if (selectedPriceRange !== 'all') {
      const activeRange = priceRanges.find((range) => range.id === selectedPriceRange)
      if (activeRange) {
        items = items.filter((item) => item.price >= activeRange.min && (activeRange.max === null || item.price <= activeRange.max))
      }
    }

    if (selectedSort === 'new-arrivals') {
      return [...items].sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id))
    }

    if (selectedSort === 'best-sellings') {
      return [...items].sort((a, b) => b.sold - a.sold)
    }

    if (selectedSort === 'price-low-high') {
      return [...items].sort((a, b) => a.price - b.price)
    }

    if (selectedSort === 'price-high-low') {
      return [...items].sort((a, b) => b.price - a.price)
    }

    return items
  }, [searchText, selectedCategories, selectedSizes, selectedRating, selectedPriceRange, selectedSort])

  const toggleCategory = (value) => {
    setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]))
  }

  const toggleSize = (value) => {
    setSelectedSizes((prev) => (prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedRating(0)
    setSelectedPriceRange('all')
  }

  const openSearchResults = () => {
    const query = searchText.trim() || 'cotton'
    navigate(`/search-results?q=${encodeURIComponent(query)}`)
  }

  const handleCategoryTabToggle = (category) => {
    if (activeCategory === category && isCategoryPanelOpen) {
      setIsCategoryPanelOpen(false)
      return
    }

    setActiveCategory(category)
    setIsCategoryPanelOpen(true)
  }

  const handleOpenCategoryPage = (categoryLabel) => {
    navigate(toCategoryRoute(categoryLabel))
  }

  return (
    <main className="min-h-screen bg-[#3f3f42] px-2 py-5 text-[#202020] sm:px-5">
      <div className="mx-auto w-full max-w-[1260px] bg-white">
        <StoreHeader
          activeCategory={activeCategory}
          categoryCatalog={categoryCatalog}
          isCategoryPanelOpen={isCategoryPanelOpen}
          onCategoryCardSelect={handleOpenCategoryPage}
          onCategoryTabToggle={handleCategoryTabToggle}
          onSearchChange={setSearchText}
          onSearchSubmit={openSearchResults}
          searchText={searchText}
        />

        <section className="border-b border-[#e7e7e7] px-4 py-3 sm:px-6">
          <p className="text-[28px] font-light text-[#2b2b2b]">All Products Screen</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-[24px] font-medium text-[#1f1f1f]">
              T-shirts <span className="text-[13px] font-normal text-[#8b8b8b]">{filteredProducts.length} items</span>
            </h1>
            <button
              className="border border-[#c4c4c4] px-3 py-1 text-[12px] text-[#2f2f2f] transition hover:bg-[#f5f5f5]"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              Back to Dashboard
            </button>
          </div>
        </section>

        <section className="grid lg:grid-cols-[255px_1fr]">
          <aside className="border-b border-r border-[#e8e8e8] bg-[#faf9f7] lg:border-b-0">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-3">
              <h2 className="text-[16px] font-semibold text-[#222]">Filters</h2>
              <button className="text-[12px] font-medium text-[#ac8f3a] transition hover:text-[#8d7328]" onClick={clearFilters} type="button">
                Clear All
              </button>
            </div>

            <section className="border-b border-[#e5e5e5] px-4 py-3">
              <h3 className="text-[13px] font-semibold text-[#303030]">Categories</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryFilters.map((item) => (
                  <button
                    className={`border px-2 py-1 text-[11px] transition ${
                      selectedCategories.includes(item)
                        ? 'border-[#1f1f1f] bg-[#1f1f1f] text-white'
                        : 'border-[#d4d4d4] bg-white text-[#555] hover:border-[#909090]'
                    }`}
                    key={item}
                    onClick={() => toggleCategory(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="border-b border-[#e5e5e5] px-4 py-3">
              <h3 className="text-[13px] font-semibold text-[#303030]">Price Range</h3>
              <div className="mt-3 space-y-2">
                {priceRanges.map((range) => (
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#555]" key={range.id}>
                    <input
                      checked={selectedPriceRange === range.id}
                      className="h-3.5 w-3.5 accent-[#2d2d2d]"
                      name="price-range"
                      onChange={() => setSelectedPriceRange(range.id)}
                      type="radio"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </section>

            <section className="border-b border-[#e5e5e5] px-4 py-3">
              <h3 className="text-[13px] font-semibold text-[#303030]">Size</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sizeFilters.map((item) => (
                  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#555]" key={item}>
                    <input
                      checked={selectedSizes.includes(item)}
                      className="h-3.5 w-3.5 accent-[#2d2d2d]"
                      onChange={() => toggleSize(item)}
                      type="checkbox"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </section>

            <section className="px-4 py-3">
              <h3 className="text-[13px] font-semibold text-[#303030]">Ratings</h3>
              <div className="mt-3 space-y-2">
                {ratingFilters.map((rating) => (
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#555]" key={rating}>
                    <input
                      checked={selectedRating === rating}
                      className="h-3.5 w-3.5 accent-[#2d2d2d]"
                      name="rating-filter"
                      onChange={() => setSelectedRating(rating)}
                      type="radio"
                    />
                    <span className="text-[#d8ad2e]">{'*'.repeat(rating)}</span> &amp; above
                  </label>
                ))}
                <button className="pt-1 text-[11px] text-[#8a8a8a] hover:text-[#444]" onClick={() => setSelectedRating(0)} type="button">
                  Clear rating
                </button>
              </div>
            </section>
          </aside>

          <section className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="relative flex items-center justify-between border-b border-[#e7e7e7] pb-3">
              <p className="text-[12px] text-[#757575]">Showing {filteredProducts.length} items</p>

              <div className="relative">
                <button
                  className="flex items-center gap-2 border border-[#d2d2d2] bg-[#f8f7f5] px-3 py-2 text-[12px] text-[#2f2f2f] transition hover:border-[#a6a6a6]"
                  onClick={() => setIsSortMenuOpen((prev) => !prev)}
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M8 6h8" strokeLinecap="round" />
                    <path d="M8 12h5" strokeLinecap="round" />
                    <path d="M8 18h2" strokeLinecap="round" />
                    <path d="m5 17 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="m19 7-3-3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sort: {sortLabel}
                </button>

                {isSortMenuOpen ? (
                  <div className="absolute right-0 top-12 z-20 w-[220px] border border-[#b9b9b9] bg-[#f3f2ef] shadow-xl">
                    {sortOptions.map((option) => (
                      <label
                        className="flex cursor-pointer items-center gap-3 border-b border-[#c8c8c8] px-4 py-3 text-[16px] text-[#2d2d2d] last:border-b-0"
                        key={option.id}
                      >
                        <input
                          checked={selectedSort === option.id}
                          className="h-4 w-4 accent-[#2d2d2d]"
                          name="sort-option"
                          onChange={() => {
                            setSelectedSort(option.id)
                            setIsSortMenuOpen(false)
                          }}
                          type="radio"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  className="group border border-[#dfdfdf] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#bbbbbb] hover:shadow-lg"
                  key={product.id}
                >
                  <div className="relative overflow-hidden">
                    <span className="absolute left-1 top-1 z-10 bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#8a8a8a]">
                      Ember
                    </span>
                    <img
                      alt={product.name}
                      className="h-[235px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      src={product.image}
                    />
                  </div>
                  <div className="p-2.5">
                    <h3 className="truncate text-[11px] text-[#444]">{product.name}</h3>
                    <p className="truncate text-[11px] text-[#8c8c8c]">All-Shirts - Regular Fit</p>
                    <p className="mt-1 flex items-center gap-2 text-[14px] font-semibold text-[#222]">
                      Rs {product.price}
                      <span className="text-[11px] font-normal text-[#8d8d8d] line-through">Rs {product.oldPrice}</span>
                      <span className="text-[10px] font-medium text-[#22983a]">Rs {product.oldPrice - product.price} OFF</span>
                    </p>
                    <p className="mt-1 text-[10px] text-[#6c6c6c]">
                      <span className="text-[#d8ad2e]">*</span> {product.rating} ({product.reviews})
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-end gap-2 border-t border-[#e8e8e8] pt-3">
              <button className="border border-[#d3d3d3] px-3 py-1 text-[11px] text-[#555] transition hover:bg-[#f4f4f4]" type="button">
                Previous
              </button>
              <p className="px-2 text-[11px] text-[#7a7a7a]">Page 1 of 1</p>
              <button className="border border-[#d3d3d3] px-3 py-1 text-[11px] text-[#555] transition hover:bg-[#f4f4f4]" type="button">
                Next
              </button>
            </div>
          </section>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default AllProducts
