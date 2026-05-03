# AI Smart Society Management System

Full-stack AI-powered housing society management system using FastAPI, React, SQLite, Ollama, and CrewAI.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Ollama installed locally (or via Docker)

### 1. Pull Ollama model
```bash
ollama pull mistral
```

### 2. Start all services
```bash
docker compose up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Ollama   | http://localhost:11434 |

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
PYTHONPATH=.. uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## Project Structure

```
smart-society/
├── backend/
│   ├── main.py                  # FastAPI app entry
│   ├── requirements.txt
│   ├── routes/
│   │   ├── complaints.py        # POST/GET /complaint
│   │   ├── chat.py              # POST /chat
│   │   ├── maintenance.py       # POST/GET /maintenance
│   │   └── deploy.py            # POST /deploy
│   ├── models/
│   │   └── schemas.py           # Pydantic models
│   └── services/
│       └── ollama_service.py    # Ollama API wrapper
├── agents/
│   ├── complaint_agent.py       # CrewAI complaint classifier
│   ├── maintenance_agent.py     # Predictive maintenance agent
│   └── devops_agent.py          # DevOps executor agent
├── database/
│   └── db.py                    # SQLite init + connection
├── frontend/
│   ├── src/
│   │   ├── App.js / App.css
│   │   ├── api.js               # API client
│   │   └── pages/
│   │       ├── ComplaintsPage.js
│   │       ├── ChatPage.js
│   │       ├── MaintenancePage.js
│   │       └── DevOpsPage.js
│   └── public/index.html
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── .github/workflows/ci.yml
└── docker-compose.yml
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /complaint/ | Submit + AI classify complaint |
| GET | /complaint/ | List all complaints |
| PATCH | /complaint/{id}/status | Update status |
| POST | /chat/ | AI chat with DB context |
| GET | /chat/history | Chat history |
| POST | /maintenance/ | Report + predict risk |
| GET | /maintenance/ | List maintenance log |
| POST | /deploy/ | Run DevOps action |
| GET | /deploy/status | System status |

## Zip Project
```bash
zip -r project.zip smart-society/
```
