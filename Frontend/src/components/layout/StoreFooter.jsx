import { Link } from 'react-router-dom'

const socialLinks = [
  { id: 'in', label: 'in', href: 'https://www.linkedin.com' },
  { id: 'ig', label: 'ig', href: 'https://www.instagram.com' },
  { id: 'yt', label: 'yt', href: 'https://www.youtube.com' },
  { id: 'x', label: 'x', href: 'https://x.com' },
]

const supportLinks = [
  { id: 'faq', label: 'FAQ', to: '/support/faq' },
  { id: 'shipping-returns', label: 'Shipping & Returns', to: '/support/shipping-returns' },
  { id: 'size-guide', label: 'Size Guide', to: '/support/size-guide' },
  { id: 'contact-us', label: 'Contact Us', to: '/support/contact-us' },
]

function StoreFooter({ onCategorySelect }) {
  const menCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', 'All Shirts', 'Cargoes', 'Active Wear', 'Hoodies & Jackets']
  const womenCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', "Saree's", 'Kurtas & Suits', 'Formals', 'Active Wear']
  const kidsCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', 'Jeans', 'Shirts', 'Formals', 'Party Wear']

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const renderCategoryAction = (category) => {
    if (typeof onCategorySelect === 'function') {
      return (
        <button
          className="transition hover:text-white"
          onClick={() => {
            onCategorySelect(category)
            scrollToPageTop()
          }}
          type="button"
        >
          {category}
        </button>
      )
    }

    return category
  }

  return (
    <footer className="bg-[#1f2024] text-[#d6d6d6]">
      <div className="grid w-full gap-10 px-7 py-14 md:grid-cols-[1.35fr_.75fr_.7fr_1.4fr]">
        <section>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-[#a5a5a5]">
            Ember is where modern design meets timeless expression. Crafted for those who value subtle luxury, every piece
            reflects confidence, individuality, and effortless style.
          </p>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-[37px] text-white">Our Socials</h3>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-[#8f8f8f] text-[15px] uppercase text-[#bababa] transition duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white"
                href={social.href}
                key={social.id}
                rel="noreferrer"
                target="_blank"
              >
                {social.label}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-5 font-serif text-[37px] text-white">Support</h3>
          <ul className="space-y-2 text-[17px] text-[#b6b6b6]">
            {supportLinks.map((item) => (
              <li key={item.id}>
                <Link
                  className="transition hover:text-white"
                  onClick={scrollToPageTop}
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
              {menCategories.map((category) => (
                <li key={`men-${category}`}>{renderCategoryAction(category)}</li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li className="text-white">Women</li>
              {womenCategories.map((category) => (
                <li key={`women-${category}`}>{renderCategoryAction(category)}</li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li className="text-white">Kids</li>
              {kidsCategories.map((category) => (
                <li key={`kids-${category}`}>{renderCategoryAction(category)}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <p className="px-7 pb-5 pt-2 font-serif text-[170px] leading-[0.8] text-white/10">Ember</p>
    </footer>
  )
}

export default StoreFooter
