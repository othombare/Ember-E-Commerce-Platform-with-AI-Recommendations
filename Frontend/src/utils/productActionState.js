import { normalizeSize } from '../data/curatedProducts'
import { normalizeProductId } from './productId'

export function isProductInCart(cartItems, productId, size) {
  const normalizedProductId = normalizeProductId(productId)
  if (!normalizedProductId) {
    return false
  }

  if (size === undefined || size === null || size === '') {
    return cartItems.some((item) => normalizeProductId(item.productId) === normalizedProductId)
  }

  const normalizedSize = normalizeSize(size)
  return cartItems.some(
    (item) => normalizeProductId(item.productId) === normalizedProductId && normalizeSize(item.size) === normalizedSize,
  )
}

export function getCartButtonLabel(isInCart) {
  return isInCart ? 'Added to Cart' : 'Add to Cart'
}

export function getFavouriteButtonLabel(isFavourite) {
  return isFavourite ? 'Favourited' : 'Add to Favourites'
}

export function getWishlistButtonLabel(isInWishlist) {
  return isInWishlist ? 'Wishlisted' : 'Add to Wishlist'
}

export function getPrimaryActionButtonClassName(isActive) {
  return [
    'h-9 flex-1 px-5 text-[13px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
    isActive ? 'bg-[#17191d] hover:bg-black' : 'bg-[#1f2125] hover:bg-black',
  ].join(' ')
}

export function getSecondaryActionButtonClassName(isActive) {
  return [
    'border px-4 text-[12px] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm',
    isActive ? 'border-[#222] bg-[#222] text-white hover:bg-[#111]' : 'border-[#c8c8c8] text-[#444] hover:bg-[#f5f5f5]',
  ].join(' ')
}

export function getCompactActionButtonClassName(isActive) {
  return [
    'border py-1 text-[10px] transition duration-200 hover:-translate-y-0.5 hover:shadow-sm',
    isActive ? 'border-[#222] bg-[#222] text-white hover:bg-[#111]' : 'border-[#d4d4d4] text-[#353535] hover:bg-[#f6f6f6]',
  ].join(' ')
}
