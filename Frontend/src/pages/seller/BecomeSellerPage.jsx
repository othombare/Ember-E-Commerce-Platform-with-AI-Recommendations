import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import emberLogo from '../../assets/branding/ember-logo.svg'
import useAuthStore from '../../store/authStore'

const sideSteps = [
  'Create Account',
  'List Products',
  'Storage & Shipping',
  'Receive Payments',
  'Grow Faster',
  'Seller App',
  'Help & Support',
]

function toCategoriesString(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return ''
  }

  return categories.join(', ')
}

function parseCategories(rawValue) {
  return [...new Set(String(rawValue ?? '').split(',').map((entry) => entry.trim()).filter(Boolean))]
}

function buildInitialDraft(user) {
  return {
    bankAccountHolder: user?.sellerProfile?.bankAccountHolder ?? user?.name ?? '',
    bankAccountNumber: user?.sellerProfile?.bankAccountNumber ?? '',
    businessName: user?.sellerProfile?.businessName ?? '',
    categories: toCategoriesString(user?.sellerProfile?.categories),
    city: user?.sellerProfile?.city ?? '',
    contactPhone: user?.sellerProfile?.contactPhone ?? user?.phone ?? '',
    email: user?.sellerProfile?.email ?? user?.email ?? '',
    gstin: user?.sellerProfile?.gstin ?? '',
    hasGstin: Boolean(user?.sellerProfile?.hasGstin),
    ifsc: user?.sellerProfile?.ifsc ?? '',
    notes: user?.sellerProfile?.notes ?? '',
    ownerName: user?.sellerProfile?.ownerName ?? user?.name ?? '',
    panNumber: user?.sellerProfile?.panNumber ?? '',
    pickupAddressLine1: user?.sellerProfile?.pickupAddressLine1 ?? '',
    pickupAddressLine2: user?.sellerProfile?.pickupAddressLine2 ?? '',
    pincode: user?.sellerProfile?.pincode ?? '',
    state: user?.sellerProfile?.state ?? '',
  }
}

function BecomeSellerPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [sellerDraft, setSellerDraft] = useState(() => buildInitialDraft(user))
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sellerStatus = String(user?.sellerProfile?.status ?? '').toLowerCase()
  const hasSubmittedApplication = sellerStatus === 'submitted' || sellerStatus === 'approved'

  useEffect(() => {
    setSellerDraft(buildInitialDraft(user))
  }, [user])

  const sellerChecklist = useMemo(
    () => [
      { id: 'c1', label: 'Active mobile number', ready: Boolean(sellerDraft.contactPhone.trim()) },
      { id: 'c2', label: 'Active email id', ready: Boolean(sellerDraft.email.trim()) },
      { id: 'c3', label: 'PAN details', ready: Boolean(sellerDraft.panNumber.trim()) },
      { id: 'c4', label: 'Pickup address', ready: Boolean(sellerDraft.pickupAddressLine1.trim()) },
      { id: 'c5', label: 'Bank account details', ready: Boolean(sellerDraft.bankAccountNumber.trim()) },
    ],
    [sellerDraft],
  )

  const handleFieldChange = (field, value) => {
    setSellerDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const validateDraft = () => {
    const requiredFields = [
      ['businessName', 'Business name'],
      ['ownerName', 'Owner name'],
      ['email', 'Email'],
      ['contactPhone', 'Contact phone'],
      ['panNumber', 'PAN number'],
      ['pickupAddressLine1', 'Pickup address line 1'],
      ['city', 'City'],
      ['state', 'State'],
      ['pincode', 'Pincode'],
      ['bankAccountHolder', 'Bank account holder'],
      ['bankAccountNumber', 'Bank account number'],
      ['ifsc', 'IFSC code'],
    ]

    const missingField = requiredFields.find(([field]) => !String(sellerDraft[field] ?? '').trim())
    if (missingField) {
      return `${missingField[1]} is required.`
    }

    if (sellerDraft.hasGstin && !sellerDraft.gstin.trim()) {
      return 'GSTIN is required when "I have GSTIN" is selected.'
    }

    if (parseCategories(sellerDraft.categories).length === 0) {
      return 'Add at least one product category.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateDraft()
    if (validationError) {
      setStatusMessage(validationError)
      return
    }

    setIsSubmitting(true)
    setStatusMessage('')

    try {
      const response = await api.patch('/api/auth/me/seller', {
        bankAccountHolder: sellerDraft.bankAccountHolder,
        bankAccountNumber: sellerDraft.bankAccountNumber,
        businessName: sellerDraft.businessName,
        categories: parseCategories(sellerDraft.categories),
        city: sellerDraft.city,
        contactPhone: sellerDraft.contactPhone,
        email: sellerDraft.email,
        gstin: sellerDraft.gstin,
        hasGstin: sellerDraft.hasGstin,
        ifsc: sellerDraft.ifsc,
        notes: sellerDraft.notes,
        ownerName: sellerDraft.ownerName,
        panNumber: sellerDraft.panNumber,
        pickupAddressLine1: sellerDraft.pickupAddressLine1,
        pickupAddressLine2: sellerDraft.pickupAddressLine2,
        pincode: sellerDraft.pincode,
        state: sellerDraft.state,
      })

      const nextUser = response.data?.user
      if (nextUser) {
        setUser(nextUser)
      }

      setStatusMessage('Seller application submitted successfully.')
    } catch (error) {
      setStatusMessage(`Could not submit seller application: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#1f2933]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex w-full max-w-[1500px] items-center gap-5 px-4 py-3 sm:px-6">
          <button className="shrink-0" onClick={() => navigate('/dashboard')} type="button">
            <img alt="Ember Seller Hub" className="h-9 w-auto object-contain" src={emberLogo} />
          </button>

          <nav className="hidden items-center gap-8 text-[18px] font-medium text-[#3d3f43] lg:flex">
            <button className="transition hover:text-black" type="button">
              Sell Online
            </button>
            <button className="transition hover:text-black" type="button">
              Fees and Commission
            </button>
            <button className="transition hover:text-black" type="button">
              Grow
            </button>
            <button className="transition hover:text-black" type="button">
              Learn
            </button>
            <button className="transition hover:text-black" type="button">
              Shopsy
            </button>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-[15px] text-[#4b5563] sm:block">Hi, {user?.name ?? 'Seller'}</p>
            <button
              className="rounded-sm border border-[#d2d7de] px-4 py-2 text-[14px] text-[#111827] transition hover:bg-[#f8fafc]"
              onClick={() => navigate('/dashboard')}
              type="button"
            >
              Back to Store
            </button>
            <button
              className="rounded-sm bg-[#f9d400] px-5 py-2 text-[15px] font-medium text-[#111827] transition hover:bg-[#ffd400]"
              onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
              type="button"
            >
              Start Selling
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[370px_1fr]">
          <aside className="space-y-2">
            {sideSteps.map((step, index) => (
              <article
                className={`rounded-md border px-5 py-4 ${
                  index === 0 ? 'border-[#1b82d2] bg-[#f5fbff]' : 'border-transparent bg-transparent'
                }`}
                key={step}
              >
                <p className={`${index === 0 ? 'font-semibold text-[#1b82d2]' : 'text-[#39424e]'} text-[20px]`}>{step}</p>
              </article>
            ))}
          </aside>

          <section>
            <div className="rounded-lg bg-transparent">
              <h1 className="text-[52px] font-semibold text-[#1f2933]">Create Account</h1>
              <div className="mt-2 h-1 w-16 rounded bg-[#1b82d2]" />
              <p className="mt-6 max-w-4xl text-[17px] leading-relaxed text-[#303844]">
                Creating your seller account is a quick process that takes less than 10 minutes. Keep your business, bank and tax
                details ready to complete onboarding without delays.
              </p>
              <p className="mt-4 max-w-4xl text-[17px] leading-relaxed text-[#5b6470]">
                * For selling in most categories, GSTIN is required. If you are selling in exempt categories, you can continue without it.
              </p>
            </div>

            {hasSubmittedApplication ? (
              <div className="mt-5 rounded-md border border-[#d6e8d3] bg-[#f1fbef] px-4 py-3 text-[15px] text-[#2f5a2f]">
                Seller onboarding is submitted. Status: <span className="font-semibold">{user?.sellerProfile?.status}</span>
              </div>
            ) : null}

            <article className="mt-6 rounded-[26px] border border-[#e2e5e9] bg-[#f7f8fa] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[34px] font-semibold text-[#1f2933]">Don&apos;t have a GSTIN?</h2>
                  <p className="mt-2 text-[17px] text-[#4b5563]">Follow these steps to generate GSTIN for your online business.</p>
                </div>
                <div className="rounded-xl border border-[#d1d9e6] bg-white px-4 py-3">
                  <p className="text-[13px] font-medium text-[#1b82d2]">Seller Readiness</p>
                  <div className="mt-2 space-y-1 text-[13px] text-[#404955]">
                    {sellerChecklist.map((item) => (
                      <p className="flex items-center gap-2" key={item.id}>
                        <span className={`h-2.5 w-2.5 rounded-full ${item.ready ? 'bg-[#2f9341]' : 'bg-[#d3d8df]'}`} />
                        {item.label}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <article className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-[16px] font-semibold text-[#1b82d2]">1</p>
                  <p className="mt-2 text-[16px] text-[#303844]">Register / Login to GST portal.</p>
                </article>
                <article className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-[16px] font-semibold text-[#1b82d2]">2</p>
                  <p className="mt-2 text-[16px] text-[#303844]">Fill GST enrolment application form.</p>
                </article>
                <article className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-[16px] font-semibold text-[#1b82d2]">3</p>
                  <p className="mt-2 text-[16px] text-[#303844]">Submit enrolment application.</p>
                </article>
              </div>
            </article>

            <form className="mt-7 rounded-lg border border-[#d7dde5] bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
              <h2 className="text-[34px] font-semibold text-[#1f2933]">Seller Account Form</h2>
              <p className="mt-2 text-[15px] text-[#5a6470]">Complete this once and we&apos;ll save it to your account.</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="text-[13px] text-[#475060]">
                  Business Name
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('businessName', event.target.value)}
                    type="text"
                    value={sellerDraft.businessName}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Owner Name
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('ownerName', event.target.value)}
                    type="text"
                    value={sellerDraft.ownerName}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Email
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    type="email"
                    value={sellerDraft.email}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Contact Phone
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('contactPhone', event.target.value)}
                    type="text"
                    value={sellerDraft.contactPhone}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  PAN Number
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('panNumber', event.target.value.toUpperCase())}
                    type="text"
                    value={sellerDraft.panNumber}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Categories (comma separated)
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('categories', event.target.value)}
                    type="text"
                    value={sellerDraft.categories}
                  />
                </label>

                <label className="text-[13px] text-[#475060] md:col-span-2">
                  Pickup Address Line 1
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('pickupAddressLine1', event.target.value)}
                    type="text"
                    value={sellerDraft.pickupAddressLine1}
                  />
                </label>

                <label className="text-[13px] text-[#475060] md:col-span-2">
                  Pickup Address Line 2 (Optional)
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('pickupAddressLine2', event.target.value)}
                    type="text"
                    value={sellerDraft.pickupAddressLine2}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  City
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('city', event.target.value)}
                    type="text"
                    value={sellerDraft.city}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  State
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('state', event.target.value)}
                    type="text"
                    value={sellerDraft.state}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Pincode
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('pincode', event.target.value)}
                    type="text"
                    value={sellerDraft.pincode}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Bank Account Holder
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('bankAccountHolder', event.target.value)}
                    type="text"
                    value={sellerDraft.bankAccountHolder}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  Bank Account Number
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] text-[#1f2933]"
                    onChange={(event) => handleFieldChange('bankAccountNumber', event.target.value)}
                    type="text"
                    value={sellerDraft.bankAccountNumber}
                  />
                </label>

                <label className="text-[13px] text-[#475060]">
                  IFSC Code
                  <input
                    className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] uppercase text-[#1f2933]"
                    onChange={(event) => handleFieldChange('ifsc', event.target.value.toUpperCase())}
                    type="text"
                    value={sellerDraft.ifsc}
                  />
                </label>
              </div>

              <label className="mt-4 flex items-center gap-2 text-[14px] text-[#374151]">
                <input
                  checked={sellerDraft.hasGstin}
                  className="h-4 w-4 accent-[#1b82d2]"
                  onChange={(event) => handleFieldChange('hasGstin', event.target.checked)}
                  type="checkbox"
                />
                I have GSTIN
              </label>

              <label className="mt-3 block max-w-[420px] text-[13px] text-[#475060]">
                GSTIN
                <input
                  className="mt-1 h-11 w-full border border-[#cfd7e3] px-3 text-[14px] uppercase text-[#1f2933] disabled:bg-[#f6f8fb]"
                  disabled={!sellerDraft.hasGstin}
                  onChange={(event) => handleFieldChange('gstin', event.target.value.toUpperCase())}
                  type="text"
                  value={sellerDraft.gstin}
                />
              </label>

              <label className="mt-4 block text-[13px] text-[#475060]">
                Notes (Optional)
                <textarea
                  className="mt-1 h-28 w-full border border-[#cfd7e3] px-3 py-2 text-[14px] text-[#1f2933]"
                  onChange={(event) => handleFieldChange('notes', event.target.value)}
                  value={sellerDraft.notes}
                />
              </label>

              {statusMessage ? <p className="mt-4 text-[14px] text-[#2f5a2f]">{statusMessage}</p> : null}

              <button
                className="mt-5 h-11 rounded-sm bg-[#f9d400] px-6 text-[15px] font-semibold text-[#111827] transition hover:bg-[#ffd400] disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Submitting...' : 'Create Seller Account'}
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}

export default BecomeSellerPage
