import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home',  path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-primary-300 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Sparkles className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl lg:text-3xl font-display font-bold gradient-text">AcneAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
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

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-300">
                  <User className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-primary-100 text-primary-600 px-5 py-2.5 rounded-full hover:bg-primary-200 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors duration-300">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-300"
          >
            {isMenuOpen
              ? <X    className="w-6 h-6 text-neutral-600" />
              : <Menu className="w-6 h-6 text-neutral-600" />}
          </button>
        </div>

        {/* Mobile nav */}
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

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-neutral-600 hover:text-primary-500 font-medium py-2 transition-colors duration-300">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-primary-100 text-primary-600 px-5 py-3 rounded-full hover:bg-primary-200 transition-all duration-300">
                  <LogOut className="w-4 h-4" /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-neutral-600 hover:text-primary-500 font-medium py-2 transition-colors duration-300">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full btn-primary text-center">
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