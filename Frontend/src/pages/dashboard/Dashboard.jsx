import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import emberLogo from '../../assets/home/ember-logo.png'
import heroBanner from '../../assets/home/hero-banner.png'
import mensCollectionBanner from '../../assets/home/mens-collection.png'
import productImageOne from '../../assets/home/product-1.png'
import productImageTwo from '../../assets/home/product-2.png'
import productImageThree from '../../assets/home/product-3.png'
import productImageFour from '../../assets/home/product-4.png'
import promoBottom from '../../assets/home/promo-bottom.png'
import promoCenter from '../../assets/home/promo-center.png'
import promoLeft from '../../assets/home/promo-left.png'
import promoRight from '../../assets/home/promo-right.png'
import menCategory1 from '../../assets/categories/men/item-1.png'
import menCategory2 from '../../assets/categories/men/item-2.png'
import menCategory3 from '../../assets/categories/men/item-3.png'
import menCategory4 from '../../assets/categories/men/item-4.png'
import menCategory5 from '../../assets/categories/men/item-5.png'
import menCategory6 from '../../assets/categories/men/item-6.png'
import menCategory7 from '../../assets/categories/men/item-7.png'
import menCategory8 from '../../assets/categories/men/item-8.png'
import menCategory9 from '../../assets/categories/men/item-9.png'
import womenCategory1 from '../../assets/categories/women/item-1.png'
import womenCategory2 from '../../assets/categories/women/item-2.png'
import womenCategory3 from '../../assets/categories/women/item-3.png'
import womenCategory4 from '../../assets/categories/women/item-4.png'
import womenCategory5 from '../../assets/categories/women/item-5.png'
import womenCategory6 from '../../assets/categories/women/item-6.png'
import womenCategory7 from '../../assets/categories/women/item-7.png'
import womenCategory8 from '../../assets/categories/women/item-8.png'
import womenCategory9 from '../../assets/categories/women/item-9.png'
import kidsCategory1 from '../../assets/categories/kids/item-1.png'
import kidsCategory2 from '../../assets/categories/kids/item-2.png'
import kidsCategory3 from '../../assets/categories/kids/item-3.png'
import kidsCategory4 from '../../assets/categories/kids/item-4.png'
import kidsCategory5 from '../../assets/categories/kids/item-5.png'
import kidsCategory6 from '../../assets/categories/kids/item-6.png'
import kidsCategory7 from '../../assets/categories/kids/item-7.png'
import kidsCategory8 from '../../assets/categories/kids/item-8.png'
import kidsCategory9 from '../../assets/categories/kids/item-9.png'
import useAuthStore from '../../store/authStore'

const headerLinks = ['Men', 'Women', 'Kids', 'GenZ', 'New Collections', 'Ai Recommendation']
const categoryTabs = ['Men', 'Women', 'Kids']

const categoryCatalog = {
  Men: [
    { id: 'men-1', image: menCategory1, label: 'T-Shirts' },
    { id: 'men-2', image: menCategory2, label: 'Joggers' },
    { id: 'men-3', image: menCategory3, label: "Polo's" },
    { id: 'men-4', image: menCategory4, label: 'Shorts' },
    { id: 'men-5', image: menCategory5, label: 'All Shirts' },
    { id: 'men-6', image: menCategory6, label: 'Cargoes' },
    { id: 'men-7', image: menCategory7, label: 'Formals' },
    { id: 'men-8', image: menCategory8, label: 'Active Wear' },
    { id: 'men-9', image: menCategory9, label: 'Hoodies & Jackets' },
  ],
  Women: [
    { id: 'women-1', image: womenCategory1, label: 'T-Shirts' },
    { id: 'women-2', image: womenCategory2, label: 'Joggers' },
    { id: 'women-3', image: womenCategory3, label: "Polo's" },
    { id: 'women-4', image: womenCategory4, label: 'Shorts' },
    { id: 'women-5', image: womenCategory5, label: 'Sarees' },
    { id: 'women-6', image: womenCategory6, label: 'Kurtas & Suits' },
    { id: 'women-7', image: womenCategory7, label: 'Formals' },
    { id: 'women-8', image: womenCategory8, label: 'Active Wear' },
    { id: 'women-9', image: womenCategory9, label: 'Dupatta' },
  ],
  Kids: [
    { id: 'kids-1', image: kidsCategory1, label: 'T-Shirts' },
    { id: 'kids-2', image: kidsCategory2, label: 'Joggers' },
    { id: 'kids-3', image: kidsCategory3, label: "Polo's" },
    { id: 'kids-4', image: kidsCategory4, label: 'Shorts' },
    { id: 'kids-5', image: kidsCategory5, label: 'Jeans' },
    { id: 'kids-6', image: kidsCategory6, label: 'Shirts' },
    { id: 'kids-7', image: kidsCategory7, label: 'Formals' },
    { id: 'kids-8', image: kidsCategory8, label: 'Party Wears' },
    { id: 'kids-9', image: kidsCategory9, label: 'Hoodies & Jackets' },
  ],
}

