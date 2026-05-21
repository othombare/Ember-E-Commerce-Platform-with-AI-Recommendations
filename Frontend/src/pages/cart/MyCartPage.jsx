import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cartEmpty from '../../assets/generated/cart-empty.svg'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { getCartPricing } from '../../utils/checkout'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function MyCartPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartItems = useCartStore((state) => state.items)
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const pricing = useMemo(() => getCartPricing(cartItems), [cartItems])
  const { subtotal, shipping, tax, total } = pricing

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

  const updateQuantity = (itemId, nextQuantity) => {
    updateCartItemQuantity(itemId, nextQuantity)
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      return
    }

    navigate('/checkout/review')
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-[#f4f3f1]">
        <StoreHeader
          activeCategory={activeCategory}
          cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
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

        <section className="px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#dddddd] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">My Cart</h1>
            <p className="text-[13px] text-[#737373]">{cartItems.reduce((total, item) => total + item.quantity, 0)} item(s)</p>
          </div>

          {cartItems.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="space-y-3">
                {cartItems.map((item) => (
                  <article className="rounded-lg border border-[#dddddd] bg-white p-3" key={item.id}>
                    <div className="grid gap-3 sm:grid-cols-[130px_1fr_auto] sm:items-center">
                      <img alt={item.name} className="h-[130px] w-full rounded-md object-cover" src={item.image} />
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.14em] text-[#8b8b8b]">{item.category}</p>
                        <button
                          className="mt-1 text-left text-[20px] font-medium text-[#252525] transition hover:underline"
                          onClick={() => navigate(`/product/${item.productId}`)}
                          type="button"
                        >
                          {item.name}
                        </button>
                        <p className="mt-2 text-[20px] font-semibold text-[#1e1e1e]">Rs {item.price}</p>
                        <p className="text-[12px] text-[#838383]">Size: {item.size ?? 'M'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="h-8 w-8 rounded border border-[#cfcfcf] text-[16px] text-[#444]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          type="button"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[14px]">{item.quantity}</span>
                        <button
                          className="h-8 w-8 rounded border border-[#cfcfcf] text-[16px] text-[#444]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="mt-3 text-[12px] font-medium text-[#8c2c2c] transition hover:text-[#5e1d1d]"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </section>

              <aside className="h-fit rounded-lg border border-[#dddddd] bg-white p-4">
                <h2 className="text-[22px] font-semibold text-[#232323]">Order Summary</h2>
                <div className="mt-4 space-y-2 text-[14px] text-[#555]">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>Rs {subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Rs {shipping}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span>Rs {tax}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#ececec] pt-2 text-[18px] font-semibold text-[#222]">
                    <span>Total</span>
                    <span>Rs {total}</span>
                  </div>
                </div>
                <button
                  className="mt-4 h-11 w-full rounded-md bg-[#1f2125] text-[14px] font-semibold text-white transition hover:bg-black"
                  onClick={handleProceedToCheckout}
                  type="button"
                >
                  Proceed to Checkout
                </button>
              </aside>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-[#dddddd] bg-white p-6 text-center">
              <img alt="Empty cart" className="mx-auto h-auto w-full max-w-[440px]" src={cartEmpty} />
              <h2 className="mt-4 text-[28px] font-semibold text-[#232323]">Your cart is currently empty</h2>
              <p className="mt-2 text-[14px] text-[#6f6f6f]">Discover fresh picks from GenZ and New Collections to get started.</p>
              <button
                className="mt-4 h-11 rounded-md bg-[#1f2125] px-6 text-[14px] font-semibold text-white transition hover:bg-black"
                onClick={() => navigate('/new-collections')}
                type="button"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default MyCartPage
