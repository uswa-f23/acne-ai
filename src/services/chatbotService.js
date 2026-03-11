const SERVER_URL = 'http://localhost:5000';

export const getWelcomeMessage = () => ({
  id: 'welcome',
  text: "👋 Hi! I'm your AcneAI Assistant powered by Gemini 2.5. Ask me anything about acne, skincare routines, and treatments!",
  sender: 'bot',
  timestamp: new Date(),
});

export const getSuggestedQuestions = () => [
  "What are the different types of acne?",
  "Best routine for oily skin?",
  "How does the AI detection work?",
  "Can diet affect my breakouts?",
];

export const sendMessageToBot = async (message) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server error');
    }

    const data = await response.json();
    
    // The disclaimer string formatted for ReactMarkdown
    // Using ***"text"*** makes it both Bold and Italicized with quotes
    
    return data.reply ;

  } catch (error) {
    console.error("Chat Error:", error);
    return "⚠️ I'm having trouble connecting to the skincare server. Please check your connection.";
  }
};