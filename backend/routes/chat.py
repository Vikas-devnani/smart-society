from fastapi import APIRouter
from backend.models.schemas import ChatRequest
from database.db import get_conn
from backend.services.ollama_service import ask_ollama

router = APIRouter()
def get_db_context() -> str:
    conn = get_conn()
    complaints = conn.execute(
        "SELECT category, priority, status, COUNT(*) as cnt FROM complaints GROUP BY category, priority, status"
    ).fetchall()
    maintenance = conn.execute(
        "SELECT equipment, risk_level, COUNT(*) as cnt FROM maintenance GROUP BY equipment, risk_level"
    ).fetchall()
    conn.close()

    ctx = "COMPLAINTS SUMMARY:\n"
    for r in complaints:
        ctx += f"  {r['category']} | {r['priority']} priority | {r['status']}: {r['cnt']}\n"
    ctx += "\nMAINTENANCE SUMMARY:\n"
    for r in maintenance:
        ctx += f"  {r['equipment']} | risk: {r['risk_level']}: {r['cnt']}\n"
    return ctx

@router.post("/")
async def chat(req: ChatRequest):
    context = get_db_context()
    system = (
        "You are an AI assistant for a housing society management system. "
        f"Use this real-time data to answer queries:\n{context}\n"
        "Be concise and helpful."
    )
    response = await ask_ollama(req.message, system)

    conn = get_conn()
    conn.execute(
        "INSERT INTO chat_history (user_msg, ai_response) VALUES (?,?)",
        (req.message, response)
    )
    conn.commit()
    conn.close()

    return {"response": response}

@router.get("/history")
def chat_history():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 50").fetchall()
    conn.close()
    return [dict(r) for r in rows]
