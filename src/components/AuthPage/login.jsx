import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import authService from '../../services/authService';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const timerRef = useRef(null);

  const showError = (message) => {
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setError(message);
    
    timerRef.current = setTimeout(() => {
      setError('');
      timerRef.current = null;
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (timerRef.current) clearTimeout(timerRef.current);
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(formData.email, formData.password);
      console.log('Auth result:', result);
      
      if (result.success === true) {
        onLogin();
        navigate('/dashboard');
      } else {
        showError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.log('Caught error:', err);
      showError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gradient-to-b from-primary-100 to-primary-300 w-full lg:py-20 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-0">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex bg-gradient-to-br from-secondary-500 via-primary-400 to-secondary-600 rounded-l-3xl p-12 flex-col justify-center items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6 text-center">
            <img src="/logo1.png" alt="AcneAI Logo" className="w-20 h-20 mx-auto animate-pulse" />
            <h2 className="text-4xl font-display font-bold">Welcome Back!</h2>
            <p className="text-xl text-primary-50">Continue your journey to clear, healthy skin</p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center space-x-3 text-primary-50">
                {/* <div className="w-8 h-1 bg-white/50 rounded"></div> */}
                <span>Track your progress</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-50">
                {/* <div className="w-8 h-1 bg-white/50 rounded"></div> */}
                <span>Get personalized treatments</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-50">
                {/* <div className="w-8 h-1 bg-white/50 rounded"></div> */}
                <span>Access your skin analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-soft-xl p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 space-y-3">
              <div className="flex justify-center lg:hidden mb-4">
                <img src="/logo1.png" alt="AcneAI Logo" className="w-12 h-12 text-primary-500" />
              </div>
              <h2 className="text-3xl font-display font-bold text-neutral-800">Sign In</h2>
              <p className="text-neutral-600">Access your personalized dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-neutral-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;