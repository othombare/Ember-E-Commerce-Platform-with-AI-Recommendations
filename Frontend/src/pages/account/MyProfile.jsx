import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useOrdersStore from '../../store/ordersStore'
import {
  createEmptyAddressDraft,
  formatAddressSingleLine,
  isAddressDraftValid,
  normalizeAddressDraft,
  normalizeAddresses,
} from '../../utils/profile'
import { toCategoryRoute } from '../../utils/category'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

const faqEntries = [
  {
    id: 'faq-1',
    answer:
      "Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).",
    question: 'What happens when I update my email address (or mobile number)?',
  },
  {
    id: 'faq-2',
    answer:
      'It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.',
    question: 'When will my account be updated with the new email address (or mobile number)?',
  },
  {
    id: 'faq-3',
    answer:
      "Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional.",
    question: 'What happens to my existing account when I update my email address (or mobile number)?',
  },
  {
    id: 'faq-4',
    answer: "Changes will reflect in your seller account as well once you submit or update seller onboarding details.",
    question: 'Does my seller account get affected when I update my email address?',
  },
]

function splitName(name) {
  const normalizedName = String(name ?? '').trim()
  if (!normalizedName) {
    return {
      firstName: '',
      lastName: '',
    }
  }

  const parts = normalizedName.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

function buildFullName(firstName, lastName) {
  return `${String(firstName ?? '').trim()} ${String(lastName ?? '').trim()}`.replace(/\s+/g, ' ').trim()
}

function formatOrderDate(dateValue) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function orderBelongsToUser(order, user) {
  const userId = String(user?.id ?? '').trim()
  const userEmail = String(user?.email ?? '').trim().toLowerCase()
  const orderUserId = String(order?.user?.id ?? '').trim()
  const orderUserEmail = String(order?.user?.email ?? '').trim().toLowerCase()

  if (userId && orderUserId) {
    return userId === orderUserId
  }

  if (userEmail && orderUserEmail) {
    return userEmail === orderUserEmail
  }

  return false
}

function paymentSummary(order) {
  const method = String(order?.payment?.method ?? '').toUpperCase()
  const channel = String(order?.payment?.channel ?? '').toUpperCase()
  const status = String(order?.payment?.status ?? '').trim()

  if (!method) {
    return 'Payment details not available'
  }

  const statusLabel = status ? ` (${status})` : ''
  if (method === 'ONLINE') {
    return `Online - ${channel || 'UPI'}${statusLabel}`
  }

  return `Cash on Delivery${statusLabel}`
}

function MyProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const orders = useOrdersStore((state) => state.orders)
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)
  const initialSection = useMemo(() => {
    const queryParams = new URLSearchParams(location.search)
    const section = queryParams.get('section')
    if (section === 'orders' || section === 'addresses' || section === 'pan') {
      return section
    }

    return 'profile'
  }, [location.search])
  const [activeAccountSection, setActiveAccountSection] = useState(initialSection)

  const [profileDraft, setProfileDraft] = useState(() => {
    const nameParts = splitName(user?.name)
    return {
      email: user?.email ?? '',
      firstName: nameParts.firstName,
      gender: user?.gender || 'Male',
      lastName: nameParts.lastName,
      phone: user?.phone ?? '',
    }
  })
  const [profileStatus, setProfileStatus] = useState('')
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isPersonalEdit, setIsPersonalEdit] = useState(false)
  const [isEmailEdit, setIsEmailEdit] = useState(false)
  const [isPhoneEdit, setIsPhoneEdit] = useState(false)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressDraft, setAddressDraft] = useState(createEmptyAddressDraft)
  const [addressError, setAddressError] = useState('')
  const [addressStatus, setAddressStatus] = useState('')
  const [isAddressSaving, setIsAddressSaving] = useState(false)

  const checkoutSuccessOrderId = location.state?.orderPlaced ? location.state?.orderId : null
  const addresses = useMemo(() => normalizeAddresses(user?.addresses ?? []), [user?.addresses])
  const myOrders = useMemo(() => orders.filter((order) => orderBelongsToUser(order, user)), [orders, user])

  useEffect(() => {
    const nameParts = splitName(user?.name)
    setProfileDraft({
      email: user?.email ?? '',
      firstName: nameParts.firstName,
      gender: user?.gender || 'Male',
      lastName: nameParts.lastName,
      phone: user?.phone ?? '',
    })
  }, [user?.email, user?.gender, user?.name, user?.phone])

  useEffect(() => {
    setActiveAccountSection(initialSection)
  }, [initialSection])

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleOpenCategoryPage = (categoryLabel) => {
    navigate(toCategoryRoute(categoryLabel))
  }

  const handleSearchSubmit = () => {
    navigate(toSearchResultsRoute(searchText))
  }

  const handleCategoryTabToggle = (category) => {
    if (activeCategory === category && isCategoryPanelOpen) {
      setIsCategoryPanelOpen(false)
      return
    }

    setActiveCategory(category)
    setIsCategoryPanelOpen(true)
  }

  const handleHeaderNavSelect = (navId) => {
    const route = getSpecialHeaderRoute(navId)
    if (route) {
      navigate(route)
    }
  }

  const saveProfile = async (nextDraft = profileDraft) => {
    const response = await api.patch('/api/auth/me', {
      addresses,
      email: nextDraft.email,
      gender: nextDraft.gender,
      name: buildFullName(nextDraft.firstName, nextDraft.lastName),
      phone: nextDraft.phone,
    })

    const nextUser = response.data?.user
    if (nextUser) {
      setUser(nextUser)
    }
  }

  const handleProfileFieldChange = (field, value) => {
    setProfileDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSavePersonalInfo = async () => {
    if (!profileDraft.firstName.trim()) {
      setProfileStatus('First name is required.')
      return
    }

    if (!profileDraft.email.trim()) {
      setProfileStatus('Email is required.')
      return
    }

    setIsProfileSaving(true)
    setProfileStatus('')

    try {
      await saveProfile()
      setIsPersonalEdit(false)
      setProfileStatus('Personal information updated successfully.')
    } catch (error) {
      setProfileStatus(`Could not update personal information: ${error.message}`)
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handleSaveEmail = async () => {
    if (!profileDraft.email.trim()) {
      setProfileStatus('Email is required.')
      return
    }

    setIsProfileSaving(true)
    setProfileStatus('')

    try {
      await saveProfile()
      setIsEmailEdit(false)
      setProfileStatus('Email address updated successfully.')
    } catch (error) {
      setProfileStatus(`Could not update email address: ${error.message}`)
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handleSavePhone = async () => {
    setIsProfileSaving(true)
    setProfileStatus('')

    try {
      await saveProfile()
      setIsPhoneEdit(false)
      setProfileStatus('Mobile number updated successfully.')
    } catch (error) {
      setProfileStatus(`Could not update mobile number: ${error.message}`)
    } finally {
      setIsProfileSaving(false)
    }
  }

  const updateAddressDraftField = (fieldName, value) => {
    setAddressDraft((previous) => ({
      ...previous,
      [fieldName]: value,
    }))
  }

  const handleAddAddress = async (event) => {
    event.preventDefault()
    setAddressStatus('')

    if (!isAddressDraftValid(addressDraft)) {
      setAddressError('Please complete line 1, city, state, and pincode.')
      return
    }

    setAddressError('')
    setIsAddressSaving(true)

    try {
      const normalizedDraft = normalizeAddressDraft({
        ...addressDraft,
        id: `addr_${Date.now()}`,
      })

      const nextAddresses = normalizeAddresses([
        ...addresses,
        addresses.length === 0 ? { ...normalizedDraft, isDefault: true } : normalizedDraft,
      ])

      const response = await api.patch('/api/auth/me', {
        addresses: nextAddresses,
        email: profileDraft.email,
        gender: profileDraft.gender,
        name: buildFullName(profileDraft.firstName, profileDraft.lastName),
        phone: profileDraft.phone,
      })

      const nextUser = response.data?.user
      if (nextUser) {
        setUser(nextUser)
      }

      setAddressDraft(createEmptyAddressDraft())
      setShowAddressForm(false)
      setAddressStatus('Address added successfully.')
    } catch (error) {
      setAddressStatus(`Could not add address: ${error.message}`)
    } finally {
      setIsAddressSaving(false)
    }
  }

  const handleRemoveAddress = async (addressId) => {
    setAddressStatus('')
    setIsAddressSaving(true)

    try {
      const nextAddresses = normalizeAddresses(addresses.filter((address) => address.id !== addressId))
      const response = await api.patch('/api/auth/me', {
        addresses: nextAddresses,
        email: profileDraft.email,
        gender: profileDraft.gender,
        name: buildFullName(profileDraft.firstName, profileDraft.lastName),
        phone: profileDraft.phone,
      })

      const nextUser = response.data?.user
      if (nextUser) {
        setUser(nextUser)
      }

      setAddressStatus('Address removed successfully.')
    } catch (error) {
      setAddressStatus(`Could not remove address: ${error.message}`)
    } finally {
      setIsAddressSaving(false)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    setAddressStatus('')
    setIsAddressSaving(true)

    try {
      const nextAddresses = normalizeAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        })),
      )
      const response = await api.patch('/api/auth/me', {
        addresses: nextAddresses,
        email: profileDraft.email,
        gender: profileDraft.gender,
        name: buildFullName(profileDraft.firstName, profileDraft.lastName),
        phone: profileDraft.phone,
      })

      const nextUser = response.data?.user
      if (nextUser) {
        setUser(nextUser)
      }

      setAddressStatus('Default address updated successfully.')
    } catch (error) {
      setAddressStatus(`Could not update default address: ${error.message}`)
    } finally {
      setIsAddressSaving(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#dfe2e7] text-[#202020]">
      <div className="w-full min-h-screen bg-[#eef1f4]">
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
          onOpenWishlist={() => navigate('/wishlist')}
          onOpenNotifications={() => navigate('/notifications')}
          onOpenProfile={(section = 'profile') => navigate(section === 'profile' ? '/my-profile' : '/my-profile?section=' + section)}
          onSearchChange={setSearchText}
          onSearchSubmit={handleSearchSubmit}
          searchText={searchText}
          userName={user?.name ?? 'Shopper'}
        />

        <section className="px-4 py-5 sm:px-8">
          <div className="mx-auto grid max-w-[1480px] gap-4 lg:grid-cols-[370px_1fr]">
            <aside className="space-y-4">
              <article className="border border-[#e2e6ea] bg-white px-5 py-4">
                <p className="text-[12px] text-[#8c8f92]">Hello,</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d7ecff] text-[#2874f0]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[22px] font-semibold leading-none text-[#1f1f1f]">{user?.name ?? 'Shopper'}</p>
                </div>
              </article>

              <article className="border border-[#e2e6ea] bg-white">
                <button
                  className={`flex w-full items-center justify-between px-5 py-5 text-left text-[24px] font-semibold ${
                    activeAccountSection === 'orders' ? 'bg-[#edf3ff] text-[#2874f0]' : 'text-[#6c7177]'
                  }`}
                  onClick={() => setActiveAccountSection('orders')}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <svg className="h-6 w-6 text-[#2874f0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 8h16v12H4z" opacity=".25" />
                      <path d="M7 4h10v4H7zm5 7a2.8 2.8 0 0 0-2.8 2.8A2.8 2.8 0 0 0 12 16.6a2.8 2.8 0 0 0 2.8-2.8A2.8 2.8 0 0 0 12 11z" />
                    </svg>
                    MY ORDERS
                  </span>
                  <span className="text-[#9aa0a6]">{'>'}</span>
                </button>
              </article>

              <article className="border border-[#e2e6ea] bg-white">
                <div className="border-b border-[#eceff2] px-5 py-4">
                  <p className="flex items-center gap-3 text-[22px] font-semibold text-[#6c7177]">
                    <svg className="h-6 w-6 text-[#2874f0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.86 0-7 1.79-7 4v2h14v-2c0-2.21-3.14-4-7-4Z" />
                    </svg>
                    ACCOUNT SETTINGS
                  </p>
                </div>
                <div className="space-y-1 px-5 py-3 text-[16px]">
                  <button
                    className={`block w-full rounded px-2 py-2 text-left ${
                      activeAccountSection === 'profile'
                        ? 'bg-[#edf3ff] font-semibold text-[#2874f0]'
                        : 'text-[#24292e] hover:bg-[#f7f9fb]'
                    }`}
                    onClick={() => setActiveAccountSection('profile')}
                    type="button"
                  >
                    Profile Information
                  </button>
                  <button
                    className={`block w-full rounded px-2 py-2 text-left ${
                      activeAccountSection === 'addresses'
                        ? 'bg-[#edf3ff] font-semibold text-[#2874f0]'
                        : 'text-[#24292e] hover:bg-[#f7f9fb]'
                    }`}
                    onClick={() => setActiveAccountSection('addresses')}
                    type="button"
                  >
                    Manage Addresses
                  </button>
                  <button
                    className={`block w-full rounded px-2 py-2 text-left ${
                      activeAccountSection === 'pan'
                        ? 'bg-[#edf3ff] font-semibold text-[#2874f0]'
                        : 'text-[#24292e] hover:bg-[#f7f9fb]'
                    }`}
                    onClick={() => setActiveAccountSection('pan')}
                    type="button"
                  >
                    PAN Card Information
                  </button>
                </div>
              </article>

              <article className="border border-[#e2e6ea] bg-white">
                <div className="border-b border-[#eceff2] px-5 py-4">
                  <p className="flex items-center gap-3 text-[22px] font-semibold text-[#6c7177]">
                    <svg className="h-6 w-6 text-[#2874f0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 5h18v14H3zm3 3v8h4V8zm6 0v2h6V8zm0 4v4h6v-4z" />
                    </svg>
                    PAYMENTS
                  </p>
                </div>
                <div className="space-y-1 px-7 py-4 text-[16px] text-[#20252a]">
                  <button
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/account/gift-cards')}
                    type="button"
                  >
                    <span>Gift Cards</span>
                    <span className="font-semibold text-[#2f9341]">Rs 0</span>
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/account/saved-upi')}
                    type="button"
                  >
                    Saved UPI
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/account/saved-cards')}
                    type="button"
                  >
                    Saved Cards
                  </button>
                </div>
              </article>

              <article className="border border-[#e2e6ea] bg-white">
                <div className="border-b border-[#eceff2] px-5 py-4">
                  <p className="flex items-center gap-3 text-[22px] font-semibold text-[#6c7177]">
                    <svg className="h-6 w-6 text-[#2874f0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    MY STUFF
                  </p>
                </div>
                <div className="space-y-1 px-7 py-4 text-[16px] text-[#20252a]">
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/account/coupons')}
                    type="button"
                  >
                    My Coupons
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/account/reviews')}
                    type="button"
                  >
                    My Reviews & Ratings
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/notifications')}
                    type="button"
                  >
                    All Notifications
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/wishlist')}
                    type="button"
                  >
                    My Wishlist
                  </button>
                  <button
                    className="block w-full rounded px-2 py-1 text-left transition hover:bg-[#f7f9fb]"
                    onClick={() => navigate('/become-seller')}
                    type="button"
                  >
                    Become Seller
                  </button>
                </div>
              </article>

              <article className="border border-[#e2e6ea] bg-white">
                <button
                  className="flex w-full items-center gap-3 px-5 py-5 text-left text-[24px] font-semibold text-[#6c7177]"
                  onClick={handleLogout}
                  type="button"
                >
                  <svg className="h-6 w-6 text-[#2874f0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2v10" strokeLinecap="round" />
                    <path d="M7.8 4.7a9 9 0 1 0 8.4 0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Logout
                </button>
              </article>

              <article className="border border-[#e2e6ea] bg-white px-5 py-4">
                <p className="text-[16px] font-semibold text-[#20252a]">Frequently Visited:</p>
                <div className="mt-3 flex flex-wrap gap-4 text-[14px] text-[#6f757a]">
                  <button className="transition hover:text-[#2874f0]" onClick={() => navigate('/my-profile?section=orders')} type="button">
                    Track Order
                  </button>
                  <button className="transition hover:text-[#2874f0]" onClick={() => navigate('/support/contact-us')} type="button">
                    Help Center
                  </button>
                </div>
              </article>
            </aside>

            <section className="border border-[#e2e6ea] bg-white p-5 sm:p-8">
              {checkoutSuccessOrderId ? (
                <div className="mb-5 rounded border border-[#d7ead1] bg-[#f3fbf0] px-4 py-3 text-[14px] text-[#2f5a2f]">
                  Order placed successfully. Order ID: {checkoutSuccessOrderId}. Shipping and tracking updates will appear in My Orders.
                </div>
              ) : null}

              {activeAccountSection === 'profile' ? (
                <div>
                  <section className="border-b border-[#eceff2] pb-8">
                    <div className="flex items-center gap-4">
                      <h1 className="text-[24px] font-semibold text-[#20252a]">Personal Information</h1>
                      <button
                        className="text-[16px] font-medium text-[#2874f0] transition hover:text-[#0c63f3]"
                        onClick={() => setIsPersonalEdit((previous) => !previous)}
                        type="button"
                      >
                        {isPersonalEdit ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <input
                        className="h-12 border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34] disabled:bg-[#f8f9fb] disabled:text-[#6c7278]"
                        disabled={!isPersonalEdit}
                        onChange={(event) => handleProfileFieldChange('firstName', event.target.value)}
                        placeholder="First name"
                        type="text"
                        value={profileDraft.firstName}
                      />
                      <input
                        className="h-12 border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34] disabled:bg-[#f8f9fb] disabled:text-[#6c7278]"
                        disabled={!isPersonalEdit}
                        onChange={(event) => handleProfileFieldChange('lastName', event.target.value)}
                        placeholder="Last name"
                        type="text"
                        value={profileDraft.lastName}
                      />
                    </div>

                    <p className="mt-6 text-[16px] text-[#20252a]">Your Gender</p>
                    <div className="mt-3 flex flex-wrap gap-8 text-[16px] text-[#4f555b]">
                      <label className="flex items-center gap-2">
                        <input
                          checked={profileDraft.gender === 'Male'}
                          className="h-4 w-4 accent-[#2874f0]"
                          disabled={!isPersonalEdit}
                          onChange={() => handleProfileFieldChange('gender', 'Male')}
                          type="radio"
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          checked={profileDraft.gender === 'Female'}
                          className="h-4 w-4 accent-[#2874f0]"
                          disabled={!isPersonalEdit}
                          onChange={() => handleProfileFieldChange('gender', 'Female')}
                          type="radio"
                        />
                        Female
                      </label>
                    </div>

                    {isPersonalEdit ? (
                      <button
                        className="mt-5 h-11 rounded-sm bg-[#2874f0] px-5 text-[14px] font-medium text-white transition hover:bg-[#0c63f3] disabled:opacity-70"
                        disabled={isProfileSaving}
                        onClick={handleSavePersonalInfo}
                        type="button"
                      >
                        {isProfileSaving ? 'Saving...' : 'Save'}
                      </button>
                    ) : null}
                  </section>

                  <section className="border-b border-[#eceff2] py-8">
                    <div className="flex items-center gap-4">
                      <h2 className="text-[26px] font-semibold text-[#20252a]">Email Address</h2>
                      <button
                        className="text-[16px] font-medium text-[#2874f0] transition hover:text-[#0c63f3]"
                        onClick={() => setIsEmailEdit((previous) => !previous)}
                        type="button"
                      >
                        {isEmailEdit ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    <input
                      className="mt-5 h-12 w-full max-w-[520px] border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34] disabled:bg-[#f8f9fb] disabled:text-[#6c7278]"
                      disabled={!isEmailEdit}
                      onChange={(event) => handleProfileFieldChange('email', event.target.value)}
                      type="email"
                      value={profileDraft.email}
                    />

                    {isEmailEdit ? (
                      <button
                        className="mt-5 h-11 rounded-sm bg-[#2874f0] px-5 text-[14px] font-medium text-white transition hover:bg-[#0c63f3] disabled:opacity-70"
                        disabled={isProfileSaving}
                        onClick={handleSaveEmail}
                        type="button"
                      >
                        {isProfileSaving ? 'Saving...' : 'Save Email'}
                      </button>
                    ) : null}
                  </section>

                  <section className="border-b border-[#eceff2] py-8">
                    <div className="flex items-center gap-4">
                      <h2 className="text-[26px] font-semibold text-[#20252a]">Mobile Number</h2>
                      <button
                        className="text-[16px] font-medium text-[#2874f0] transition hover:text-[#0c63f3]"
                        onClick={() => setIsPhoneEdit((previous) => !previous)}
                        type="button"
                      >
                        {isPhoneEdit ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    <input
                      className="mt-5 h-12 w-full max-w-[520px] border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34] disabled:bg-[#f8f9fb] disabled:text-[#6c7278]"
                      disabled={!isPhoneEdit}
                      onChange={(event) => handleProfileFieldChange('phone', event.target.value)}
                      placeholder="+91 98XXXXXX20"
                      type="text"
                      value={profileDraft.phone}
                    />

                    {isPhoneEdit ? (
                      <button
                        className="mt-5 h-11 rounded-sm bg-[#2874f0] px-5 text-[14px] font-medium text-white transition hover:bg-[#0c63f3] disabled:opacity-70"
                        disabled={isProfileSaving}
                        onClick={handleSavePhone}
                        type="button"
                      >
                        {isProfileSaving ? 'Saving...' : 'Save Mobile'}
                      </button>
                    ) : null}
                  </section>

                  <section className="py-8">
                    <h2 className="text-[26px] font-semibold text-[#20252a]">FAQs</h2>
                    <div className="mt-5 space-y-5">
                      {faqEntries.map((entry) => (
                        <article key={entry.id}>
                          <p className="text-[18px] font-semibold text-[#171b1f]">{entry.question}</p>
                          <p className="mt-2 text-[16px] leading-relaxed text-[#2f3338]">{entry.answer}</p>
                        </article>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-6">
                      <button className="text-[18px] font-medium text-[#2874f0] transition hover:text-[#0c63f3]" type="button">
                        Deactivate Account
                      </button>
                      <button className="text-[18px] font-medium text-[#ea2a73] transition hover:text-[#ce145a]" type="button">
                        Delete Account
                      </button>
                    </div>
                  </section>
                </div>
              ) : null}

              {activeAccountSection === 'orders' ? (
                <section>
                  <div className="flex items-center justify-between border-b border-[#eceff2] pb-4">
                    <h1 className="text-[24px] font-semibold text-[#20252a]">My Orders</h1>
                    <p className="text-[13px] text-[#616870]">{myOrders.length} order(s)</p>
                  </div>

                  {myOrders.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {myOrders.map((order) => (
                        <article className="border border-[#e2e6ea] bg-[#f7f9fb] p-4" key={order.id}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[16px] font-semibold text-[#20252a]">Order ID: {order.id}</p>
                            <p className="text-[12px] text-[#5d6570]">{formatOrderDate(order.createdAt)}</p>
                          </div>
                          <div className="mt-2 grid gap-2 text-[13px] text-[#3e4650] sm:grid-cols-2">
                            <p>Status: {order.status ?? 'Placed'}</p>
                            <p>Total: Rs {order.total}</p>
                            <p>Items: {order.itemCount ?? order.items?.length ?? 0}</p>
                            <p>Payment: {paymentSummary(order)}</p>
                          </div>
                          {order.items?.length > 0 ? (
                            <p className="mt-2 truncate text-[12px] text-[#5d6570]">
                              Products: {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded border border-[#dce2ea] bg-[#f7f9fb] p-5 text-center">
                      <p className="text-[15px] text-[#57606b]">No orders found yet.</p>
                      <button
                        className="mt-3 h-10 rounded-sm bg-[#2874f0] px-4 text-[13px] font-medium text-white transition hover:bg-[#0c63f3]"
                        onClick={() => navigate('/products')}
                        type="button"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </section>
              ) : null}

              {activeAccountSection === 'addresses' ? (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceff2] pb-4">
                    <h1 className="text-[24px] font-semibold text-[#20252a]">Manage Addresses</h1>
                    <button
                      className="h-11 rounded-sm border border-[#d2d8dd] bg-white px-4 text-[14px] text-[#20252a] transition hover:bg-[#f5f8fb]"
                      onClick={() => {
                        setShowAddressForm((previous) => !previous)
                        setAddressError('')
                      }}
                      type="button"
                    >
                      {showAddressForm ? 'Close Form' : 'Add New Address'}
                    </button>
                  </div>

                  {addresses.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {addresses.map((address) => (
                        <article className="border border-[#e2e6ea] bg-[#f7f9fb] p-4" key={address.id}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[16px] font-semibold text-[#20252a]">
                              {address.label}
                              {address.isDefault ? <span className="ml-2 text-[11px] text-[#2f9341]">Default</span> : null}
                            </p>
                            <div className="flex items-center gap-3">
                              {!address.isDefault ? (
                                <button
                                  className="text-[12px] font-medium text-[#2874f0] transition hover:text-[#0c63f3]"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  type="button"
                                >
                                  Set Default
                                </button>
                              ) : null}
                              <button
                                className="text-[12px] font-medium text-[#ce3131] transition hover:text-[#b11616]"
                                onClick={() => handleRemoveAddress(address.id)}
                                type="button"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-[15px] text-[#2f3439]">{address.fullName || user?.name || 'Shopper'}</p>
                          <p className="mt-1 text-[14px] text-[#4f555b]">{formatAddressSingleLine(address)}</p>
                          {address.phone ? <p className="mt-1 text-[14px] text-[#4f555b]">Phone: {address.phone}</p> : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-[16px] text-[#5e646a]">No saved addresses yet.</p>
                  )}

                  {showAddressForm ? (
                    <form className="mt-5 grid gap-3 border-t border-[#eceff2] pt-5" onSubmit={handleAddAddress}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-[13px] text-[#3f4449]">
                          Address Label
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('label', event.target.value)}
                            type="text"
                            value={addressDraft.label}
                          />
                        </label>
                        <label className="text-[13px] text-[#3f4449]">
                          Full Name
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('fullName', event.target.value)}
                            type="text"
                            value={addressDraft.fullName}
                          />
                        </label>
                      </div>

                      <label className="text-[13px] text-[#3f4449]">
                        Phone
                        <input
                          className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                          onChange={(event) => updateAddressDraftField('phone', event.target.value)}
                          type="text"
                          value={addressDraft.phone}
                        />
                      </label>

                      <label className="text-[13px] text-[#3f4449]">
                        Address Line 1
                        <input
                          className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                          onChange={(event) => updateAddressDraftField('line1', event.target.value)}
                          type="text"
                          value={addressDraft.line1}
                        />
                      </label>

                      <label className="text-[13px] text-[#3f4449]">
                        Address Line 2 (Optional)
                        <input
                          className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                          onChange={(event) => updateAddressDraftField('line2', event.target.value)}
                          type="text"
                          value={addressDraft.line2}
                        />
                      </label>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <label className="text-[13px] text-[#3f4449]">
                          City
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('city', event.target.value)}
                            type="text"
                            value={addressDraft.city}
                          />
                        </label>
                        <label className="text-[13px] text-[#3f4449]">
                          State
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('state', event.target.value)}
                            type="text"
                            value={addressDraft.state}
                          />
                        </label>
                        <label className="text-[13px] text-[#3f4449]">
                          Pincode
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('pincode', event.target.value)}
                            type="text"
                            value={addressDraft.pincode}
                          />
                        </label>
                        <label className="text-[13px] text-[#3f4449]">
                          Country
                          <input
                            className="mt-1 h-12 w-full border border-[#d6dbe0] px-4 text-[16px] text-[#2a2f34]"
                            onChange={(event) => updateAddressDraftField('country', event.target.value)}
                            type="text"
                            value={addressDraft.country}
                          />
                        </label>
                      </div>

                      <label className="flex items-center gap-2 text-[13px] text-[#3f4449]">
                        <input
                          checked={addressDraft.isDefault}
                          className="h-4 w-4 accent-[#2874f0]"
                          onChange={(event) => updateAddressDraftField('isDefault', event.target.checked)}
                          type="checkbox"
                        />
                        Make this my default address
                      </label>

                      {addressError ? <p className="text-[12px] text-[#b11616]">{addressError}</p> : null}

                      <button
                        className="h-11 rounded-sm bg-[#2874f0] px-5 text-[14px] font-medium text-white transition hover:bg-[#0c63f3] disabled:opacity-70"
                        disabled={isAddressSaving}
                        type="submit"
                      >
                        {isAddressSaving ? 'Saving...' : 'Save Address'}
                      </button>
                    </form>
                  ) : null}
                </section>
              ) : null}

              {activeAccountSection === 'pan' ? (
                <section>
                  <h1 className="text-[24px] font-semibold text-[#20252a]">PAN Card Information</h1>
                  <article className="mt-5 rounded border border-[#e2e6ea] bg-[#f7f9fb] p-5">
                    <p className="text-[16px] text-[#2f3439]">
                      PAN Number:{' '}
                      <span className="font-semibold text-[#20252a]">{user?.sellerProfile?.panNumber || 'Not added yet'}</span>
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#4f555b]">
                      PAN verification is part of seller onboarding. Continue to the Become Seller page to add or update tax and business
                      details.
                    </p>
                    <button
                      className="mt-5 h-11 rounded-sm bg-[#f9d400] px-5 text-[14px] font-medium text-[#1f1f1f] transition hover:bg-[#ffd400]"
                      onClick={() => navigate('/become-seller')}
                      type="button"
                    >
                      Go To Become Seller
                    </button>
                  </article>
                </section>
              ) : null}

              {profileStatus ? <p className="mt-5 text-[13px] text-[#2f5a2f]">{profileStatus}</p> : null}
              {addressStatus ? <p className="mt-5 text-[13px] text-[#2f5a2f]">{addressStatus}</p> : null}
            </section>
          </div>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default MyProfile


