import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { findProductById, products: listingProducts } = useCatalogProducts()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))

  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)

  const product = useMemo(() => findProductById(productId), [findProductById, productId])

  const gallery = useMemo(() => {
    if (!product) {
      return []
    }

    const categoryImages = listingProducts
      .filter((item) => item.id !== product.id && item.category === product.category)
      .map((item) => item.image)
      .filter(Boolean)
      .slice(0, 4)

    const uniqueGallery = Array.from(new Set([product.image, ...categoryImages]))
    return uniqueGallery.length > 0 ? uniqueGallery : [product.image]
  }, [listingProducts, product])

  const [activeImage, setActiveImage] = useState(0)

  const recommendedProducts = useMemo(() => {
    if (!product) {
      return listingProducts.slice(0, 4)
    }

    const sameCategoryProducts = listingProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4)
    if (sameCategoryProducts.length === 4) {
      return sameCategoryProducts
    }

    const fallbackProducts = listingProducts.filter((item) => item.id !== product.id && item.category !== product.category).slice(0, 4 - sameCategoryProducts.length)

    return [...sameCategoryProducts, ...fallbackProducts]
  }, [listingProducts, product])

  const [activeProductId, setActiveProductId] = useState(productId)

  if (activeProductId !== productId) {
    setActiveProductId(productId)
    setActiveImage(0)
    setSelectedSize(product?.sizes?.[0] ?? 'M')
    setQuantity(1)
  }

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

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    addToCart({ product, quantity, size: selectedSize })
    navigate('/my-cart')
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

        {product ? (
          <section className="px-4 pb-10 pt-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between text-[11px] text-[#777]">
              <button className="text-[#2e2e2e] transition hover:underline" onClick={() => navigate(-1)} type="button">
                Back
              </button>
              <p>Home / {product.category} / {product.name}</p>
            </div>

            <article className="border border-[#d7d7d7] bg-white p-3 sm:p-4">
              <div className="grid gap-5 lg:grid-cols-[1.03fr_1fr]">
                <div>
                  <div className="relative overflow-hidden border border-[#e2e2e2]">
                    <img alt={product.name} className="h-[520px] w-full object-cover" src={gallery[activeImage]} />
                    <button
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center border border-[#c9c9c9] bg-white text-[12px]"
                      onClick={() => setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                      type="button"
                    />
                    <button
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center border border-[#c9c9c9] bg-white text-[12px]"
                      onClick={() => setActiveImage((prev) => (prev + 1) % gallery.length)}
                      type="button"
                    />
                  </div>

                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {gallery.map((image, index) => (
                      <button
                        className={`shrink-0 overflow-hidden border ${activeImage === index ? 'border-[#222]' : 'border-[#d3d3d3]'}`}
                        key={`${product.id}-thumb-${index}`}
                        onClick={() => setActiveImage(index)}
                        type="button"
                      >
                        <img alt={`${product.name} ${index + 1}`} className="h-16 w-14 object-cover sm:h-20 sm:w-16" src={image} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[#2a2a2a]">
                  <h1 className="text-[30px] font-medium leading-tight">{product.name}</h1>
                  <p className="text-[13px] text-[#6b6b6b]">{product.category}</p>
                  <p className="mt-1 text-[12px] text-[#666]">
                    <span className="text-[#e4b223]">*</span> {product.rating} | {product.reviews} ratings
                  </p>

                  <p className="mt-3 text-[44px] font-semibold leading-none">
                    Rs {product.price}{' '}
                    <span className="text-[15px] font-normal text-[#8d8d8d] line-through">Rs {product.oldPrice}</span>
                  </p>
                  <p className="mt-2 text-[13px] text-[#5d5d5d]">{product.shortDescription}</p>

                  <hr className="my-4 border-[#ececec]" />

                  <p className="text-[12px] text-[#4e4e4e]">Please select a size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(product.sizes ?? ['M']).map((entry) => (
                      <button
                        className={`min-w-10 border px-2 py-1 text-[12px] ${
                          selectedSize === entry ? 'border-[#111] bg-[#111] text-white' : 'border-[#c8c8c8] text-[#444]'
                        }`}
                        key={entry}
                        onClick={() => setSelectedSize(entry)}
                        type="button"
                      >
                        {entry}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <div className="flex h-9 items-center border border-[#c8c8c8]">
                      <button
                        className="h-9 w-9 text-[15px] text-[#444]"
                        onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                        type="button"
                      >
                        -
                      </button>
                      <span className="flex h-9 w-9 items-center justify-center border-x border-[#c8c8c8] text-[12px]">{quantity}</span>
                      <button className="h-9 w-9 text-[15px] text-[#444]" onClick={() => setQuantity((prev) => prev + 1)} type="button">
                        +
                      </button>
                    </div>
                    <button
                      className="h-9 flex-1 bg-[#1e1f22] px-5 text-[13px] font-medium text-white transition hover:bg-black"
                      onClick={handleAddToCart}
                      type="button"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <section className="mt-8 border-t border-[#ececec] pt-5">
                <h3 className="text-[22px] font-medium text-[#242424]">Recommended for You</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {recommendedProducts.map((entry) => (
                    <article
                      className="cursor-pointer border border-[#dfdfdf] bg-white p-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      key={entry.id}
                      onClick={() => navigate(`/product/${entry.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          navigate(`/product/${entry.id}`)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <img alt={entry.name} className="h-[190px] w-full object-cover" src={entry.image} />
                      <p className="mt-2 truncate text-[13px] text-[#2f2f2f]">{entry.name}</p>
                      <p className="text-[12px] text-[#818181]">{entry.category}</p>
                      <p className="mt-1 text-[14px] font-semibold">Rs {entry.price}</p>
                    </article>
                  ))}
                </div>
              </section>
            </article>
          </section>
        ) : (
          <section className="px-6 py-12 text-center">
            <h1 className="text-[36px] font-semibold text-[#222]">Product not found</h1>
            <p className="mt-2 text-[#666]">The product may have been removed or renamed.</p>
            <button
              className="mt-4 h-10 rounded-md bg-[#1f2125] px-4 text-white transition hover:bg-black"
              onClick={() => navigate('/products')}
              type="button"
            >
              Back to products
            </button>
          </section>
        )}

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default ProductDetails
