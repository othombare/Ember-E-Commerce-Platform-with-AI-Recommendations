function StoreFooter({ onCategorySelect }) {
  const menCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', 'All Shirts', 'Cargoes', 'Active Wear', 'Hoodies & Jackets']
  const womenCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', "Saree's", 'Kurtas & Suits', 'Formals', 'Active Wear']
  const kidsCategories = ['T-shirts', 'Joggers', "Polo's", 'Shorts', 'Jeans', 'Shirts', 'Formals', 'Party Wear']

  const renderCategoryAction = (category) => {
    if (typeof onCategorySelect === 'function') {
      return (
        <button className="transition hover:text-white" onClick={() => onCategorySelect(category)} type="button">
          {category}
        </button>
      )
    }

    return category
  }

  return (
    <footer className="bg-[#1f2024] text-[#d6d6d6]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-7 py-14 md:grid-cols-[1.35fr_.75fr_.7fr_1.4fr]">
        <section>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-[#a5a5a5]">
            Ember is where modern design meets timeless expression. Crafted for those who value subtle luxury, every piece
            reflects confidence, individuality, and effortless style.
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
