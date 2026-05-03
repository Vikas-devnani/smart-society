from backend.services.ollama_service import ask_ollama

ACTION_PLANS = {
    "plumbing": "Maintenance team will inspect and repair the plumbing issue within 24 hours. Residents are advised to use alternative water sources in the meantime.",
    "electrical": "Electrician will be dispatched within 4 hours to assess and fix the issue. Avoid using affected switches until resolved.",
    "security": "Security supervisor has been notified and will investigate immediately. Additional patrol has been scheduled for the area.",
    "noise": "Society management will issue a formal notice to the concerned flat. Repeat violations will be escalated to the committee.",
    "cleanliness": "Housekeeping team will clean the area within 2 hours. Regular cleaning schedule will be reviewed.",
    "parking": "Parking committee has been notified. A warning notice will be issued to the vehicle owner.",
    "other": "Complaint has been logged and assigned to the society manager. You will be updated within 48 hours.",
}

async def run_complaint_agent(title, description, classification):
    category = classification.get("category", "other")
    try:
        prompt = (
            f"Complaint: {title}\nDetails: {description}\n"
            f"Category: {category}, Priority: {classification.get('priority')}\n"
            "Give a 2-sentence action plan."
        )
        result = await ask_ollama(prompt, "You are a housing society complaint manager.")
        if result:
            return result
        return ACTION_PLANS.get(category, ACTION_PLANS["other"])
    except Exception:
        return ACTION_PLANS.get(category, ACTION_PLANS["other"])