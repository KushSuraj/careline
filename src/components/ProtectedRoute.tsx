import { Navigate, Outlet, useLocation } from 'react-router'
import { useApp } from '../context/app-context'
import type { Role } from '../types'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { state } = useApp()
  const location = useLocation()
  if (!state.signedIn)
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (roles && !roles.includes(state.role)) return <Navigate to="/" replace />
  return <Outlet />
}
