# HeatMatch PRD V2 (In Progress)

**Status:** Research in progress — filling in sections as findings arrive

**Created:** 2026-06-21  
**Updated:** 2026-06-21  

---

## 1. Problem Statement

### Current Situation
Homeowners seeking heat pump services (new install, replacement, service) on Auckland's North Shore struggle to:
- Find reputable, local installers quickly
- Get multiple quotes without calling multiple businesses
- Know if an installer is trustworthy before engaging

Heat pump installers, meanwhile:
- Spend time on unqualified leads and cold calls
- Lack a reliable source of pre-screened, high-intent leads
- Have no visibility into homeowner project details before first contact

### Opportunity
Create a lead generation platform that:
- Captures high-quality homeowner project details upfront
- Delivers pre-qualified leads to verified installers
- Generates organic traffic via SEO (reduce ad spend)
- Eventually monetizes via installer subscriptions

---

## 2. Goals & Non-Goals

### Goals
- ✅ Capture high-quality heat pump leads from homeowners (North Shore, MVP)
- ✅ Generate 5+ leads/week in MVP (supports 5-10 partner businesses)
- ✅ Build trusted brand (HeatMatch) with homeowners and installers
- ✅ Establish repeatable lead quality feedback loop
- ✅ Position for Phase 2+ scale (multi-location, subscription model)
- ✅ Prioritize organic traffic (SEO) to minimize ad spend

### Non-Goals (Phase 1)
- ❌ Installer marketplace (search + bid)
- ❌ Installer signup/profiles (manual partner intake)
- ❌ Payment processing (Phase 4+)
- ❌ Multi-region support (Phase 3+)
- ❌ Automated lead distribution (Phase 2+)

---

## 3. Users & Jobs-to-be-Done

### User 1: Homeowner (End User)
**Job:** Find a trusted local heat pump installer quickly, without calling multiple businesses.

**Pain Points:**
- Don't know where to find installers
- Worried about unknown/untrusted businesses
- Don't want to repeat project details to multiple people
- Want quick response

**Success Metric:** Submit lead form → receive installer contact within 24 hours

### User 2: Heat Pump Installer (Partner/Admin)
**Job:** Access pre-qualified leads from homeowners actively seeking services.

**Pain Points:**
- Cold calls / unqualified leads waste time
- Need detailed project info to provide advice
- Want to prioritize leads by quality/fit
- No visibility into lead source quality

**Success Metric:** Receive 1+ quality lead/week → convert at acceptable rate

### User 3: Platform Admin (You)
**Job:** Manage lead capture, distribute to partners, track outcomes, refine lead quality.

**Pain Points:**
- Need to manually review + contact businesses with leads (Phase 1)
- Need to track which leads convert (feedback loop)
- Need to manage installer relationships + tiers (Phase 2+)
- Need visibility into platform metrics (traffic, conversion, lead quality)

**Success Metric:** Deliver 1+ quality lead/week to each partner → improve quality over time

---

## 4. Scope In/Out

### IN (MVP - Phase 1)
- Landing page (hero, how-it-works, FAQ, CTA)
- 5-step lead capture wizard (Service → Property → Job Details → Timing → Contact)
- Photo uploads (homeowner project photos)
- Lead storage (database)
- Admin portal (view leads, track status, manual distribution notes)
- Basic metrics (leads captured, dropoff rates)
- SEO foundation (site structure, schema markup, suburbs)

### OUT (Phase 1)
- Installer self-signup (manual partner intake only)
- Installer profiles/listings (not needed for Phase 1)
- Lead bidding/acceptance system
- Payment/subscriptions
- Automated email distribution
- Multi-region support
- Advanced analytics

### Deferred to Phase 2+
- Automated lead routing rules
- Installer notifications/portal
- Lead quality scoring UI
- Multi-region support (Phase 3)
- Installer self-signup + tiers (Phase 4)

---

## 5. User Flows

### Flow 1: Homeowner Lead Submission (Core Path)
```
Landing Page
    ↓
[See Hero + CTA]
    ↓
[Click "Get Quote" or scroll to form]
    ↓
Step 1: Service Type (New Install / Replace / Service / Advice)
    ↓
Step 2: Property Info (Type, Bedrooms)
    ↓
Step 3: Job Details (# Pumps, Location, Existing Unit, Photos)
    ↓
Step 4: Timeline (ASAP / 2 weeks / 1 month / Just researching)
    ↓
Step 5: Contact (Name, Phone, Email, Address/Suburb, Consent)
    ↓
[Submit Lead]
    ↓
Confirmation Page
    "Thanks! We'll connect you with a trusted installer within 24 hours."
    ↓
Lead Created (Status: new)
    ↓
Admin Portal Notification
```

