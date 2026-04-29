import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const LEGACY_TOKEN_KEY = 'accessToken'
const AUTH_STORAGE_KEY = 'ember-auth-storage'
const DEFAULT_SESSION_TTL_MS = 60 * 60 * 1000

const initialState = {
  user: null,
  token: null,
  tokenExpiresAt: null,
}

const syncLegacyToken = (token) => {
  if (typeof window === 'undefined') {
    return
  }

  if (token) {
    window.localStorage.setItem(LEGACY_TOKEN_KEY, token)
    return
  }

  window.localStorage.removeItem(LEGACY_TOKEN_KEY)
}

function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const tokenParts = token.split('.')

  if (tokenParts.length !== 3) {
    return null
  }

  try {
    const normalizedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=')
    const decodeBase64 =
      typeof atob === 'function'
        ? atob
        : typeof window !== 'undefined' && typeof window.atob === 'function'
          ? window.atob
          : null

    if (!decodeBase64) {
      return null
    }

    const decodedPayload = decodeBase64(paddedPayload)
    const parsedPayload = JSON.parse(decodedPayload)

    return typeof parsedPayload === 'object' && parsedPayload !== null ? parsedPayload : null
  } catch {
    return null
  }
}

function getJwtExpiration(token) {
  const payload = parseJwtPayload(token)

  if (typeof payload?.exp !== 'number') {
    return null
  }

  return payload.exp * 1000
}

function resolveTokenExpiration(token, expiresAt) {
  if (typeof expiresAt === 'number' && Number.isFinite(expiresAt) && expiresAt > 0) {
    return expiresAt
  }

  const jwtExpiration = getJwtExpiration(token)

  if (jwtExpiration) {
    return jwtExpiration
  }

  if (!token) {
    return null
  }

  return Date.now() + DEFAULT_SESSION_TTL_MS
}

function isTokenValid(token, tokenExpiresAt) {
  if (!token) {
    return false
  }

  if (typeof tokenExpiresAt === 'number' && Number.isFinite(tokenExpiresAt)) {
    return Date.now() < tokenExpiresAt
  }

  const jwtExpiration = getJwtExpiration(token)

  if (typeof jwtExpiration === 'number') {
    return Date.now() < jwtExpiration
  }

  return true
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      login: ({ user, token, expiresAt }) => {
        const normalizedToken = token ?? null
        const tokenExpiresAt = resolveTokenExpiration(normalizedToken, expiresAt)
        syncLegacyToken(normalizedToken)
        set({
          user: user ?? null,
          token: normalizedToken,
          tokenExpiresAt,
        })
      },
      logout: () => {
        syncLegacyToken(null)
        set(initialState)
      },
      setUser: (user) => set({ user: user ?? null }),
      setToken: (token, expiresAt) => {
        const normalizedToken = token ?? null
        const tokenExpiresAt = resolveTokenExpiration(normalizedToken, expiresAt)
        syncLegacyToken(normalizedToken)
        set({
          token: normalizedToken,
          tokenExpiresAt,
        })
      },
      hasValidToken: () => isTokenValid(get().token, get().tokenExpiresAt),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        if (!isTokenValid(state.token, state.tokenExpiresAt)) {
          state.logout()
        }
      },
    },
  ),
)

export default useAuthStore
export { isTokenValid }
