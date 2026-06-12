# EduMitra AI

Multi-agent personalized learning and mental wellness companion for Indian students (grades 6–12). Combines LLMs (Gemini, Claude), voice AI (Sarvam), RAG (ChromaDB), and deterministic wellness triage into a single platform.

## Architecture

```
frontend/          — Next.js 14 (App Router), Tailwind, TypeScript
backend/           — FastAPI (Python 3.12), Supabase, httpx
agents/            — LangGraph supervisor + specialized agents
├── langgraph/     — Graph orchestration, sanitizer, circuit breaker, guardrails
├── content_gen/   — Explanations, quizzes, mind maps, image gen (Stable Diffusion)
├── rag/           — ChromaDB vector store + curriculum retrieval
├── bhasha/        — Sarvam AI STT/TTS for 11 Indian languages
├── wellness/      — Crisis classifier + check-in processing
├── progress/      — Mastery tracking, burnout risk, alert dispatch
├── multimodal/    — Image upload validation + vision analysis
```

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- A Supabase project (free tier works)
- API keys (see below)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
cp ../.env.example ../.env  # Then fill in your keys
uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Already done — edit with your Supabase keys
npm run dev
```

### API Keys Required

| Key | Source | Used By |
|-----|--------|---------|
| `GEMINI_API_KEY` | aistudio.google.com | Chat, content generation |
| `CLAUDE_API_KEY` | console.anthropic.com | Content generation (primary) |
| `SARVAM_API_KEY` | dashboard.sarvam.ai | Voice STT/TTS in 11 Indian languages |
| `STABLE_DIFFUSION_API_KEY` | platform.stability.ai | Image generation |
| `LANGCHAIN_API_KEY` | smith.langchain.com | LangSmith tracing |
| `SUPABASE_*` | supabase.com | Database, auth, storage |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/study/query` | Chat with AI tutor |
| `POST` | `/api/langgraph/query` | Full LangGraph supervisor pipeline |
| `POST` | `/api/study/quiz` | Generate quiz |
| `GET` | `/api/study/plan` | Generate study plan |
| `POST` | `/api/study/voice` | Upload audio for STT + AI response |
| `POST` | `/api/generate/image` | Generate image via Stable Diffusion |
| `POST` | `/api/upload` | Upload image for vision analysis |
| `POST` | `/api/wellness/checkin` | Wellness check-in |
| `GET` | `/api/wellness/history` | Wellness history |
| `GET` | `/api/progress` | Study progress |
| `GET` | `/api/progress/burnout-risk` | Burnout risk assessment |
| `GET` | `/api/dashboard` | Student dashboard |
| `GET` | `/api/teacher/students` | Teacher view of students |
| `GET` | `/api/parent/child-progress` | Parent view of child progress |
| `DELETE` | `/api/data/me` | Right to erasure (DPDP Act) |
| `GET` | `/api/data/export` | Data portability export |
| `GET` | `/api/data/retention-policy` | Data retention policy |

## LangGraph Supervisor

The supervisor graph routes user input to the appropriate agent:

```
process_input → classify_intent → [curriculum_rag | content_gen | wellness | ...] → final_output
```

Each agent node is wrapped with a circuit breaker (timeout + retry). All inputs are sanitized, all outputs pass through a guardrail.

## Security

- Prompt injection sanitizer on every untrusted input path
- Output guardrail filters system prompt leaks, PII, harmful content
- Image uploads validated by magic bytes, not extension
- Wellness triage is deterministic (keyword-based), never diagnoses
- Encryption at rest for wellness/sentiment data
- DPDP Act 2023 compliance: right to erasure, data portability, retention policy

## Testing

```bash
pytest tests/ -v
```

## License

Apache 2.0
