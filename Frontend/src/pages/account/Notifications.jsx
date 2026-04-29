import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import { toCategoryRoute } from '../../utils/category'

const notifications = [
  { id: 'n-1', title: 'Your order has been shipped', time: '2 hours ago', status: 'New' },
  { id: 'n-2', title: 'Price dropped on a favourite item', time: 'Yesterday', status: 'Unread' },
  { id: 'n-3', title: 'New arrivals in Men - T-shirts', time: '2 days ago', status: 'Read' },
  { id: 'n-4', title: 'Special offer: Extra 15% off', time: '3 days ago', status: 'Read' },
]

function Notifications() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleOpenCategoryPage = (categoryLabel) => {
    navigate(toCategoryRoute(categoryLabel))
  }

  const handleSearchSubmit = () => {
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

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-white">
        <StoreHeader
          activeCategory={activeCategory}
          categoryCatalog={categoryCatalog}
          isCategoryPanelOpen={isCategoryPanelOpen}
          onCategoryCardSelect={handleOpenCategoryPage}
          onCategoryTabToggle={handleCategoryTabToggle}
          onLogout={handleLogout}
          onOpenCart={() => navigate('/products')}
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
            <h1 className="text-[34px] font-semibold text-[#222]">Notifications</h1>
            <button className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]" type="button">
              Mark all as read
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {notifications.map((item) => (
              <article className="border border-[#e5e5e5] bg-[#faf9f7] p-4" key={item.id}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-medium text-[#262626]">{item.title}</h2>
                  <span className="text-[11px] text-[#8a8a8a]">{item.status}</span>
                </div>
                <p className="mt-1 text-[12px] text-[#7a7a7a]">{item.time}</p>
              </article>
            ))}
          </div>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default Notifications
