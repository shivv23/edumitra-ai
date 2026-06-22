# EduMitra AI — Architecture

## High-Level System Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js 14)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Dashboard│  │  Study   │  │ Wellness │  │ Teacher  │  │  Parent  │  │
│  │  (Home)  │  │  Plan    │  │ Check-in │  │ Dashboard│  │ Dashboard│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│            ┌─────────────────────────────────────────┐                  │
│            │       api.ts (fetch layer)              │                  │
│            │  Mock data fallback for demo offline     │                  │
│            └─────────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
                              │  HTTPS (REST)
                              ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI / Python)                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                     Router Layer (api.py)                          │  │
│  │  /api/study/*  /api/quiz/*  /api/wellness/*  /api/teacher/*       │  │
│  │  /api/parent/* /api/generate/* /api/data/*  /api/langgraph/*      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│         ┌────────────────────┼────────────────────────┐                  │
│         ▼                    ▼                        ▼                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐         │
│  │  Learning     │   │  Wellness    │   │  LangGraph           │         │
│  │  Agent        │   │  Agent       │   │  Supervisor          │         │
│  │               │   │              │   │                      │         │
│  │  • Content Gen│   │  • Sentiment │   │  Routes intent to    │         │
│  │  • Quiz Gen   │   │    Analysis  │   │  correct agent       │         │
│  │  • Flashcard  │   │  • Crisis    │   │  • study → Learning  │         │
│  │    Generator  │   │    Detection │   │  • wellness → Wellness│         │
│  │  • RAG        │   │    (rule)    │   │  • voice → Voice→LLM │         │
│  └──────┬───────┘   └──────┬───────┘   └──────────────────────┘         │
│         │                  │                                            │
│         ▼                  ▼                                            │
│  ┌──────────────┐   ┌──────────────┐                                    │
│  │ ChromaDB     │   │ Supabase     │                                    │
│  │ (Vector      │   │ (PostgreSQL) │                                    │
│  │  Store)      │   │              │                                    │
│  │  • NCERT     │   │  • users     │                                    │
│  │    chunks    │   │  • study_    │                                    │
│  │  • 0.65      │   │    plans     │                                    │
│  │    threshold │   │  • quiz_     │                                    │
│  └──────────────┘   │    attempts  │                                    │
│                     │  • wellness_ │                                    │
│  ┌──────────────┐   │    data      │                                    │
│  │ External APIs │   │  • teacher_ │                                    │
│  │  • Claude    │   │    reports   │                                    │
│  │  • Gemini    │   └──────────────┘                                    │
│  │  • Sarvam STT│                                                     │
│  │  • Stability │                                                     │
│  │    AI        │                                                     │
│  └──────────────┘                                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

## Multi-Agent Orchestration Flow

```
User Input
    │
    ▼
┌──────────────────────┐
│  LangGraph Router    │
│  (intent classifier) │
└──────┬───────────────┘
       │
       ├── "study" ──────────► Learning Agent
       │                          │
       │                          ├─► ChromaDB retrieval (NCERT)
       │                          ├─► Claude/Gemini (content gen)
       │                          └─► Response
       │
       ├── "wellness" ────────► Wellness Agent
       │                          │
       │                          ├─► Sentiment classifier
       │                          ├─► Crisis detection (rule-based)
       │                          └─► Response + alert (if risk)
       │
       ├── "voice" ──────────► Voice Handler
       │                          │
       │                          ├─► Sarvam STT / Web Speech API
       │                          ├─► Gemini chat
       │                          └─► Response
       │
       └── "teacher/parent" ─► Supabase query
                                  │
                                  ├─► Aggregate progress
                                  ├─► At-risk detection
                                  └─► Response
```

## Data Flow — Request Lifecycle

```
1. User submits query via UI
2. api.ts sends POST to FastAPI router
3. Router authenticates (if needed), parses request
4. LangGraph supervisor classifies intent
5. Appropriate agent executes:
   a. Learning: Retrieves context from ChromaDB → LLM generates response
   b. Wellness: Runs sentiment classifier → persists to Supabase
   c. Voice: STT → LLM → TTS (if needed)
6. Response returned to UI
7. UI renders in glassmorphism cards
```

## Deployment Architecture

```
┌─────────────────────┐     ┌─────────────────────────┐
│   Vercel (CDN)     │     │   Railway (Compute)      │
│   edumitraai.      │     │   edumitraai-api.        │
│   vercel.app       │◄────┤   up.railway.app         │
│                     │     │                          │
│  • Next.js (SSR)   │     │  • FastAPI (uvicorn)     │
│  • Static assets   │     │  • ChromaDB (persistent) │
│  • Mock data mode  │     │  • Agents (LangGraph)    │
│                     │     │  • External API calls   │
└─────────────────────┘     └──────────┬───────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Supabase      │
                              │   (PostgreSQL)  │
                              │   Managed DB    │
                              └─────────────────┘
```

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM Primary | Claude Sonnet 4 | Better educational content quality |
| LLM Fallback | Gemini 2.5 Flash | Free tier, handles high volume |
| Vector Store | ChromaDB | Local persistent, no cloud service needed |
| Database | Supabase (PostgreSQL) | Managed, RLS, auth built-in |
| Frontend Framework | Next.js 14 + App Router | Vercel-native, RSC, fast CDN |
| Backend Framework | FastAPI | Async, Python-native for ML/LLM libs |
| STT Primary | Web Speech API (browser) | Free, 11 Indian languages, zero server load |
| STT Fallback | Sarvam AI | Indian language optimized |
| Auth (demo) | Removed | All pages hardcoded defaults for demo |
| Wire Format | camelCase JSON | Per identifier-naming convention |
