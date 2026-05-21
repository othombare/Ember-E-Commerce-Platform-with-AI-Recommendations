import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useOrdersStore from '../../store/ordersStore'
import { toCategoryRoute } from '../../utils/category'
import {
  createEmptyAddressDraft,
  formatAddressSingleLine,
  isAddressDraftValid,
  normalizeAddressDraft,
  normalizeAddresses,
} from '../../utils/profile'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'

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
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))
  const orders = useOrdersStore((state) => state.orders)
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const [profileDraft, setProfileDraft] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  })
  const [profileStatus, setProfileStatus] = useState('')
  const [isProfileSaving, setIsProfileSaving] = useState(false)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressDraft, setAddressDraft] = useState(createEmptyAddressDraft)
  const [addressError, setAddressError] = useState('')
  const [addressStatus, setAddressStatus] = useState('')
  const [isAddressSaving, setIsAddressSaving] = useState(false)

  const checkoutSuccessOrderId = location.state?.orderPlaced ? location.state?.orderId : null

  const addresses = useMemo(() => normalizeAddresses(user?.addresses ?? []), [user?.addresses])
  const myOrders = useMemo(() => orders.filter((order) => orderBelongsToUser(order, user)), [orders, user])

  const saveProfile = async (payload) => {
    const response = await api.patch('/api/auth/me', payload)
    const nextUser = response.data?.user
    if (nextUser) {
      setUser(nextUser)
    }
    return nextUser
  }

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

  const handleProfileChange = (field, value) => {
    setProfileDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setProfileStatus('')

    if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
      setProfileStatus('Name and email are required to update profile.')
      return
    }

    setIsProfileSaving(true)

    try {
      await saveProfile({
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
        addresses,
      })
      setProfileStatus('Profile updated successfully.')
    } catch (error) {
      setProfileStatus(`Could not update profile: ${error.message}`)
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

      await saveProfile({
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
        addresses: nextAddresses,
      })

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
      await saveProfile({
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
        addresses: nextAddresses,
      })
      setAddressStatus('Address removed.')
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

      await saveProfile({
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
        addresses: nextAddresses,
      })
      setAddressStatus('Default address updated.')
    } catch (error) {
      setAddressStatus(`Could not update default address: ${error.message}`)
    } finally {
      setIsAddressSaving(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-white">
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

        <section className="px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">My Profile</h1>
            <div className="flex items-center gap-2">
              <button
                className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]"
                onClick={() => navigate('/admin/products')}
                type="button"
              >
                Upload Product
              </button>
              <button
                className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                Back to Home
              </button>
            </div>
          </div>

          {checkoutSuccessOrderId ? (
            <div className="mt-4 rounded-md border border-[#d7ead1] bg-[#f3fbf0] px-4 py-3 text-[13px] text-[#2f5a2f]">
              Order placed successfully. Order ID: {checkoutSuccessOrderId}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_1fr]">
            <article className="border border-[#e4e4e4] bg-[#faf9f7] p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#888]">Profile Details</p>
              <form className="mt-4 grid gap-3" onSubmit={handleProfileSave}>
                <label className="text-[12px] text-[#555]">
                  Full Name
                  <input
                    className="mt-1 h-10 w-full border border-[#d0d0d0] bg-white px-3 text-[14px]"
                    onChange={(event) => handleProfileChange('name', event.target.value)}
                    type="text"
                    value={profileDraft.name}
                  />
                </label>

                <label className="text-[12px] text-[#555]">
                  Email
                  <input
                    className="mt-1 h-10 w-full border border-[#d0d0d0] bg-white px-3 text-[14px]"
                    onChange={(event) => handleProfileChange('email', event.target.value)}
                    type="email"
                    value={profileDraft.email}
                  />
                </label>

                <label className="text-[12px] text-[#555]">
                  Phone
                  <input
                    className="mt-1 h-10 w-full border border-[#d0d0d0] bg-white px-3 text-[14px]"
                    onChange={(event) => handleProfileChange('phone', event.target.value)}
                    placeholder="+91 98XXXXXX20"
                    type="text"
                    value={profileDraft.phone}
                  />
                </label>

                <p className="text-[12px] text-[#666]">User ID: {user?.id ?? 'Not available'}</p>

                <button
                  className="h-10 rounded-md bg-[#1f2125] px-4 text-[13px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
                  disabled={isProfileSaving}
                  type="submit"
                >
                  {isProfileSaving ? 'Saving Profile...' : 'Update Profile'}
                </button>

                {profileStatus ? <p className="text-[12px] text-[#4f4f4f]">{profileStatus}</p> : null}
              </form>
            </article>

            <article className="border border-[#e4e4e4] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#888]">Saved Addresses</p>
                <button
                  className="border border-[#d3d3d3] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5] disabled:opacity-60"
                  disabled={isAddressSaving}
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
                <div className="mt-4 space-y-3 text-[13px] text-[#555]">
                  {addresses.map((address) => (
                    <article className="border border-[#ececec] bg-[#fafafa] p-3" key={address.id}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-[#2f2f2f]">
                          {address.label}
                          {address.isDefault ? <span className="ml-2 text-[11px] text-[#5a8c2f]">Default</span> : null}
                        </p>
                        <div className="flex gap-2">
                          {!address.isDefault ? (
                            <button
                              className="text-[11px] text-[#2f2f2f] underline"
                              onClick={() => handleSetDefaultAddress(address.id)}
                              type="button"
                            >
                              Set Default
                            </button>
                          ) : null}
                          <button className="text-[11px] text-[#8c2c2c] underline" onClick={() => handleRemoveAddress(address.id)} type="button">
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-[12px] text-[#575757]">{address.fullName || user?.name || 'Shopper'}</p>
                      <p className="mt-1 text-[12px] text-[#666]">{formatAddressSingleLine(address)}</p>
                      {address.phone ? <p className="mt-1 text-[12px] text-[#666]">Phone: {address.phone}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-[13px] text-[#666]">No saved addresses yet.</p>
              )}

              {showAddressForm ? (
                <form className="mt-4 grid gap-3 border-t border-[#ececec] pt-4" onSubmit={handleAddAddress}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-[12px] text-[#555]">
                      Address Label
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('label', event.target.value)}
                        type="text"
                        value={addressDraft.label}
                      />
                    </label>
                    <label className="text-[12px] text-[#555]">
                      Full Name
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('fullName', event.target.value)}
                        type="text"
                        value={addressDraft.fullName}
                      />
                    </label>
                    <label className="text-[12px] text-[#555]">
                      Phone
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('phone', event.target.value)}
                        type="text"
                        value={addressDraft.phone}
                      />
                    </label>
                    <label className="text-[12px] text-[#555]">
                      Pincode
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('pincode', event.target.value)}
                        type="text"
                        value={addressDraft.pincode}
                      />
                    </label>
                  </div>

                  <label className="text-[12px] text-[#555]">
                    Address Line 1
                    <input
                      className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                      onChange={(event) => updateAddressDraftField('line1', event.target.value)}
                      type="text"
                      value={addressDraft.line1}
                    />
                  </label>

                  <label className="text-[12px] text-[#555]">
                    Address Line 2 (Optional)
                    <input
                      className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                      onChange={(event) => updateAddressDraftField('line2', event.target.value)}
                      type="text"
                      value={addressDraft.line2}
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="text-[12px] text-[#555]">
                      City
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('city', event.target.value)}
                        type="text"
                        value={addressDraft.city}
                      />
                    </label>
                    <label className="text-[12px] text-[#555]">
                      State
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('state', event.target.value)}
                        type="text"
                        value={addressDraft.state}
                      />
                    </label>
                    <label className="text-[12px] text-[#555]">
                      Country
                      <input
                        className="mt-1 h-10 w-full border border-[#d0d0d0] px-3 text-[14px]"
                        onChange={(event) => updateAddressDraftField('country', event.target.value)}
                        type="text"
                        value={addressDraft.country}
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-2 text-[12px] text-[#555]">
                    <input
                      checked={addressDraft.isDefault}
                      className="h-4 w-4 accent-[#1f2125]"
                      onChange={(event) => updateAddressDraftField('isDefault', event.target.checked)}
                      type="checkbox"
                    />
                    Make this my default address
                  </label>

                  {addressError ? <p className="text-[12px] text-[#8c2c2c]">{addressError}</p> : null}

                  <button
                    className="h-10 rounded-md bg-[#1f2125] px-4 text-[13px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
                    disabled={isAddressSaving}
                    type="submit"
                  >
                    {isAddressSaving ? 'Saving Address...' : 'Save Address'}
                  </button>
                </form>
              ) : null}

              {addressStatus ? <p className="mt-3 text-[12px] text-[#4f4f4f]">{addressStatus}</p> : null}
            </article>
          </div>

          <section className="mt-6 border border-[#e4e4e4] bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
              <h2 className="text-[26px] font-medium text-[#222]">My Orders</h2>
              <p className="text-[12px] text-[#7a7a7a]">{myOrders.length} order(s)</p>
            </div>

            {myOrders.length > 0 ? (
              <div className="mt-4 space-y-4">
                {myOrders.map((order) => (
                  <article className="border border-[#e4e4e4] bg-[#faf9f7] p-4" key={order.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#2f2f2f]">Order ID: {order.id}</p>
                      <p className="text-[12px] text-[#666]">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-[12px] text-[#666]">Status: {order.status ?? 'Placed'}</p>
                    <p className="mt-1 text-[12px] text-[#666]">Payment: {paymentSummary(order)}</p>
                    {order.payment?.transactionRef ? (
                      <p className="mt-1 text-[12px] text-[#666]">Transaction Ref: {order.payment.transactionRef}</p>
                    ) : null}
                    {order.shippingAddress ? (
                      <p className="mt-1 text-[12px] text-[#666]">Delivery: {formatAddressSingleLine(order.shippingAddress)}</p>
                    ) : null}

                    <div className="mt-3 space-y-2">
                      {order.items.map((item) => (
                        <div className="flex items-center justify-between gap-3 text-[12px] text-[#444]" key={`${order.id}-${item.id}`}>
                          <p className="truncate">
                            {item.name} ({item.size}) x {item.quantity}
                          </p>
                          <p className="shrink-0 font-medium">Rs {item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#e7e7e7] pt-2 text-[13px]">
                      <p className="text-[#555]">Total items: {order.itemCount ?? 0}</p>
                      <p className="font-semibold text-[#1f1f1f]">Total: Rs {order.total}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 border border-[#ececec] bg-[#fafafa] p-4 text-center">
                <p className="text-[14px] text-[#666]">No previous orders yet.</p>
                <button
                  className="mt-3 bg-[#1f2125] px-4 py-2 text-[12px] text-white transition hover:bg-black"
                  onClick={() => navigate('/products')}
                  type="button"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </section>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default MyProfile
