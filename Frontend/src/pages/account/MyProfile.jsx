import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import { toCategoryRoute } from '../../utils/category'

function MyProfile() {
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
    <main className="min-h-screen bg-[#3f3f42] px-2 py-5 text-[#202020] sm:px-5">
      <div className="mx-auto w-full max-w-[1260px] bg-white">
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
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default MyProfile
