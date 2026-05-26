import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import { PRODUCT_CATEGORIES } from '../../data/productCategories'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useSavedItems from '../../hooks/useSavedItems'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { normalizeCategoryLabel, toCategoryRoute } from '../../utils/category'
import { normalizeProductId } from '../../utils/productId'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

const priceRanges = [
  { id: 'under-500', label: 'Less than Rs 500', min: 0, max: 499 },
  { id: '500-1000', label: 'Rs 500 - Rs 1000', min: 500, max: 1000 },
  { id: '1000-1500', label: 'Rs 1000 - Rs 1500', min: 1000, max: 1500 },
  { id: '1500-2000', label: 'Rs 1500 - Rs 2000', min: 1500, max: 2000 },
  { id: '2000-plus', label: 'More than Rs 2000', min: 2001, max: null },
]

const sizeFilters = [
  { id: 'XS', label: 'XS', count: 125 },
  { id: 'S', label: 'S', count: 245 },
  { id: 'M', label: 'M', count: 36 },
  { id: 'L', label: 'L', count: 45 },
  { id: 'XL', label: 'XL', count: 147 },
  { id: 'XXL', label: 'XXL', count: 100 },
  { id: 'XXXL', label: 'XXXL', count: 15 },
  { id: 'PLUS', label: 'Plus Size', count: 35 },
]

const ratingFilters = [
  { stars: 5, count: 127 },
  { stars: 4, count: 98 },
  { stars: 3, count: 50 },
  { stars: 2, count: 21 },
  { stars: 1, count: 1 },
]

const sortOptions = [
  { id: 'price-low-high', label: 'Price Low to High' },
  { id: 'price-high-low', label: 'Price High to Low' },
  { id: 'best-sellings', label: 'Best Sellings' },
  { id: 'new-arrivals', label: 'New Arrivals' },
]

function ProductTile({ isFavourite, isInWishlist, onAddToCart, onOpenProduct, onToggleFavourite, onToggleWishlist, product }) {
  return (
    <article
      className="border border-[#d8d8d8] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onOpenProduct(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenProduct(product)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <img alt={product.name} className="h-[230px] w-full object-cover" src={product.image} />
      <div className="px-2 py-2">
        <h3 className="truncate text-[10px] text-[#343434]">{product.name}</h3>
        <p className="text-[10px] text-[#888]">{product.category}</p>
        <div className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-[#232323]">
          Rs {product.price}
          <span className="text-[10px] font-normal text-[#8f8f8f] line-through">Rs {product.oldPrice}</span>
          <span className="text-[10px] font-medium text-[#279436]">Rs {product.oldPrice - product.price} Off</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <button
            className="flex-1 border border-[#d4d4d4] py-1 text-[10px] text-[#353535] transition hover:bg-[#f6f6f6]"
            onClick={(event) => {
              event.stopPropagation()
              onOpenProduct(product)
            }}
            type="button"
          >
            View
          </button>
          <button
            className="flex-1 bg-[#1f2125] py-1 text-[10px] text-white transition hover:bg-black"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product)
            }}
            type="button"
          >
            Add
          </button>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <button
            className={`border py-1 text-[10px] transition ${
              isFavourite ? 'border-[#222] bg-[#222] text-white' : 'border-[#d4d4d4] text-[#353535] hover:bg-[#f6f6f6]'
            }`}
            onClick={async (event) => {
              event.stopPropagation()
              await onToggleFavourite(product.id)
            }}
            type="button"
          >
            {isFavourite ? 'Favourited' : 'Favourite'}
          </button>
          <button
            className={`border py-1 text-[10px] transition ${
              isInWishlist ? 'border-[#222] bg-[#222] text-white' : 'border-[#d4d4d4] text-[#353535] hover:bg-[#f6f6f6]'
            }`}
            onClick={async (event) => {
              event.stopPropagation()
              await onToggleWishlist(product.id)
            }}
            type="button"
          >
            {isInWishlist ? 'Wishlisted' : 'Wishlist'}
          </button>
        </div>
      </div>
    </article>
  )
}

