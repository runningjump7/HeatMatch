# TRADEEV2 Progress

## Current Status
- **Date:** 2026-06-17 (Session 2)
- **Phase:** MVP Implementation - Enhanced Onboarding ✅
- **Overall Completion:** ~70% (Phase 1A done, onboarding redesigned, Phase 1B/1C pending)
- **Session Work:** Progressive disclosure signup flow, approval status tracking, 4-step setup guide

## Objective
Build MVP installer platform: installers manage profiles & leads, public users search & submit quotes, admin approves businesses.

## Completed (Session 2026-06-17)

### ✅ Text Input Styling (Fixed)
- Added `text-gray-900` to all input fields across the app for dark text visibility
- Fixed password field placeholders (now "Enter password" / "Confirm password")
- Covered: /installer-signup, /installer-login, /admin-login, profile, account, create-business pages

### ✅ Installer Approval System
- Added `approval_status` column to installers table (unverified/verified/rejected)
- Updated dashboard to show "⚠️ Your account is pending approval" banner for unverified users
- Blocked unverified installers from accepting/rejecting leads (403 error + disabled UI)
- Leads page shows warning + disabled buttons until approved

### ✅ Enhanced Signup Flow (Progressive Disclosure)
- **Signup now auto-logs in** → redirects to dashboard immediately
- **Creates installer record** with `approval_status='unverified'` at signup time
- Removed long onboarding form upfront (was causing drop-off)

### ✅ 4-Step Setup Guide Component
- **SetupGuide.tsx**: Interactive checklist showing 4 setup steps with progress bar
- **Step 1: Business Name & Phone** → BasicInfoModal
- **Step 2: Years in Business & Bio** → ExperienceModal
- **Step 3: Primary + Service Suburbs** → ServiceAreasModal
- **Step 4: Portfolio Images** → ImagesModal
- Each step saves independently via updated profile API
- Progress tracks: 0/4 → 4/4 as user completes steps
- All fields optional (can save profile anytime, complete asynchronously)

### ✅ Approval Status Tracking in Leads
- `/api/installer/leads/[id]/accept` now checks `approval_status='verified'`
- Returns 403 if unverified with message "Your account must be verified before accepting leads"

### ✅ Phase 1A: Installer UX (Previously Complete)
- Updated schema: added installers.{years_in_business, profile_active, images[], created_at, updated_at, approval_status, bio, business_name}
- Updated leads table: added status (new/accepted/completed/rejected/unconfirmed), rejection_reason, completed_notes
- Created suburbs table with NZ suburbs (North Shore MVP, autocomplete-ready)

### ✅ Previous Sessions (Foundation & Phase 1A)
- Email+password auth (bcryptjs, 7-day HTTP-only cookies)
- /installer-login, /installer-signup (with auto-login at signup)
- /installer-dashboard (layout + home) with left-hand nav (Dashboard, Leads, Business Listing, Account)
- GET /api/installer/leads?status=[status] - fetch leads for installer
- POST /api/installer/leads/[id]/accept - accept lead (now checks approval_status)
- POST /api/installer/leads/[id]/reject - reject lead with reason
- POST /api/installer/leads/[id]/complete - mark lead completed with notes
- GET/POST /api/installer/profile - fetch/update profile
- GET/POST /api/installer/account - fetch/update account
- /admin-login page + admin dashboard with approval workflow
- Lead capture endpoint (/api/leads)

## Remaining Work (Next Session)

### Phase 1B: Public Search & Lead Capture (~8-10 hours)
- [ ] /search page (search by suburb with installer cards)
- [ ] /search/installer/[id] page (public installer profile)
- [ ] /search/installer/[id]/quote page (quote request form)
- [ ] GET /api/search?suburb=[suburb] - return verified installers
- [ ] GET /api/search/installer/[id] - public profile + increment views
- [ ] Wire leads to increment analytics (search impressions, profile views)

### Phase 1C: Admin Tools (~2-3 hours)
- [ ] /admin/create-business page (manual installer creation)
- [ ] POST /api/admin/create-business endpoint
- [ ] Admin approval/rejection UI in admin dashboard
- [ ] Email notifications when installer approved/rejected (future)

### Homepage & Final Polish (~1-2 hours)
- [ ] Add "Find a Tradee" CTA linking to /search
- [ ] Add "Get a Quote" CTA linking to /search
- [ ] Test full end-to-end flows

### Testing & Deployment (~2-3 hours)
- [ ] End-to-end testing (signup → onboarding → dashboard → leads accepted)
- [ ] Public search flow (search → profile → quote → lead created)
- [ ] Admin flow (create installer → auto-approval → login works)
- [ ] Deploy to Vercel

## Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS (utility-first, no component lib)
- **Backend:** Next.js API routes, PostgreSQL (pg driver)
- **Auth:** bcryptjs (email+password), HTTP-only cookies (7-day expiry)
- **Database:** PostgreSQL with UUID PKs, timestamps
- **Email:** Resend (stubbed for MVP)
- **Payment:** Stripe (MVP+1, stubbed for manual testing)
- **Deployment:** Vercel