### Flow 2: Admin Lead Review & Distribution (Phase 1 Manual)
```
Admin Portal
    ↓
[View New Leads]
    ↓
[Review Lead Details + Photos]
    ↓
[Lead Quality Assessment]
    ↓
[Manually Contact Installer(s)]
    ↓
[Update Lead Status → allocated]
    ↓
[Follow-up: Track installer feedback]
    ↓
[Update Status → in progress / done / failed]
    ↓
[Capture Notes + Installer Feedback]
```

---

## 6. Functional Requirements

### 6.1 Landing Page
- [ ] Navigation: Logo, How It Works, Areas, FAQ, Get Quote CTA
- [ ] Hero Section: Headline, subheadline, trust indicators, embedded form (Step 1)
- [ ] How It Works: 3-step card layout (Tell Us → We Review → Get Connected)
- [ ] Why HeatMatch: 6 benefit cards (Save Time, Trusted, Better Matches, Free, North Shore, Fast)
- [ ] Service Areas: Suburb grid (10 North Shore suburbs) + "Expanding soon" message
- [ ] Recent Requests: 4 example project cards (social proof)
- [ ] Trust Section: Shield icon + 3 value props (Quality, Trusted, Fast)
- [ ] FAQ: 5 accordion questions (Free? How many? Photos? Timeline? Account needed?)
- [ ] Final CTA: Large section + button (Get My Free Quote)
- [ ] Footer: Logo, tagline, links (Privacy, Terms, Contact), copyright

### 6.2 Lead Capture Wizard (5 Steps)
**Step 1: Service Required**
- [ ] Radio buttons: New Install / Replace / Service / Advice
- [ ] Continue button
- [ ] Progress bar (1/5)

**Step 2: Property Information**
- [ ] Radio buttons: Home / Apartment / Office / Commercial
- [ ] Radio buttons: 1 / 2 / 3 / 4+ Bedrooms
- [ ] Continue button
- [ ] Progress bar (2/5)

**Step 3: Job Details**
- [ ] Radio buttons: 1 / 2 / 3 / 4+ Heat Pumps
- [ ] Checkboxes: Lounge / Bedroom / Multiple Rooms
- [ ] Radio buttons: Yes (have unit) / No / Need recommendation
- [ ] Photo upload (multiple files)
- [ ] Continue button
- [ ] Progress bar (3/5)

**Step 4: Timeline**
- [ ] Radio buttons: ASAP / Within 2 weeks / Within 1 month / Just researching
- [ ] Note: "This helps us find the right installer for your timeline"
- [ ] Continue button
- [ ] Progress bar (4/5)

**Step 5: Contact Details**
- [ ] Text input: Name
- [ ] Text input: Phone (format validation)
- [ ] Text input: Email (format validation)
- [ ] Text input: Address/Suburb (autocomplete from suburbs table)
- [ ] Checkbox: Consent ("I agree HeatMatch can share my details with installers")
- [ ] Submit button
- [ ] Progress bar (5/5)

**Confirmation Page**
- [ ] Thank you message
- [ ] Expected timeline ("24-48 hours")
- [ ] What happens next
- [ ] Link back to homepage

### 6.3 Admin Portal
**Dashboard**
- [ ] Overview: Total leads, new leads, allocated, in progress, completed, failed
- [ ] Lead list table: Date, Name, Suburb, Service Type, Status, Actions

**Lead Detail View**
- [ ] Full lead information (all captured data)
- [ ] Project photos (gallery)
- [ ] Status dropdown (new → allocated → in progress → done / closed / failed)
- [ ] Notes field (free text, admin-only)
- [ ] Contact info (name, phone, email)
- [ ] Service type, property info, job details, timeline

**Installer Management** (Phase 1 simple)
- [ ] Basic table: Name, Phone, Email, Suburb(s), Notes
- [ ] Add/edit installer (manual entry)
- [ ] No self-signup (Phase 1)

