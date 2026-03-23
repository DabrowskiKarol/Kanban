import { Toaster } from 'react-hot-toast'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { BoardPage } from './pages/app/BoardPage'
import { DashboardPage } from './pages/app/DashboardPage'
import { ProfilePage } from './pages/app/ProfilePage'
import { SettingsPage } from './pages/app/SettingsPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/boards/:id" element={<BoardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(249, 249, 255, 0.88)',
              color: '#032147',
              boxShadow: '0 16px 48px rgba(3, 33, 71, 0.12)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </HashRouter>
    </AuthProvider>
  )
}

export default App
