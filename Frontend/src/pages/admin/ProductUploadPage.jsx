import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import { PRODUCT_CATEGORIES } from '../../data/productCategories'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

const inputClassName = 'h-10 w-full border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#333] outline-none focus:border-[#1f1f1f]'

function ProductUploadPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const { products, fetchProducts } = useCatalogProducts()

  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('T-Shirts')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [rating, setRating] = useState('4.5')
  const [reviews, setReviews] = useState('0')
  const [sold, setSold] = useState('0')
  const [stock, setStock] = useState('50')
  const [isNew, setIsNew] = useState(true)
  const [sizesText, setSizesText] = useState('S,M,L,XL')
  const [tagsText, setTagsText] = useState('new')
  const [shortDescription, setShortDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recentProducts = useMemo(() => products.slice(0, 8), [products])

  const handleCategoryTabToggle = (nextCategory) => {
    if (activeCategory === nextCategory && isCategoryPanelOpen) {
      setIsCategoryPanelOpen(false)
      return
    }

    setActiveCategory(nextCategory)
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

  const handleSearchSubmit = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const resetForm = () => {
    setName('')
    setCategory('T-Shirts')
    setPrice('')
    setOldPrice('')
    setRating('4.5')
    setReviews('0')
    setSold('0')
    setStock('50')
    setIsNew(true)
    setSizesText('S,M,L,XL')
    setTagsText('new')
    setShortDescription('')
    setImageFile(null)
    setImageUrl('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !price) {
      setStatusMessage('Product name and price are required.')
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Uploading product...')

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('category', category)
      formData.append('price', price)
      formData.append('oldPrice', oldPrice || price)
      formData.append('rating', rating || '4.5')
      formData.append('reviews', reviews || '0')
      formData.append('sold', sold || '0')
      formData.append('stock', stock || '0')
      formData.append('isNew', String(isNew))
      formData.append('sizes', sizesText)
      formData.append('tags', tagsText)
      formData.append('shortDescription', shortDescription.trim())
      formData.append('description', shortDescription.trim())

      if (imageFile) {
        formData.append('image', imageFile)
      } else if (imageUrl.trim()) {
        formData.append('image', imageUrl.trim())
      }

      const response = await api.post('/api/products', formData)
      await fetchProducts()
      setStatusMessage(response.data?.message ?? 'Product uploaded successfully.')
      resetForm()
    } catch (error) {
      setStatusMessage(`Upload failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
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
          onOpenProfile={() => navigate('/my-profile')}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dddddd] pb-3">
            <h1 className="text-[30px] font-semibold text-[#232323]">Upload Product</h1>
            <button
              className="border border-[#c8c8c8] bg-white px-3 py-1 text-[12px] text-[#3a3a3a] transition hover:bg-[#f7f7f7]"
              onClick={() => navigate('/products')}
              type="button"
            >
              View Catalog
            </button>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <form className="space-y-3 border border-[#dddddd] bg-white p-4" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-[12px] text-[#555]">
                  Product Name
                  <input className={inputClassName} onChange={(event) => setName(event.target.value)} type="text" value={name} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Category
                  <select className={inputClassName} onChange={(event) => setCategory(event.target.value)} value={category}>
                    {PRODUCT_CATEGORIES.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-[12px] text-[#555]">
                  Price (Rs)
                  <input className={inputClassName} min="0" onChange={(event) => setPrice(event.target.value)} type="number" value={price} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Old Price (Rs)
                  <input className={inputClassName} min="0" onChange={(event) => setOldPrice(event.target.value)} type="number" value={oldPrice} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Rating
                  <input className={inputClassName} max="5" min="1" onChange={(event) => setRating(event.target.value)} step="0.1" type="number" value={rating} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Reviews Count
                  <input className={inputClassName} min="0" onChange={(event) => setReviews(event.target.value)} type="number" value={reviews} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Sold Count
                  <input className={inputClassName} min="0" onChange={(event) => setSold(event.target.value)} type="number" value={sold} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Stock
                  <input className={inputClassName} min="0" onChange={(event) => setStock(event.target.value)} type="number" value={stock} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Sizes (comma separated)
                  <input className={inputClassName} onChange={(event) => setSizesText(event.target.value)} type="text" value={sizesText} />
                </label>
                <label className="text-[12px] text-[#555]">
                  Tags (comma separated)
                  <input className={inputClassName} onChange={(event) => setTagsText(event.target.value)} type="text" value={tagsText} />
                </label>
              </div>

              <label className="text-[12px] text-[#555]">
                Short Description
                <textarea
                  className="min-h-[90px] w-full border border-[#d0d0d0] bg-white px-3 py-2 text-[14px] text-[#333] outline-none focus:border-[#1f1f1f]"
                  onChange={(event) => setShortDescription(event.target.value)}
                  value={shortDescription}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-[12px] text-[#555]">
                  Upload Image File
                  <input
                    className="mt-1 block w-full text-[13px] text-[#444]"
                    onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                    type="file"
                  />
                </label>
                <label className="text-[12px] text-[#555]">
                  Or Image URL
                  <input className={inputClassName} onChange={(event) => setImageUrl(event.target.value)} type="text" value={imageUrl} />
                </label>
              </div>

              <label className="flex items-center gap-2 text-[13px] text-[#4a4a4a]">
                <input checked={isNew} className="h-4 w-4 accent-[#1f1f1f]" onChange={(event) => setIsNew(event.target.checked)} type="checkbox" />
                Mark as New Collection product
              </label>

              <button
                className="h-11 w-full bg-[#1f2125] text-[14px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Uploading...' : 'Upload Product'}
              </button>

              {statusMessage ? <p className="text-[13px] text-[#575757]">{statusMessage}</p> : null}
            </form>

            <aside className="border border-[#dddddd] bg-white p-4">
              <h2 className="text-[20px] font-semibold text-[#252525]">Latest Products</h2>
              <p className="mt-1 text-[12px] text-[#7a7a7a]">New uploads appear here after refresh.</p>
              <div className="mt-4 space-y-2">
                {recentProducts.map((product) => (
                  <button
                    className="flex w-full items-center gap-3 border border-[#ececec] p-2 text-left transition hover:border-[#d5d5d5] hover:bg-[#fafafa]"
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    type="button"
                  >
                    <img alt={product.name} className="h-16 w-14 object-cover" src={product.image} />
                    <div>
                      <p className="text-[13px] font-medium text-[#2a2a2a]">{product.name}</p>
                      <p className="text-[11px] text-[#7f7f7f]">{product.category}</p>
                      <p className="text-[12px] font-semibold text-[#1f1f1f]">Rs {product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default ProductUploadPage
