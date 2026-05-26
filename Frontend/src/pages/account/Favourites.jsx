import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useFavouritesStore from '../../store/favouritesStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function Favourites() {
  const navigate = useNavigate()
  const { products } = useCatalogProducts()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const favouriteProductIds = useFavouritesStore((state) => state.favouriteProductIds)
  const removeFromFavourites = useFavouritesStore((state) => state.removeFromFavourites)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const productLookup = useMemo(() => new Map(products.map((item) => [item.id, item])), [products])

  const favouriteItems = useMemo(
    () => favouriteProductIds.map((productId) => productLookup.get(productId)).filter(Boolean),
    [favouriteProductIds, productLookup],
  )

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleOpenCategoryPage = (categoryLabel) => {
    navigate(toCategoryRoute(categoryLabel))
  }

  const handleSearchSubmit = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  const handleCategoryTabToggle = (category) => {
    if (activeCategory === category && isCategoryPanelOpen) {
      setIsCategoryPanelOpen(false)
      return
    }

    setActiveCategory(category)
    setIsCategoryPanelOpen(true)
  }

  const handleHeaderNavSelect = (navId) => {
    const route = getSpecialHeaderRoute(navId)
    if (route) {
      navigate(route)
    }
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
          onOpenCart={() => navigate('/my-cart')}
          onOpenFavourites={() => navigate('/favourites')}
          onOpenNotifications={() => navigate('/notifications')}
          onOpenProfile={(section = 'profile') => navigate(section === 'profile' ? '/my-profile' : '/my-profile?section=' + section)}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">Favourites</h1>
            <p className="text-[12px] text-[#8a8a8a]">{favouriteItems.length} saved items</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {favouriteItems.map((item) => (
              <article className="border border-[#dfdfdf] bg-white p-2" key={item.id}>
                <button className="w-full text-left" onClick={() => navigate(`/product/${item.id}`)} type="button">
                  <img alt={item.name} className="h-[230px] w-full object-cover" src={item.image} />
                  <h2 className="mt-2 truncate text-[12px] text-[#343434]">{item.name}</h2>
                </button>
                <p className="mt-1 text-[14px] font-semibold text-[#222]">Rs {item.price}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="border border-[#d3d3d3] px-2 py-1 text-[11px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]"
                    onClick={() => removeFromFavourites(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                  <button
                    className="bg-[#1f2125] px-2 py-1 text-[11px] text-white transition hover:bg-black"
                    onClick={() => addToCart({ product: item, quantity: 1, size: item.sizes?.[0] ?? 'M' })}
                    type="button"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          {favouriteItems.length === 0 ? (
            <div className="mt-5 border border-[#dfdfdf] bg-[#faf9f7] p-6 text-center">
              <h2 className="text-[22px] font-medium text-[#2b2b2b]">No saved favourites</h2>
              <p className="mt-2 text-[13px] text-[#666]">Browse products and save your top picks here.</p>
              <button
                className="mt-4 bg-[#1f2125] px-4 py-2 text-[12px] text-white transition hover:bg-black"
                onClick={() => navigate('/products')}
                type="button"
              >
                Explore Products
              </button>
            </div>
          ) : null}
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default Favourites

