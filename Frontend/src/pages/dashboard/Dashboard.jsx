import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBanner from '../../assets/home/hero-banner.png'
import mensCollectionBanner from '../../assets/home/mens-collection.png'
import promoBottom from '../../assets/home/promo-bottom.png'
import promoCenter from '../../assets/home/promo-center.png'
import promoLeft from '../../assets/home/promo-left.png'
import promoRight from '../../assets/home/promo-right.png'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function ProductCard({ onAddToCart, onOpenProduct, product }) {
  return (
    <article
      className="group overflow-hidden rounded-lg border border-[#dcdcdc] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => onOpenProduct(product.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenProduct(product.id)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <img alt={product.name} className="h-[280px] w-full object-cover" src={product.image} />
      <div className="px-3 py-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#848484]">{product.category}</p>
        <h3 className="mt-1 truncate text-[16px] font-medium text-[#222]">{product.name}</h3>
        <p className="mt-1 text-[12px] text-[#707070]">{product.shortDescription}</p>
        <p className="mt-2 flex items-center gap-2 text-[20px] font-semibold text-[#1f1f1f]">
          Rs {product.price}
          <span className="text-[12px] font-normal text-[#8b8b8b] line-through">Rs {product.oldPrice}</span>
        </p>
        <p className="mt-1 text-[12px] text-[#707070]">
          <span className="text-[#daa520]">*</span> {product.rating.toFixed(1)} ({product.reviews})
        </p>
        <div className="mt-3 flex gap-2">
          <button
            className="h-9 flex-1 rounded-md border border-[#cecece] text-[12px] text-[#2d2d2d] transition hover:bg-[#f6f6f6]"
            onClick={(event) => {
              event.stopPropagation()
              onOpenProduct(product.id)
            }}
            type="button"
          >
            View
          </button>
          <button
            className="h-9 flex-1 rounded-md bg-[#1f2125] text-[12px] font-medium text-white transition hover:bg-black"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product)
            }}
            type="button"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductSection({ onAddToCart, onOpenProduct, products, subtitle, title }) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[34px] font-semibold text-[#222]">{title}</h2>
          {subtitle ? <p className="text-[13px] text-[#6f6f6f]">{subtitle}</p> : null}
        </div>
        <p className="text-[12px] text-[#7b7b7b]">{products.length} products</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={`${title}-${product.id}`} onAddToCart={onAddToCart} onOpenProduct={onOpenProduct} product={product} />
        ))}
      </div>
    </section>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const { products, status, error } = useCatalogProducts()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))

  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const collections = useMemo(() => {
    const newArrivals = products.filter((product) => product.isNew).slice(0, 8)
    const aiRecommendations = products.filter((product) => (product.tags ?? []).includes('ai-pick')).slice(0, 8)
    const bestSellers = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 8)
    const essentials = products.slice(0, 8)

    return {
      essentials,
      newArrivals,
      aiRecommendations,
      bestSellers,
    }
  }, [products])

  const handleLogout = () => {
    logout()
    navigate('/signin')
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

  const handleSearchSubmit = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  const handleHeaderNavSelect = (navId) => {
    const route = getSpecialHeaderRoute(navId)
    if (route) {
      navigate(route)
    }
  }

  const handleOpenProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleAddToCart = (product) => {
    addToCart({ product, quantity: 1, size: product.sizes?.[0] ?? 'M' })
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen">
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
          onOpenCart={() => navigate('/my-cart')}
          onOpenFavourites={() => navigate('/favourites')}
          onOpenNotifications={() => navigate('/notifications')}
          onOpenProfile={() => navigate('/my-profile')}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className={`overflow-hidden border border-[#d2d2d2] bg-[#8b8e68] ${isCategoryPanelOpen ? 'border-t-0' : 'mt-2'}`}>
          <img alt="Define your style with Ember" className="w-full object-cover" src={heroBanner} />
        </section>

        <div className="bg-[#f4f3f1] px-2 pb-14 pt-7 sm:px-6">
          <section className="grid gap-2 lg:grid-cols-[1.02fr_1.48fr]">
            <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
              <img
                alt="Seasonal offer banner"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                src={promoLeft}
              />
            </div>
            <div className="grid gap-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                  <img
                    alt="Special edition banner"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    src={promoCenter}
                  />
                </div>
                <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                  <img
                    alt="Autumn offer banner"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    src={promoRight}
                  />
                </div>
              </div>
              <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                <img
                  alt="New collection banner"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  src={promoBottom}
                />
              </div>
            </div>
          </section>

          {status === 'loading' ? (
            <section className="mt-10 rounded-lg border border-[#dadada] bg-white px-5 py-8 text-center text-[#666]">
              Loading products from catalog...
            </section>
          ) : null}

          {status === 'error' ? (
            <section className="mt-10 rounded-lg border border-[#ead7b0] bg-[#fff8e7] px-5 py-4 text-[13px] text-[#6a5a37]">
              Could not refresh products from backend ({error}). Showing fallback catalog data.
            </section>
          ) : null}

          <ProductSection
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
            products={collections.newArrivals}
            subtitle="Latest drops curated across men, women, and kids."
            title="New Arrivals"
          />

          <ProductSection
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
            products={collections.essentials}
            subtitle="Everyday wardrobe essentials with premium quality finish."
            title="Featured Collection"
          />

          <section className="mt-12">
            <div className="group overflow-hidden border border-[#c1c8d7] transition duration-200 hover:shadow-lg">
              <img
                alt="Exclusive men's collection banner"
                className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                src={mensCollectionBanner}
              />
            </div>
          </section>

          <ProductSection
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
            products={collections.aiRecommendations}
            subtitle="Personalized picks tuned from customer trends and product affinity."
            title="AI Recommendations"
          />

          <ProductSection
            onAddToCart={handleAddToCart}
            onOpenProduct={handleOpenProduct}
            products={collections.bestSellers}
            subtitle="Top selling pieces loved by the Ember community."
            title="Best Sellers"
          />

          <div className="mt-9 flex justify-center">
            <button
              className="h-12 rounded-md border border-[#b8b8b8] bg-[#f6f4f1] px-9 text-[15px] text-[#2e2e2e] transition duration-200 hover:-translate-y-0.5 hover:border-[#2e2e2e] hover:bg-white"
              onClick={() => navigate('/products')}
              type="button"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default Dashboard