const baseProducts = [
  { id: 'linen-orchid-1', image: productImageOne, name: 'Cotton Linen Stripes: Orchid...' },
  { id: 'linen-orchid-2', image: productImageTwo, name: 'Cotton Linen Stripes: Orchid...' },
  { id: 'linen-orchid-3', image: productImageThree, name: 'Cotton Linen Stripes: Orchid...' },
  { id: 'linen-orchid-4', image: productImageFour, name: 'Cotton Linen Stripes: Orchid...' },
]

const featuredProducts = [baseProducts[0], baseProducts[3], baseProducts[2], baseProducts[1]]
const recommendedProducts = [baseProducts[0], baseProducts[1], baseProducts[2], baseProducts[3]]
const favoriteProducts = [baseProducts[0], baseProducts[1], baseProducts[2], baseProducts[3]]

function IconButton({ children, label }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#1f1f1f] transition duration-200 hover:-translate-y-0.5 hover:border-[#cfcfcf] hover:bg-[#f3f3f3]"
      type="button"
    >
      {children}
    </button>
  )
}

function CategoryStrip({ activeCategory, isPanelOpen, onCategoryTap }) {
  const cards = isPanelOpen && activeCategory ? categoryCatalog[activeCategory] ?? [] : []

  return (
    <section className="border border-[#dadada] bg-white">
      <div className="flex items-center gap-4 px-6 py-3">
        <img alt="Ember logo" className="h-8 w-auto object-contain" src={emberLogo} />
        <nav className="hidden items-center gap-8 text-[17px] font-medium text-[#2e2e2e] lg:flex">
          {headerLinks.map((link) => {
            const isActive = isPanelOpen && link === activeCategory
            const isCategoryTab = categoryTabs.includes(link)
            return (
              <button
                className={`${
                  isActive ? 'text-black' : 'text-[#2e2e2e]'
                } relative transition duration-200 hover:text-black after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#1f1f1f] after:transition-transform after:duration-200 hover:after:scale-x-100`}
                key={link}
                onClick={() => {
                  if (isCategoryTab) {
                    onCategoryTap(link)
                  }
                }}
                type="button"
              >
                {link}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center border border-[#c8c8c8] bg-[#fbfbfb] px-3 md:flex md:w-[370px]">
            <input
              className="h-10 w-full bg-transparent text-[14px] text-[#535353] outline-none placeholder:text-[#b5b5b5]"
              placeholder="Search for your favorite brand"
              type="text"
            />
            <svg className="h-4 w-4 text-[#707070]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </label>

          <IconButton label="Wishlist">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path
                d="m12 20-1.4-1.27C5.4 13.95 2 10.86 2 7.06A4.76 4.76 0 0 1 6.76 2.3c1.9 0 3.73.88 4.9 2.26A6.55 6.55 0 0 1 16.56 2.3 4.76 4.76 0 0 1 21.32 7.06c0 3.8-3.4 6.9-8.6 11.67L12 20Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>

          <IconButton label="Account">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
            </svg>
          </IconButton>

          <IconButton label="Cart">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.1 10.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.75L20 7H7.2" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>
      </div>

      {isPanelOpen ? (
        <div className="border-t border-[#e5e5e5] px-4 pb-3 pt-3">
          <div className="flex gap-5 overflow-x-auto pb-1">
            {cards.map((card) => (
              <article className="group min-w-[108px] cursor-pointer text-center" key={card.id}>
                <div className="overflow-hidden rounded-[4px] border border-transparent transition duration-200 group-hover:-translate-y-1 group-hover:border-[#d2d2d2] group-hover:shadow-md">
                  <img
                    alt={card.label}
                    className="h-[160px] w-[108px] object-cover transition duration-300 group-hover:scale-105"
                    src={card.image}
                  />
                </div>
                <p className="mt-2 text-[15px] font-medium text-[#303030] transition duration-200 group-hover:text-black">
                  {card.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-8 mt-10 flex items-center gap-4">
      <div className="h-px flex-1 bg-[#cfcfcf]" />
      <div className="text-center">
        <h2 className="font-serif text-4xl font-semibold text-[#262626] sm:text-5xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-[13px] text-[#868686]">{subtitle}</p> : null}
      </div>
      <div className="h-px flex-1 bg-[#cfcfcf]" />
    </div>
  )
}

function SectionArrows() {
  return (
    <div className="mb-4 flex justify-end gap-3">
      <button
        aria-label="Previous"
        className="flex h-11 w-11 items-center justify-center border border-[#9f9f9f] text-[#252525] transition duration-200 hover:-translate-y-0.5 hover:border-[#252525] hover:bg-[#252525] hover:text-white"
        type="button"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18 9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Next"
        className="flex h-11 w-11 items-center justify-center border border-[#9f9f9f] text-[#252525] transition duration-200 hover:-translate-y-0.5 hover:border-[#252525] hover:bg-[#252525] hover:text-white"
        type="button"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <article className="group cursor-pointer border border-[#bcbcbc] bg-[#f3f1ed] transition duration-200 hover:-translate-y-1 hover:border-[#8f8f8f] hover:shadow-lg">
      <div className="overflow-hidden">
        <img
          alt={product.name}
          className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-105"
          src={product.image}
        />
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[18px] font-medium text-[#2c2c2c] transition duration-200 group-hover:text-black">
            {product.name}
          </h3>
          <span className="shrink-0 text-[14px] text-[#515151]">
            <span className="text-[#e4b223]">*</span> 4.7 (127)
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[#8f8f8f]">All-Shirts</p>
        <p className="mt-1 text-[36px] font-semibold leading-none text-[#232323]">
          Rs 599 <span className="ml-1 text-[30px] font-normal text-[#9f9f9f] line-through">Rs 999</span>{' '}
          <span className="text-[28px] font-semibold text-[#1f9a2f]">Rs 400 Off</span>
        </p>
      </div>
    </article>
  )
}

function ProductSection({ title, subtitle, products, showSeeAllButton = false }) {
  return (
    <section>
      <SectionHeading subtitle={subtitle} title={title} />
      <SectionArrows />
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={`${title}-${product.id}`} product={product} />
        ))}
      </div>
      {showSeeAllButton ? (
        <div className="mt-9 flex justify-center">
          <button
            className="h-14 border border-[#b8b8b8] bg-[#f6f4f1] px-9 text-[15px] text-[#2e2e2e] transition duration-200 hover:-translate-y-0.5 hover:border-[#2e2e2e] hover:bg-white"
            type="button"
          >
            See All Products
          </button>
        </div>
      ) : null}
    </section>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleCategoryTap = (category) => {
    if (activeCategory === category && isCategoryPanelOpen) {
      setIsCategoryPanelOpen(false)
      return
    }

    setActiveCategory(category)
    setIsCategoryPanelOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#3f3f42] px-2 py-5 text-[#202020] sm:px-5">
      <div className="mx-auto w-full max-w-[1260px]">
        <CategoryStrip
          activeCategory={activeCategory}
          isPanelOpen={isCategoryPanelOpen}
          onCategoryTap={handleCategoryTap}
        />

        <section
          className={`overflow-hidden border border-[#d2d2d2] bg-[#8b8e68] ${isCategoryPanelOpen ? 'border-t-0' : 'mt-2'}`}
        >
          <img alt="Define your style with Ember" className="w-full object-cover" src={heroBanner} />
        </section>

        <div className="bg-[#f4f3f1] px-2 pb-14 pt-7 sm:px-6">
          <div className="mb-4 flex items-center justify-end gap-4">
            <p className="text-[14px] text-[#666]">Hi, {user?.name ?? 'Shopper'}</p>
            <button
              className="h-9 rounded-md bg-[#1f2125] px-3 text-[13px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>

          <section className="grid gap-2 lg:grid-cols-[1.02fr_1.48fr]">
            <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
              <img
                alt="Ugadi sale banner"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                src={promoLeft}
              />
            </div>
            <div className="grid gap-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                  <img
                    alt="Special edition hoodie banner"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    src={promoCenter}
                  />
                </div>
                <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                  <img
                    alt="Autumn offer banner"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    src={promoRight}
                  />
                </div>
              </div>
              <div className="group overflow-hidden border border-[#d0d0d0] transition duration-200 hover:shadow-lg">
                <img
                  alt="New knits banner"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  src={promoBottom}
                />
              </div>
            </div>
          </section>

          <ProductSection products={baseProducts} showSeeAllButton title="NEW ARRIVALS" />
          <ProductSection
            subtitle="Handpicked pieces for the current season."
            products={featuredProducts}
            title="Featured Collection"
          />

          <section className="mt-14">
            <div className="group overflow-hidden border border-[#c1c8d7] transition duration-200 hover:shadow-lg">
              <img
                alt="Exclusive men's collection banner"
                className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                src={mensCollectionBanner}
              />
            </div>
          </section>

          <ProductSection
            subtitle="* AI Powered Recommendations"
            products={recommendedProducts}
            title="Recommended for You"
          />
          <ProductSection products={favoriteProducts} title="Ember's Favorite" />
        </div>

        <footer className="relative overflow-hidden bg-[#1f2024] text-[#d6d6d6]">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-7 py-14 md:grid-cols-[1.35fr_.75fr_.7fr_1.4fr]">
            <section>
              <p className="max-w-[420px] text-[17px] leading-relaxed text-[#a5a5a5]">
                Ember is where modern design meets timeless expression. Crafted for those who value subtle luxury,
                every piece reflects confidence, individuality, and effortless style.
              </p>
            </section>

            <section>
              <h3 className="mb-5 font-serif text-[37px] text-white">Our Socials</h3>
              <div className="flex gap-3">
                {['in', 'ig', 'yt', 'x'].map((social) => (
                  <span
                    className="flex h-11 w-11 cursor-pointer items-center justify-center border border-[#8f8f8f] text-[15px] uppercase text-[#bababa] transition duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white"
                    key={social}
                  >
                    {social}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-5 font-serif text-[37px] text-white">Support</h3>
              <ul className="space-y-2 text-[17px] text-[#b6b6b6]">
                <li>FAQ</li>
                <li>Shipping & Returns</li>
                <li>Size Guide</li>
                <li>Contact Us</li>
              </ul>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <h3 className="font-serif text-[37px] text-white">Shop</h3>
                <div className="h-px flex-1 bg-[#545454]" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-[17px] text-[#b8b8b8]">
                <ul className="space-y-2">
                  <li className="text-white">Men</li>
                  <li className="cursor-pointer transition hover:text-white">T-shirts</li>
                  <li className="cursor-pointer transition hover:text-white">Joggers</li>
                  <li className="cursor-pointer transition hover:text-white">Polo's</li>
                  <li className="cursor-pointer transition hover:text-white">Shorts</li>
                  <li className="cursor-pointer transition hover:text-white">All Shirts</li>
                  <li className="cursor-pointer transition hover:text-white">Cargoes</li>
                  <li className="cursor-pointer transition hover:text-white">Active Wear</li>
                  <li className="cursor-pointer transition hover:text-white">Hoodies & Jackets</li>
                </ul>
                <ul className="space-y-2">
                  <li className="text-white">Women</li>
                  <li className="cursor-pointer transition hover:text-white">T-shirts</li>
                  <li className="cursor-pointer transition hover:text-white">Joggers</li>
                  <li className="cursor-pointer transition hover:text-white">Polo's</li>
                  <li className="cursor-pointer transition hover:text-white">Shorts</li>
                  <li className="cursor-pointer transition hover:text-white">Saree's</li>
                  <li className="cursor-pointer transition hover:text-white">Kurtas & Suits</li>
                  <li className="cursor-pointer transition hover:text-white">Formals</li>
                  <li className="cursor-pointer transition hover:text-white">Active Wear</li>
                </ul>
                <ul className="space-y-2">
                  <li className="text-white">Kids</li>
                  <li className="cursor-pointer transition hover:text-white">T-shirts</li>
                  <li className="cursor-pointer transition hover:text-white">Joggers</li>
                  <li className="cursor-pointer transition hover:text-white">Polo's</li>
                  <li className="cursor-pointer transition hover:text-white">Shorts</li>
                  <li className="cursor-pointer transition hover:text-white">Jeans</li>
                  <li className="cursor-pointer transition hover:text-white">Shirts</li>
                  <li className="cursor-pointer transition hover:text-white">Formals</li>
                  <li className="cursor-pointer transition hover:text-white">Party Wear</li>
                </ul>
              </div>
            </section>
          </div>
          <p className="pointer-events-none absolute -bottom-10 left-5 text-[200px] leading-none text-white/10">Ember</p>
        </footer>
      </div>
    </main>
  )
}

export default Dashboard
