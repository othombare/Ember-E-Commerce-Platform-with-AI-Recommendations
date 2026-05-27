import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useSavedItems from '../../hooks/useSavedItems'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { normalizeProductId } from '../../utils/productId'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'
import { getCartButtonLabel, getFavouriteButtonLabel, isProductInCart } from '../../utils/productActionState'

function Wishlist() {
  const navigate = useNavigate()
  const { products } = useCatalogProducts()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItems = useCartStore((state) => state.items)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const { addToFavourites, isFavourite, removeFromWishlist, wishlistProductIds } = useSavedItems()
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const productLookup = useMemo(() => new Map(products.map((item) => [normalizeProductId(item.id), item])), [products])

  const wishlistItems = useMemo(
    () => wishlistProductIds.map((productId) => productLookup.get(normalizeProductId(productId))).filter(Boolean),
    [wishlistProductIds, productLookup],
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
          onOpenWishlist={() => navigate('/wishlist')}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">Wishlist</h1>
            <p className="text-[12px] text-[#8a8a8a]">{wishlistItems.length} saved items</p>
          </div>

          {statusMessage ? <p className="mt-4 text-[13px] text-[#3f3f3f]">{statusMessage}</p> : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <article className="border border-[#dfdfdf] bg-white p-2" key={item.id}>
                <button className="w-full text-left" onClick={() => navigate(`/product/${item.id}`)} type="button">
                  <img alt={item.name} className="h-[230px] w-full object-cover" src={item.image} />
                  <h2 className="mt-2 truncate text-[12px] text-[#343434]">{item.name}</h2>
                </button>
                <p className="mt-1 text-[14px] font-semibold text-[#222]">Rs {item.price}</p>
                <div className="mt-2 grid gap-2">
                  <button
                    className="border border-[#d3d3d3] px-2 py-1 text-[11px] text-[#3f3f3f] transition duration-200 hover:-translate-y-0.5 hover:border-[#b9b9b9] hover:bg-[#f5f5f5] hover:shadow-sm"
                    onClick={async () => {
                      const result = await removeFromWishlist(item.id)
                      setStatusMessage(result.ok ? `${item.name} removed from wishlist.` : result.error)
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                  <button
                    className={`border px-2 py-1 text-[11px] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                      isFavourite(item.id)
                        ? 'border-[#222] bg-[#222] text-white hover:bg-[#111]'
                        : 'border-[#d3d3d3] text-[#3f3f3f] hover:border-[#b9b9b9] hover:bg-[#f5f5f5]'
                    }`}
                    onClick={async () => {
                      const result = await addToFavourites(item.id)
                      setStatusMessage(result.ok ? `${item.name} added to favourites.` : result.error)
                    }}
                    type="button"
                  >
                    {getFavouriteButtonLabel(isFavourite(item.id))}
                  </button>
                  <button
                    className={`px-2 py-1 text-[11px] text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isProductInCart(cartItems, item.id, item.sizes?.[0] ?? 'M') ? 'bg-[#17191d] hover:bg-black' : 'bg-[#1f2125] hover:bg-black'
                    }`}
                    onClick={() => addToCart({ product: item, quantity: 1, size: item.sizes?.[0] ?? 'M' })}
                    type="button"
                  >
                    {getCartButtonLabel(isProductInCart(cartItems, item.id, item.sizes?.[0] ?? 'M'))}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="mt-5 border border-[#dfdfdf] bg-[#faf9f7] p-6 text-center">
              <h2 className="text-[22px] font-medium text-[#2b2b2b]">No saved wishlist items</h2>
              <p className="mt-2 text-[13px] text-[#666]">Save products to wishlist so you can revisit them anytime.</p>
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

export default Wishlist
