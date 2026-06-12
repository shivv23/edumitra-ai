# EduMitra AI — Operations Runbook

## Deployment

### Prerequisites
- Railway account (backend)
- Vercel account (frontend)
- Supabase project
- All API keys obtained (Gemini, Claude, Sarvam AI, WhatsApp, LangSmith)

### Backend (Railway)
```bash
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
vercel login
vercel --prod
```

## Monitoring & Alerting

### LangSmith Tracing
- Traces ALL agent executions.
- PII and student message content are REDACTED from traces.
- Configured via `LANGCHAIN_API_KEY` and `LANGCHAIN_PROJECT`.

### Health Check
- Endpoint: `GET /health`
- Expected: `{"status": "ok", "version": "0.1.0"}`

### Abuse Monitoring
- Rate limit breaches are logged with source IP.
- Alert threshold: >100 rate limit hits in 5 minutes from same IP.
- Error spike alert: >5% error rate in 10-minute window.

## Incident Response Checklist

### 1. Security Incident (Data Breach / Unauthorized Access)
- [ ] Rotate all compromised credentials immediately.
- [ ] Check Supabase access logs for unauthorized queries.
- [ ] Verify RLS policies are still active.
- [ ] Trigger right-to-erasure if PII exposed.
- [ ] Notify affected users per legal obligation.

### 2. Service Outage
- [ ] Check Railway dashboard for deployment status.
- [ ] Check Supabase status page.
- [ ] Verify health endpoint.
- [ ] Check recent deploys for breaking changes.
- [ ] Rollback if necessary.

### 3. Abuse / Rate Limit Flood
- [ ] Identify offending IP(s) from logs.
- [ ] Block at infrastructure level.
- [ ] Review rate limit thresholds.
- [ ] Check for compromised API keys.

### 4. LLM API Cost Spike
- [ ] Check LangSmith for unusual usage patterns.
- [ ] Verify per-user generation budgets.
- [ ] Check for prompt injection causing infinite loops.

## Secrets Rotation
See `secrets-checklist.md` for detailed rotation steps.
