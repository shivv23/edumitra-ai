# Week 0 Plan — EduMitra AI

## Goal
Establish all foundations so Week 1 onwards is pure feature delivery. End-state: an end-to-end smoke test passes — user asks a question → agent returns a study plan → UI renders it.

---

## Day 1: Architecture & Design Freeze

### Deliverables
- [ ] Finalized feature scope (must-have vs nice-to-have)
- [ ] Architecture diagram (multi-agent flow, data pipelines)
- [ ] API contract: all endpoints, request/response shapes
- [ ] DB schema: Supabase tables (users, study_plans, quiz_attempts, wellness_data, teacher_reports)
- [ ] DPDP Act 2023 compliance map: every data field → privacy requirement

### Success Check
All design documents reviewed and frozen by EOD. No scope changes without re-freeze.

---

## Day 2: Tech Spike — End-to-End Agent Call

### Deliverables
- [ ] One real end-to-end agent call working: Claude (Sonnet 4) → generates study plan → returns structured response
- [ ] LangGraph supervisor routing (Learning Agent) verified
- [ ] ChromaDB seeded with minimum 5 NCERT chunks, retrieval working
- [ ] Identify any architectural flaws before Week 1

### Success Check
A POST to `/api/study/plan` with a topic returns a valid study plan rendered in the frontend.

---

## Day 3: Accounts, API Keys & Infra

### Deliverables
- [ ] All accounts created and keys verified:
  | Service | Key Name | Purpose | Verified? |
  |---------|----------|---------|-----------|
  | Gemini | `GEMINI_API_KEY` | Fallback LLM | [ ] |
  | Claude (Anthropic) | `CLAUDE_API_KEY` | Primary LLM | [ ] |
  | Sarvam AI | `SARVAM_API_KEY` | Speech-to-text | [ ] |
  | Stability AI | `STABLE_DIFFUSION_API_KEY` | Image generation | [ ] |
  | LangChain | `LANGCHAIN_API_KEY` | Tracing (optional) | [ ] |
  | Supabase | Project URL + anon key + service key | DB + Auth | [ ] |
- [ ] Railway account + Hobby plan ($5/mo)
- [ ] Vercel account + project linked to GitHub
- [ ] GitHub private repo with branch protection (main locked, PRs required)
- [ ] `.env.example` committed (actual keys in 1Password / vault)

### Success Check
All 7 services respond to a test call. Railway + Vercel show green deployments.

---

## Day 4 (Morning): CI/CD & Monorepo Scaffold

### Deliverables
- [ ] Monorepo structure:
  ```
  edumitra-ai/
  ├── frontend/          # Next.js 14 (App Router)
  ├── backend/           # FastAPI (Python 3.11)
  ├── agents/            # LangGraph multi-agent orchestration
  ├── docs/              # Architecture, contracts, compliance
  └── infra/             # Dockerfiles, railway.toml, render.yaml
  ```
- [ ] `requirements.txt` + `package.json` with pinned versions
- [ ] `Dockerfile` + `railway.toml` for backend
- [ ] `vercel.json` for frontend
- [ ] CI pipeline: `lint → test → build → deploy preview`
- [ ] Pre-commit hooks (ruff, eslint, secret scan)
- [ ] `GET /api/health` returns `{ "status": "ok", "version": "0.1.0" }`
- [ ] Frontend "hello world" on Vercel URL

### Success Check
Both `https://edumitraai.vercel.app` (frontend) and `https://edumitraai-api.up.railway.app/health` (backend) return 200.

---

## Day 4 (Afternoon): Week 1 Sprint Kickoff

### Deliverables
- [ ] GitHub Issues created for all Week 1 tasks
- [ ] Owners assigned per module (Learning, Wellness, Voice, Teacher/Parent, Data Protection)
- [ ] Definition of Done documented per module
- [ ] Cost projection spreadsheet (tokens/session × expected users × 6 weeks)
- [ ] Fallback chains documented for every API dependency
- [ ] Standup schedule set

### Success Check
Team confirms readiness. Go / No-Go decision documented.

---

## End-of-Week-0 Success Criteria

1. **E2E smoke test:** User types a topic → backend agent returns study plan → UI renders it
2. **Both URLs live:** Frontend (Vercel) and Backend (Railway) return 200
3. **CI/CD green:** Push to `main` triggers lint → test → build → deploy, all pass
4. **All keys active:** 7 services respond to test calls
5. **Cost model known:** Projected monthly LLM spend documented
6. **Fallback chains defined:** Every API dependency has a `plan_b`
7. **Go / No-Go:** Decision documented with rationale
