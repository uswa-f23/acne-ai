import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, User, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme, themes } = useTheme();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Close theme dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-theme-dropdown]')) setIsThemeOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { name: 'Home',    path: '/' },
    { name: 'About',   path: '/about' },
    { name: 'Stories', path: '/stories' },
  ];

  return (
    <nav className="bg-primary-300 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          
          <Link to="/" className="flex items-center space-x-3 group">
            <Sparkles className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl lg:text-3xl font-display font-bold gradient-text">AcneAI</span>
          </Link>

          {/* Desktop Nav  */}
          <div className="hidden md:flex items-center space-x-8">

            {/* Regular nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-mauve-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Theme dropdown — no icon, no box, underline style */}
            <div className="relative" data-theme-dropdown>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="text-neutral-600 hover:text-primary-500 font-medium
                transition-colors duration-300 relative group
                bg-transparent border-none shadow-none p-0"
              >
                Theme
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-mauve-400 group-hover:w-full transition-all duration-300" />
              </button>

              {isThemeOpen && (
                <div className="absolute top-8 right-0 bg-white rounded-2xl shadow-soft-lg border border-primary-100 overflow-hidden z-50 w-44">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setIsThemeOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3
                      hover:bg-primary-50 transition-colors duration-200 text-left
                      bg-transparent border-none shadow-none rounded-none"
                    >
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{t.label}</p>
                        <p className="text-xs text-neutral-400">{t.desc}</p>
                      </div>
                      {theme === t.id && (
                        <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-primary-100 text-primary-600
                  px-5 py-2.5 rounded-full hover:bg-primary-200 transition-all duration-300
                  border-none shadow-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-300 relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-mauve-400 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/signup"
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-300 relative group"
                >
                  Sign Up
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-mauve-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ─────────────────────── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-300
            bg-transparent border-none shadow-none"
          >
            {isMenuOpen
              ? <X    className="w-6 h-6 text-neutral-600" />
              : <Menu className="w-6 h-6 text-neutral-600" />}
          </button>
        </div>

        {/* ── Mobile Nav ────────────────────────────── */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 animate-fadeIn border-t border-primary-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-neutral-600 hover:text-primary-500 font-medium py-2 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile theme picker — pill buttons */}
            <div className="py-2">
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-2">Theme</p>
              <div className="flex space-x-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold border
                    transition-all duration-200 bg-transparent shadow-none
                    ${theme === t.id
                      ? 'border-primary-400 text-primary-600 bg-primary-50'
                      : 'border-neutral-200 text-neutral-500 hover:border-primary-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-neutral-600 hover:text-primary-500 font-medium py-2 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2
                  bg-primary-100 text-primary-600 px-5 py-3 rounded-full
                  hover:bg-primary-200 transition-all duration-300 border-none shadow-none"
                >
                  <LogOut className="w-4 h-4" /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-neutral-600 hover:text-primary-500 font-medium py-2 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-primary-500 hover:text-primary-600 font-medium py-2 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;