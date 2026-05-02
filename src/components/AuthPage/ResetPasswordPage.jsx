import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const navigate                = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid reset link.'); return; }

    setLoading(true);
    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('Reset failed. Link may have expired.');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-4xl font-display font-bold">
              {success ? 'All Done!' : 'Set New Password'}
            </h2>
            <p className="text-xl text-primary-50">
              {success ? 'Your password has been reset' : 'Choose a strong password'}
            </p>
            <div className="pt-8 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">🔒 Minimum 8 characters</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">✨ Use letters and numbers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">🛡 Keep it unique and secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-soft-xl p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 space-y-3">
              <div className="flex justify-center lg:hidden mb-4">
                <img src="/logo1.png" alt="AcneAI Logo" className="w-12 h-12 text-primary-500" />
              </div>
              <h2 className="text-3xl font-display font-bold text-neutral-800">
                {success ? 'Password Reset!' : 'Set New Password'}
              </h2>
              <p className="text-neutral-600">
                {success ? 'Redirecting you to login...' : 'Enter your new password below'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {success ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-neutral-600 text-sm">
                  Your password has been reset successfully. You'll be redirected to login in a few seconds.
                </p>
                <Link to="/login" className="w-full btn-primary inline-flex items-center justify-center">
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Min. 8 characters"
                      className="input-field pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPass
                        ? <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                        : <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                      }
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                      placeholder="Re-enter your password"
                      className="input-field pl-12"
                    />
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;