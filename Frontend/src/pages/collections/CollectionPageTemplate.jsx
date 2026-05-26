import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function CollectionPageTemplate({ activeNavLink, heroImage, pageSubtitle, pageTitle, products }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchText.toLowerCase().trim()

    if (!normalizedSearch) {
      return products
    }

    return products.filter((product) => {
      const searchable = [product.name, product.category, ...(product.tags ?? [])].join(' ').toLowerCase()
      return searchable.includes(normalizedSearch)
    })
  }, [products, searchText])

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

  const handleHeaderNavSelect = (navId) => {
    const route = getSpecialHeaderRoute(navId)
    if (route) {
      navigate(route)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleSearchSubmit = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-[#f4f3f1]">
        <StoreHeader
          activeCategory={activeCategory}
          activeNavLink={activeNavLink}
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
          onOpenProfile={(section = 'profile') => navigate(section === 'profile' ? '/my-profile' : '/my-profile?section=' + section)}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-4 py-4 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-[#d6d6d6] bg-white shadow-sm">
            <img alt={`${pageTitle} hero`} className="w-full object-cover" src={heroImage} />
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[34px] font-semibold text-[#232323]">{pageTitle}</h1>
              <p className="mt-1 text-[14px] text-[#707070]">{pageSubtitle}</p>
            </div>
            <p className="text-[13px] text-[#6f6f6f]">{filteredProducts.length} curated picks</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  className="group overflow-hidden rounded-lg border border-[#dcdcdc] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/product/${product.id}`)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <img alt={product.name} className="h-[280px] w-full object-cover" src={product.image} />
                  <div className="px-3 py-3">
                    <p className="text-[12px] uppercase tracking-[0.14em] text-[#8a8a8a]">{product.category}</p>
                    <h2 className="mt-1 truncate text-[16px] font-medium text-[#262626]">{product.name}</h2>
                    <p className="mt-2 flex items-center gap-2 text-[20px] font-semibold text-[#1f1f1f]">
                      Rs {product.price}
                      <span className="text-[12px] font-normal text-[#8b8b8b] line-through">Rs {product.oldPrice}</span>
                    </p>
                    <p className="mt-1 text-[12px] text-[#707070]">
                      <span className="text-[#daa520]">*</span> {product.rating.toFixed(1)} ({product.reviews})
                    </p>
                    <button
                      className="mt-3 h-9 w-full rounded-md bg-[#1f2125] text-[13px] font-medium text-white transition hover:bg-black"
                      onClick={(event) => {
                        event.stopPropagation()
                        addToCart({ product, quantity: 1, size: product.sizes?.[0] ?? 'M' })
                        navigate('/my-cart')
                      }}
                      type="button"
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-[#dddddd] bg-white p-8 text-center">
              <h2 className="text-[26px] font-semibold text-[#1f1f1f]">No matches for this search</h2>
              <p className="mt-2 text-[14px] text-[#6d6d6d]">Try searching by category names like Joggers, Jackets, or Shirts.</p>
            </div>
          )}
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default CollectionPageTemplate

