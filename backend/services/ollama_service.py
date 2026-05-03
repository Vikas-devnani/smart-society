from dotenv import load_dotenv
load_dotenv()
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

CATEGORY_RULES = {
    "plumbing":    ["water", "pipe", "leak", "tap", "drain", "flush", "toilet", "bathroom"],
    "electrical":  ["electric", "shock", "wire", "light", "power", "switch", "current", "short"],
    "security":    ["theft", "security", "guard", "cctv", "gate", "stranger", "break"],
    "noise":       ["noise", "loud", "music", "party", "sound", "disturbance"],
    "cleanliness": ["dirty", "garbage", "waste", "smell", "clean", "trash", "litter"],
    "parking":     ["parking", "car", "vehicle", "bike", "blocked", "space"],
}

def rule_based_classify(title: str, description: str) -> dict:
    text = (title + " " + description).lower()
    for category, keywords in CATEGORY_RULES.items():
        for kw in keywords:
            if kw in text:
                priority = "high" if any(w in text for w in ["urgent", "emergency", "danger", "shock", "burst", "fire"]) else "medium"
                return {"category": category, "priority": priority}
    return {"category": "other", "priority": "medium"}

async def ask_ollama(prompt: str, system: str = "") -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    try:
        response = client.chat.completions.create(
            model=MODEL, messages=messages, max_tokens=500
        )
        return response.choices[0].message.content
    except Exception:
        return None

async def classify_complaint(title: str, description: str) -> dict:
    system = (
        "You are a complaint classifier. Respond ONLY with JSON: "
        "{\"category\": <string>, \"priority\": <string>}. "
        "Categories: plumbing, electrical, security, noise, cleanliness, parking, other. "
        "Priorities: low, medium, high, critical."
    )
    result = await ask_ollama(f"Title: {title}\nDescription: {description}", system)
    import json, re
    try:
        if result:
            match = re.search(r'\{.*?\}', result, re.DOTALL)
            if match:
                return json.loads(match.group())
    except Exception:
        pass
    return rule_based_classify(title, description)