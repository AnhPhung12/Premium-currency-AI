import google.generativeai as genai
from app.core.config import settings

# Initialize Gemini if key is provided
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    # Sử dụng model mới nhất của Gemini
    model = genai.GenerativeModel('gemini-3.5-flash')
else:
    model = None

async def get_market_analysis(base: str, target: str, language_code: str):
    if not model:
        return "Gemini API key is missing. Please configure GEMINI_API_KEY in the .env file."
    
    prompt = (
        f"You are a top-tier financial analyst. Provide a market analysis for the {target} currency and its country's stock market, compared to {base}.\n"
        f"Requirements:\n"
        f"1. Discuss recent exchange rate trends between {base} and {target}.\n"
        f"2. Discuss the current state and recent fluctuations of the stock market in the {target} country.\n"
        f"3. Provide a brief future prediction or outlook.\n"
        f"4. Format the output professionally using Markdown (headings, bold text, bullet points).\n"
        f"5. IMPORTANT: Your entire response MUST be written in the language corresponding to this language code: {language_code}. Do not use English unless the code is EN."
    )

    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"Lỗi gọi Gemini AI: {e}"

async def ask_ai_chat(message: str, base: str, target: str, language_code: str):
    if not model:
        return "Gemini API key is missing."
    
    prompt = (
        f"You are a versatile, highly intelligent AI assistant named Premium AI. You can answer absolutely any question the user asks, from finance to coding, daily life, science, and more. You are not restricted to any specific domain.\n"
        f"User message: {message}\n"
        f"Please reply clearly in the language: {language_code}."
    )

    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Lỗi gọi Gemini AI: {e}"

async def get_short_insight(amount: str, target: str, language_code: str):
    if not model:
        return ""
    
    prompt = (
        f"You are a helpful assistant. The user converted {amount} {target}. "
        f"Spell out this exact amount in words using the language code: '{language_code}'. "
        f"IMPORTANT: You MUST write the words strictly in the requested language. Do NOT use Vietnamese unless the code is 'VI'. If the code is 'KO', write completely in Korean. Just the spelled out amount, no other text."
    )

    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        err = str(e)
        if '429' in err or 'quota' in err.lower():
            return "(AI đang quá tải/vượt hạn mức, vui lòng thử lại sau)"
        return "(Lỗi hệ thống AI)"
