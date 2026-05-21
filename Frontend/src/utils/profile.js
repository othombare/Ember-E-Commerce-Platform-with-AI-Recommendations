function sanitizeText(value) {
  return String(value ?? '').trim()
}

export function createEmptyAddressDraft() {
  return {
    label: 'Home',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false,
  }
}

export function normalizeAddressDraft(draft = {}) {
  return {
    id: sanitizeText(draft.id),
    label: sanitizeText(draft.label) || 'Address',
    fullName: sanitizeText(draft.fullName),
    phone: sanitizeText(draft.phone),
    line1: sanitizeText(draft.line1),
    line2: sanitizeText(draft.line2),
    city: sanitizeText(draft.city),
    state: sanitizeText(draft.state),
    pincode: sanitizeText(draft.pincode),
    country: sanitizeText(draft.country) || 'India',
    isDefault: Boolean(draft.isDefault),
  }
}

export function isAddressDraftValid(draft = {}) {
  const nextAddress = normalizeAddressDraft(draft)
  return Boolean(nextAddress.line1 && nextAddress.city && nextAddress.state && nextAddress.pincode)
}

export function normalizeAddresses(addresses) {
  if (!Array.isArray(addresses)) {
    return []
  }

  const nextAddresses = addresses
    .map((address) => normalizeAddressDraft(address))
    .filter((address) => isAddressDraftValid(address))

  if (nextAddresses.length === 0) {
    return []
  }

  const defaultIndex = nextAddresses.findIndex((address) => address.isDefault)
  const effectiveDefaultIndex = defaultIndex >= 0 ? defaultIndex : 0

  return nextAddresses.map((address, index) => ({
    ...address,
    isDefault: index === effectiveDefaultIndex,
  }))
}

export function getDefaultAddress(addresses) {
  const normalizedAddresses = normalizeAddresses(addresses)
  return normalizedAddresses.find((address) => address.isDefault) ?? normalizedAddresses[0] ?? null
}

export function formatAddressSingleLine(address) {
  const nextAddress = normalizeAddressDraft(address)
  return [nextAddress.line1, nextAddress.line2, nextAddress.city, nextAddress.state, nextAddress.pincode, nextAddress.country]
    .filter(Boolean)
    .join(', ')
}
