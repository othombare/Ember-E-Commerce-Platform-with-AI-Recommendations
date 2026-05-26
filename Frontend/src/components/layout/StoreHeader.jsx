import { useEffect, useMemo, useState } from 'react'
import emberLogo from '../../assets/branding/ember-logo.svg'

const headerLinks = [
  { id: 'Men', label: 'Men', isCategoryTab: true },
  { id: 'Women', label: 'Women', isCategoryTab: true },
  { id: 'Kids', label: 'Kids', isCategoryTab: true },
  { id: 'genz', label: 'GenZ', isCategoryTab: false },
  { id: 'new-collections', label: 'New Collections', isCategoryTab: false },
  { id: 'ai-recommendations', label: 'AI Recommendation', isCategoryTab: false },
]

function IconButton({ badge = null, children, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#1f1f1f] transition duration-200 hover:-translate-y-0.5 hover:border-[#cfcfcf] hover:bg-[#f3f3f3]"
      onClick={onClick}
      type="button"
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#1f2125] px-1 text-center text-[10px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function AccountMenu({ items, onItemClick }) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] rounded-2xl border border-[#dce2ea] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.14)]">
      <p className="px-2 text-[18px] font-semibold text-[#1f2933]">Your Account</p>
      <div className="mt-2 space-y-1">
        {items.map((item) => (
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[13px] text-[#2f3742] transition hover:bg-[#f6f8fb] ${
              item.id === 'logout' ? 'mt-2 border-t border-[#eceff4] pt-3' : ''
            }`}
            key={item.id}
            onClick={() => onItemClick(item)}
            type="button"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d2d8e2] text-[13px] text-[#374151]">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function StoreHeader({
  activeCategory = null,
  activeNavLink = '',
  cartCount = 0,
  categoryCatalog = {},
  isCategoryPanelOpen = false,
  onCategoryCardSelect,
  onCategoryTabToggle,
  onLogoClick,
  onLogout,
  onNavLinkSelect,
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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

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

  const handleBecomeSeller = () => {
    if (typeof onNavLinkSelect === 'function') {
      onNavLinkSelect('become-seller')
    }
    setIsAccountMenuOpen(false)
  }

  const accountMenuItems = useMemo(
    () => [
      {
        icon: 'P',
        id: 'profile',
        label: 'My Profile',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('profile')
          }
        },
      },
      {
        icon: 'O',
        id: 'orders',
        label: 'Orders',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('orders')
          }
        },
      },
      {
        icon: 'C',
        id: 'coupons',
        label: 'Coupons',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('profile')
          }
        },
      },
      {
        icon: 'S',
        id: 'supercoin',
        label: 'Supercoin',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('profile')
          }
        },
      },
      {
        icon: 'W',
        id: 'wallet',
        label: 'Saved Cards & Wallet',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('profile')
          }
        },
      },
      {
        icon: 'A',
        id: 'addresses',
        label: 'Saved Addresses',
        onClick: () => {
          if (typeof onOpenProfile === 'function') {
            onOpenProfile('addresses')
          }
        },
      },
      {
        icon: 'L',
        id: 'wishlist',
        label: 'Wishlist',
        onClick: () => {
          if (typeof onOpenFavourites === 'function') {
            onOpenFavourites()
          }
        },
      },
      {
        icon: 'N',
        id: 'notifications',
        label: 'Notifications',
        onClick: () => {
          if (typeof onOpenNotifications === 'function') {
            onOpenNotifications()
          }
        },
      },
      {
        icon: 'X',
        id: 'logout',
        label: 'Logout',
        onClick: () => {
          if (typeof onLogout === 'function') {
            onLogout()
          }
        },
      },
    ],
    [onLogout, onOpenFavourites, onOpenNotifications, onOpenProfile],
  )

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return
    }

    const closeOnOutsideClick = (event) => {
      if (!(event.target instanceof Element)) {
        return
      }

      if (!event.target.closest('[data-account-menu-wrapper="true"]')) {
        setIsAccountMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [isAccountMenuOpen])

  return (
    <section className="border border-[#dadada] bg-white">
      <div className="flex items-center gap-4 px-6 py-3">
        {typeof onLogoClick === 'function' ? (
          <button className="shrink-0" onClick={onLogoClick} type="button">
            <img alt="Ember logo" className="h-8 w-auto object-contain" src={emberLogo} />
          </button>
        ) : (
          <img alt="Ember logo" className="h-8 w-auto object-contain" src={emberLogo} />
        )}
        <nav className="hidden items-center gap-8 text-[17px] font-medium text-[#2e2e2e] lg:flex">
          {headerLinks.map((link) => {
            const isActive = link.isCategoryTab
              ? isCategoryPanelOpen && link.label === activeCategory
              : activeNavLink === link.id

            return (
              <button
                className={`${
                  isActive ? 'text-black' : 'text-[#2e2e2e]'
                } relative transition duration-200 hover:text-black after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#1f1f1f] after:transition-transform after:duration-200 hover:after:scale-x-100`}
                key={link.id}
                onClick={() => {
                  if (link.isCategoryTab && typeof onCategoryTabToggle === 'function') {
                    onCategoryTabToggle(link.label)
                    return
                  }

                  if (!link.isCategoryTab && typeof onNavLinkSelect === 'function') {
                    onNavLinkSelect(link.id)
                  }
                }}
                type="button"
              >
                {link.label}
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

          <IconButton badge={cartCount > 0 ? String(Math.min(cartCount, 99)) : null} label="Cart" onClick={onOpenCart}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M3 4h2l2.1 10.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.75L20 7H7.2" strokeLinecap="round" />
            </svg>
          </IconButton>

          {showAuthActions ? (
            <div className="relative hidden items-center gap-2 lg:flex" data-account-menu-wrapper="true">
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1 text-[13px] text-[#31353b] transition hover:bg-[#f3f5f8]"
                onClick={() => setIsAccountMenuOpen((previous) => !previous)}
                type="button"
              >
                <span>Hi, {userName}</span>
                <svg className="h-3 w-3 text-[#4b5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                className="h-9 rounded-sm border border-[#d5b800] bg-[#f9d400] px-3 text-[12px] font-semibold text-[#1f1f1f] transition duration-200 hover:bg-[#ffd400]"
                onClick={handleBecomeSeller}
                type="button"
              >
                Become Seller
              </button>

              {isAccountMenuOpen ? (
                <AccountMenu
                  items={accountMenuItems}
                  onItemClick={(item) => {
                    item.onClick()
                    setIsAccountMenuOpen(false)
                  }}
                />
              ) : null}
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
        <div
          className="relative mx-6 mb-3 mt-1 flex items-center justify-between rounded-md border border-[#dfdfdf] bg-[#f8f8f8] px-3 py-2 text-[12px] text-[#5f5f5f] lg:hidden"
          data-account-menu-wrapper="true"
        >
          <button className="flex items-center gap-1 text-[12px] text-[#31353b]" onClick={() => setIsAccountMenuOpen((previous) => !previous)} type="button">
            Hi, {userName}
            <svg className="h-3 w-3 text-[#4b5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <button
              className="rounded border border-[#d5b800] bg-[#f9d400] px-2.5 py-1 text-[11px] font-medium text-[#1f1f1f]"
              onClick={handleBecomeSeller}
              type="button"
            >
              Become Seller
            </button>
          </div>

          {isAccountMenuOpen ? (
            <AccountMenu
              items={accountMenuItems}
              onItemClick={(item) => {
                item.onClick()
                setIsAccountMenuOpen(false)
              }}
            />
          ) : null}
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
