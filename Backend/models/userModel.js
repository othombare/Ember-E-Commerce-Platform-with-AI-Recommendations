import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { readCollection, usersFilePath, writeCollection } from './dataStore.js'

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

function normalizePhone(phone) {
  return String(phone ?? '')
    .replace(/[^\d+\s-]/g, '')
    .trim()
}

function sanitizeText(value) {
  return String(value ?? '').trim()
}

function normalizeGender(value) {
  const normalizedValue = sanitizeText(value).toLowerCase()
  if (normalizedValue === 'male') {
    return 'Male'
  }

  if (normalizedValue === 'female') {
    return 'Female'
  }

  if (normalizedValue === 'other') {
    return 'Other'
  }

  return ''
}

function normalizePan(value) {
  return sanitizeText(value).toUpperCase().replace(/[^A-Z0-9]/g, '')
}

const SELLER_STATUSES = new Set(['not_applied', 'draft', 'submitted', 'approved', 'rejected'])

function normalizeSellerStatus(value) {
  const normalizedValue = sanitizeText(value).toLowerCase()
  return SELLER_STATUSES.has(normalizedValue) ? normalizedValue : 'not_applied'
}

function normalizeSellerCategories(categories) {
  if (!Array.isArray(categories)) {
    return []
  }

  return [...new Set(categories.map((category) => sanitizeText(category)).filter(Boolean))]
}

function normalizeSellerProfile(sellerProfile, fallback = null) {
  if (!sellerProfile || typeof sellerProfile !== 'object') {
    return fallback
  }

  const normalizedProfile = {
    status: normalizeSellerStatus(sellerProfile.status),
    businessName: sanitizeText(sellerProfile.businessName),
    ownerName: sanitizeText(sellerProfile.ownerName),
    email: normalizeEmail(sellerProfile.email),
    contactPhone: normalizePhone(sellerProfile.contactPhone),
    hasGstin: Boolean(sellerProfile.hasGstin),
    gstin: sanitizeText(sellerProfile.gstin).toUpperCase().replace(/\s+/g, ''),
    panNumber: normalizePan(sellerProfile.panNumber),
    pickupAddressLine1: sanitizeText(sellerProfile.pickupAddressLine1),
    pickupAddressLine2: sanitizeText(sellerProfile.pickupAddressLine2),
    city: sanitizeText(sellerProfile.city),
    state: sanitizeText(sellerProfile.state),
    pincode: sanitizeText(sellerProfile.pincode),
    categories: normalizeSellerCategories(sellerProfile.categories),
    bankAccountHolder: sanitizeText(sellerProfile.bankAccountHolder),
    bankAccountNumber: sanitizeText(sellerProfile.bankAccountNumber).replace(/\s+/g, ''),
    ifsc: sanitizeText(sellerProfile.ifsc).toUpperCase().replace(/\s+/g, ''),
    notes: sanitizeText(sellerProfile.notes),
    appliedAt: sellerProfile.appliedAt ?? null,
    updatedAt: sellerProfile.updatedAt ?? null,
  }

  if (!normalizedProfile.hasGstin) {
    normalizedProfile.gstin = ''
  }

  return normalizedProfile
}

function hasMinimumSellerProfileFields(profile) {
  if (!profile) {
    return false
  }

  const hasBusinessDetails =
    Boolean(profile.businessName) &&
    Boolean(profile.ownerName) &&
    Boolean(profile.email) &&
    Boolean(profile.contactPhone) &&
    Boolean(profile.panNumber)

  const hasAddressDetails =
    Boolean(profile.pickupAddressLine1) && Boolean(profile.city) && Boolean(profile.state) && Boolean(profile.pincode)

  const hasBankDetails =
    Boolean(profile.bankAccountHolder) && Boolean(profile.bankAccountNumber) && Boolean(profile.ifsc)

  const hasCategory = profile.categories.length > 0
  const hasGstinIfRequired = !profile.hasGstin || Boolean(profile.gstin)

  return hasBusinessDetails && hasAddressDetails && hasBankDetails && hasCategory && hasGstinIfRequired
}

function normalizeAddressFromStore(address, index) {
  return {
    id: sanitizeText(address?.id) || `address-${index + 1}`,
    label: sanitizeText(address?.label) || `Address ${index + 1}`,
    fullName: sanitizeText(address?.fullName),
    phone: normalizePhone(address?.phone),
    line1: sanitizeText(address?.line1),
    line2: sanitizeText(address?.line2),
    city: sanitizeText(address?.city),
    state: sanitizeText(address?.state),
    pincode: sanitizeText(address?.pincode),
    country: sanitizeText(address?.country) || 'India',
    isDefault: Boolean(address?.isDefault),
  }
}

