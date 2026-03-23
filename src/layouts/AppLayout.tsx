import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Avatar } from '../components/ui/Avatar'
import { logoutUser } from '../firebase/auth'
import { useAuth } from '../hooks/useAuth'

export function AppLayout() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const [sidebarHidden, setSidebarHidden] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Wylogowano')
    navigate('/login')
  }

  const displayName = profile?.displayName || user?.displayName || 'Editorial Boards'

  return (
    <div className="editorial-page">
      <div
        className={`page-inner grid min-h-screen gap-6 ${
          sidebarHidden ? 'lg:grid-cols-[minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'
        }`}
      >
        {!sidebarHidden ? (
          <aside className="surface-panel flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="surface-soft p-5">
                  <p className="label-text">Wspólne studio</p>
                  <h1 className="mt-3 text-2xl font-semibold">Editorial Boards</h1>
                  <p className="mt-3 text-sm leading-7 text-copy">
                    Spokojne zarządzanie projektami dla znajomych, współpracowników i skupionej pracy.
                  </p>
                </div>
                <button
                  className="premium-button-secondary h-12 w-12 shrink-0 rounded-2xl p-0"
                  onClick={() => setSidebarHidden(true)}
                  aria-label="Hide sidebar"
                  title="Hide sidebar"
                >
                  <Bars3BottomLeftIcon className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 space-y-2">
                <NavLink
                  to="/app"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                  Pulpit
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Profil
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  Ustawienia
                </NavLink>
              </nav>
            </div>

            <Menu as="div" className="relative">
              <MenuButton className="surface-soft flex w-full items-center gap-3 p-3 text-left">
                <Avatar src={profile?.photoURL} name={displayName} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                  <p className="truncate text-xs text-copy">{user?.email}</p>
                </div>
              </MenuButton>
              <MenuItems
                anchor="top start"
                className="surface-glass mt-2 w-64 rounded-3xl p-2 outline-none"
              >
                <MenuItem>
                  <button
                    className="nav-link w-full"
                    onClick={() => navigate('/profile')}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Mój profil
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="nav-link w-full" onClick={handleLogout}>
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                    Wyloguj się
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </aside>
        ) : null}

        <main className="min-w-0">
          <Outlet
            context={{
              sidebarHidden,
              setSidebarHidden,
            }}
          />
        </main>
      </div>

      {sidebarHidden ? (
        <button
          className="premium-button-secondary fixed left-5 top-5 z-30 h-12 w-12 rounded-2xl p-0 sm:left-8 sm:top-8"
          onClick={() => setSidebarHidden(false)}
          aria-label="Show sidebar"
          title="Show sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  )
}
