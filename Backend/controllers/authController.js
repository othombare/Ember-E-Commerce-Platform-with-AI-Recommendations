import bcrypt from 'bcryptjs'
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateSellerProfile,
  updateUserProfile,
  updateUserSavedItems,
} from '../models/userModel.js'
import { signAuthToken, toSafeUser } from '../utils/auth.js'

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

function validatePassword(password) {
  const rawPassword = String(password ?? '')
  return rawPassword.length >= 6
}

export async function signup(req, res) {
  const name = String(req.body?.name ?? '').trim()
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password ?? '')

  if (!name || !email || !password) {
    res.status(400).json({
      message: 'Name, email, and password are required.',
    })
    return
  }

  if (!validatePassword(password)) {
    res.status(400).json({
      message: 'Password must be at least 6 characters long.',
    })
    return
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    res.status(409).json({
      message: 'An account with this email already exists.',
    })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({
    name,
    email,
    passwordHash,
  })
  const token = signAuthToken(user)

  res.status(201).json({
    message: 'Account created successfully.',
    user: toSafeUser(user),
    token,
  })
}

export async function signin(req, res) {
  const email = normalizeEmail(req.body?.email)
  const password = String(req.body?.password ?? '')

  if (!email || !password) {
    res.status(400).json({
      message: 'Email and password are required.',
    })
    return
  }

  const user = await findUserByEmail(email)
  if (!user) {
    res.status(401).json({
      message: 'Invalid email or password.',
    })
    return
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    res.status(401).json({
      message: 'Invalid email or password.',
    })
    return
  }

  const token = signAuthToken(user)
  res.json({
    message: 'Signed in successfully.',
    user: toSafeUser(user),
    token,
  })
}

export async function me(req, res) {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  const user = await findUserById(userId)
  if (!user) {
    res.status(404).json({ message: 'User not found.' })
    return
  }

  res.json({
    user: toSafeUser(user),
  })
}

export async function forgotPassword(req, res) {
  const email = normalizeEmail(req.body?.email)
  if (!email) {
    res.status(400).json({
      message: 'Email is required.',
    })
    return
  }

  res.json({
    message:
      'If an account exists with this email, a password reset link has been prepared (demo mode).',
  })
}

export async function updateProfile(req, res) {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  const payload = {
    name: req.body?.name,
    email: req.body?.email,
    phone: req.body?.phone,
    gender: req.body?.gender,
    addresses: req.body?.addresses,
  }

  const { user, error } = await updateUserProfile(userId, payload)

  if (error === 'not_found') {
    res.status(404).json({ message: 'User not found.' })
    return
  }

  if (error === 'invalid_email') {
    res.status(400).json({ message: 'A valid email is required.' })
    return
  }

  if (error === 'email_taken') {
    res.status(409).json({ message: 'An account with this email already exists.' })
    return
  }

  res.json({
    message: 'Profile updated successfully.',
    user: toSafeUser(user),
  })
}

export async function submitSellerApplication(req, res) {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  const payload = {
    businessName: req.body?.businessName,
    ownerName: req.body?.ownerName,
    email: req.body?.email,
    contactPhone: req.body?.contactPhone,
    hasGstin: req.body?.hasGstin,
    gstin: req.body?.gstin,
    panNumber: req.body?.panNumber,
    pickupAddressLine1: req.body?.pickupAddressLine1,
    pickupAddressLine2: req.body?.pickupAddressLine2,
    city: req.body?.city,
    state: req.body?.state,
    pincode: req.body?.pincode,
    categories: req.body?.categories,
    bankAccountHolder: req.body?.bankAccountHolder,
    bankAccountNumber: req.body?.bankAccountNumber,
    ifsc: req.body?.ifsc,
    notes: req.body?.notes,
  }

  const { user, error } = await updateSellerProfile(userId, payload)

  if (error === 'not_found') {
    res.status(404).json({ message: 'User not found.' })
    return
  }

  if (error === 'invalid_seller_profile') {
    res.status(400).json({
      message: 'Please complete required seller onboarding fields before submitting.',
    })
    return
  }

  res.json({
    message: 'Seller application submitted successfully.',
    user: toSafeUser(user),
  })
}

export async function updateSavedItems(req, res) {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ message: 'Not authenticated.' })
    return
  }

  const payload = {
    favouriteProductIds: req.body?.favouriteProductIds,
    wishlistProductIds: req.body?.wishlistProductIds,
  }

  const { user, error } = await updateUserSavedItems(userId, payload)

  if (error === 'not_found') {
    res.status(404).json({ message: 'User not found.' })
    return
  }

  res.json({
    message: 'Saved items updated successfully.',
    user: toSafeUser(user),
  })
}