function SearchResults() {
  const navigate = useNavigate()
  const { products: listingProducts } = useCatalogProducts()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const { favouriteProductIds, toggleFavourite, toggleWishlist, wishlistProductIds } = useSavedItems()
  const { categoryName } = useParams()
  const [searchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const routeCategory = categoryName ? normalizeCategoryLabel(categoryName) : ''
  const routeStateKey = `${routeCategory}:${queryFromUrl}`
  const [searchText, setSearchText] = useState(routeCategory ? '' : queryFromUrl)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState('price-low-high')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [appliedRouteStateKey, setAppliedRouteStateKey] = useState(routeStateKey)

  if (appliedRouteStateKey !== routeStateKey) {
    setAppliedRouteStateKey(routeStateKey)
    setSearchText(routeCategory ? '' : queryFromUrl)
    if (routeCategory) {
      setSelectedCategories([])
    }
  }

  const sortLabel = sortOptions.find((option) => option.id === selectedSort)?.label ?? 'Price Low to High'
  const favouriteIdsSet = useMemo(() => new Set(favouriteProductIds), [favouriteProductIds])
  const wishlistIdsSet = useMemo(() => new Set(wishlistProductIds), [wishlistProductIds])

  const filteredProducts = useMemo(() => {
    let items = [...listingProducts]

    if (routeCategory) {
      items = items.filter((product) => normalizeCategoryLabel(product.category) === routeCategory)
    }

    const normalizedSearch = searchText.toLowerCase().trim()
    if (normalizedSearch) {
      items = items.filter((product) =>
        [product.name, product.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    }

    if (selectedCategories.length > 0) {
      items = items.filter((product) => selectedCategories.includes(normalizeCategoryLabel(product.category)))
    }

    if (selectedPriceRange) {
      const activeRange = priceRanges.find((range) => range.id === selectedPriceRange)
      if (activeRange) {
        items = items.filter((product) => product.price >= activeRange.min && (activeRange.max === null || product.price <= activeRange.max))
      }
    }

    if (selectedSizes.length > 0) {
      items = items.filter((product) => selectedSizes.some((entry) => product.sizes.includes(entry)))
    }

    if (selectedRating > 0) {
      items = items.filter((product) => product.rating >= selectedRating)
    }

    if (selectedSort === 'price-low-high') {
      return [...items].sort((a, b) => a.price - b.price)
    }

    if (selectedSort === 'price-high-low') {
      return [...items].sort((a, b) => b.price - a.price)
    }

    if (selectedSort === 'best-sellings') {
      return [...items].sort((a, b) => b.sold - a.sold)
    }

    if (selectedSort === 'new-arrivals') {
      return [...items].sort((a, b) => Number(b.isNew) - Number(a.isNew))
    }

    return items
  }, [listingProducts, routeCategory, searchText, selectedSort, selectedCategories, selectedPriceRange, selectedSizes, selectedRating])

  const hasResults = filteredProducts.length > 0
  const normalizedSearchText = searchText.trim()
  const headingLabel = routeCategory || (normalizedSearchText ? `Search Results for "${normalizedSearchText}"` : 'All Products')
  const breadcrumbCategory = routeCategory || 'Search'

  const applySearch = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  const toggleCategory = (value) => {
    const normalizedValue = normalizeCategoryLabel(value)

    if (routeCategory) {
      navigate(toCategoryRoute(normalizedValue))
      return
    }

    setSelectedCategories((prev) =>
      prev.includes(normalizedValue) ? prev.filter((entry) => entry !== normalizedValue) : [...prev, normalizedValue],
    )
  }

  const toggleSize = (value) => {
    setSelectedSizes((prev) => (prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRange('')
    setSelectedSizes([])
    setSelectedRating(0)
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

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleOpenFavouritesPage = () => {
    navigate('/favourites')
  }

  const handleOpenNotificationsPage = () => {
    navigate('/notifications')
  }

  const handleOpenProfilePage = (section = 'profile') => {
    navigate(section === 'profile' ? '/my-profile' : `/my-profile?section=${section}`)
  }

  const handleOpenCartPage = () => {
    navigate('/my-cart')
  }

  const handleHeaderNavSelect = (navId) => {
    const route = getSpecialHeaderRoute(navId)
    if (route) {
      navigate(route)
    }
  }

  const handleOpenProduct = (product) => {
    navigate(`/product/${product.id}`)
  }

  const handleAddToCart = (product) => {
    addToCart({ product, quantity: 1, size: product.sizes?.[0] ?? 'M' })
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-white">
        <StoreHeader
          activeCategory={activeCategory}
          cartCount={cartItemCount}
          categoryCatalog={categoryCatalog}
          isCategoryPanelOpen={isCategoryPanelOpen}
          onCategoryCardSelect={handleOpenCategoryPage}
          onCategoryTabToggle={handleCategoryTabToggle}
          onLogoClick={() => navigate('/dashboard')}
          onLogout={handleLogout}
          onNavLinkSelect={handleHeaderNavSelect}
          onOpenCart={handleOpenCartPage}
          onOpenFavourites={handleOpenFavouritesPage}
          onOpenWishlist={() => navigate('/wishlist')}
          onOpenNotifications={handleOpenNotificationsPage}
          onOpenProfile={handleOpenProfilePage}
          onSearchChange={setSearchText}
          onSearchSubmit={applySearch}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-4 py-2 sm:px-6">
          <p className="text-[11px] text-[#9c9c9c]">Home / Men / {breadcrumbCategory}</p>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-[33px] font-semibold text-[#202020]">
              {headingLabel} <span className="text-[12px] font-normal text-[#949494]">{filteredProducts.length} items</span>
            </h1>
            <button
              className="hidden border border-[#cfcfcf] px-3 py-1 text-[11px] text-[#4a4a4a] transition hover:bg-[#f5f5f5] lg:block"
              onClick={() => navigate('/products')}
              type="button"
            >
              Back to Products
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
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#303030]">Categories</h3>
                <span className="text-[12px] text-[#6f6f6f]">v</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRODUCT_CATEGORIES.map((item) => (
                  <button
                    className={`border px-2 py-1 text-[11px] transition ${
                      routeCategory === normalizeCategoryLabel(item) || selectedCategories.includes(normalizeCategoryLabel(item))
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
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#303030]">Price Range</h3>
                <span className="text-[12px] text-[#6f6f6f]">v</span>
              </div>
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
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#303030]">Size</h3>
                <span className="text-[12px] text-[#6f6f6f]">v</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {sizeFilters.map((item) => (
                  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#555]" key={item.id}>
                    <input
                      checked={selectedSizes.includes(item.id)}
                      className="h-3.5 w-3.5 accent-[#2d2d2d]"
                      onChange={() => toggleSize(item.id)}
                      type="checkbox"
                    />
                    {item.label} <span className="text-[#a4a4a4]">({item.count})</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#303030]">Ratings</h3>
                <span className="text-[12px] text-[#6f6f6f]">v</span>
              </div>
              <div className="mt-3 space-y-2">
                {ratingFilters.map((entry) => (
                  <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#555]" key={entry.stars}>
                    <input
                      checked={selectedRating === entry.stars}
                      className="h-3.5 w-3.5 accent-[#2d2d2d]"
                      name="rating-filter"
                      onChange={() => setSelectedRating(entry.stars)}
                      type="radio"
                    />
                    <span className="text-[#d8ad2e]">{'*'.repeat(entry.stars)}</span>
                    <span>
                      {entry.stars} Ratings ({entry.count})
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </aside>

          <section className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="relative flex justify-end border-b border-[#ececec] pb-3">
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
                        className="flex cursor-pointer items-center gap-3 border-b border-[#c8c8c8] px-4 py-3 text-[14px] text-[#2d2d2d] last:border-b-0"
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

            {hasResults ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductTile
                    isFavourite={favouriteIdsSet.has(normalizeProductId(product.id))}
                    isInWishlist={wishlistIdsSet.has(normalizeProductId(product.id))}
                    key={product.id}
                    onAddToCart={handleAddToCart}
                    onOpenProduct={handleOpenProduct}
                    onToggleFavourite={toggleFavourite}
                    onToggleWishlist={toggleWishlist}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <svg className="h-20 w-20 text-[#dbdbdb]" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
                <h2 className="mt-2 text-[40px] font-medium text-[#1f1f1f]">No products found</h2>
                <p className="mt-2 max-w-[420px] text-[13px] text-[#696969]">
                  We couldn&apos;t find any products matching your current filters or search query.
                </p>
              </div>
            )}
          </section>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default SearchResults
