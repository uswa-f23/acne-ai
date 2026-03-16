import json
from typing import Optional
from google import genai
from google.genai import types
from app.core.config import settings

MEDICAL_DISCLAIMER = (
    "⚕️ **Medical Disclaimer:** I am an AI assistant for informational purposes only. "
    "I am not a substitute for professional medical advice, diagnosis, or treatment. "
    "Always consult a licensed dermatologist for medical concerns."
)

SYSTEM_PROMPT = """You are DermaAI, an expert AI dermatology assistant built into the Acne AI app.

Your role:
- Answer questions about acne types: blackheads, whiteheads, papules, pustules, cysts, nodules
- Explain acne severity levels: mild, moderate, severe, very severe
- Recommend skincare routines and ingredients (Salicylic Acid, Benzoyl Peroxide, Retinoids, Niacinamide, etc.)
- Explain treatment options both medicated and herbal/natural
- Discuss diet, lifestyle, and habits that affect acne
- Help users understand their scan results from the app
- Clearly recommend seeing a dermatologist when appropriate

Rules you must ALWAYS follow:
1. Be empathetic, warm, and non-judgmental — acne affects self-esteem
2. Always recommend seeing a dermatologist for severe/very severe cases
3. Never diagnose medical conditions — only provide general information
4. Keep responses concise and easy to understand
5. Use bullet points for lists to improve readability
6. If asked about something unrelated to skin/dermatology, politely redirect

Always recommend a dermatologist when:
- Cysts or nodules are present
- Severity is severe or very_severe
- User mentions pain, fever, or spreading infection
- Treatments have not worked after 8 weeks
- Scarring is occurring
"""


class DermaAIChatbot:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def build_context(self, latest_result: Optional[dict] = None) -> str:
        if not latest_result:
            return ""
        context = "\n\n--- USER'S LATEST SCAN RESULT ---\n"
        context += f"Has Acne: {latest_result.get('has_acne')}\n"
        context += f"Acne Types Detected: {', '.join(latest_result.get('acne_types', []))}\n"
        context += f"Severity: {latest_result.get('severity', 'N/A')}\n"
        context += f"Severity Score: {latest_result.get('severity_score', 0)}\n"
        context += "--- END OF SCAN RESULT ---\n"
        context += "Use this information to give personalized advice when relevant.\n"
        return context

    def format_history(self, chat_history: list) -> list:
        formatted = []
        for msg in chat_history:
            role = "user" if msg["role"] == "user" else "model"
            formatted.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=msg["content"])]
                )
            )
        return formatted

    def chat(
        self,
        message: str,
        chat_history: list,
        latest_result: Optional[dict] = None,
        is_first_message: bool = False
    ) -> str:
        try:
            context = self.build_context(latest_result)

            if context and is_first_message:
                full_message = f"{context}\n\nUser question: {message}"
            else:
                full_message = message

            formatted_history = self.format_history(chat_history)

            response = self.client.models.generate_content(
                model=settings.LLM_MODEL,
                contents=formatted_history + [
                    types.Content(
                        role="user",
                        parts=[types.Part(text=full_message)]
                    )
                ],
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=1000,
                )
            )

            reply = response.text

            if is_first_message:
                reply = f"{MEDICAL_DISCLAIMER}\n\n{reply}"

            return reply

        except Exception as e:
            print(f"Gemini error: {e}")
            return (
                "I'm sorry, I'm having trouble responding right now. "
                "Please try again in a moment."
            )


chatbot = DermaAIChatbot()