function normalizeAddressInput(address, index) {
  return {
    id: sanitizeText(address?.id) || `addr_${nanoid(10)}`,
    label: sanitizeText(address?.label) || `Address ${index + 1}`,
    fullName: sanitizeText(address?.fullName),
    phone: normalizePhone(address?.phone),
    line1: sanitizeText(address?.line1),
    line2: sanitizeText(address?.line2),
    city: sanitizeText(address?.city),
    state: sanitizeText(address?.state),
    pincode: sanitizeText(address?.pincode),
    country: sanitizeText(address?.country) || 'India',
    isDefault: Boolean(address?.isDefault),
  }
}

function hasMinimumAddressFields(address) {
  return Boolean(address.line1 && address.city && address.state && address.pincode)
}

function ensureSingleDefaultAddress(addresses) {
  if (addresses.length === 0) {
    return addresses
  }

  const defaultIndex = addresses.findIndex((address) => address.isDefault)
  const normalizedDefaultIndex = defaultIndex >= 0 ? defaultIndex : 0

  return addresses.map((address, index) => ({
    ...address,
    isDefault: index === normalizedDefaultIndex,
  }))
}

function normalizeAddressesFromStore(addresses) {
  if (!Array.isArray(addresses)) {
    return []
  }

  const nextAddresses = addresses
    .map((address, index) => normalizeAddressFromStore(address, index))
    .filter(hasMinimumAddressFields)

  return ensureSingleDefaultAddress(nextAddresses)
}

function normalizeAddressesInput(addresses) {
  if (!Array.isArray(addresses)) {
    return []
  }

  const nextAddresses = addresses
    .map((address, index) => normalizeAddressInput(address, index))
    .filter(hasMinimumAddressFields)

  return ensureSingleDefaultAddress(nextAddresses)
}

function normalizeProductId(productId) {
  return sanitizeText(productId)
}

function normalizeProductIdCollection(productIds) {
  if (!Array.isArray(productIds)) {
    return []
  }

  return [...new Set(productIds.map((productId) => normalizeProductId(productId)).filter(Boolean))]
}

function normalizeUserRecord(user) {
  return {
    ...user,
    id: sanitizeText(user?.id),
    name: sanitizeText(user?.name) || 'Ember Shopper',
    email: normalizeEmail(user?.email),
    role: sanitizeText(user?.role) || 'customer',
    phone: normalizePhone(user?.phone),
    gender: normalizeGender(user?.gender),
    addresses: normalizeAddressesFromStore(user?.addresses),
    favouriteProductIds: normalizeProductIdCollection(user?.favouriteProductIds),
    wishlistProductIds: normalizeProductIdCollection(user?.wishlistProductIds),
    sellerProfile: normalizeSellerProfile(user?.sellerProfile),
    createdAt: user?.createdAt ?? new Date().toISOString(),
    updatedAt: user?.updatedAt ?? user?.createdAt ?? new Date().toISOString(),
  }
}

export async function getUsers() {
  const users = await readCollection(usersFilePath, [])
  return users.map((user) => normalizeUserRecord(user)).filter((user) => user.id && user.email)
}

export async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) {
    return null
  }

  const users = await getUsers()
  return users.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null
}

export async function findUserById(userId) {
  const normalizedId = String(userId ?? '').trim()
  if (!normalizedId) {
    return null
  }

  const users = await getUsers()
  return users.find((user) => user.id === normalizedId) ?? null
}

export async function createUser({ email, name, passwordHash, role = 'customer', phone = '', addresses = [] }) {
  const users = await getUsers()
  const now = new Date().toISOString()
  const nextUser = {
    id: nanoid(12),
    name: String(name ?? '').trim() || 'Ember Shopper',
    email: normalizeEmail(email),
    passwordHash,
    role,
    phone: normalizePhone(phone),
    gender: '',
    addresses: normalizeAddressesInput(addresses),
    favouriteProductIds: [],
    wishlistProductIds: [],
    sellerProfile: null,
    createdAt: now,
    updatedAt: now,
  }

  users.push(nextUser)
  await writeCollection(usersFilePath, users)
  return nextUser
}

