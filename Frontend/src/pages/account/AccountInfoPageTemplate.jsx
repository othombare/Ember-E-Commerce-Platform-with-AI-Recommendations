import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function AccountInfoPageTemplate({ ctaLabel = '', ctaRoute = '', intro, points = [], title }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

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
          onOpenWishlist={() => navigate('/wishlist')}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-4 py-6 sm:px-6 sm:py-8">
          <article className="rounded-lg border border-[#dddddd] bg-white p-5 sm:p-7">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#8d8d8d]">My Account</p>
            <h1 className="mt-2 text-[34px] font-semibold text-[#232323]">{title}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5f5f5f]">{intro}</p>

            <ul className="mt-5 space-y-3">
              {points.map((point) => (
                <li className="rounded-md border border-[#ebebeb] bg-[#faf9f7] px-4 py-3 text-[14px] text-[#4b4b4b]" key={point}>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-sm border border-[#d2d2d2] px-4 py-2 text-[13px] text-[#343434] transition hover:bg-[#f5f5f5]"
                onClick={() => navigate('/my-profile')}
                type="button"
              >
                Back to My Profile
              </button>
              {ctaLabel && ctaRoute ? (
                <button
                  className="rounded-sm bg-[#1f2125] px-4 py-2 text-[13px] text-white transition hover:bg-black"
                  onClick={() => navigate(ctaRoute)}
                  type="button"
                >
                  {ctaLabel}
                </button>
              ) : null}
            </div>
          </article>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default AccountInfoPageTemplate
