import pytesseract
from PIL import Image
import io
from groq import Groq
from app.core.config import settings

# Set tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

client = Groq(api_key=settings.GROQ_API_KEY)


def extract_ingredients_from_image(image_bytes: bytes) -> str:
    """Extract text from product image using OCR."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"OCR error: {e}")
        return ""


def analyze_product_for_acne(
    ingredients_text: str,
    acne_types: list,
    severity: str
) -> dict:
    """Use Groq AI to analyze ingredients for acne suitability."""

    if not ingredients_text:
        return {
            "success": False,
            "error": "Could not extract text from image. Please ensure the ingredients list is clearly visible."
        }

    acne_info = f"Acne types: {', '.join(acne_types) if acne_types else 'unknown'}, Severity: {severity or 'unknown'}"

    prompt = f"""You are an expert dermatologist and cosmetic chemist. Analyze these product ingredients for someone with acne.

USER'S SKIN CONDITION:
{acne_info}

PRODUCT INGREDIENTS FROM IMAGE:
{ingredients_text}

Please provide a detailed analysis in this exact JSON format:
{{
  "product_name": "guess the product type if possible",
  "overall_rating": "Safe / Use with Caution / Avoid",
  "suitability_score": <number 1-10>,
  "comedogenic_ingredients": ["list", "of", "pore-clogging", "ingredients found"],
  "beneficial_ingredients": ["list", "of", "acne-fighting", "or", "beneficial ingredients found"],
  "harmful_ingredients": ["list", "of", "ingredients", "to", "avoid for this acne type"],
  "recommendation": "detailed paragraph about whether to use this product",
  "alternative_suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "key_concerns": ["concern 1", "concern 2"],
  "disclaimer": "This analysis is for informational purposes only. Consult a dermatologist for medical advice."
}}

Respond ONLY with the JSON, no other text."""

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
        )

        import json
        raw = response.choices[0].message.content.strip()
        # Clean markdown if present
        raw = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw)
        return {"success": True, "analysis": result}

    except Exception as e:
        print(f"Groq analysis error: {e}")
        return {
            "success": False,
            "error": "Failed to analyze ingredients. Please try again."
        }