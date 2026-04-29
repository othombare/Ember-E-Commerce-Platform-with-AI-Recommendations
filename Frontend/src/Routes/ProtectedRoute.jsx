import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore, { isTokenValid } from '../store/authStore'

function ProtectedRoute() {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const tokenExpiresAt = useAuthStore((state) => state.tokenExpiresAt)
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = isTokenValid(token, tokenExpiresAt)

  useEffect(() => {
    if (token && !isAuthenticated) {
      logout()
    }
  }, [isAuthenticated, logout, token])

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/signin" />
  }

  return <Outlet />
}

export default ProtectedRoute
