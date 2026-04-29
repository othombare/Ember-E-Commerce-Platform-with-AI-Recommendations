import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const LEGACY_TOKEN_KEY = 'accessToken'
const AUTH_STORAGE_KEY = 'ember-auth-storage'

const initialState = {
  user: null,
  token: null,
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

function isTokenValid(token) {
  return typeof token === 'string' && token.trim().length > 0
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      login: ({ user, token }) => {
        const normalizedToken = isTokenValid(token) ? token.trim() : null
        syncLegacyToken(normalizedToken)
        set({
          user: user ?? null,
          token: normalizedToken,
        })
      },
      logout: () => {
        syncLegacyToken(null)
        set(initialState)
      },
      setUser: (user) => set({ user: user ?? null }),
      setToken: (token) => {
        const normalizedToken = isTokenValid(token) ? token.trim() : null
        syncLegacyToken(normalizedToken)
        set({
          token: normalizedToken,
        })
      },
      hasValidToken: () => isTokenValid(get().token),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        if (!isTokenValid(state.token)) {
          state.logout()
        }
      },
    },
  ),
)

export default useAuthStore
export { isTokenValid }
