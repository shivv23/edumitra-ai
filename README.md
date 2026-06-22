# EduMitra AI

**Team:** shivamkumar0423  
**Live:** https://edumitraai.vercel.app  

An AI tutor + wellness check-in for Indian students grades 6–12. Built around NCERT curriculum, works in 11 Indian languages, and complies with DPDP Act 2023.

---

## Innovation & Creativity (25%)

- **Multi-agent architecture, not a single LLM call.** LangGraph routes intent to specialized agents (learning, wellness, voice, progress). Each has its own model, prompt, and fallback chain. If Claude rate-limits, Gemini takes over. No single point of LLM failure.
- **Wellness triage is deterministic.** No AI diagnoses or prescriptions. A keyword classifier flags crisis signals and offers helpline numbers. The LLM never touches mental health decisions.
- **Voice-native for Indian languages.** Web Speech API handles STT client-side (free, works offline). Sarvam AI is backend fallback. No English dependency.
- **Prompt injection defense** on every user input before it reaches any LLM. Not just a system prompt — actual sanitization logic.

## Technical Implementation (25%)

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind. 11 routes, 16 components. Deployed on Vercel.
- **Backend:** FastAPI, 18 REST endpoints, async throughout. Deployed on Railway via Docker.
- **Auth:** Supabase SSR (email/password), middleware guards every protected route, JWT forwarded to backend.
- **RAG:** ChromaDB with all-MiniLM-L6-v2 embeddings, 29+ NCERT chunks seeded, 0.65 relevance threshold.
- **Orchestration:** LangGraph supervisor with circuit breaker (3 failures = open, 30s timeout per node), 6 agent node types.
- **Tests:** 15 test files covering sanitizer, circuit breaker, crisis detection, XSS, RAG ingestion, file upload, webhook security, RLS isolation, encryption, red-team.
- **CI/CD:** GitHub Actions (lint → test → build), Dependabot for pip/npm, pre-commit hooks (gitleaks, bandit, ruff).

## Problem-Solving Approach (20%)

The problem: 250M+ Indian students across CBSE/state boards, with no personalized learning adaptation. 53% report anxiety. Existing platforms handle academics OR wellness, never both. Most ignore DPDP Act compliance.

The approach:
- **RAG over NCERT,** not generic web data. Answers stay syllabus-aligned.
- **Adaptive difficulty** — quiz performance feeds back into content selection. Weak areas get more practice.
- **Wellness integrated into the same flow**, not a separate app. Student checks mood, gets immediate support if needed, but academics continue uninterrupted.
- **DPDP compliance built in from day one** — erasure endpoint, export, encryption at rest, parental consent gate. Not retrofitted.

## User Experience & Design (15%)

- Dark glassmorphism theme, gradient accents, animated transitions. Consistent across all 9 pages.
- Every button has hover/active feedback. Loading states on every data fetch. Error states with retry buttons.
- Voice mode with language selector (11 Indian languages) built into the study page.
- Wellness helped by real Indian helpline numbers (iCall, Vandrevala, KIRAN, AASRA, Childline).
- Breathing exercise and quick journal tools accessible from the wellness page without leaving the app.

## Scalability & Impact (15%)

- **Stateless backend** — all agents are stateless functions. Scale horizontally behind Railway's load balancer.
- **ChromaDB is persistent and local.** No cloud vector DB dependency. Works offline, no per-query cost.
- **Browser-side STT** for voice — zero server cost per transcription. Sarvam API only used as fallback.
- **LLM cost control** — Claude primary for quality, Gemini fallback for cost. Circuit breaker prevents runaway API calls.
- **DPDP Act 2023** compliance means it can actually be deployed in Indian schools without legal issues.
- **250M addressable users.** No per-user infrastructure cost beyond the database row. RAG scales with index size, not user count.

---

## Quick Start

### Prerequisites
- Python 3.12+, Node.js 18+
- Supabase project (free tier works)
- API keys: Gemini, Claude, Sarvam AI, Stability AI, LangChain

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
cp ../.env.example ../.env  # Fill in your keys
uvicorn src.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
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

## Testing

```bash
pytest tests/ -v
```

## License

Apache 2.0
