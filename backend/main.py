from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from backend.routes import complaints, chat, deploy, maintenance
from backend.routes import residents, payments, notices, bookings, insights

app = FastAPI(title="AI Smart Society Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(complaints.router, prefix="/complaint", tags=["Complaints"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(deploy.router, prefix="/deploy", tags=["DevOps"])
app.include_router(maintenance.router, prefix="/maintenance", tags=["Maintenance"])
app.include_router(residents.router, prefix="/residents", tags=["Residents"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(notices.router, prefix="/notices", tags=["Notices"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

@app.get("/health")
def health():
    return {"status": "ok"}