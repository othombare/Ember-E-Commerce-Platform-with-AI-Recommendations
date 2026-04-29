import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuthStore, { isTokenValid } from '../store/authStore'
import ProtectedRoute from './ProtectedRoute'
import Signin from '../pages/authentication/Signin'
import Signup from '../pages/authentication/Signup'
import ForgotPassword from '../pages/authentication/ForgetPassword'
import Dashboard from '../pages/dashboard/Dashboard'
import AllProducts from '../pages/products/AllProducts'
import SearchResults from '../pages/products/SearchResults'
import Favourites from '../pages/account/Favourites'
import Notifications from '../pages/account/Notifications'
import MyProfile from '../pages/account/MyProfile'

function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  return <Navigate replace to={isTokenValid(token) ? '/dashboard' : '/signin'} />
}

function AppRouter() {
  return (
    <BrowserRouter>
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
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/account" element={<Navigate replace to="/my-profile" />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
