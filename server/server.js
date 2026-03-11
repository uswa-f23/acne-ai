import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this matches your React Vite port
}));
app.use(express.json());

// Initialize Gemini with your confirmed API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Skincare Guardrail Prompt
const SYSTEM_PROMPT = `You are AcneAI Assistant, a helpful skincare expert. 
You only answer questions about acne, skincare routines, treatments, and dermatology. 
If a user asks about anything else (politics, coding, sports, etc.), politely decline 
and redirect them to skincare. Keep responses warm and concise.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Use the 2.5 Flash model with native System Instructions
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: "The skincare assistant is currently resting. Please try again in a moment." });
  }
});

// Health check to verify server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', model: 'gemini-2.5-flash' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});