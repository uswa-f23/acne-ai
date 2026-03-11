import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Sparkles, Bot } from 'lucide-react';
import theme from '../../theme';
import { sendMessageToBot, getWelcomeMessage, getSuggestedQuestions } from '../../services/chatbotService';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = getWelcomeMessage();
      setMessages([welcomeMsg]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await sendMessageToBot(messageText);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      }]);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const suggestedQuestions = getSuggestedQuestions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '400px',
          maxWidth: 'calc(100vw - 48px)',
          height: '600px',
          maxHeight: 'calc(100vh - 150px)',
          backgroundColor: '#ffffff',
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.xl,
          border: `2px solid ${theme.colors.primary[200]}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          fontFamily: theme.typography.fonts.body,
        }}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.lavender[500]} 100%)`,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: theme.typography.sizes.lg,
                fontWeight: '600',
                fontFamily: theme.typography.fonts.heading,
              }}>
                AcneAI Assistant
              </h3>
              <p style={{
                margin: 0,
                fontSize: theme.typography.sizes.xs,
                opacity: 0.9,
              }}>
                Online • Ready to help
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
            }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: theme.colors.neutral[50],
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
              
              {message.sender === 'bot' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: theme.colors.lavender[100],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.5rem',
                  flexShrink: 0,
                }}>
                  <Sparkles className="w-4 h-4" style={{ color: theme.colors.lavender[600] }} />
                </div>
              )}

              {/* INTEGRATED MARKDOWN BUBBLE START */}
              <div style={{
                maxWidth: '75%',
                padding: '0.875rem 1rem',
                borderRadius: message.sender === 'user' 
                  ? `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 ${theme.borderRadius.lg}`
                  : `${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0`,
                backgroundColor: message.sender === 'user' 
                  ? theme.colors.primary[500] 
                  : '#ffffff',
                color: message.sender === 'user' ? '#ffffff' : theme.colors.neutral[800],
                boxShadow: theme.shadows.sm,
                fontSize: theme.typography.sizes.sm,
                lineHeight: '1.6',
                background: message.sender === 'user' 
                  ? `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.lavender[500]} 100%)`
                  : '#ffffff',
              }}>
                {message.sender === 'bot' ? (
                  <div className="markdown-container">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  message.text
                )}

                <div style={{
                  fontSize: theme.typography.sizes.xs,
                  opacity: 0.7,
                  marginTop: '0.5rem',
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {/* INTEGRATED MARKDOWN BUBBLE END */}

            </motion.div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: theme.colors.lavender[100], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles className="w-4 h-4" style={{ color: theme.colors.lavender[600] }} />
              </div>
              <div style={{ padding: '0.875rem 1rem', borderRadius: theme.borderRadius.lg, backgroundColor: '#ffffff', boxShadow: theme.shadows.sm, display: 'flex', gap: '0.25rem' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.colors.lavender[400] }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#ffffff', borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: theme.typography.sizes.sm,
                border: `2px solid ${theme.colors.neutral[200]}`,
                borderRadius: theme.borderRadius.md,
                outline: 'none',
                resize: 'none',
                maxHeight: '100px',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              style={{
                padding: '0.75rem',
                background: inputValue.trim() && !isTyping ? `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.lavender[500]} 100%)` : theme.colors.neutral[300],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                color: '#ffffff',
                cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
              }}>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;