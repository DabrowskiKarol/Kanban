import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="editorial-page">
        <div className="page-inner flex min-h-screen items-center justify-center">
          <div className="surface-glass px-8 py-10 text-center">
            <p className="label-text">Przygotowywanie przestrzeni</p>
            <h1 className="mt-4 text-3xl font-semibold">Ładowanie Twoich tablic...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return <Navigate to="/" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
