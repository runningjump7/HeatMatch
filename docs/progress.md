# HeatMatch Progress

## Current Status
- **Date:** 2026-09-20 (Session 14 - Blog & Marketing Manager)
- **Phase:** Content strategy + marketing automation
- **Live URL:** https://www.heatmatch.nz
- **Languages:** English (/en), Simplified Chinese (/zh-CN), Traditional Chinese (/zh-TW)
- **Custom Domain:** heatmatch.nz (Vercel nameservers, www redirect active)
- **Email System:** Resend configured — sender is `onboarding@resend.dev` (sandbox). Need to verify `heatmatch.nz` domain in Resend to send to real installers.
- **GitHub:** https://github.com/runningjump7/HeatMatch
- **Testing:** 8/8 Playwright smoke tests passing
- **Admin Portal:** https://www.heatmatch.nz/admin (auth: alex@alexvaz.org / Testing123)
- **Blog:** Live at /blog with trilingual support (EN + ZH-CN + ZH-TW)

## Objective
Build HeatMatch: a lead generation platform for heat pump installers. Capture high-quality leads from homeowners, route to verified installers, eventually monetize via subscriptions.

> For sessions prior to 2026-07-04, see [docs/progress-archive.md](docs/progress-archive.md)

---

## Session 2026-09-20 - BLOG & MARKETING MANAGER AGENT

### What Happened
Built a complete blog infrastructure with multilingual support and an AI marketing manager agent to autonomously write and publish blog posts. Also reorganized the project root directory for cleaner structure.

### Blog Infrastructure
- **Blog pages:** Live at `/en/blog`, `/zh-CN/blog`, `/zh-TW/blog`
- **Individual posts:** `/blog/[slug]` with full multilingual support
- **Data structure:** `src/data/blog-posts.ts` (easy to expand)
- **Sample post:** "What is a Heat Pump?" (all 3 languages)
- **Features:** Topic tags, read time, featured posts, pagination

### Marketing Strategy & Audit
- **Marketing strategy:** `docs/marketing-strategy.md` — Q4 goals (2–3 posts/month, 400+ views/post), blog roadmap, SEO targets
- **Blog audit trail:** `docs/blog-audit.md` — logs all published posts (date, slug, views, engagement, notes)
- **Purpose:** Track performance, avoid duplication, inform future content

### Marketing Manager Agent
- **Skill:** `/marketing-write-blog` (reusable, persists across sessions)
- **Workflow:** Interview user → check strategy alignment → verify no duplicates → write post in all 3 languages → draft for review → on approval: auto-update code + git + publish
- **Reference:** `agents/marketing-manager.md` (how to use)

### Also Completed
- **Landing page icons:** Updated "Why HeatMatch" section with 6 new custom SVG icons (phone, shield, tag, checklist, location, documents)
- **Project organization:** Moved docs to `docs/` folder (DEPLOYMENT_CHECKLIST, next-session-prompt, progress); kept root clean with only essential files

### Files Modified/Created
- `src/app/[locale]/blog/page.tsx` — Blog index
- `src/app/[locale]/blog/[slug]/page.tsx` — Individual post page
- `src/data/blog-posts.ts` — Blog data structure + sample post
- `docs/marketing-strategy.md` — Marketing goals & roadmap
- `docs/blog-audit.md` — Post audit trail
- `.claude/skills/marketing-write-blog/SKILL.md` — Agent instructions
- `agents/marketing-manager.md` — User guide
- `public/icons/[6 new icons]` — SVG icons for features

### Validation
- Build: passed, no errors
- Blog pages: live at /en/blog, all icons loading (HTTP 200)
- Agent: tested, workflows documented
- Git: all changes committed + pushed

### Known Issues / Next Steps
- [ ] Write first blog post (queue: "Heat Pump Maintenance Before Winter")
- [ ] Track blog analytics (Google Analytics or Vercel analytics)
- [ ] Implement SEO optimization (keywords, meta tags, internal linking)
- [ ] Expand marketing agent to include SEO and ads optimization (/marketing-plan, /marketing-seo)
- [ ] Update next-session-prompt with blog workflow

---

## Session 2026-09-10 - MIDDLEWARE & AUTH RESTORATION

### What Happened
The admin portal at `/admin` was returning a 404 in production. The i18n localization work from Session 12 (2026-07-04) had **silently replaced the entire middleware**, deleting:
- Admin auth guards (cookie checks, redirect to `/admin-login`)
- Installer auth guards (cookie checks, redirect to `/installer-login`)
- Route-specific logic

The `next-intl` middleware was catching all routes and forcing a `/en/` locale prefix — including `/admin`, which doesn't live under `[locale]`. So `/admin` → redirected to `/en/admin` → 404.

### Root Cause
Commit `5fa768b` ("Add multi-language support") replaced the entire `src/middleware.ts` with a blanket i18n middleware. No blast radius check was done — auth logic was deleted without warning.

### Fix Applied
Rewrote `src/middleware.ts` to combine both concerns:
- **Non-locale routes** (`/admin/*`, `/admin-login`, `/installer-*`, `/api/*`, `/search/*`): skip i18n, apply auth guards
- **Locale routes** (`/en/*`, `/zh-CN/*`, `/zh-TW/*`, `/`): apply i18n middleware

