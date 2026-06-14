# TRADEEV2 — Technical Stack Summary

## Stack (Final Decision)

```
Frontend/Backend: Next.js 16+ (App Router, TypeScript)
Database: PostgreSQL (Vercel Postgres or self-hosted)
Hosting: Vercel
Authentication: Clerk (installers + admin)
Payments: Stripe (subscriptions MVP+1)
Email: Resend or SendGrid (transactional)
Analytics: Vercel Analytics + custom event tracking
```

## Why This Stack

- **Full-stack in one codebase** (frontend + backend + admin in Next.js)
- **No lock-in** (can migrate off Vercel anytime; PostgreSQL is standard)
- **Scales easily** (Vercel auto-scales, PostgreSQL supports millions of leads)
- **Developer velocity** (Claude + TypeScript = fast, safe builds)
- **Cost-effective MVP** (~$55/month before revenue)

## MVP Database Schema (Simplified)

```sql
-- Installers
CREATE TABLE installers (
  id UUID PRIMARY KEY,
  clerk_user_id VARCHAR(255) UNIQUE,
  business_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  service_suburbs TEXT[],
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);

-- Customer Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  suburb VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP
);

-- Lead Routing
CREATE TABLE leads_sent (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  installer_id UUID REFERENCES installers(id),
  installer_response VARCHAR(50),  -- 'interested', 'not_relevant', null
  sent_at TIMESTAMP
);

-- Daily Analytics
CREATE TABLE analytics_daily (
  id UUID PRIMARY KEY,
  installer_id UUID REFERENCES installers(id),
  date DATE,
  search_impressions INT,
  profile_views INT,
  call_clicks INT,
  email_clicks INT,
  leads_received INT
);
```

## Key API Routes (MVP)

```
GET  /api/installers                 -- List installers
GET  /api/installers/:id             -- Installer detail
POST /api/leads                      -- Submit customer inquiry
GET  /api/suburbs                    -- List North Shore suburbs

(Authenticated)
GET  /api/installers/me              -- My profile
PUT  /api/installers/me              -- Edit profile
GET  /api/leads/me                   -- My leads
PUT  /api/leads/:id/response         -- Mark interested/not relevant
GET  /api/analytics/me               -- My analytics

(Admin)
GET  /api/admin/installers/pending   -- Approval queue
POST /api/admin/installers/:id/approve
```

## Deployment

```bash
# Vercel auto-deploys on git push
git push origin main

# Environment variables (Vercel dashboard):
DATABASE_URL=postgres://...
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
```

## Performance Targets

- Page load: <2s (Vercel + PostgreSQL optimized)
- Lead submission: <500ms
- Admin approval: <100ms
- Analytics queries: <1s

## Migration Path (Future)

**Can easily move to:**
- Self-hosted PostgreSQL (if Vercel Postgres becomes expensive)
- Any Node.js host (AWS, DigitalOcean, Heroku)
- Different auth provider (Auth0, NextAuth)
- Different payment processor (Paddle, Chargebee)

**No vendor lock-in.**
