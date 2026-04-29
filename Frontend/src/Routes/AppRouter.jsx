import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import useAuthStore, { isTokenValid } from '../store/authStore'
import ProtectedRoute from './ProtectedRoute'
import Signin from '../pages/authentication/Signin'
import Signup from '../pages/authentication/Signup'
import ForgotPassword from '../pages/authentication/ForgetPassword'
import Dashboard from '../pages/dashboard/Dashboard'

function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  const tokenExpiresAt = useAuthStore((state) => state.tokenExpiresAt)
  return <Navigate replace to={isTokenValid(token, tokenExpiresAt) ? '/dashboard' : '/signin'} />
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
          <Route path="/account" element={<Navigate replace to="/dashboard" />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
