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
import ProductScanner from './components/AuthPage/ProductScanner';
import SuccessStoriesPage from './components/AuthPage/SuccessStoriesPage';
import ResetPasswordPage from './components/AuthPage/ResetPasswordPage';


// ✅ Improved ProtectedRoute (only checks token)
const ProtectedRoute = ({ children }) => {
  const hasToken = !!localStorage.getItem('access_token');
  return hasToken ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

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
  }, []);

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
            <Route path="/product-scanner" element={<ProductScanner />} />
            <Route path="/stories" element={<SuccessStoriesPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/detection"
              element={
                <ProtectedRoute>
                  <DetectionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
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