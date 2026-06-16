# TRADEEV2 Next Session Handoff (2026-06-16)

## Status Summary
- **Phase:** MVP Implementation
- **Completion:** ~60% (Phase 1A done, Phase 1B/1C pending)
- **Last Session:** Built complete installer UX (login, dashboard, leads, profile, account)
- **App URL:** http://localhost:3003 (when dev server running)

---

## What's Complete ✅

### Phase 1A: Installer UX (DONE)
- ✅ Installer login page (/installer-login)
- ✅ Installer dashboard layout with left-hand nav
- ✅ Installer dashboard home (metrics: pending leads, search impressions, profile views, response rate)
- ✅ Installer leads page (filter by status, accept/reject/complete actions)
- ✅ Installer profile/business listing page (edit bio, years, images, on/off toggle)
- ✅ Installer account settings page (phone, username, password change, 2FA/notifications stubs)
- ✅ All supporting API endpoints
- ✅ Database migrations (schema updates, suburbs table, analytics table)
- ✅ Fixed placeholder text color (darker grey for readability)

### Authentication & Foundation
- ✅ Email+password auth (signup/login/logout)
- ✅ Session middleware protecting installer/admin routes
- ✅ Admin approval workflow for installer signups

---

## What's Pending (Next Steps)

### Phase 1B: Public Search & Lead Capture (~8-10 hours)
1. **Public search results page** (/search)
   - Search bar: "Looking for Heat Pump Installers in [suburb]"
   - Results: Grid/list of installer cards (name, years, photo)
   - Click card → view full profile
   - API: GET /api/search?suburb=[suburb]

2. **Public installer profile page** (/search/installer/[id])
   - Display: name, photo, years, bio, images, rating placeholder
   - Buttons: Call, Email, Get a Quote
   - Track profile views in analytics
   - API: GET /api/search/installer/[id]

3. **Get a Quote form** (single installer lead)
   - Fields: name, email, phone, address, description, urgency, budget, property type, system type
   - Submit → creates lead with status="new" (confirmed)
   - API: POST /api/leads (update to mark as confirmed vs. unconfirmed)

### Phase 1C: Admin Tools (~2-3 hours)
1. **Admin create business page** (/admin/create-business)
   - Full form: email, password, phone, business name, ABN, address, photo, bio, years, images, status toggle
   - Submit → creates installer record (auto-approved)
   - API: POST /api/admin/create-business

### Phase 1D: Homepage & Final Polish
1. **Update homepage** (src/app/page.tsx)
   - Add "Find a Tradee" CTA (links to /search)
   - Add "Get a Quote" CTA (MVP+1 - for now just link to homepage, will route to /search eventually)
   - Update nav with links to both flows

---

## Database Changes Done
```sql
-- installers table
ALTER TABLE installers ADD COLUMN years_in_business INTEGER, profile_active BOOLEAN, images TEXT[], created_at TIMESTAMP, updated_at TIMESTAMP;

-- leads table
ALTER TABLE leads ADD COLUMN installer_id UUID REFERENCES installers(id), status VARCHAR(50) DEFAULT 'new', rejection_reason TEXT, completed_notes TEXT, created_at TIMESTAMP;

-- New tables
CREATE TABLE suburbs (id SERIAL PRIMARY KEY, name VARCHAR(100) UNIQUE, postcode VARCHAR(10), region VARCHAR(100));
CREATE TABLE analytics (id UUID PRIMARY KEY, installer_id UUID, date DATE, search_impressions INTEGER, profile_views INTEGER, leads_received_count INTEGER, leads_accepted_count INTEGER, UNIQUE(installer_id, date));
```

---

## Key Architecture Decisions (For MVP+1 Planning)

### Lead Flow
- **MVP:** Direct lead to one installer (lead.installer_id set at creation)
  - Status: new → accepted → completed (or rejected)
- **MVP+1:** Multi-installer routing
  - Status: unconfirmed → confirmed (once accepted by someone)
  - Creates leads_sent records for each installer, each can accept/reject independently

### Image Handling
- **MVP:** Store URLs as TEXT[] strings (mocked)
- **MVP+1:** Upgrade to Vercel Blob or cloud storage

### Analytics
- **MVP:** Simple daily counts per installer
- **MVP+1:** Real-time updates, more granular metrics

---

## Testing Checklist (For Tomorrow)

### Installer Flow
- [ ] Sign up installer at /installer-signup
- [ ] Log in as admin at /admin-login (alex@alexvaz.org / Testing123)
- [ ] Approve the installer
- [ ] Log in as installer at /installer-login
- [ ] Verify dashboard shows metrics
- [ ] Edit profile (add bio, years, images)
- [ ] Toggle profile on/off
- [ ] Update account (phone, username, password)

### Public Search (Once built)
- [ ] Search "Heat Pump Installers in [suburb]"
- [ ] Click installer card
- [ ] View profile
- [ ] Submit Get a Quote form
- [ ] Verify lead appears in installer dashboard

### Admin Create Business (Once built)
- [ ] Go to /admin/create-business
- [ ] Fill form and submit
- [ ] Verify new installer can log in immediately

---

## Important Notes

### Files to Touch Next Session
- src/app/search/page.tsx (NEW)
- src/app/search/installer/[id]/page.tsx (NEW)
- src/app/search/installer/[id]/quote/page.tsx (NEW)
- src/app/api/search/route.ts (NEW)
- src/app/api/search/installer/[id]/route.ts (NEW)
- src/app/api/leads/route.ts (UPDATE - mark confirmed vs unconfirmed)
- src/app/admin/create-business/page.tsx (NEW)
- src/app/api/admin/create-business/route.ts (NEW)
- src/app/page.tsx (UPDATE - add CTAs)

### Git Status
- Check uncommitted changes: `git status`
- If needed, commit: `git commit -m "Phase 1A complete: Installer UX (login, dashboard, leads, profile, account)"`

### Running Dev Server
```bash
cd "/Users/alexvaz/Desktop/Legacy Apps/TRADEEV2"
npm run dev
# Opens on http://localhost:3003
```

### Known Issues Fixed
- ✅ Placeholder text color (too light) - Fixed with placeholder-gray-600

### MVP Requirements Recap
- No email verification (Resend integration deferred)
- No Stripe (manual payment testing for now)
- No multi-business lead routing (Flow 2 stubbed as "unconfirmed" status)
- Heat pump installers only (category fixed, hidden from UI)
- North Shore Auckland MVP launch area

---

## Success Criteria (End of Next Session)
- [ ] Phase 1B complete (public search + Get a Quote working)
- [ ] Phase 1C complete (admin create business working)
- [ ] Homepage updated with both CTAs
- [ ] Full end-to-end flow testable (installer signup → profile → search → quote → lead)
- [ ] Ready for deployment to Vercel

---

## Questions for Tomorrow
- Should we test the current installer flow before building Phase 1B?
- Do you want to deploy to Vercel between phases?
- Any UI/UX feedback on the installer dashboard that needs adjustment?
