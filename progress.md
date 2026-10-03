# HeatMatch Progress

## Session 16 — v1.2 Database Migration + API Implementation

**Date:** 2026-10-03

### Completed

#### Part 1: Database Migration ✅
- ✅ Created reversible database migration (v1.2-installer-directory-migration.ts)
- ✅ Created installer_translations table (multilingual: EN/ZH-CN/ZH-TW)
- ✅ Added slug (unique, indexed), status (verified/unclaimed), verified_at columns
- ✅ Generated slugs for 2 existing installers
- ✅ Backfilled English translations + status enum migration
- ✅ Created 5 performance indices
- ✅ Migration wrapped in transaction with rollback capability
- ✅ Ran successfully against Neon Postgres

#### Part 2: API Implementation ✅
- ✅ Built `GET /api/installers` endpoint
  - Pagination (default 20/page, max 100)
  - Suburb filtering (case-insensitive, partial match, primary or service suburbs)
  - Status filtering (verified/unclaimed)
  - Language support with fallback (en → zh-tw → zh-cn)
  - Returns both verified + unclaimed (SEO exposure)
  - Cache: 5 minutes
  - Filters out inactive installers (profileActive=false)

- ✅ Built `GET /api/installers/[slug]` endpoint
  - Full profile with all fields
  - Language parameter with fallback chain (requested → ZH-TW → ZH-CN → EN)
  - Shows which language was used + fallback chain
  - 404 if not found
  - Cache: 10 minutes
  - Filters out inactive installers

- ✅ Created comprehensive integration tests (22 tests)
  - List endpoint: 12 tests (pagination, filtering, languages, edge cases)
  - Detail endpoint: 10 tests (slugs, languages, null handling, fallback)
  - Test data setup/teardown with 4 installers + translations

### Technical Decisions Locked
- Slug is permanent (never changes even if business name changes)
- Inactive installers (profileActive=false) filtered from all responses
- Language fallback: Requested → ZH-TW → ZH-CN → EN
- Both verified and unclaimed installers publicly visible
- HTTP caching headers for CDN performance
- Analytics tracking deferred to v1.2.1

### Database Changes Summary
- **New table:** installer_translations(installer_id, language, business_name, bio)
- **New columns on installers:** slug, status, verified_at
- **Data migration:** approved=true → status='verified', approved=false → status='unclaimed'
- **Backfill:** business_name, bio → translations table (language='en')

### Next Steps (Ready for Pages)
1. Build public pages: `/installers` (directory) + `/installers/[slug]` (profiles)
2. Add multilingual routing (i18n path-based: /en, /zh-cn, /zh-tw)
3. Update admin UI: status badge toggle (verified/unclaimed)
4. Add SEO: meta tags, schema.org LocalBusiness structured data
5. Manual testing + QA

---

## Session 15 — v1.2 Installer Directory Planning

**Date:** 2026-09-27

### Objective
Build a public-facing installer directory (v1.2) to drive organic SEO growth. Each installer gets an indexed, multilingual landing page.

### Current State of Codebase
✅ Admin portal exists: `/admin/installers` (CRUD for installers)  
✅ Installer database schema: `business_name`, `phone`, `email`, `suburb_primary`, `service_suburbs`, `approved`, `profile_active`, `bio`, `photo_url`, `years_in_business`  
✅ Public API: `/api/search?suburb=x` returns approved installers  
✅ Suburb landing pages: `/installers/[suburb]` (SEO content, no listings)  
✅ Project rebranded: **HeatMatch** (not TRADEEV2)

### v1.2 Scope — Installer Directory
**What we're building:** Public listing pages to expose existing installer data for SEO.

**Out of Scope (v1.3+):**
- Installer self-serve claims/signup
- Advanced search/filtering
- Ratings/reviews
- Lead capture forms

### Key Decisions Made
1. **No rebuild of admin backend** — reuse existing CRUD + APIs
2. **Public pages only** — `/installers` (paginated list) + `/installers/[id]` (individual profiles)
3. **"Find an Installer" in header** — navigation link to directory
4. **Multilingual from day 1** — EN/ZH-CN/ZH-TW
5. **Status field clarification** — rename `approved` to `verified/unclaimed` (future v1.3 claim flow ready)
6. **Pagination MVP** — no search filtering yet (full search already exists in `/api/search`)

### Technical Overview
- **Public Directory:** `/installers` → paginated list (20 per page)
  - Card layout: name, suburb, bio excerpt, "View Profile" link
  - Meta tags for SEO
  
- **Individual Profile:** `/installers/[id]` (or slug-based)
  - Full installer info: name, suburb, contact email/phone, full bio
  - Verified badge (conditional)
  - Schema.org LocalBusiness structured data
  - Multilingual content fallback (ZH-TW → ZH-CN → EN)

- **Admin Changes:** 
  - Add status toggle (`verified` / `unclaimed`)
  - Update installer list view to show status badge
  - (No new CRUD needed; just UI tweak)

- **Database:** 
  - Add multilingual fields for installer names/descriptions (or use separate i18n table)
  - Add `status` enum field (replacing/clarifying `approved`)
  - Add `verified_at` timestamp

### Artifacts Created (To Review Next Session)
1. **PRD:** `/docs/features/v1.2-installer-directory.md` — full 12-section spec (note: uses "TRADEEV2", should update to "HeatMatch")
2. **Execution Checklist:** `/docs/features/v1.2-execution-checklist.md` — week-by-week breakdown (58h estimate)
3. **Memory:** Project goals saved for continuity

### Next Steps (Ready to Code)
1. **Confirm schema** — finalize multilingual fields (separate i18n table vs. denormalized columns)
2. **Update progress.md** — once PRD is locked
3. **Database migration** — add status field + multilingual support
4. **Build public API** — `/api/installers` endpoint (list + single profile)
5. **Build public pages** — directory + profile pages with i18n
6. **Admin UI tweak** — status badge toggle
7. **Deploy & monitor** — GSC indexing, organic traffic

### Blockers/Decisions Pending
- [ ] Multilingual schema: separate `i18n_installers` table OR `name_en`, `name_zh_cn`, `name_zh_tw` columns?
- [ ] URL structure: `/installers/[id]` OR `/installers/[slug]`?
- [ ] Language routing: query param (`?lang=zh-cn`) OR path-based (`/zh-cn/installers`)?

### Effort Estimate
~20-30 hours (much leaner than original PRD; reusing existing data layer)
- Public API endpoints: 4h
- Directory + profile pages: 8h
- Multilingual support: 4h
- Admin UI status badge: 2h
- SEO setup (meta tags, schema.org): 3h
- Testing + QA: 4h

---

**Last updated:** 2026-09-27  
**Next session:** Jump straight to PRD review + schema finalization, then code.
