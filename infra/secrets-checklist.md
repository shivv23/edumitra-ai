# EduMitra AI — Secrets & Environment Variables Checklist

## Where Secrets Go

| Secret | Destination | Required By |
|--------|------------|-------------|
| `SUPABASE_URL` | Backend env, Vercel/ Railway | Backend + Frontend (public URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend env ONLY. Never in frontend | Backend |
| `SUPABASE_ANON_KEY` | Backend + Frontend (public, RLS-enforced) | Both |
| `ENCRYPTION_KEY` | Backend env ONLY | Backend (Fernet) |
| `GEMINI_API_KEY` | Backend env ONLY | Backend (LLM) |
| `CLAUDE_API_KEY` | Backend env ONLY | Backend (LLM) |
| `STABLE_DIFFUSION_API_KEY` | Backend env ONLY | Backend (Image gen) |
| `SARVAM_API_KEY` | Backend env ONLY | Backend (Voice) |
| `WHATSAPP_ACCESS_TOKEN` | Backend env ONLY | Backend (WhatsApp) |
| `WHATSAPP_APP_SECRET` | Backend env ONLY | Backend (Webhook) |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Backend env ONLY | Backend (Webhook) |
| `LANGCHAIN_API_KEY` | Backend env ONLY | Backend (Tracing) |
| `DATABASE_URL` | Backend env ONLY | Backend |

## Platform Configuration

### Railway (Backend)
1. Add all secrets as Railway Environment Variables (not in repo).
2. Set `DEBUG=false` in production.
3. Set `ALLOWED_ORIGINS` to your frontend domain.
4. Enable Health Check path: `/health`.

### Vercel (Frontend)
1. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`.
2. These are public env vars prefixed with `NEXT_PUBLIC_`.

## Rotation Runbook
1. Generate new key/secret.
2. Update in Railway/Vercel dashboard.
3. Restart backend service.
4. Verify health endpoint returns 200.
5. Run integration tests.
6. Delete old key after 24-hour cooldown period.

## Incident Response
1. If a secret is compromised: immediately rotate it.
2. Check access logs for unauthorized usage.
3. Revoke any exposed tokens.
4. Document the incident and update the runbook.
