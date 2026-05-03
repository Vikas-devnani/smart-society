from fastapi import APIRouter, HTTPException
from database.db import get_conn
from backend.models.schemas import ResidentCreate

router = APIRouter()

@router.get("/")
def list_residents():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM residents ORDER BY flat_number").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_resident(data: ResidentCreate):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO residents (name, flat_number, role, contact) VALUES (?,?,?,?)",
            (data.name, data.flat_number, data.role, data.contact)
        )
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"created": True}

@router.delete("/{resident_id}")
def delete_resident(resident_id: int):
    conn = get_conn()
    conn.execute("DELETE FROM residents WHERE id=?", (resident_id,))
    conn.commit()
    conn.close()
    return {"deleted": True}