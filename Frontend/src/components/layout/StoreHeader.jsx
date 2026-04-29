import emberLogo from '../../assets/home/ember-logo.png'

const headerLinks = ['Men', 'Women', 'Kids', 'GenZ', 'New Collections', 'Ai Recommendation']
const categoryTabs = ['Men', 'Women', 'Kids']

function IconButton({ children, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#1f1f1f] transition duration-200 hover:-translate-y-0.5 hover:border-[#cfcfcf] hover:bg-[#f3f3f3]"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function StoreHeader({
  activeCategory = null,
  categoryCatalog = {},
  isCategoryPanelOpen = false,
  onCategoryCardSelect,
  onCategoryTabToggle,
  onLogout,
  onOpenCart,
  onOpenFavourites,
  onOpenNotifications,
  onOpenProfile,
  onSearchChange,
  onSearchSubmit,
  searchText = '',
  userName = 'Shopper',
}) {
  const cards = isCategoryPanelOpen && activeCategory ? categoryCatalog[activeCategory] ?? [] : []
  const showAuthActions = typeof onLogout === 'function'

  const handleSearchSubmit = () => {
    if (typeof onSearchSubmit === 'function') {
      onSearchSubmit()
    }
  }

  const handleSearchChange = (event) => {
    if (typeof onSearchChange === 'function') {
      onSearchChange(event.target.value)
    }
  }

  return (
    <section className="border border-[#dadada] bg-white">
      <div className="flex items-center gap-4 px-6 py-3">
        <img alt="Ember logo" className="h-8 w-auto object-contain" src={emberLogo} />
        <nav className="hidden items-center gap-8 text-[17px] font-medium text-[#2e2e2e] lg:flex">
          {headerLinks.map((link) => {
            const isActive = isCategoryPanelOpen && link === activeCategory
            const isCategoryTab = categoryTabs.includes(link)

            return (
              <button
                className={`${
                  isActive ? 'text-black' : 'text-[#2e2e2e]'
                } relative transition duration-200 hover:text-black after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#1f1f1f] after:transition-transform after:duration-200 hover:after:scale-x-100`}
                key={link}
                onClick={() => {
                  if (isCategoryTab && typeof onCategoryTabToggle === 'function') {
                    onCategoryTabToggle(link)
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
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit()
                }
              }}
              placeholder="Search for your favorite brand"
              type="text"
              value={searchText}
            />
            <button className="text-[#707070]" onClick={handleSearchSubmit} type="button">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" />
              </svg>
            </button>
          </label>

          <IconButton label="Favourites" onClick={onOpenFavourites}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path
                d="m12 20-1.4-1.27C5.4 13.95 2 10.86 2 7.06A4.76 4.76 0 0 1 6.76 2.3c1.9 0 3.73.88 4.9 2.26A6.55 6.55 0 0 1 16.56 2.3 4.76 4.76 0 0 1 21.32 7.06c0 3.8-3.4 6.9-8.6 11.67L12 20Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>

          <IconButton label="Notifications" onClick={onOpenNotifications}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <path d="M6 9a6 6 0 1 1 12 0v4l1.5 2H4.5L6 13Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
            </svg>
          </IconButton>

          <IconButton label="My Profile" onClick={onOpenProfile}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
            </svg>
          </IconButton>

          <IconButton label="Cart" onClick={onOpenCart}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.1 10.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.75L20 7H7.2" strokeLinecap="round" />
            </svg>
          </IconButton>

          {showAuthActions ? (
            <div className="hidden items-center gap-2 lg:flex">
              <p className="text-[13px] text-[#5f5f5f]">Hi, {userName}</p>
              <button
                className="h-8 rounded-md bg-[#1f2125] px-3 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black"
                onClick={onLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <label className="mx-6 mb-3 mt-1 flex items-center border border-[#c8c8c8] bg-[#fbfbfb] px-3 md:hidden">
        <input
          className="h-10 w-full bg-transparent text-[14px] text-[#535353] outline-none placeholder:text-[#b5b5b5]"
          onChange={handleSearchChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearchSubmit()
            }
          }}
          placeholder="Search for your favorite brand"
          type="text"
          value={searchText}
        />
        <button className="text-[#707070]" onClick={handleSearchSubmit} type="button">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" />
          </svg>
        </button>
      </label>

      {showAuthActions ? (
        <div className="mx-6 mb-3 mt-1 flex items-center justify-between rounded-md border border-[#dfdfdf] bg-[#f8f8f8] px-3 py-2 text-[12px] text-[#5f5f5f] lg:hidden">
          <p>Hi, {userName}</p>
          <button className="rounded bg-[#1f2125] px-2.5 py-1 text-[11px] font-medium text-white" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      ) : null}

      {isCategoryPanelOpen ? (
        <div className="border-t border-[#e5e5e5] px-4 pb-3 pt-3">
          <div className="flex gap-5 overflow-x-auto pb-1">
            {cards.map((card) => (
              <article
                className="group min-w-[108px] cursor-pointer text-center"
                key={card.id}
                onClick={() => {
                  if (typeof onCategoryCardSelect === 'function') {
                    onCategoryCardSelect(card.label)
                  }
                }}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && typeof onCategoryCardSelect === 'function') {
                    event.preventDefault()
                    onCategoryCardSelect(card.label)
                  }
                }}
                role="button"
                tabIndex={0}
              >
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

export default StoreHeader
