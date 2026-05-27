import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import StoreFooter from '../../components/layout/StoreFooter'
import StoreHeader from '../../components/layout/StoreHeader'
import { categoryCatalog } from '../../data/categoryCatalog'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useOrdersStore from '../../store/ordersStore'
import { getCartPricing } from '../../utils/checkout'
import { toCategoryRoute } from '../../utils/category'
import {
  createEmptyAddressDraft,
  formatAddressSingleLine,
  getDefaultAddress,
  isAddressDraftValid,
  normalizeAddressDraft,
  normalizeAddresses,
} from '../../utils/profile'
import { getSpecialHeaderRoute, toSearchResultsRoute } from '../../utils/storeNavigation'
import { loadRazorpayCheckoutScript } from '../../utils/razorpay'

const checkoutFlowSteps = [
  'Browse Products',
  'Add to Cart',
  'View Cart',
  'Proceed to Checkout',
  'Login / Signup',
  'Add Address',
  'Select Payment Method',
  'Payment Gateway',
  'Order Confirmed',
  'Shipping & Tracking',
]

function generateReceiptId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `EMB-${Date.now()}-${randomPart}`
}

function buildPaymentPayload({ paymentMethod, razorpayResponse = null }) {
  if (paymentMethod === 'ONLINE') {
    return {
      method: 'ONLINE',
      channel: 'RAZORPAY',
      status: 'paid',
      transactionRef: razorpayResponse?.razorpay_payment_id ?? null,
      gateway: razorpayResponse
        ? {
            provider: 'RAZORPAY',
            orderId: razorpayResponse.razorpay_order_id ?? null,
            paymentId: razorpayResponse.razorpay_payment_id ?? null,
            signature: razorpayResponse.razorpay_signature ?? null,
          }
        : null,
    }
  }

  return {
    method: 'COD',
    channel: 'COD',
    status: 'pending',
    transactionRef: null,
    gateway: null,
  }
}