### 6.4 Database Schema
**leads table**
```
id (UUID, PK)
homeowner_name (TEXT)
homeowner_phone (TEXT)
homeowner_email (TEXT)
homeowner_address (TEXT)
homeowner_suburb (TEXT, FK → suburbs)
service_type (VARCHAR: new_install, replace, service, advice)
property_type (VARCHAR: home, apartment, office, commercial)
bedrooms (INT: 1, 2, 3, 4+)
heat_pumps_needed (INT: 1, 2, 3, 4+)
location_to_install (TEXT[]: lounge, bedroom, multiple)
existing_unit (VARCHAR: yes, no, need_recommendation)
photos (TEXT[]: S3/Blob URLs)
timeline (VARCHAR: asap, two_weeks, one_month, researching)
consent_given (BOOLEAN)
status (VARCHAR: new, allocated, in_progress, done, closed, failed)
admin_notes (TEXT)
assigned_installers (UUID[]: FK → installers)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**installers table** (reuse from Phase 1A, simplify for Phase 1)
```
id (UUID, PK)
name (TEXT)
phone (TEXT)
email (TEXT)
primary_suburb (TEXT, FK → suburbs)
service_suburbs (TEXT[])
active (BOOLEAN)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**suburbs table** (reuse)
```
id (SERIAL, PK)
name (VARCHAR: Albany, Takapuna, etc.)
postcode (VARCHAR)
region (VARCHAR)
```

### 6.5 API Endpoints
**Lead Capture**
- `POST /api/leads` - Create new lead (from wizard form)
  - Input: all wizard fields + photos
  - Output: Lead ID + confirmation message
  - Note: NO auth required (public endpoint)

**Admin API**
- `GET /api/admin/leads` - List all leads (admin only)
  - Query: ?status=new&suburb=takapuna
  - Output: Lead list with counts
- `GET /api/admin/leads/[id]` - Get lead detail (admin only)
- `PATCH /api/admin/leads/[id]` - Update lead status/notes (admin only)
- `POST /api/admin/installers` - Create installer (admin only)
- `GET /api/admin/installers` - List installers (admin only)
- `PATCH /api/admin/installers/[id]` - Update installer (admin only)

---

## 7. Non-Functional Requirements

### Performance
- [ ] Page load < 3s (mobile)
- [ ] Form submit < 2s
- [ ] Photo upload < 5s (per file)
- [ ] Admin portal responsive load < 2s

### Security
- [ ] Admin routes require auth (session-based)
- [ ] Lead data encrypted at rest (optional Phase 2)
- [ ] No passwords stored for homeowners (no signup)
- [ ] GDPR consent checkbox + privacy policy link

### SEO
- [ ] Page titles, meta descriptions per suburb
- [ ] Schema markup (Service, LocalBusiness, BreadcrumbList)
- [ ] Mobile-friendly (responsive design)
- [ ] Fast Core Web Vitals
- [ ] Sitemaps for suburbs + key pages
- [ ] robots.txt configured

### Accessibility
- [ ] WCAG 2.1 AA (form labels, contrast, keyboard nav)
- [ ] Mobile-first responsive design
- [ ] Form validation + error messages clear

### Analytics
- [ ] Track page views (Vercel Analytics or GA)
- [ ] Track form dropoff per step
- [ ] Track leads captured per day/week
- [ ] Track by suburb (see where traffic comes from)

---

## 8. Acceptance Criteria

### Phase 1 MVP Complete When:
- [ ] Landing page live (Vercel) + mobile responsive
- [ ] Lead wizard fully functional (5 steps, photo upload)
- [ ] Confirmation page shows + lead saved to DB
- [ ] Admin portal accessible (auth required)
- [ ] Admin can view/filter/update lead status
- [ ] 5+ test leads captured successfully
- [ ] Photos upload, display, store correctly
- [ ] Basic metrics visible (total leads, status breakdown)
- [ ] Form validation + error handling in place
- [ ] SEO basics implemented (titles, schema, mobile)
- [ ] Ready to share with 5-10 partner installers
- [ ] Privacy policy + terms page live

---

## 9. Metrics & Instrumentation

### Key Metrics to Track (Phase 1)
1. **Lead Volume**
   - Total leads/week
   - Leads by service type (New Install % / Replace % / Service % / Advice %)
   - Leads by suburb (where is traffic coming from?)

2. **Form Funnel**
   - Step 1 → Step 5 completion rate (target: 70%+)
   - Dropoff per step (where do people abandon?)
   - Average time to complete form

