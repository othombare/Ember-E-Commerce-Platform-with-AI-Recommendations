import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuthStore, { isTokenValid } from '../store/authStore'
import ProtectedRoute from './ProtectedRoute'
import ScrollToTop from '../components/layout/ScrollToTop'
import Signin from '../pages/authentication/Signin'
import Signup from '../pages/authentication/Signup'
import ForgotPassword from '../pages/authentication/ForgetPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import AllProducts from '../pages/products/AllProducts'
import SearchResults from '../pages/products/SearchResults'
import ProductDetails from '../pages/products/ProductDetails'
import Favourites from '../pages/account/Favourites'
import Notifications from '../pages/account/Notifications'
import MyProfile from '../pages/account/MyProfile'
import GenZPage from '../pages/collections/GenZPage'
import NewCollectionsPage from '../pages/collections/NewCollectionsPage'
import AIRecommendationsPage from '../pages/collections/AIRecommendationsPage'
import MyCartPage from '../pages/cart/MyCartPage'
import CheckoutReviewPage from '../pages/checkout/CheckoutReviewPage'
import ProductUploadPage from '../pages/admin/ProductUploadPage'
import FAQPage from '../pages/support/FAQPage'
import ShippingReturnsPage from '../pages/support/ShippingReturnsPage'
import SizeGuidePage from '../pages/support/SizeGuidePage'
import ContactUsPage from '../pages/support/ContactUsPage'
import BecomeSellerPage from '../pages/seller/BecomeSellerPage'

function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  return <Navigate replace to={isTokenValid(token) ? '/dashboard' : '/signin'} />
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Navigate replace to="/signin" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/category/:categoryName" element={<SearchResults />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/genz" element={<GenZPage />} />
          <Route path="/new-collections" element={<NewCollectionsPage />} />
          <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
          <Route path="/my-cart" element={<MyCartPage />} />
          <Route path="/checkout/review" element={<CheckoutReviewPage />} />
          <Route path="/admin/products" element={<ProductUploadPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/support/faq" element={<FAQPage />} />
          <Route path="/support/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/support/size-guide" element={<SizeGuidePage />} />
          <Route path="/support/contact-us" element={<ContactUsPage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/account" element={<Navigate replace to="/my-profile" />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
