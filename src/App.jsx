import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Chatbot from './components/Chatbot/Chatbot';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/AuthPage/HomePage';
import AboutPage from './components/AuthPage/AboutPage';
import LoginPage from './components/AuthPage/login';
import SignUpPage from './components/AuthPage/signup';
import DashboardPage from './components/AuthPage/dashboard';
import DetectionPage from './components/AuthPage/detection';
import ProgressPage from './components/AuthPage/progress';
import ForgotPasswordPage from './components/AuthPage/ForgetPassword';
import SuccessStoriesPage from './components/AuthPage/SuccessStoriesPage';

// ✅ ProtectedRoute OUTSIDE App — prevents remount bug
const ProtectedRoute = ({ children, isLoggedIn }) => {
  // Double-check localStorage directly as backup
  const hasToken = !!localStorage.getItem('access_token');

  if (!isLoggedIn && !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Give auth state time to initialize before rendering routes
  useEffect(() => {
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => setIsChatOpen(true);
    window.addEventListener('openChatbot', handler);
    return () => window.removeEventListener('openChatbot', handler);
  }, []);

  const handleLogin = useCallback(() => setIsLoggedIn(true), []);
  const handleSignUp = useCallback(() => setIsLoggedIn(true), []);
  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // ✅ No window.location.href — React Router handles navigation
  }, []);

  // Don't render routes until auth state is confirmed
  if (authLoading) return null;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage onSignUp={handleSignUp} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/stories" element={<SuccessStoriesPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detection"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <DetectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-6 right-6 z-[999] items-center space-x-2
            bg-gradient-to-r from-primary-500 to-mauve-500 text-white font-semibold
            px-5 py-5 rounded-full shadow-dusty-lg hover:scale-105
            transition-all duration-300 border-none
            ${isChatOpen ? 'hidden' : 'flex'}`}
        >
          <span className="relative flex items-center space-x-2">
            <span className="absolute -inset-1 rounded-full bg-primary-400 opacity-20 animate-ping" />
            <MessageCircle className="w-5 h-5 relative" />
          </span>
        </button>

        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </Router>
  );
}

export default App;