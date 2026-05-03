from fastapi import APIRouter, HTTPException
from backend.models.schemas import ComplaintCreate
from database.db import get_conn
from backend.services.ollama_service import classify_complaint
from agents.complaint_agent import run_complaint_agent

router = APIRouter()

@router.post("/")
async def create_complaint(data: ComplaintCreate):
    classification = await classify_complaint(data.title, data.description)
    agent_result = await run_complaint_agent(data.title, data.description, classification)

    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "INSERT INTO complaints (title, description, category, priority, flat_number) VALUES (?,?,?,?,?)",
        (data.title, data.description, classification["category"], classification["priority"], data.flat_number)
    )
    conn.commit()
    complaint_id = c.lastrowid
    conn.close()

    return {
        "id": complaint_id,
        "classification": classification,
        "agent_response": agent_result
    }

@router.get("/")
def list_complaints():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM complaints ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/{complaint_id}")
def get_complaint(complaint_id: int):
    conn = get_conn()
    row = conn.execute("SELECT * FROM complaints WHERE id=?", (complaint_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return dict(row)

@router.patch("/{complaint_id}/status")
def update_status(complaint_id: int, status: str):
    conn = get_conn()
    conn.execute("UPDATE complaints SET status=? WHERE id=?", (status, complaint_id))
    conn.commit()
    conn.close()
    return {"updated": True}