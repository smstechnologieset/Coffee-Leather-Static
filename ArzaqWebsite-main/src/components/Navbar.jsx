import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Blog', href: '/blog' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const dropdownRef = React.useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('#profile-menu-button')
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <>
      <nav className={`${(isHomePage && !scrolled) ? 'bg-transparent py-4' : 'bg-white/30 backdrop-blur-md shadow-sm py-2'} fixed w-full z-50 transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img className={`${(isHomePage && !scrolled) ? 'h-48' : 'h-24'} w-auto transition-all duration-300`} src="/assets/logo-new.png" alt="ARZAQ Trading PLC" />
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`${location.pathname === link.href
                    ? (isHomePage && !scrolled ? 'text-white border-b-2 border-white' : 'text-amber-700 border-b-2 border-amber-700')
                    : (isHomePage && !scrolled ? 'text-white hover:text-amber-200' : 'text-gray-700 hover:text-amber-700')
                    } px-1 py-2 text-sm font-semibold transition-all duration-300 hover:scale-110 transform inline-block`}
                >
                  {link.name}
                </Link>
              ))}
              {currentUser ? (
                <div className="ml-4 relative flex-shrink-0">
                  <div>
                    <button
                      type="button"
                      id="profile-menu-button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-10 w-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-lg border-2 border-amber-800">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </button>
                  </div>
                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div
                      ref={dropdownRef}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-900 font-bold">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        <p className="text-xs text-gray-400 capitalize mt-1">{userRole === 'admin' ? 'Administrator' : 'User Account'}</p>
                      </div>

                      {/* Admin Dashboard Link - Only for Admins */}
                      {userRole === 'admin' && (
                        <button
                          onClick={() => {
                            navigate('/admin');
                            setIsProfileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Admin Dashboard
                        </button>
                      )}

                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className={`${(isHomePage && !scrolled) ? 'bg-white text-amber-700 hover:bg-gray-100' : 'bg-amber-700 text-white hover:bg-amber-800'} px-4 py-2 rounded-md text-sm font-medium transition duration-300`}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${isHomePage && !scrolled ? 'text-white' : 'text-gray-700'} hover:text-amber-700 focus:outline-none`}
              >
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`${location.pathname === link.href
                  ? 'text-amber-700 border-l-4 border-amber-700 bg-amber-50'
                  : 'text-gray-700 hover:text-amber-700 hover:bg-amber-50'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {currentUser ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="text-base font-medium text-gray-800">Signed in as</div>
                  <div className="text-sm font-medium text-gray-500 truncate ml-2">{userName}</div>
                </div>
                {/* Show admin link only for users with admin role on mobile */}
                {userRole === 'admin' && (
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </button>
                  </div>
                )}
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-4 bg-amber-700 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-amber-800 transition duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;