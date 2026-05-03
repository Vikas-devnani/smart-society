from fastapi import APIRouter
from backend.models.schemas import MaintenanceCreate
from agents.maintenance_agent import run_maintenance_agent
from database.db import get_conn

router = APIRouter()

@router.post("/")
async def create_maintenance(data: MaintenanceCreate):
    return await run_maintenance_agent(data.equipment, data.issue)

@router.get("/")
def list_maintenance():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM maintenance ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]
