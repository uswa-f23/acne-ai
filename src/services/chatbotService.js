import api from './api';

let currentSessionId = null;

const chatbotService = {
  // Welcome message (local, no API call needed)
  getWelcomeMessage: () => ({
    id: 'welcome',
    text: "👋 Hi! I'm DermaAI, your personal skincare assistant. Ask me anything about acne, skincare routines, and treatments!",
    sender: 'bot',
    timestamp: new Date(),
  }),

  // Suggested questions (local)
  getSuggestedQuestions: () => [
    "What are the different types of acne?",
    "Best routine for oily skin?",
    "How does the AI detection work?",
    "Can diet affect my breakouts?",
  ],

  // Send message to DermaAI backend
  sendMessageToBot: async (message) => {
    try {
      const response = await api.post('/chat/message', {
        message,
        session_id: currentSessionId,
      });

      if (response.data.success) {
        currentSessionId = response.data.data.session_id;
        return response.data.data.message;
      }
      throw new Error('Failed to get response');

    } catch (error) {
      console.error('Chatbot error:', error);
      return "⚠️ I'm having trouble connecting to the skincare server. Please check your connection.";
    }
  },

  // Reset session
  resetSession: () => {
    currentSessionId = null;
  },

  getSessionId: () => currentSessionId,
};

export default chatbotService;

// Named exports to match your existing Chatbot.jsx imports
export const getWelcomeMessage = chatbotService.getWelcomeMessage;
export const getSuggestedQuestions = chatbotService.getSuggestedQuestions;
export const sendMessageToBot = chatbotService.sendMessageToBot;