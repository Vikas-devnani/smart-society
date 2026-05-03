from pydantic import BaseModel
from typing import Optional

class ComplaintCreate(BaseModel):
    title: str
    description: str
    flat_number: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

class MaintenanceCreate(BaseModel):
    equipment: str
    issue: str

class DeployRequest(BaseModel):
    action: str
    target: Optional[str] = "backend"

class ResidentCreate(BaseModel):
    name: str
    flat_number: str
    role: Optional[str] = "resident"
    contact: Optional[str] = None

class PaymentCreate(BaseModel):
    flat_number: str
    amount: float
    status: Optional[str] = "pending"
    due_date: Optional[str] = None

class NoticeCreate(BaseModel):
    title: str
    content: str

class BookingCreate(BaseModel):
    flat_number: str
    facility: str
    date: str