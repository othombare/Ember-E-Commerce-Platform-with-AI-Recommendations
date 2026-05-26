import jwt from 'jsonwebtoken'

const DEFAULT_EXPIRY = process.env.JWT_EXPIRES_IN ?? '7d'

export function signAuthToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET configuration')
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role ?? 'customer',
    },
    secret,
    { expiresIn: DEFAULT_EXPIRY },
  )
}

export function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET configuration')
  }

  return jwt.verify(token, secret)
}

export function toSafeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? 'customer',
    phone: user.phone ?? '',
    gender: user.gender ?? '',
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
    sellerProfile: user.sellerProfile && typeof user.sellerProfile === 'object' ? user.sellerProfile : null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  }
}