## Lead Lifecycle (MVP)
1. **Creation**: Public user submits quote from installer profile → creates lead (status: new, installer_id set)
2. **Acceptance**: Installer accepts lead → status: accepted
3. **Completion**: Installer marks done → status: completed + notes
4. **Rejection**: Installer rejects → status: rejected + reason
5. **Metrics**: Search impressions, profile views tracked in analytics table

## Decisions Log
- 2026-06-16: Completed thorough product discovery before any new code (avoided "figuring it out as we go")
- 2026-06-16: Structured MVP into 3 phases: 1A (installer UX) ✅, 1B (public search), 1C (admin tools)
- 2026-06-16: No email verification, Stripe, or multi-business lead routing in MVP
- 2026-06-16: Single installer per lead (Flow 1); unconfirmed status reserved for MVP+1 multi-business flow
- 2026-06-16: Image URLs stored as TEXT[] in DB (mock upload for MVP)
- 2026-06-16: Lead status on leads table (not leads_sent) for MVP simplicity
- 2026-06-14: Removed Clerk completely, rebuilt with email+password auth
- 2026-06-14: Admin password: Testing123 (for MVP testing only)

## Risks / Mitigations
| Risk | Mitigation |
|------|-----------|
| Multi-image handling in PostgreSQL | Storing as TEXT[]; upgrade to proper JSON/JSONB later |
| Lead routing for MVP+1 | Status "unconfirmed" prepared; logic deferred to MVP+1 |
| Email verification | Stubbed; Resend integration skipped for MVP |
| Analytics complexity | Simple counts in analytics table; increment on page view/lead create |
| Image upload (no cloud storage yet) | Mock URLs for MVP; upgrade to Vercel Blob post-MVP |

## Files Created/Modified (Session 2026-06-17)

**Scripts:**
- scripts/add-approval-status.ts (NEW - add approval_status column)

**Pages:**
- src/app/installer-onboarding/page.tsx (UPDATED - removed, replaced with SetupGuide)
- src/app/installer-signup/page.tsx (UPDATED - now auto-logs in + redirects to dashboard)
- src/app/installer-dashboard/page.tsx (UPDATED - shows SetupGuide + unverified banner)
- src/app/installer-dashboard/leads/page.tsx (UPDATED - checks approval_status, disables buttons)

**Components (NEW):**
- src/components/SetupGuide.tsx (Main 4-step guide component)
- src/components/setup/BasicInfoModal.tsx (Business name + phone)
- src/components/setup/ExperienceModal.tsx (Years + bio)
- src/components/setup/ServiceAreasModal.tsx (Suburbs)
- src/components/setup/ImagesModal.tsx (Portfolio images)

**API Routes (UPDATED):**
- src/app/api/auth/signup/route.ts (UPDATED - creates installer, auto-logs in, sets session cookie)
- src/app/api/installer/onboarding/route.ts (UPDATED - still used for testing, can be removed)
- src/app/api/installer/leads/[id]/accept/route.ts (UPDATED - checks approval_status)

## Estimate Summary (Updated)
- **Phase 1A (Installer UX):** ~15-17 hours ✅ DONE
- **Onboarding Redesign & Approval System:** ~4-5 hours ✅ DONE
- **Phase 1B (Public Search):** ~8-10 hours (ready to start)
- **Phase 1C (Admin Tools):** ~2-3 hours (ready to start)
- **Database & Infrastructure:** ~3-4 hours ✅ DONE
- **Testing & Deployment:** ~2-3 hours (pending)
- **Total MVP:** ~34-42 hours (~70% complete)

## Session 2026-06-17 Summary

### Accomplishments
1. **Fixed Input Text Colors** - All login/signup fields now have dark text (text-gray-900)
2. **Enhanced Signup Flow** - Auto-login + redirect to dashboard (progressive disclosure)
3. **Approval Status System** - Added approval_status tracking (unverified/verified/rejected)
4. **4-Step Setup Guide** - Interactive onboarding checklist with progress bar + 4 modals
5. **Blocked Unverified Actions** - Installers can't accept leads until verified
6. **Improved UX** - "Get in the door fast" psychology: signup → dashboard → self-serve setup

### Key Design Decisions
- **Progressive Disclosure:** Signup fast (email+password only) → get into app → setup at own pace
- **Asynchronous Completion:** All 4 setup steps optional order, can save independently
- **Psychological Momentum:** "You're in!" feeling immediately, reduced drop-off risk
- **Admin Control:** Unverified installers can edit profile but can't accept leads until approved

### Testing Done
- ✅ Signup creates installer with approval_status='unverified'
- ✅ Auto-login redirects to dashboard immediately
- ✅ Dashboard shows unverified banner + SetupGuide
- ✅ SetupGuide steps clickable, open modals
- ✅ Each modal saves independently, progress updates
- ✅ Leads page shows disabled buttons for unverified installers

### Ready for Next Session
- Phase 1B (public search) ready to start immediately
- All installer onboarding complete
- Approval system ready for admin dashboard UI
