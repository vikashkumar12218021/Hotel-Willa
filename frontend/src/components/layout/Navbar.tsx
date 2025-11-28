import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Rooms', path: '/rooms' },
  { label: 'Tables', path: '/tables' },
  { label: 'Resorts', path: '/resorts' },
  { label: 'Planes', path: '/planes' },
  { label: 'Occasions', path: '/occasions' },
]

export const Navbar = () => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-semibold text-brand">
          Hotel Willa
        </Link>
        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation">
          <span className="h-0.5 w-6 bg-brand block mb-1" />
          <span className="h-0.5 w-6 bg-brand block mb-1" />
          <span className="h-0.5 w-6 bg-brand block" />
        </button>
        <nav
          className={`${
            open ? 'flex' : 'hidden'
          } absolute inset-x-0 top-full flex-col gap-4 bg-white px-4 pb-4 md:relative md:flex md:flex-row md:bg-transparent md:px-0 md:pb-0`}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-brand' : 'text-gray-600'} hover:text-brand`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {user?.isStaff && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? 'text-brand' : 'text-gray-600'} hover:text-brand`
              }
              onClick={() => setOpen(false)}
            >
              Admin
            </NavLink>
          )}
          <div className="flex flex-col gap-2 md:hidden">
            {user ? (
              <>
                <Link to="/profile" className="text-sm text-brand" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="text-left text-sm text-brand"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-brand" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="text-sm text-brand" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.username}</span>
              <Link to="/profile" className="text-sm text-brand hover:underline">
                Profile
              </Link>
              <button onClick={logout} className="rounded-full border border-brand px-3 py-1 text-sm text-brand">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-brand hover:underline">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-brand px-3 py-1 text-sm text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

