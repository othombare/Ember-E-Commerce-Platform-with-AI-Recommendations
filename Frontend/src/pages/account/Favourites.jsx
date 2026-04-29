import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import menCategory1 from '../../assets/categories/men/item-1.png'
import menCategory2 from '../../assets/categories/men/item-2.png'
import menCategory3 from '../../assets/categories/men/item-3.png'
import menCategory4 from '../../assets/categories/men/item-4.png'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import { toCategoryRoute } from '../../utils/category'

const favouriteItems = [
  { id: 'f-1', name: 'Cotton Linen Stripes: Orchid', price: 599, image: menCategory1 },
  { id: 'f-2', name: 'Cotton Linen Beige: Orchid', price: 599, image: menCategory2 },
  { id: 'f-3', name: 'Cotton Linen Night Sky: Orchid', price: 599, image: menCategory3 },
  { id: 'f-4', name: 'Cotton Linen Monochrome: Orchid', price: 599, image: menCategory4 },
]

function Favourites() {
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
            <h1 className="text-[34px] font-semibold text-[#222]">Favourites</h1>
            <p className="text-[12px] text-[#8a8a8a]">{favouriteItems.length} saved items</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {favouriteItems.map((item) => (
              <article className="border border-[#dfdfdf] bg-white p-2" key={item.id}>
                <img alt={item.name} className="h-[230px] w-full object-cover" src={item.image} />
                <h2 className="mt-2 truncate text-[12px] text-[#343434]">{item.name}</h2>
                <p className="mt-1 text-[14px] font-semibold text-[#222]">Rs {item.price}</p>
                <div className="mt-2 flex gap-2">
                  <button className="border border-[#d3d3d3] px-2 py-1 text-[11px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]" type="button">
                    Remove
                  </button>
                  <button className="bg-[#1f2125] px-2 py-1 text-[11px] text-white transition hover:bg-black" type="button">
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default Favourites
