from backend.services.ollama_service import ask_ollama
from database.db import get_conn

RISK_RULES = {
    "pump":      {"keywords": ["noise", "vibration", "leak", "overheat"], "risk": "high"},
    "elevator":  {"keywords": ["stuck", "noise", "jerk", "slow", "door"], "risk": "critical"},
    "generator": {"keywords": ["fail", "smoke", "overheat", "fuel"],      "risk": "critical"},
    "light":     {"keywords": ["flicker", "off", "burnt"],                "risk": "medium"},
    "pipe":      {"keywords": ["leak", "burst", "clog", "drip"],          "risk": "high"},
}

def predict_risk(equipment: str, issue: str) -> str:
    for eq_key, config in RISK_RULES.items():
        if eq_key in equipment.lower():
            for kw in config["keywords"]:
                if kw in issue.lower():
                    return config["risk"]
    return "low"

async def run_maintenance_agent(equipment: str, issue: str) -> dict:
    risk = predict_risk(equipment, issue)
    conn = get_conn()
    conn.execute(
        "INSERT INTO maintenance (equipment, issue, risk_level) VALUES (?,?,?)",
        (equipment, issue, risk)
    )
    conn.commit()
    conn.close()
    action = await ask_ollama(
        f"Equipment: {equipment}\nIssue: {issue}\nRisk: {risk}\nGive a 2-sentence maintenance plan.",
        "You are a building maintenance engineer."
    )
    return {"equipment": equipment, "risk_level": risk, "action": action}