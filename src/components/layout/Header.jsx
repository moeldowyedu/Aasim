import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <header className="glass-card sticky top-0 z-40 mb-8">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <span className="material-icons text-3xl text-white">gavel</span>
            <span className="text-2xl font-bold text-white text-shadow">Aasim</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/#features" className="text-white/90 hover:text-white transition-colors">
                  Features
                </Link>
                <Link to="/#use-cases" className="text-white/90 hover:text-white transition-colors">
                  Use Cases
                </Link>
                <Link to="/login" className="text-white/90 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="glass-btn-primary rounded-xl px-6 py-2"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/submissions" className="text-white/90 hover:text-white transition-colors">
                  Submissions
                </Link>
                <Link to="/criteria" className="text-white/90 hover:text-white transition-colors">
                  Criteria
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-white/90 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 glass-card px-4 py-2 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-white font-medium">{user?.name || 'User'}</span>
                    <span className="material-icons text-white text-sm">
                      {userMenuOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden shadow-2xl">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-white/90 hover:bg-white/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-sm">person</span>
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        to="/notifications"
                        className="block px-4 py-3 text-white/90 hover:bg-white/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-sm">notifications</span>
                          <span>Notifications</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 transition-colors border-t border-white/10"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="material-icons text-sm">logout</span>
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2"
          >
            <span className="material-icons">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/#features"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/#use-cases"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Use Cases
                </Link>
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="glass-btn-primary rounded-xl px-6 py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/dashboard"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/submissions"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submissions
                </Link>
                <Link
                  to="/criteria"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Criteria
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-white/90 hover:text-white transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/notifications"
                  className="text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-white/90 hover:text-white transition-colors py-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
