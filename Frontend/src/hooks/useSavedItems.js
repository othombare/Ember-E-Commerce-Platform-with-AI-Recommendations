import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import { normalizeProductId, normalizeProductIds } from '../utils/productId'

function addProductId(productIds, productId) {
  const normalizedId = normalizeProductId(productId)
  if (!normalizedId) {
    return normalizeProductIds(productIds)
  }

  return normalizeProductIds([...productIds, normalizedId])
}

function removeProductId(productIds, productId) {
  const normalizedId = normalizeProductId(productId)
  if (!normalizedId) {
    return normalizeProductIds(productIds)
  }

  return normalizeProductIds(productIds.filter((entry) => entry !== normalizedId))
}

export default function useSavedItems() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [pendingSaveCount, setPendingSaveCount] = useState(0)
  const saveQueueRef = useRef(Promise.resolve())
  const latestSavedItemsRef = useRef({
    favouriteProductIds: [],
    wishlistProductIds: [],
  })

  const favouriteProductIds = useMemo(() => normalizeProductIds(user?.favouriteProductIds), [user?.favouriteProductIds])
  const wishlistProductIds = useMemo(() => normalizeProductIds(user?.wishlistProductIds), [user?.wishlistProductIds])

  useEffect(() => {
    latestSavedItemsRef.current = {
      favouriteProductIds,
      wishlistProductIds,
    }
  }, [favouriteProductIds, wishlistProductIds])

  const getCurrentSavedItems = useCallback(() => {
    const currentUser = useAuthStore.getState().user

    if (!currentUser) {
      return latestSavedItemsRef.current
    }

    return {
      favouriteProductIds: normalizeProductIds(currentUser?.favouriteProductIds),
      wishlistProductIds: normalizeProductIds(currentUser?.wishlistProductIds),
    }
  }, [])

  const commitSavedItems = useCallback(
    async (nextFavouriteProductIds, nextWishlistProductIds) => {
      const normalizedFavourites = normalizeProductIds(nextFavouriteProductIds)
      const normalizedWishlist = normalizeProductIds(nextWishlistProductIds)
      const currentUser = useAuthStore.getState().user

      latestSavedItemsRef.current = {
        favouriteProductIds: normalizedFavourites,
        wishlistProductIds: normalizedWishlist,
      }

      if (currentUser) {
        setUser({
          ...currentUser,
          favouriteProductIds: normalizedFavourites,
          wishlistProductIds: normalizedWishlist,
        })
      }

      const persistSave = async () => {
        setPendingSaveCount((count) => count + 1)

        try {
          const response = await api.patch('/api/auth/me/saved-items', {
            favouriteProductIds: normalizedFavourites,
            wishlistProductIds: normalizedWishlist,
          })

          const nextUser = response.data?.user
          if (nextUser) {
            latestSavedItemsRef.current = {
              favouriteProductIds: normalizeProductIds(nextUser.favouriteProductIds),
              wishlistProductIds: normalizeProductIds(nextUser.wishlistProductIds),
            }
            setUser(nextUser)
          }

          return { ok: true }
        } catch (error) {
          return {
            ok: false,
            error: error.message ?? 'Could not update saved items.',
          }
        } finally {
          setPendingSaveCount((count) => Math.max(0, count - 1))
        }
      }

      const queuedPersistPromise = saveQueueRef.current.then(persistSave, persistSave)
      saveQueueRef.current = queuedPersistPromise.then(
        () => undefined,
        () => undefined,
      )

      return queuedPersistPromise
    },
    [setUser],
  )

  const addToFavourites = useCallback(
    async (productId) => {
      const currentItems = getCurrentSavedItems()
      return commitSavedItems(addProductId(currentItems.favouriteProductIds, productId), currentItems.wishlistProductIds)
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  const removeFromFavourites = useCallback(
    async (productId) => {
      const currentItems = getCurrentSavedItems()
      return commitSavedItems(removeProductId(currentItems.favouriteProductIds, productId), currentItems.wishlistProductIds)
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  const toggleFavourite = useCallback(
    async (productId) => {
      const normalizedId = normalizeProductId(productId)
      if (!normalizedId) {
        return { ok: false, error: 'Invalid product id.' }
      }

      const currentItems = getCurrentSavedItems()

      if (currentItems.favouriteProductIds.includes(normalizedId)) {
        return commitSavedItems(removeProductId(currentItems.favouriteProductIds, normalizedId), currentItems.wishlistProductIds)
      }

      return commitSavedItems(addProductId(currentItems.favouriteProductIds, normalizedId), currentItems.wishlistProductIds)
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  const addToWishlist = useCallback(
    async (productId) => {
      const currentItems = getCurrentSavedItems()
      return commitSavedItems(currentItems.favouriteProductIds, addProductId(currentItems.wishlistProductIds, productId))
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  const removeFromWishlist = useCallback(
    async (productId) => {
      const currentItems = getCurrentSavedItems()
      return commitSavedItems(currentItems.favouriteProductIds, removeProductId(currentItems.wishlistProductIds, productId))
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  const toggleWishlist = useCallback(
    async (productId) => {
      const normalizedId = normalizeProductId(productId)
      if (!normalizedId) {
        return { ok: false, error: 'Invalid product id.' }
      }

      const currentItems = getCurrentSavedItems()

      if (currentItems.wishlistProductIds.includes(normalizedId)) {
        return commitSavedItems(currentItems.favouriteProductIds, removeProductId(currentItems.wishlistProductIds, normalizedId))
      }

      return commitSavedItems(currentItems.favouriteProductIds, addProductId(currentItems.wishlistProductIds, normalizedId))
    },
    [commitSavedItems, getCurrentSavedItems],
  )

  return {
    favouriteProductIds,
    wishlistProductIds,
    isFavourite: (productId) => favouriteProductIds.includes(normalizeProductId(productId)),
    isInWishlist: (productId) => wishlistProductIds.includes(normalizeProductId(productId)),
    addToFavourites,
    removeFromFavourites,
    toggleFavourite,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isSaving: pendingSaveCount > 0,
  }
}