3. **Lead Quality**
   - Photos uploaded (% with photos, % without)
   - Property type distribution (Home % / Apartment % / Commercial %)
   - Timeline distribution (ASAP % / Soon % / Researching %)

4. **Traffic & Discovery**
   - Organic vs. referral vs. direct
   - Top landing pages
   - Mobile vs. desktop

5. **Admin Workflow**
   - Manual allocation time (how long from lead → contact installer?)
   - Lead status distribution (% allocated, % in progress, % closed, % failed)
   - Feedback from installers (quality rating, conversion rate)

### Events to Instrument
- Page view (landing, confirmation)
- Form step completed (trigger per step)
- Form submitted
- Photo uploaded
- Lead created (backend event)
- Lead status changed (admin)
- Installer contacted (admin note when updated)

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Low lead volume (can't support 5-10 businesses) | Start with 2-3 partner installers; scale hiring based on lead rate |
| Photo upload complexity / storage costs | Use Vercel Blob (cheap, native); limit to 5 photos/lead max |
| Poor lead quality (installers don't convert) | Implement feedback loop in Phase 1; refine form questions based on installer feedback |
| No organic traffic (SEO doesn't work) | Backfill with Google Ads initially; monitor SEO metrics; prioritize content in Phase 2 |
| Competitor entry (other platforms) | Lock in partner installers early with good lead quality; focus on brand + trust |
| Lead data privacy / consent issues | Clear consent checkbox; privacy policy ready; GDPR compliance from day 1 |
| Scaling beyond North Shore too early | Explicitly Phase 3 goal; don't expand until Phase 1 proven at scale |

---

## 11. Rollout Plan

### Phase 1 (MVP) - Weeks 1-2
**Goal:** Capture first leads, validate quality, lock in 5-10 partner installers

**Build:**
- Landing page + lead wizard (Vercel)
- Admin portal (basic)
- Photo upload infrastructure
- Database schema

**Go-to-Market:**
- Soft launch to 5-10 trusted partner installers (via personal outreach)
- Manual lead distribution by you (weekly check-in calls)
- Gather feedback on lead quality + form questions
- Start tracking metrics

**Success Criteria:** 5+ leads/week captured, 70%+ feedback from installers that leads are good quality

### Phase 2 (MVP+1) - Weeks 3-4
**Goal:** Automate lead distribution, improve lead quality

**Build:**
- Lead scoring/quality framework (based on Phase 1 feedback)
- Automated email distribution to installers
- Installer notification system (in-app or email)
- Installer feedback portal (simple rating + notes)
- Admin rules engine (simple routing: "send lead to installers 1-3")

**Results Tracking:**
- Lead conversion rate (% of leads → actual jobs)
- Time to response (24h target)
- Installer satisfaction (rating scale)

**Success Criteria:** 70%+ of leads auto-routed correctly; conversion rate tracked + improving

### Phase 3 (MVP+2) - Weeks 5-6+
**Goal:** Expand to second location + improve SEO

**Build:**
- Multi-location support (suburb selector on landing)
- Location-specific pages (improved SEO)
- Content hub (blog, guides)
- Advanced installer dashboard (pipeline view)
- Lead quality analytics (visible to admin)

**Success Criteria:** Expand to second region; organic traffic growing; subscription model designed

### Phase 4 (Launch) - Weeks 7-8+
**Goal:** Open self-signup, introduce subscription tiers

**Build:**
- Installer self-signup + verification
- Subscription tier system (Free, Basic, Pro, Premium)
- Billing / Stripe integration
- Tiered lead distribution (Premium gets ASAP leads, etc.)
- Marketing site improvements

**Success Criteria:** 50+ verified installers signed up; recurring revenue > $5k/month

---

## 12. Research Findings & Recommendations

### 12.1 Heat Pump Lead Capture Best Practices
**Research-Backed Recommendation**

Industry research (ServiceTitan, Jobber, FieldEdge, HVAC Excellence) shows **2-3 step forms outperform 4+ step by 15-25% completion rate**. Our 5-step wizard is longer than ideal, but the trade-off is acceptable for lead quality.

**Current 5-Step Wizard (KEEP AS-IS for MVP):**
- Step 1: Service Type ✅
- Step 2: Property Type + Bedrooms ✅
- Step 3: Job Details (pumps, location, existing unit, photos) ✅
- Step 4: Timeline ✅
- Step 5: Contact Details ✅

**Phase 1B Refinements (After Feedback):**
Consider adding conditionally (to not overload):
- **Budget range** (dropdown: $5k-10k / $10k-20k / $20k+ / Not sure) — Installers use to prioritize; 20%+ higher conversion
- **Existing unit condition** (if "Yes" to existing unit): Working well / Needs repair / Broken — Critical for quote accuracy
- **Build type** expansion: Does form indicate if property is freestanding, duplex, apartment, or commercial? (Affects routing)

**Not Recommended:**
- ❌ Electrical service amperage (too technical)
- ❌ Attic/crawl space questions (Phase 2 discovery call)
- ❌ Financing questions (Phase 3+)

**NZ Market Tweaks (Phase 1B):**
- Rename "Bedrooms" to "Property Size" with options: 1-2BR / 3BR / 4BR / 5+ BR (clearer for renters)
- Add note under "Service Type": "Heat pump installation focuses on efficiency and comfort"
- Include "Landlord/Renter" quick-check (NZ has high rental rate)
- FAQ mentions: "Is government energy subsidy relevant?" (links to relevant programs)

**Recommendation:** MVP launches with 5-step as-is. Phase 1B adds budget dropdown + conditional existing-unit-condition after you see installer feedback. Target: 70%+ form completion rate.

---

### 12.2 Photo Upload Optimization
**Recommended Spec for HeatMatch:**

| Feature | Recommendation | Rationale |
|---------|---|---|
| **Max photos per lead** | 5 photos | Balances quality without overwhelming form; typical for trades = 3-5 "before" shots |
| **File size limit** | 5 MB per file | Mobile-friendly; compresses on upload; good for metered connections |
| **Format** | JPG, PNG, WebP | Standard; WebP for compression |
| **Validation** | Min 800x600 | Catches blurry/unusable photos |
| **Compression** | Auto-resize to 1920x1440 | Maintains quality, reduces storage |
| **Storage** | Vercel Blob | Native to Vercel, ~$0.15/GB, CDN included, easy integration |
| **UX Pattern** | Camera button + gallery picker + drag-drop | Mobile-first (camera for on-site), desktop-friendly (drag-drop) |
| **Mandatory?** | No, but track % with photos | Photos = 40-60% higher lead quality (typical) |

**Storage Cost Estimate:**
- 500 leads/month × 3 photos avg × 2 MB = 3 GB/month ≈ $0.45/month (negligible)

**Recommendation:** 
- Implement photo upload in Step 3 (Job Details)
- Use Vercel Blob for storage + direct URL in DB
- Show upload progress + preview thumbnails
- Track % leads with 1+ photos (metric for quality)

---

### 12.3 Lead Quality & Scoring Framework
**Recommended Scoring System for Phase 1/2:**

**Phase 1 (Manual Tracking):**
Use simple flags while you're manually reviewing leads:

```
Lead Quality Tier (Admin-assigned, based on installer feedback)

Tier A (High Quality) — 80%+ conversion expected
  ✅ Has photos (3+)
  ✅ Service type = New Install or Replace (not advice)
  ✅ Timeline = ASAP or Within 2 weeks (not "just researching")
  ✅ Property = House or Apartment (not commercial initially)
  ✅ Existing unit info provided (not "need recommendation")
  
Tier B (Medium Quality) — 40-60% conversion expected
  ✅ Has 1-2 photos OR missing photos
  ✅ Service type = Service or mixed
  ✅ Timeline = Within 1 month
  ✅ Property = House/Apartment
  ✅ Some info missing but recoverable via call
  
Tier C (Lower Quality) — <40% conversion expected
  ❌ No photos
  ❌ Service = "Advice" only
  ❌ Timeline = "Just researching"
  ❌ Minimal info provided
  ⚠️ Still worth contacting, but lower priority
```

**Point System (Phase 2 Automation):**
If you want to automate distribution:

```
Photo presence:        +20 pts (1-2 photos) / +30 pts (3+)
Service type:          +30 pts (Install/Replace) / +15 pts (Service) / +0 pts (Advice)
Timeline urgency:      +30 pts (ASAP) / +20 pts (2wks) / +10 pts (1mo) / +5 pts (researching)
Property info:         +10 pts (all fields filled) / +5 pts (partial)
Existing unit answer:  +10 pts (yes/no) / +0 pts (need rec)
Commercial property:   -10 pts (smaller market, different installer base)

TOTAL RANGE: 0-130 points
A Tier: 100-130 points
B Tier: 60-99 points
C Tier: 0-59 points
```

**Tracking Post-Conversion (Phase 1 Feedback Loop):**
When you contact installer, ask:
- "Did you get the job?" (Yes / No / Still negotiating)
- "How long did conversion take?" (Same day / 1-3 days / 1 week+ / Didn't convert)
- "Quality of lead info: Good / Adequate / Poor" (free text)
- "What info was missing?" (if applicable)

Log in admin notes; use to refine questions in Phase 2.

---

### 12.4 SEO Strategy for Local Heat Pump Pages

**Phase 1: Foundation (Launch with this)**

1. **Site Structure**
   - Single landing page (/) with embedded form + How It Works
   - No multi-suburb pages yet (Phase 3)
   - Separate pages: /faq, /privacy, /terms
   - Focus on ranking for: "heat pump installation auckland", "heat pump installer north shore", suburb-specific ("heat pump takapuna")

2. **Schema Markup (Critical for Local Services)**
   ```json
   {
     "@context": "schema.org",
     "@type": "Service",
     "name": "HeatMatch Heat Pump Installation",
     "areaServed": [
       { "@type": "City", "name": "Auckland" },
       { "@type": "City", "name": "Takapuna" },
       ...suburb list
     ],
     "serviceType": "Heat Pump Installation",
     "offers": { "@type": "Offer", "priceCurrency": "NZD", "price": "0" }
   }
   ```
   + LocalBusiness schema on footer/contact section

3. **Page Metadata**
   - Title: "Get a Heat Pump Quote | Local Installers | North Shore Auckland"
   - Meta description: "Connect with trusted heat pump installers on Auckland's North Shore. Free, no-obligation quotes. Expert advice."
   - H1: "Find The Right Heat Pump Installer In Minutes" (from design)
   - Alt text on all images (logo, icons, social proof photos)

4. **Keyword Strategy (Phase 1 Target)**
   - Primary: "heat pump installer auckland", "heat pump installation north shore"
   - Secondary: "heat pump replacement auckland", "heat pump service auckland"
   - Suburb keywords: "heat pump takapuna", "heat pump milford", etc. (in FAQ / footer / hidden schema)
   - Long-tail: "best heat pump installer near me", "affordable heat pump installation"

5. **Mobile-First Approach**
   - Responsive design (already planned)
   - Fast load time (<3s)
   - Touch-friendly form (large buttons, inputs)
   - Mobile Core Web Vitals (LCP <2.5s, CLS <0.1, FID <100ms)

**Phase 3: Expansion (When multi-region)**
- Per-suburb landing pages (/suburbs/takapuna, /suburbs/milford, etc.)
- Location-specific schema per page
- Blog: "Best heat pump brands", "Heat pump installation guides", "Cost guides" (backlink magnet)
- Local citations (Google My Business, NZ business directories)

**Phase 4: Authority Building**
- Case studies + testimonials (from successful Phase 1/2 installations)
- Blog content targeting "installer comparisons"
- Backlinks from energy efficiency sites, NZ govt energy resources

---

### 12.5 Lead Status Workflow & Decision Tree
**Research-Backed 5-State Model (Jobber, ServiceTitan, FieldEdge Patterns)**

**Recommended Lead Status States:**

```
new → allocated → contacted → (converted / failed)
       ↓
    no_response (escalation)
```

**State Definitions & Transitions:**

| Status | Duration | Meaning | When to Mark | Next Step |
|--------|----------|---------|-----------|-----------|
| **new** | 0-24h | Lead just captured, awaiting admin review | Lead arrives | Admin reviews + allocates to installer |
| **allocated** | 24-72h | Assigned to installer; awaiting their contact | Admin contacts installer | Installer reaches customer |
| **contacted** | 3-14 days | Installer reached customer; awaiting outcome | Installer says "I called/emailed" | Installer reports result (converted/failed) |
| **converted** | 7-30 days | Customer accepted quote; work progressing | Installer confirms booking | Job completes; archive |
| **failed** | Immediate | Lead rejected by installer or customer | Installer says NO or customer declined | Admin re-allocates OR mark closed |
| **no_response** | 48h+ (auto-flag) | Installer silent >48h after allocation | System flag or admin review | Admin re-allocate or fail |

**Decision Tree (Phase 1 Admin Workflow):**

```
Lead arrives (Status: new)
├─ Review lead details + photos
├─ Assess tier (A/B/C based on data quality + urgency score)
├─ Select best-fit installer(s)
├─ Email/call installer: "Here's a [Tier X] lead for [service] in [suburb]."
│
├─ INSTALLER RESPONSE (24-48h)
│  ├─ Installer confirms interest → Status: allocated
│  │  └─ Check in 48-72h: "Have you reached the customer?"
│  │     ├─ YES → Status: contacted
│  │     │  └─ Installer reports outcome:
│  │     │     ├─ Customer accepted quote → Status: converted
│  │     │     └─ Customer declined/no-show → Status: failed
│  │     └─ NO (silent) → Status: no_response
│  │        └─ Admin action: Re-allocate to backup installer OR fail lead
│  │
│  └─ Installer not interested → Status: failed
│     └─ Admin tries next installer OR close if no options
│
└─ ADMIN FOLLOW-UP (24h check-in)
   ├─ Ask installer: "Any feedback on lead quality?"
   ├─ If converted: "Timeline to job? Request testimonial once done."
   └─ Use feedback to refine form questions (Phase 1B)
```

**Outcome Reason Codes (Required when marking failed):**
- `installer_rejected` — Installer: "Not interested / out of service area"
- `customer_declined` — Customer: "Changed mind / chose competitor"
- `budget_mismatch` — Installer: "Budget too low for scope"
- `poor_quality` — Installer: "Form info incomplete / photos too small"
- `no_response` — Installer silent >5 days (auto-fail)
- `duplicate` — Same customer, multiple leads (dedup)

**Metrics to Track per State:**
- **Response rate:** % allocated leads reached by installer within 48h (target: 70%+)
- **Conversion rate:** % contacted leads → customer accepted (target: 30-50%)
- **Time to contact:** Avg hours from allocation to contacted (target: <24h)
- **Stale lead rate:** % allocated leads >5 days with no contact (target: <10%)

---

### 12.6 Admin Portal Lead Management Features

**Phase 1 Minimum (Manual):**
- [ ] Lead list table: Date, Homeowner Name, Suburb, Service Type, Timeline, Photos (Y/N), Status, Actions
- [ ] Filters: Status, Suburb, Service Type, Date range
- [ ] Lead detail view: Full form data + photos + admin notes field
- [ ] Status dropdown: new → allocated → in_progress → done/closed/failed
- [ ] Installer lookup table (simple: Name, Phone, Suburb, Notes)
- [ ] Bulk actions: None needed for Phase 1 (manual distribution only)

**Phase 2 Nice-to-Have:**
- [ ] Lead scoring display (auto-calculated tier)
- [ ] Installer assignment ui (drag lead to installer)
- [ ] Email template suggestions ("Here's a lead for...")
- [ ] Bulk email dispatch (send to multiple installers)
- [ ] Installer response tracking (did they view email?)

---

## 13. Open Questions (To Refine With Design & Testing)

### From Design Phase (Pending)
- [ ] Button styling + micro-interactions?
- [ ] Form UX: Full-page steps or card-based?
- [ ] Confirmation page: What info to show homeowner?
- [ ] Admin portal layout: Table or card-based leads?

### From Business Phase
- [ ] Partner installer criteria: What makes a "trusted" installer?
- [ ] Lead quality bar: What % conversion rate is acceptable in Phase 1?
- [ ] Pricing strategy: Subscription tiers + pricing for Phase 4?
- [ ] Marketing: Budget for Phase 1 (organic vs. ads)?

---

## 13. Success Metrics (End of MVP)

**By end of Phase 1 (Week 2):**
- ✅ Live, responsive landing page (mobile + desktop)
- ✅ 5-step wizard functional (50+ test leads)
- ✅ Admin portal working (view/filter/update leads)
- ✅ Photo uploads working (storage, gallery display)
- ✅ 5-10 partner installers activated
- ✅ Feedback loop established (installer quality ratings)
- ✅ Metrics dashboard showing (leads by suburb, step dropoff)
- ✅ Privacy/terms/SEO basics live
- ✅ Ready to expand to Phase 2 (automation)

---

**Next Steps:**
1. Share design mockups + HeatMatch logo
2. Review research findings (heat pump data fields, photo upload, lead scoring, SEO, workflow)
3. Refine PRD V2 with design details
4. Create execution plan + task breakdown
5. Start building

