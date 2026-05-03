from backend.services.ollama_service import ask_ollama

ACTIONS = {
    "status":  "System status: All services running",
    "restart": "Mock restart: Service restarted successfully",
    "logs":    "Mock logs: No errors in last 100 lines",
    "health":  "Health check passed: DB=OK, API=OK",
}

async def run_devops_agent(action: str, target: str) -> dict:
    cmd_output = ACTIONS.get(action, f"Unknown action: {action}")
    analysis = await ask_ollama(
        f"Action: {action} on {target}\nOutput: {cmd_output}\nSummarize in 1 sentence.",
        "You are a DevOps engineer."
    )
    return {"action": action, "target": target, "cmd_output": cmd_output, "analysis": analysis}