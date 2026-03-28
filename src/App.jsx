import React, { useState } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  React.useEffect(() => {
  const handler = () => setIsChatOpen(true);
  window.addEventListener('openChatbot', handler);
  return () => window.removeEventListener('openChatbot', handler);
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
            <Route path="/stories" element={<SuccessStoriesPage />} />
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

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {/* Floating Chat Button */}
        <Footer />
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f83c87 0%, #a855f7 100%)',
            border: 'none',
            cursor: 'pointer',
            display: isChatOpen ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            boxShadow: '0 8px 32px rgba(248, 60, 135, 0.4)',
          }}>
          <MessageCircle color="white" size={28} />
        </button>

        <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      </div>
    </Router>
  );
}

export default App;