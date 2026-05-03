from fastapi import APIRouter
from database.db import get_conn
from backend.models.schemas import BookingCreate

router = APIRouter()

FACILITIES = ["Clubhouse", "Swimming Pool", "Gym", "Badminton Court", "Party Hall", "Terrace Garden"]

@router.get("/")
def list_bookings():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM bookings ORDER BY date DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/")
def create_booking(data: BookingCreate):
    conn = get_conn()
    conn.execute(
        "INSERT INTO bookings (flat_number, facility, date) VALUES (?,?,?)",
        (data.flat_number, data.facility, data.date)
    )
    conn.commit()
    conn.close()
    return {"created": True}

@router.patch("/{booking_id}/status")
def update_booking(booking_id: int, status: str):
    conn = get_conn()
    conn.execute("UPDATE bookings SET status=? WHERE id=?", (status, booking_id))
    conn.commit()
    conn.close()
    return {"updated": True}

@router.get("/facilities")
def get_facilities():
    return FACILITIES