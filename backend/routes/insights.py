from fastapi import APIRouter
from database.db import get_conn

router = APIRouter()

@router.get("/")
def get_insights():
    conn = get_conn()
    total_complaints = conn.execute("SELECT COUNT(*) as c FROM complaints").fetchone()["c"]
    open_complaints = conn.execute("SELECT COUNT(*) as c FROM complaints WHERE status='open'").fetchone()["c"]
    resolved_complaints = conn.execute("SELECT COUNT(*) as c FROM complaints WHERE status='resolved'").fetchone()["c"]
    by_category = conn.execute("SELECT category, COUNT(*) as cnt FROM complaints GROUP BY category ORDER BY cnt DESC").fetchall()
    by_priority = conn.execute("SELECT priority, COUNT(*) as cnt FROM complaints GROUP BY priority ORDER BY cnt DESC").fetchall()
    total_residents = conn.execute("SELECT COUNT(*) as c FROM residents").fetchone()["c"]
    pending_payments = conn.execute("SELECT COUNT(*) as c, SUM(amount) as total FROM payments WHERE status='pending'").fetchone()
    critical_maintenance = conn.execute("SELECT COUNT(*) as c FROM maintenance WHERE risk_level IN ('critical','high')").fetchone()["c"]
    recent_notices = conn.execute("SELECT title, created_at FROM notices ORDER BY created_at DESC LIMIT 3").fetchall()
    conn.close()

    return {
        "complaints": {
            "total": total_complaints,
            "open": open_complaints,
            "resolved": resolved_complaints,
            "by_category": [dict(r) for r in by_category],
            "by_priority": [dict(r) for r in by_priority],
            "top_category": by_category[0]["category"] if by_category else "none",
        },
        "residents": {"total": total_residents},
        "payments": {
            "pending_count": pending_payments["c"] or 0,
            "pending_amount": round(pending_payments["total"] or 0, 2),
        },
        "maintenance": {"high_risk_count": critical_maintenance},
        "recent_notices": [dict(r) for r in recent_notices],
    }