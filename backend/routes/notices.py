from fastapi import APIRouter
from database.db import get_conn
from backend.models.schemas import NoticeCreate

router = APIRouter()

@router.get("/")
def list_notices():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM notices ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_notice(data: NoticeCreate):
    conn = get_conn()
    conn.execute("INSERT INTO notices (title, content) VALUES (?,?)", (data.title, data.content))
    conn.commit()
    conn.close()
    return {"created": True}

@router.delete("/{notice_id}")
def delete_notice(notice_id: int):
    conn = get_conn()
    conn.execute("DELETE FROM notices WHERE id=?", (notice_id,))
    conn.commit()
    conn.close()
    return {"deleted": True}