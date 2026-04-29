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
import useAuthStore from '../../store/authStore'

const headerLinks = ['Men', 'Women', 'Kids', 'GenZ', 'New Collections', 'Ai Recommendation']

const baseProducts = [
  {
    id: 'linen-orchid-1',
    image: productImageOne,
    name: 'Cotton Linen Stripes: Orchid...',
  },
  {
    id: 'linen-orchid-2',
    image: productImageTwo,
    name: 'Cotton Linen Stripes: Orchid...',
  },
  {
    id: 'linen-orchid-3',
    image: productImageThree,
    name: 'Cotton Linen Stripes: Orchid...',
  },
  {
    id: 'linen-orchid-4',
    image: productImageFour,
    name: 'Cotton Linen Stripes: Orchid...',
  },
]

const featuredProducts = [baseProducts[0], baseProducts[3], baseProducts[2], baseProducts[1]]
const recommendedProducts = [baseProducts[0], baseProducts[1], baseProducts[2], baseProducts[3]]
const favoriteProducts = [baseProducts[0], baseProducts[1], baseProducts[2], baseProducts[3]]

function HeaderIconButton({ children, label }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#1f1f1f] transition hover:border-[#d2d2d2] hover:bg-white"
      type="button"
    >
      {children}
    </button>
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
        className="flex h-11 w-11 items-center justify-center border border-[#9f9f9f] text-[#252525]"
        type="button"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18 9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Next"
        className="flex h-11 w-11 items-center justify-center border border-[#9f9f9f] text-[#252525]"
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
    <article className="border border-[#bcbcbc] bg-[#f3f1ed]">
      <img alt={product.name} className="h-[320px] w-full object-cover" src={product.image} />
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[18px] font-medium text-[#2c2c2c]">{product.name}</h3>
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
            className="h-14 border border-[#b8b8b8] bg-[#f6f4f1] px-9 text-[15px] text-[#2e2e2e] transition hover:bg-white"
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

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <main className="min-h-screen bg-[#f4f3f1] text-[#202020]">
      <header className="sticky top-0 z-40 border-b border-[#dadada] bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-4 px-3 py-3 sm:px-6">
          <img alt="Ember logo" className="h-8 w-auto object-contain" src={emberLogo} />

          <nav className="hidden items-center gap-8 text-[19px] font-medium text-[#2e2e2e] lg:flex">
            {headerLinks.map((link) => (
              <button className="transition hover:text-black" key={link} type="button">
                {link}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <label className="hidden items-center border border-[#c8c8c8] bg-[#f2f1ee] px-3 md:flex md:w-[370px]">
              <input
                className="h-10 w-full bg-transparent text-[14px] text-[#535353] outline-none placeholder:text-[#a6a6a6]"
                placeholder="Search for your favorite brand"
                type="text"
              />
              <svg className="h-4 w-4 text-[#676767]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" />
              </svg>
            </label>

            <HeaderIconButton label="Wishlist">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                <path
                  d="m12 20-1.4-1.27C5.4 13.95 2 10.86 2 7.06A4.76 4.76 0 0 1 6.76 2.3c1.9 0 3.73.88 4.9 2.26A6.55 6.55 0 0 1 16.56 2.3 4.76 4.76 0 0 1 21.32 7.06c0 3.8-3.4 6.9-8.6 11.67L12 20Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </HeaderIconButton>

            <HeaderIconButton label="Account">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
              </svg>
            </HeaderIconButton>

            <HeaderIconButton label="Cart">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M3 4h2l2.1 10.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.75L20 7H7.2" strokeLinecap="round" />
              </svg>
            </HeaderIconButton>

            <p className="hidden text-[13px] text-[#666] xl:block">Hi, {user?.name ?? 'Shopper'}</p>
            <button
              className="h-9 rounded-md bg-[#1f2125] px-3 text-[13px] font-medium text-white transition hover:bg-black"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-2 pb-14 sm:px-6">
        <section className="overflow-hidden border border-[#bcc6b6] bg-[#8b8e68]">
          <img alt="Define your style with Ember" className="w-full object-cover" src={heroBanner} />
        </section>

        <section className="mt-7 grid gap-2 lg:grid-cols-[1.02fr_1.48fr]">
          <div className="overflow-hidden border border-[#d0d0d0]">
            <img alt="Ugadi sale banner" className="h-full w-full object-cover" src={promoLeft} />
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="overflow-hidden border border-[#d0d0d0]">
                <img alt="Special edition hoodie banner" className="h-full w-full object-cover" src={promoCenter} />
              </div>
              <div className="overflow-hidden border border-[#d0d0d0]">
                <img alt="Autumn offer banner" className="h-full w-full object-cover" src={promoRight} />
              </div>
            </div>
            <div className="overflow-hidden border border-[#d0d0d0]">
              <img alt="New knits banner" className="h-full w-full object-cover" src={promoBottom} />
            </div>
          </div>
        </section>

        <ProductSection products={baseProducts} showSeeAllButton title="NEW ARRIVALS" />
        <ProductSection subtitle="Handpicked pieces for the current season." products={featuredProducts} title="Featured Collection" />

        <section className="mt-14">
          <div className="overflow-hidden border border-[#c1c8d7]">
            <img alt="Exclusive men's collection banner" className="w-full object-cover" src={mensCollectionBanner} />
          </div>
        </section>

        <ProductSection subtitle="* AI Powered Recommendations" products={recommendedProducts} title="Recommended for You" />
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
                  className="flex h-11 w-11 items-center justify-center border border-[#8f8f8f] text-[15px] uppercase text-[#bababa]"
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
                <li>T-shirts</li>
                <li>Joggers</li>
                <li>Polo's</li>
                <li>Shorts</li>
                <li>All Shirts</li>
                <li>Cargoes</li>
                <li>Active Wear</li>
                <li>Hoodies & Jackets</li>
              </ul>
              <ul className="space-y-2">
                <li className="text-white">Women</li>
                <li>T-shirts</li>
                <li>Joggers</li>
                <li>Polo's</li>
                <li>Shorts</li>
                <li>Saree's</li>
                <li>Kurtas & Suits</li>
                <li>Formals</li>
                <li>Active Wear</li>
              </ul>
              <ul className="space-y-2">
                <li className="text-white">Kids</li>
                <li>T-shirts</li>
                <li>Joggers</li>
                <li>Polo's</li>
                <li>Shorts</li>
                <li>Jeans</li>
                <li>Shirts</li>
                <li>Formals</li>
                <li>Party Wear</li>
              </ul>
            </div>
          </section>
        </div>
        <p className="pointer-events-none absolute -bottom-10 left-5 text-[200px] leading-none text-white/10">Ember</p>
      </footer>
    </main>
  )
}

export default Dashboard
