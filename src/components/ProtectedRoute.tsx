import { Navigate, Outlet, useLocation } from 'react-router'
import type { Role } from '../types'
import { selectAppState } from '../store/appSlice'
import { useAppSelector } from '../store/hooks'

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const state = useAppSelector(selectAppState)
  const location = useLocation()
  if (!state.signedIn)
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (roles && !roles.includes(state.role)) return <Navigate to="/" replace />
  return <Outlet />
}
