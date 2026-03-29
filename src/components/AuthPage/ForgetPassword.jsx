import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      if (result.success) setSent(true);
      else setError('Something went wrong. Please try again.');
    } catch {
      setError('Could not connect to server. Please try again.');
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
            <Sparkles className="w-20 h-20 mx-auto animate-pulse" />
            <h2 className="text-4xl font-display font-bold">Reset Password</h2>
            <p className="text-xl text-primary-50">We'll help you get back on track</p>
            <div className="pt-8 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">📧 Check your inbox for reset link</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">⏱ Link expires in 1 hour</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-primary-50 text-sm">🔒 Your account stays secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-soft-xl p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 space-y-3">
              <div className="flex justify-center lg:hidden mb-4">
                <Sparkles className="w-12 h-12 text-primary-500" />
              </div>
              <h2 className="text-3xl font-display font-bold text-neutral-800">Forgot Password?</h2>
              <p className="text-neutral-600">No worries! We'll send you reset instructions</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {sent ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-semibold text-neutral-800">Check your email!</h3>
                  <p className="text-neutral-600 text-sm">
                    If <span className="font-semibold text-primary-600">{email}</span> is
                    registered, you'll receive a reset link shortly.
                  </p>
                  <p className="text-xs text-neutral-400">Didn't get it? Check your spam folder.</p>
                </div>
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full btn-secondary"
                >
                  Try another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-neutral-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="input-field pl-12"
                    />
                  </div>
                  {email && !isValidEmail(email) && (
                    <p className="text-xs text-red-500">Please enter a valid email (e.g. name@example.com)</p>
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
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

export default ForgotPasswordPage;