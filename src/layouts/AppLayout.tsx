import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Avatar } from '../components/ui/Avatar'
import { logoutUser } from '../firebase/auth'
import { useAuth } from '../hooks/useAuth'

export function AppLayout() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    toast.success('Signed out')
    navigate('/login')
  }

  const displayName = profile?.displayName || user?.displayName || 'Editorial Boards'

  return (
    <div className="editorial-page">
      <div className="page-inner grid min-h-screen gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface-panel flex flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="surface-soft p-5">
              <p className="label-text">Shared studio</p>
              <h1 className="mt-3 text-2xl font-semibold">Editorial Boards</h1>
              <p className="mt-3 text-sm leading-7 text-copy">
                Calm project management for friends, collaborators, and focused work.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              <NavLink
                to="/app"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <UserCircleIcon className="h-5 w-5" />
                Profile
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Settings
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
                  My profile
                </button>
              </MenuItem>
              <MenuItem>
                <button className="nav-link w-full" onClick={handleLogout}>
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                  Log out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
