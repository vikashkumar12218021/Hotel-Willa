import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && !user.isStaff) {
    return <Navigate to="/" replace />
  }

  return children
}

