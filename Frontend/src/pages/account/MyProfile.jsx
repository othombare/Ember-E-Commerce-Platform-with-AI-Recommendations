import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useOrdersStore from '../../store/ordersStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function formatOrderDate(dateValue) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function orderBelongsToUser(order, user) {
  const userId = String(user?.id ?? '').trim()
  const userEmail = String(user?.email ?? '').trim().toLowerCase()
  const orderUserId = String(order?.user?.id ?? '').trim()
  const orderUserEmail = String(order?.user?.email ?? '').trim().toLowerCase()

  if (userId && orderUserId) {
    return userId === orderUserId
  }

  if (userEmail && orderUserEmail) {
    return userEmail === orderUserEmail
  }

  return false
}

function MyProfile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const orders = useOrdersStore((state) => state.orders)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const myOrders = useMemo(() => orders.filter((order) => orderBelongsToUser(order, user)), [orders, user])

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
          onOpenProfile={() => navigate('/my-profile')}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">My Profile</h1>
            <button
              className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <article className="border border-[#e4e4e4] bg-[#faf9f7] p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#888]">Profile Details</p>
              <h2 className="mt-3 text-[26px] font-medium text-[#222]">{user?.name ?? 'Shopper'}</h2>
              <div className="mt-4 space-y-3 text-[14px] text-[#555]">
                <p>
                  <span className="font-semibold text-[#2f2f2f]">Email:</span> {user?.email ?? 'Not available'}
                </p>
                <p>
                  <span className="font-semibold text-[#2f2f2f]">User ID:</span> {user?.id ?? 'Not available'}
                </p>
                <p>
                  <span className="font-semibold text-[#2f2f2f]">Phone:</span> +91 98XXXXXX20
                </p>
              </div>
            </article>

            <article className="border border-[#e4e4e4] bg-white p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#888]">Saved Addresses</p>
              <div className="mt-4 space-y-3 text-[13px] text-[#555]">
                <p className="border border-[#ececec] bg-[#fafafa] p-3">Home: 22, MG Road, Bengaluru, Karnataka</p>
                <p className="border border-[#ececec] bg-[#fafafa] p-3">Office: 4th Floor, Cyber Hub, Hyderabad</p>
              </div>
              <button className="mt-4 border border-[#d3d3d3] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]" type="button">
                Add New Address
              </button>
            </article>
          </div>

          <section className="mt-6 border border-[#e4e4e4] bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
              <h2 className="text-[26px] font-medium text-[#222]">My Orders</h2>
              <p className="text-[12px] text-[#7a7a7a]">{myOrders.length} order(s)</p>
            </div>

            {myOrders.length > 0 ? (
              <div className="mt-4 space-y-4">
                {myOrders.map((order) => (
                  <article className="border border-[#e4e4e4] bg-[#faf9f7] p-4" key={order.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#2f2f2f]">Order ID: {order.id}</p>
                      <p className="text-[12px] text-[#666]">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-[12px] text-[#666]">Status: {order.status ?? 'Placed'}</p>
                    <div className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <div className="flex items-center justify-between gap-3 text-[12px] text-[#444]" key={`${order.id}-${item.id}`}>
                          <p className="truncate">
                            {item.name} ({item.size}) x {item.quantity}
                          </p>
                          <p className="shrink-0 font-medium">Rs {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#e7e7e7] pt-2 text-[13px]">
                      <p className="text-[#555]">Total items: {order.itemCount}</p>
                      <p className="font-semibold text-[#1f1f1f]">Total: Rs {order.total}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 border border-[#ececec] bg-[#fafafa] p-4 text-center">
                <p className="text-[14px] text-[#666]">No previous orders yet.</p>
                <button
                  className="mt-3 bg-[#1f2125] px-4 py-2 text-[12px] text-white transition hover:bg-black"
                  onClick={() => navigate('/products')}
                  type="button"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </section>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default MyProfile
