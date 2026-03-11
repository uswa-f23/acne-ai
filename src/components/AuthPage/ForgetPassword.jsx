import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password reset logic here
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl shadow-soft-xl p-8 lg:p-12 animate-fadeIn">
            {/* Header */}
            <div className="text-center mb-8 space-y-4">
              <Sparkles className="w-16 h-16 mx-auto text-primary-500" />
              <h2 className="text-3xl font-display font-bold text-neutral-800">
                Forgot Password?
              </h2>
              <p className="text-neutral-600">
                No worries! We'll send you reset instructions
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                Send Reset Link
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft-xl p-8 lg:p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-neutral-600 mb-8">
              We've sent password reset instructions to{' '}
              <span className="font-semibold text-primary-600">{email}</span>
            </p>

            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary-600 hover:text-primary-500 font-semibold"
                >
                  try again
                </button>
              </p>

              <Link to="/login" className="btn-primary w-full inline-block">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;