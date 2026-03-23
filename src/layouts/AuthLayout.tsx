import { Outlet } from 'react-router-dom'
import { AuthHero } from '../components/auth/AuthHero'

export function AuthLayout() {
  return (
    <div className="editorial-page">
      <div className="page-inner grid min-h-screen items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <AuthHero />
        <Outlet />
      </div>
    </div>
  )
}