function CheckoutFlowTimeline() {
  return (
    <section className="px-4 pt-4 sm:px-6">
      <div className="rounded-xl border border-[#ded7ca] bg-[#fffaf1] px-4 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-[#8b6f33]">Checkout Flow</p>
            <h2 className="mt-1 text-[20px] font-semibold text-[#27211a]">Purchase journey from browse to delivery</h2>
          </div>
          <p className="text-[12px] text-[#7c6b53]">Razorpay Standard Checkout is used for online payments.</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {checkoutFlowSteps.map((step, index) => {
            const isCompleted = index < 6
            const isActive = index === 6
            const isGateway = index === 7

            return (
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] ${
                  isCompleted
                    ? 'border-[#bfa25f] bg-[#f7ecd0] text-[#4d3c13]'
                    : isActive
                      ? 'border-[#1f2125] bg-[#1f2125] text-white'
                      : isGateway
                        ? 'border-[#3d5c90] bg-[#eaf1ff] text-[#23406d]'
                        : 'border-[#d8d8d8] bg-white text-[#666]'
                }`}
                key={step}
              >
                <span className="font-semibold">{index + 1}</span>
                <span>{step}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CheckoutReviewPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const placeOrder = useOrdersStore((state) => state.placeOrder)

  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressDraft, setAddressDraft] = useState(createEmptyAddressDraft)
  const [addressError, setAddressError] = useState('')

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [orderNote, setOrderNote] = useState('')

  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  const pricing = useMemo(() => getCartPricing(cartItems), [cartItems])
  const { itemCount, subtotal, shipping, tax, total } = pricing

  const addresses = useMemo(() => normalizeAddresses(user?.addresses ?? []), [user?.addresses])
  const fallbackAddressId = useMemo(() => getDefaultAddress(addresses)?.id ?? addresses[0]?.id ?? '', [addresses])
  const [selectedAddressId, setSelectedAddressId] = useState(() => fallbackAddressId)

  const resolvedSelectedAddressId = useMemo(() => {
    if (addresses.length === 0) {
      return ''
    }

    const hasSelected = addresses.some((address) => address.id === selectedAddressId)
    if (hasSelected) {
      return selectedAddressId
    }

    return fallbackAddressId
  }, [addresses, fallbackAddressId, selectedAddressId])

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === resolvedSelectedAddressId) ?? null,
    [addresses, resolvedSelectedAddressId],
  )

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

  const updateAddressDraftField = (fieldName, value) => {
    setAddressDraft((previous) => ({
      ...previous,
      [fieldName]: value,
    }))
  }

  const saveAddressesToProfile = async (nextAddresses) => {
    const payload = {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      addresses: nextAddresses,
    }

    const response = await api.patch('/api/auth/me', payload)
    const nextUser = response.data?.user

    if (nextUser) {
      setUser(nextUser)
    }

    return nextUser
  }

  const handleAddAddress = async (event) => {
    event.preventDefault()

    if (!isAddressDraftValid(addressDraft)) {
      setAddressError('Please complete line 1, city, state, and pincode.')
      return
    }

    setAddressError('')
    setIsSavingAddress(true)
    setStatusMessage('')

    try {
      const normalizedDraft = normalizeAddressDraft({
        ...addressDraft,
        id: `addr_${Date.now()}`,
      })

      const draftMarkedDefault = addresses.length === 0 ? { ...normalizedDraft, isDefault: true } : normalizedDraft
      const nextAddresses = normalizeAddresses([...addresses, draftMarkedDefault])
      const nextUser = await saveAddressesToProfile(nextAddresses)

      const nextDefaultId = getDefaultAddress(nextUser?.addresses ?? nextAddresses)?.id ?? normalizedDraft.id
      setSelectedAddressId(nextDefaultId)
      setAddressDraft(createEmptyAddressDraft())
      setShowAddressForm(false)
      setStatusMessage('Address added successfully.')
    } catch (error) {
      setStatusMessage(`Could not save address: ${error.message}`)
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleRemoveAddress = async (addressId) => {
    const nextAddresses = normalizeAddresses(addresses.filter((address) => address.id !== addressId))

    setIsSavingAddress(true)
    setStatusMessage('')

    try {
      const nextUser = await saveAddressesToProfile(nextAddresses)
      const nextDefaultId = getDefaultAddress(nextUser?.addresses ?? nextAddresses)?.id ?? ''
      setSelectedAddressId(nextDefaultId)
      setStatusMessage('Address removed.')
    } catch (error) {
      setStatusMessage(`Could not remove address: ${error.message}`)
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    const nextAddresses = normalizeAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    )

    setIsSavingAddress(true)
    setStatusMessage('')

    try {
      await saveAddressesToProfile(nextAddresses)
      setSelectedAddressId(addressId)
      setStatusMessage('Default address updated.')
    } catch (error) {
      setStatusMessage(`Could not update default address: ${error.message}`)
    } finally {
      setIsSavingAddress(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setStatusMessage('Your cart is empty. Add products before checkout.')
      return
    }

    if (!selectedAddress) {
      setStatusMessage('Please select or add a delivery address first.')
      return
    }

    setIsSubmitting(true)
    setStatusMessage(paymentMethod === 'ONLINE' ? 'Opening Razorpay Checkout...' : 'Placing your order...')

    const finalizeOrder = async (paymentPayload) => {
      const orderPayload = {
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: selectedAddress,
        payment: paymentPayload,
        notes: orderNote,
      }

      let remoteOrderId = null

      try {
        const response = await api.post('/api/orders', orderPayload)
        remoteOrderId = response.data?.order?.id ?? null
      } catch (error) {
        console.error('Remote order sync failed:', error)
      }

      const localOrderId = placeOrder({
        ...orderPayload,
        user,
      })

      clearCart()
      navigate('/my-profile', {
        state: {
          orderPlaced: true,
          orderId: remoteOrderId ?? localOrderId,
        },
      })
    }

    if (paymentMethod === 'COD') {
      await finalizeOrder(buildPaymentPayload({ paymentMethod: 'COD' }))
      return
    }

    try {
      const receipt = generateReceiptId()
      const createOrderResponse = await api.post('/api/payments/razorpay/orders', {
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt,
        notes: {
          orderNote: orderNote || '',
          itemCount: String(itemCount),
          customerEmail: user?.email ?? '',
        },
      })

      const keyId = createOrderResponse.data?.keyId
      const razorpayOrder = createOrderResponse.data?.order

      if (!keyId || !razorpayOrder?.id) {
        throw new Error('Could not initialize Razorpay payment.')
      }

      const scriptLoaded = await loadRazorpayCheckoutScript()
      if (!scriptLoaded || typeof window === 'undefined' || typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay checkout script could not be loaded.')
      }

      const razorpay = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency ?? 'INR',
        name: 'Ember',
        description: `Payment for ${cartItems.length} item(s)`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name ?? '',
          email: user?.email ?? '',
          contact: user?.phone ?? '',
        },
        theme: {
          color: '#1f2125',
        },
        modal: {
          ondismiss: () => {
            setStatusMessage('Payment cancelled. You can try again.')
            setIsSubmitting(false)
          },
        },
        handler: async (response) => {
          try {
            const verifyResponse = await api.post('/api/payments/razorpay/verify', {
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            if (!verifyResponse.data?.verified) {
              throw new Error('Payment verification failed.')
            }

            await finalizeOrder(
              buildPaymentPayload({
                paymentMethod: 'ONLINE',
                razorpayResponse: response,
              }),
            )
          } catch (error) {
            setStatusMessage(error.message || 'Razorpay payment verification failed.')
          } finally {
            setIsSubmitting(false)
          }
        },
      })

      razorpay.on('payment.failed', (response) => {
        const reason = response?.error?.description || response?.error?.reason || 'Payment failed. Please try again.'
        setStatusMessage(reason)
        setIsSubmitting(false)
      })

      razorpay.open()
    } catch (error) {
      setStatusMessage(error.message || 'Could not start Razorpay checkout.')
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
        <div className="w-full min-h-screen bg-[#f4f3f1]">
          <StoreHeader
            activeCategory={activeCategory}
            cartCount={itemCount}
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

          <CheckoutFlowTimeline />

          <section className="mx-4 mt-6 rounded-lg border border-[#dddddd] bg-white p-6 text-center sm:mx-6">
            <h1 className="text-[32px] font-semibold text-[#232323]">Checkout Review</h1>
            <p className="mt-2 text-[14px] text-[#666]">Your cart is empty. Add products before checkout.</p>
            <button
              className="mt-4 h-11 rounded-md bg-[#1f2125] px-6 text-[14px] font-semibold text-white transition hover:bg-black"
              onClick={() => navigate('/products')}
              type="button"
            >
              Browse Products
            </button>
          </section>

          <StoreFooter onCategorySelect={handleOpenCategoryPage} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#3f3f42] text-[#202020]">
      <div className="w-full min-h-screen bg-[#f4f3f1]">
        <StoreHeader
          activeCategory={activeCategory}
          cartCount={itemCount}
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

        <CheckoutFlowTimeline />

        <section className="px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dddddd] pb-3">
            <h1 className="text-[34px] font-semibold text-[#222]">Checkout Review</h1>
            <button
              className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5]"
              onClick={() => navigate('/my-cart')}
              type="button"
            >
              Back to Cart
            </button>
          </div>

          {statusMessage ? (
            <div className="mt-4 rounded-md border border-[#d9d9d9] bg-white px-4 py-3 text-[13px] text-[#525252]">{statusMessage}</div>
          ) : null}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-5">
              <article className="rounded-lg border border-[#dddddd] bg-white p-4">
                <div className="flex items-center justify-between border-b border-[#ececec] pb-3">
                  <h2 className="text-[22px] font-semibold text-[#232323]">Delivery Address</h2>
                  <button
                    className="border border-[#d2d2d2] px-3 py-1 text-[12px] text-[#3f3f3f] transition hover:bg-[#f5f5f5] disabled:opacity-60"
                    disabled={isSavingAddress}
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
                  <div className="mt-4 space-y-3">
                    {addresses.map((address) => (
                      <label
                        className={`block cursor-pointer rounded-md border p-3 transition ${
                          selectedAddressId === address.id ? 'border-[#1f2125] bg-[#f7f7f7]' : 'border-[#e4e4e4] bg-white hover:border-[#c8c8c8]'
                        }`}
                        key={address.id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <input
                              checked={resolvedSelectedAddressId === address.id}
                              className="mt-1 h-4 w-4 accent-[#1f2125]"
                              name="selected-address"
                              onChange={() => setSelectedAddressId(address.id)}
                              type="radio"
                            />
                            <div>
                              <p className="text-[14px] font-semibold text-[#2f2f2f]">
                                {address.label}
                                {address.isDefault ? <span className="ml-2 text-[11px] text-[#5a8c2f]">Default</span> : null}
                              </p>
                              <p className="text-[12px] text-[#575757]">{address.fullName || user?.name || 'Shopper'}</p>
                              <p className="mt-1 text-[12px] text-[#666]">{formatAddressSingleLine(address)}</p>
                              {address.phone ? <p className="mt-1 text-[12px] text-[#666]">Phone: {address.phone}</p> : null}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {!address.isDefault ? (
                              <button
                                className="text-[11px] text-[#2f2f2f] underline"
                                onClick={(event) => {
                                  event.preventDefault()
                                  handleSetDefaultAddress(address.id)
                                }}
                                type="button"
                              >
                                Set Default
                              </button>
                            ) : null}
                            <button
                              className="text-[11px] text-[#8c2c2c] underline"
                              onClick={(event) => {
                                event.preventDefault()
                                handleRemoveAddress(address.id)
                              }}
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-[13px] text-[#666]">No saved addresses yet. Add your first delivery address.</p>
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
                      disabled={isSavingAddress}
                      type="submit"
                    >
                      {isSavingAddress ? 'Saving Address...' : 'Save Address'}
                    </button>
                  </form>
                ) : null}
              </article>

              <article className="rounded-lg border border-[#dddddd] bg-white p-4">
                <h2 className="border-b border-[#ececec] pb-3 text-[22px] font-semibold text-[#232323]">Payment Method</h2>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <label className={`rounded-md border p-3 ${paymentMethod === 'COD' ? 'border-[#1f2125] bg-[#f8f8f8]' : 'border-[#e4e4e4]'}`}>
                    <input
                      checked={paymentMethod === 'COD'}
                      className="mr-2 accent-[#1f2125]"
                      name="payment-method"
                      onChange={() => setPaymentMethod('COD')}
                      type="radio"
                    />
                    <span className="text-[14px] font-medium text-[#2f2f2f]">Cash on Delivery</span>
                    <p className="mt-1 text-[12px] text-[#666]">Pay at your doorstep upon delivery.</p>
                  </label>

                  <label className={`rounded-md border p-3 ${paymentMethod === 'ONLINE' ? 'border-[#1f2125] bg-[#f8f8f8]' : 'border-[#e4e4e4]'}`}>
                    <input
                      checked={paymentMethod === 'ONLINE'}
                      className="mr-2 accent-[#1f2125]"
                      name="payment-method"
                      onChange={() => setPaymentMethod('ONLINE')}
                      type="radio"
                    />
                    <span className="text-[14px] font-medium text-[#2f2f2f]">Razorpay Checkout</span>
                    <p className="mt-1 text-[12px] text-[#666]">UPI, cards, netbanking, and wallets are supported.</p>
                  </label>
                </div>

                {paymentMethod === 'ONLINE' ? (
                  <div className="mt-4 rounded-md border border-[#e4e4e4] bg-[#fafafa] p-4">
                    <p className="text-[13px] font-medium text-[#2f2f2f]">Secure checkout powered by Razorpay.</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#666]">
                      You&apos;ll be able to pay using UPI, card, netbanking, or wallet from Razorpay&apos;s secure modal after you click pay.
                    </p>
                  </div>
                ) : null}

                <label className="mt-4 block text-[12px] text-[#555]">
                  Delivery Notes (Optional)
                  <textarea
                    className="mt-1 min-h-[80px] w-full border border-[#d0d0d0] bg-white px-3 py-2 text-[14px]"
                    onChange={(event) => setOrderNote(event.target.value)}
                    placeholder="Any delivery instructions for your order"
                    value={orderNote}
                  />
                </label>
              </article>
            </section>

            <aside className="h-fit rounded-lg border border-[#dddddd] bg-white p-4">
              <h2 className="text-[22px] font-semibold text-[#232323]">Order Review</h2>

              <div className="mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <article className="flex items-center gap-3 rounded-md border border-[#ececec] p-2" key={item.id}>
                    <img alt={item.name} className="h-16 w-14 rounded object-cover" src={item.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[#2f2f2f]">{item.name}</p>
                      <p className="text-[11px] text-[#777]">
                        {item.category} â€¢ Size {item.size} â€¢ Qty {item.quantity}
                      </p>
                      <p className="text-[12px] font-semibold text-[#232323]">Rs {item.price * item.quantity}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-[#ececec] pt-3 text-[14px] text-[#555]">
                <div className="flex items-center justify-between">
                  <span>Items ({itemCount})</span>
                  <span>Rs {subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>Rs {shipping}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>Rs {tax}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#ececec] pt-2 text-[19px] font-semibold text-[#222]">
                  <span>Total</span>
                  <span>Rs {total}</span>
                </div>
              </div>

              <button
                className="mt-4 h-11 w-full rounded-md bg-[#1f2125] text-[14px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || isSavingAddress}
                onClick={handlePlaceOrder}
                type="button"
              >
                {isSubmitting
                  ? paymentMethod === 'ONLINE'
                    ? 'Opening Razorpay...'
                    : 'Processing Order...'
                  : paymentMethod === 'ONLINE'
                    ? 'Pay with Razorpay'
                    : 'Place Order'}
              </button>
            </aside>
          </div>
        </section>

        <StoreFooter onCategorySelect={handleOpenCategoryPage} />
      </div>
    </main>
  )
}

export default CheckoutReviewPage