Auth guards restored:
- `/admin/*` without session cookie → redirect to `/admin-login`
- `/admin-login` with session cookie → redirect to `/admin`
- `/installer-dashboard` without session cookie → redirect to `/installer-login`

### Also Fixed
- Missing translation key `form.step5.submitting` — quote form submit button was showing raw key text instead of "Submitting..."
- Added `submitting` and `submit` keys to all 3 translation files (EN, ZH-CN, ZH-TW)

### Validation
- Build: passed, no type errors
- JSON: all 3 translation files valid, keys match across languages
- Route tests: `/admin` → 307 to `/admin-login`, `/en` → 200, `/api/suburbs` → 200
- Playwright: 8/8 smoke tests passed
- Deployed to production via `vercel --prod`

### Files Modified
- `src/middleware.ts` — Rewrote with combined auth + i18n logic
- `messages/en.json` — Added `form.step5.submitting` and `form.step5.submit`
- `messages/zh-CN.json` — Added Chinese simplified translations
- `messages/zh-TW.json` — Added Chinese traditional translations

### Known Issues / Next Steps
- [ ] **Email sending broken for real installers** — sender is `onboarding@resend.dev` (Resend sandbox, only delivers to account owner). Need to verify `heatmatch.nz` domain in Resend (free tier, add 3 DNS records) and update sender address.
- [ ] **Set reply-to header** — so installer replies land in Alex's inbox (zero cost, one code change)
- [ ] `/admin/settings` and `/admin/reports` — nav links exist but pages were never built (404s expected)
- [ ] `NEXT_PUBLIC_BASE_URL` may be empty in Vercel — affects response links in installer emails

---

## Session 2026-07-04 Extended (Complete) - 100% PLATFORM LOCALIZATION

### Session Summary
Achieved complete platform localization across all 3 languages (EN, ZH-CN, ZH-TW). Zero hardcoded English text visible to end users. Every dropdown option, button label, error message, and placeholder translates seamlessly.

**Work completed (13 commits):**
1. Fixed critical translation issues in quote form stepper (steps 3, 4, 5) and recent projects section
2. Implemented locale-aware routing for utility pages (about, contact, privacy, terms)
3. Added comprehensive translations for all 4 utility pages
4. Translated footer component with locale-aware links
5. Translated ALL error messages (photo upload, form submission, generic fallback)
6. Translated ALL form placeholders with language-specific examples
7. Translated contact form (all labels, options, placeholders, success/error messages)
8. Translated confirmation modal completely
9. Added language-specific placeholder names (John Smith/李明/王小明)
10. Fixed root page prerendering error (redirect to /en)
11. Fixed missing contact form dropdown label ("I am a") and all options

**CRITICAL NOTE:** This session's middleware change broke admin portal auth — fixed in Session 2026-09-10.

---

## Session 2026-07-04 (Complete) - PHASE 1 SMOKE TESTING FRAMEWORK

### Session Summary
Implemented automated smoke testing framework. 8 Playwright tests covering all 3 languages, form interactions, API health, and error monitoring.

### What Was Built
- `playwright.config.ts` — Chromium, auto dev server startup, HTML reports
- `tests/e2e/smoke.spec.ts` — 8 smoke tests (all passing)
- `DEPLOYMENT_CHECKLIST.md` — 3-phase testing strategy
- npm scripts: `test:smoke`, `test:smoke:ui`

### Tests
1. Homepage loads in English (200)
2. Homepage loads in Simplified Chinese (200)
3. Homepage loads in Traditional Chinese (200)
4. Quote form modal can be triggered
5. API leads endpoint returns valid status
6. English site has no unhandled 500 errors
7. Simplified Chinese has no unhandled 500 errors
8. Traditional Chinese has no unhandled 500 errors

---

## Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API routes, PostgreSQL (pg driver, Neon)
- **Auth:** Admin (HTTP-only cookies); homeowners don't sign up
- **Database:** PostgreSQL with UUID PKs, timestamps
- **File Storage:** Vercel Blob (public access)
- **Email:** Resend (sandbox mode — needs domain verification for real sending)
- **Deployment:** Vercel (custom domain: heatmatch.nz)
- **i18n:** next-intl v3 (EN, ZH-CN, ZH-TW)

## Database Schema
**leads** — id (UUID), homeowner_name, phone, email, suburb, service_type, property_type, bedrooms, heat_pumps_needed, location_to_install (TEXT[]), existing_unit, photos (TEXT[]), timeline, consent_given, status, admin_notes, assigned_installers (UUID[]), installer_response, installer_response_at, installer_response_from, created_at, updated_at

**installers** — id (UUID), name, phone, email, primary_suburb, service_suburbs (TEXT[]), active, notes, created_at, updated_at

**suburbs** — id (SERIAL), name, postcode, region

## Lead Lifecycle
1. **Creation**: Homeowner submits 5-step quote form → lead created (status: new)
2. **Admin Review**: Review lead details + photos, assess quality (A/B/C tier)
3. **Allocation**: Assign installer in admin → email auto-sent → status: allocated
4. **Installer Response**: Accept/reject/need info via signed email link
5. **Contact**: Installer reaches homeowner → status: contacted
6. **Outcome**: Converted or failed
