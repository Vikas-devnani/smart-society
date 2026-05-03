from fastapi import APIRouter
from backend.models.schemas import DeployRequest
from agents.devops_agent import run_devops_agent

router = APIRouter()

@router.post("/")
async def deploy(req: DeployRequest):
    result = await run_devops_agent(req.action, req.target)
    return result

@router.get("/status")
def deploy_status():
    return {
        "backend": "running",
        "frontend": "running",
        "database": "healthy",
        "agents": "active"
    }
