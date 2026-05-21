import { findUserById } from '../models/userModel.js'
import { verifyAuthToken } from './auth.js'

function extractBearerToken(authorizationHeader) {
  const rawHeader = String(authorizationHeader ?? '')
  if (!rawHeader.startsWith('Bearer ')) {
    return null
  }

  return rawHeader.slice('Bearer '.length).trim()
}

export async function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization)

  if (!token) {
    res.status(401).json({ message: 'Authentication token is required.' })
    return
  }

  try {
    const payload = verifyAuthToken(token)
    const user = await findUserById(payload.sub)

    if (!user) {
      res.status(401).json({ message: 'User for this token no longer exists.' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
