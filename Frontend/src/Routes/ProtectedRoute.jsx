import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore, { isTokenValid } from '../store/authStore'

function ProtectedRoute() {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = isTokenValid(token)

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/signin" />
  }

  return <Outlet />
}

export default ProtectedRoute
