import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot } from 'lucide-react';
import { sendMessageToBot, getWelcomeMessage, getSuggestedQuestions } from '../../services/chatbotService';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages]     = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await sendMessageToBot(messageText);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
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
      {/* ── Chat Window ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-28 right-6 z-[1000] flex flex-col
        w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-9rem)]
        bg-white rounded-3xl shadow-soft-xl border-2 border-primary-200
        overflow-hidden font-body"
      >

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4
        bg-gradient-to-r from-primary-500 to-mauve-500 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-display m-0">AcneAI Assistant</h3>
              <p className="text-xs opacity-90 m-0">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/25
            transition-colors duration-200 border-none shadow-none text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Messages ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-primary-50
        flex flex-col gap-4 chatbot-scroll">

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-400 text-center">Suggested questions:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="px-4 py-2 bg-white border border-primary-200 rounded-xl
                  text-primary-700 text-xs text-left hover:bg-primary-50
                  transition-colors duration-200 shadow-soft border-none"
                  style={{ border: '1px solid' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot avatar */}
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-mauve-100 flex items-center
                justify-center mr-2 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-mauve-600" />
                </div>
              )}

              {/* Bubble */}
              <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-soft
                ${message.sender === 'user'
                  ? 'bg-gradient-to-br from-primary-500 to-mauve-500 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                  : message.isError
                    ? 'bg-red-50 text-red-700 border border-red-200 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                    : 'bg-white text-neutral-800 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                }`}
              >
                {message.sender === 'bot' ? (
                  <div className="markdown-container">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  message.text
                )}
                <p className={`text-xs mt-1.5 opacity-70
                  ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-mauve-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-mauve-600" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-soft flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-primary-400"
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ──────────────────────────────────────── */}
        <div className="px-5 py-4 bg-white border-t border-primary-100 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 px-4 py-3 text-sm bg-primary-50 border-2 border-primary-200
              rounded-2xl outline-none resize-none max-h-24 text-neutral-800
              placeholder:text-neutral-400 focus:border-primary-400 focus:bg-white
              transition-all duration-200 chatbot-textarea"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-2xl border-none shadow-none transition-all duration-200 flex-shrink-0
              ${inputValue.trim() && !isTyping
                ? 'bg-gradient-to-br from-primary-500 to-mauve-500 text-white hover:scale-105 shadow-soft cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;