export async function updateUserProfile(userId, updates = {}) {
  const users = await getUsers()
  const targetUserId = String(userId ?? '').trim()
  const userIndex = users.findIndex((user) => user.id === targetUserId)

  if (userIndex < 0) {
    return {
      user: null,
      error: 'not_found',
    }
  }

  const currentUser = users[userIndex]
  const nextUser = {
    ...currentUser,
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
    const nextName = sanitizeText(updates.name)
    if (nextName) {
      nextUser.name = nextName
    }
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'email')) {
    const nextEmail = normalizeEmail(updates.email)
    if (!nextEmail) {
      return {
        user: null,
        error: 'invalid_email',
      }
    }

    const duplicate = users.find(
      (user) => user.id !== targetUserId && normalizeEmail(user.email) === nextEmail,
    )

    if (duplicate) {
      return {
        user: null,
        error: 'email_taken',
      }
    }

    nextUser.email = nextEmail
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'phone')) {
    nextUser.phone = normalizePhone(updates.phone)
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'gender')) {
    nextUser.gender = normalizeGender(updates.gender)
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'addresses')) {
    nextUser.addresses = normalizeAddressesInput(updates.addresses)
  }

  nextUser.updatedAt = new Date().toISOString()

  users[userIndex] = normalizeUserRecord(nextUser)
  await writeCollection(usersFilePath, users)

  return {
    user: users[userIndex],
    error: null,
  }
}

export async function updateUserSavedItems(userId, updates = {}) {
  const users = await getUsers()
  const targetUserId = String(userId ?? '').trim()
  const userIndex = users.findIndex((user) => user.id === targetUserId)

  if (userIndex < 0) {
    return {
      user: null,
      error: 'not_found',
    }
  }

  const currentUser = users[userIndex]
  const nextUser = {
    ...currentUser,
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'favouriteProductIds')) {
    nextUser.favouriteProductIds = normalizeProductIdCollection(updates.favouriteProductIds)
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'wishlistProductIds')) {
    nextUser.wishlistProductIds = normalizeProductIdCollection(updates.wishlistProductIds)
  }

  nextUser.updatedAt = new Date().toISOString()

  users[userIndex] = normalizeUserRecord(nextUser)
  await writeCollection(usersFilePath, users)

  return {
    user: users[userIndex],
    error: null,
  }
}

export async function updateSellerProfile(userId, sellerProfileUpdates = {}) {
  const users = await getUsers()
  const targetUserId = String(userId ?? '').trim()
  const userIndex = users.findIndex((user) => user.id === targetUserId)

  if (userIndex < 0) {
    return {
      user: null,
      error: 'not_found',
    }
  }

  const currentUser = users[userIndex]
  const previousSellerProfile = normalizeSellerProfile(currentUser.sellerProfile, {
    status: 'not_applied',
    businessName: '',
    ownerName: '',
    email: '',
    contactPhone: '',
    hasGstin: false,
    gstin: '',
    panNumber: '',
    pickupAddressLine1: '',
    pickupAddressLine2: '',
    city: '',
    state: '',
    pincode: '',
    categories: [],
    bankAccountHolder: '',
    bankAccountNumber: '',
    ifsc: '',
    notes: '',
    appliedAt: null,
    updatedAt: null,
  })

  const now = new Date().toISOString()
  const candidateProfile = normalizeSellerProfile(
    {
      ...previousSellerProfile,
      ...sellerProfileUpdates,
      status: 'submitted',
      appliedAt: previousSellerProfile.appliedAt ?? now,
      updatedAt: now,
    },
    previousSellerProfile,
  )

  if (!hasMinimumSellerProfileFields(candidateProfile)) {
    return {
      user: null,
      error: 'invalid_seller_profile',
    }
  }

  const nextUser = {
    ...currentUser,
    role: currentUser.role === 'admin' ? 'admin' : 'seller',
    phone: candidateProfile.contactPhone || currentUser.phone,
    sellerProfile: candidateProfile,
    updatedAt: now,
  }

  if (candidateProfile.ownerName) {
    nextUser.name = candidateProfile.ownerName
  }

  users[userIndex] = normalizeUserRecord(nextUser)
  await writeCollection(usersFilePath, users)

  return {
    user: users[userIndex],
    error: null,
  }
}

export async function ensureDefaultAdminUser() {
  const adminEmail = 'admin@ember.com'
  const users = await getUsers()
  const hasAdmin = users.some((user) => normalizeEmail(user.email) === adminEmail)

  if (hasAdmin) {
    return
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10)
  const now = new Date().toISOString()

  users.push({
    id: nanoid(12),
    name: 'Ember Admin',
    email: adminEmail,
    passwordHash,
    role: 'admin',
    phone: '',
    gender: '',
    addresses: [],
    favouriteProductIds: [],
    wishlistProductIds: [],
    sellerProfile: null,
    createdAt: now,
    updatedAt: now,
  })

  await writeCollection(usersFilePath, users)
}
