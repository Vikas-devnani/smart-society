from fastapi import APIRouter
from database.db import get_conn
from backend.models.schemas import PaymentCreate

router = APIRouter()

@router.get("/")
def list_payments():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM payments ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_payment(data: PaymentCreate):
    conn = get_conn()
    conn.execute(
        "INSERT INTO payments (flat_number, amount, status, due_date) VALUES (?,?,?,?)",
        (data.flat_number, data.amount, data.status, data.due_date)
    )
    conn.commit()
    conn.close()
    return {"created": True}

@router.patch("/{payment_id}/status")
def update_payment_status(payment_id: int, status: str):
    conn = get_conn()
    conn.execute("UPDATE payments SET status=? WHERE id=?", (status, payment_id))
    conn.commit()
    conn.close()
    return {"updated": True}