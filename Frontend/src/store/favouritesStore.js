import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { allCatalogProducts } from '../data/curatedProducts'

const FAVOURITES_STORAGE_KEY = 'ember-favourites-storage'
const DEFAULT_FAVOURITE_PRODUCT_IDS = allCatalogProducts.slice(0, 6).map((item) => item.id)

function normalizeProductId(productId) {
  return String(productId ?? '').trim()
}

function dedupeProductIds(ids) {
  return [...new Set((ids ?? []).map(normalizeProductId).filter(Boolean))]
}

const useFavouritesStore = create(
  persist(
    (set, get) => ({
      favouriteProductIds: DEFAULT_FAVOURITE_PRODUCT_IDS,
      addToFavourites: (productId) => {
        const normalizedId = normalizeProductId(productId)
        if (!normalizedId) {
          return
        }

        set((state) => {
          if (state.favouriteProductIds.includes(normalizedId)) {
            return state
          }

          return { favouriteProductIds: [...state.favouriteProductIds, normalizedId] }
        })
      },
      removeFromFavourites: (productId) => {
        const normalizedId = normalizeProductId(productId)
        if (!normalizedId) {
          return
        }

        set((state) => ({
          favouriteProductIds: state.favouriteProductIds.filter((entry) => entry !== normalizedId),
        }))
      },
      toggleFavourite: (productId) => {
        const normalizedId = normalizeProductId(productId)
        if (!normalizedId) {
          return
        }

        set((state) => ({
          favouriteProductIds: state.favouriteProductIds.includes(normalizedId)
            ? state.favouriteProductIds.filter((entry) => entry !== normalizedId)
            : [...state.favouriteProductIds, normalizedId],
        }))
      },
      clearFavourites: () => set({ favouriteProductIds: [] }),
      isFavourite: (productId) => get().favouriteProductIds.includes(normalizeProductId(productId)),
    }),
    {
      name: FAVOURITES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favouriteProductIds: state.favouriteProductIds }),
      merge: (persistedState, currentState) => {
        if (!persistedState || !Array.isArray(persistedState.favouriteProductIds)) {
          return currentState
        }

        return {
          ...currentState,
          ...persistedState,
          favouriteProductIds: dedupeProductIds(persistedState.favouriteProductIds),
        }
      },
    },
  ),
)

export default useFavouritesStore
