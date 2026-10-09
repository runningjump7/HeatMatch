# Phase 5: Installer Profile Management
**Status:** Ready for review & approval  
**Date:** 2026-10-09

---

## 1. Problem Statement

After claiming their business (Phases 1-3) and logging in (Phase 4), installers need a way to **customize their public profile** to attract more customers. Currently:
- ✅ Login works
- ✅ Dashboard shows verification status
- ❌ No way to edit profile information
- ❌ No way to upload photos
- ❌ No way to customize description or services

**Phase 5 solves this** by letting installers manage:
- Contact info (phone, website, service areas)
- Listing content (description, photos, services)
- Account security (password, sessions)

---

## 2. Goals and Non-Goals

### Goals ✅
1. **Profile Customization** — Let installers edit listing info to stand out
2. **Photo Management** — Upload cover image + logo
3. **Service Definition** — Installers check what services they offer (Installation/Maintenance/Repairs)
4. **Account Security** — Change password, view active sessions
5. **Verified Integrity** — Lock business name & URL (claimed identity)
6. **Real-time Updates** — Changes appear on public profile immediately

### Non-Goals ❌
- Installer ratings/reviews (Phase 6+)
- Lead inbox/messaging (Phase 6+)
- Analytics dashboard (Phase 6+)
- Installer branding (themes, colors) (Phase 7+)
- Bulk uploads (waitlist feature) (Future)
- API access for installers (Future)

---

## 3. Users and Jobs-to-be-Done

### User: Verified Installer
**Job 1:** Update my phone number and website so customers can contact me  
**Job 2:** Write a compelling description so I rank higher in search  
**Job 3:** Upload professional photos to look credible  
**Job 4:** Specify what services I offer (Installation, Maintenance, Repairs)  
**Job 5:** Change my password securely  
**Job 6:** See all my info in one place (profile overview)

### User: Admin
**Job:** Monitor what installers update (for spam/abuse detection)  
**Job:** Access audit log if needed

### User: Customer
**Job:** See complete, up-to-date installer info (no change to experience, just better data)

---

## 4. Scope (In/Out)

### In Scope ✅
| Feature | Why | Status |
|---------|-----|--------|
| Edit phone number | Core contact info | New |
| Edit website URL | Core contact info | New |
| Edit service areas (multi-select) | Core targeting | New |
| Edit description/bio | Marketing content | New |
| Upload cover image | Visual appeal | New |
| Upload logo | Branding | New |
| Check services (Installation/Maint/Repairs) | Service discovery | New |
| Change password | Account security | New |
| View active sessions | Security visibility | New |
| Logout all sessions | Account control | New |
| View verified status (locked) | Confidence signal | Display only |
| View business name (locked) | Identity verification | Display only |

### Out of Scope ❌
| Feature | Why | Defer To |
|---------|-----|----------|
| Edit business name | Verified at claim; change needs admin | Phase 6+ |
| Ratings/reviews display | Requires review system | Phase 6+ |
| Lead inbox | Requires messaging infrastructure | Phase 6+ |
| Profile analytics | Requires tracking setup | Phase 6+ |
| Export/download profile | Nice-to-have | Phase 7+ |
| Bulk photo upload | Complex; start with single | Phase 7+ |
| Social media links | Extra; focus on core | Phase 7+ |

---

## 5. User Flows

### Flow 1: Installer Edits Basic Info
```
1. Logs in → Dashboard
2. Clicks "Edit Profile" (or nav: Profile Settings)
3. Lands on `/installer-dashboard/profile`
4. Sees form with sections:
   - Account Settings (email, password)
   - Listing Info (phone, website, service areas)
   - Media (cover image, logo)
   - Services (checkboxes)
   - Status (locked fields)
5. Edits phone + description
6. Clicks "Save Changes"
7. Validation passes
8. Data saved → redirects to public profile
9. Sees updates live
```

### Flow 2: Installer Uploads Cover Image
```
1. On profile edit page
2. Clicks "Upload Cover Image" button in Media section
3. File picker opens
4. Selects JPG/PNG (max 5MB)
5. Image preview shown
6. Clicks "Save Changes"
7. Image uploaded to Vercel Blob
8. Public profile updated
9. Confirms with toast: "Cover image updated"
```

### Flow 3: Installer Changes Password
```
1. On profile edit page
2. Scrolls to Account Settings section
3. Clicks "Change Password"
4. Modal opens with 2 fields:
   - Current password
   - New password (8+ chars, 1 upper, 1 number)
5. Enters current password + new password
6. Submits
7. Password validated & updated
8. Modal closes
9. Toast: "Password updated successfully"
10. Session preserved (no re-login needed)
```

### Flow 4: View Active Sessions & Logout Others
```
1. On profile edit page
2. Account Settings section shows:
   - "Active Sessions" card
   - Current device marked "This device"
   - Other devices listed (IP, browser, last seen)
3. Clicks "Logout" on another device
4. Confirms modal
5. Session deleted
6. Device removed from list
```

---

## 6. Functional Requirements

### Requirement 1: Profile Edit Page Layout
**File:** `src/app/installer-dashboard/profile/page.tsx` (or `/settings`)

**Sections (vertical stack):**

1. **Page Header**
   - "Profile Settings" title
   - Back button (links to `/installer-dashboard`)
   - Save Changes button (sticky footer or top-right)

2. **Account Settings Card**
   - Email: Read-only display (or show change email flow in Phase 6)
   - Password: "Change Password" button → modal
   - Active Sessions: List current sessions, logout option

3. **Listing Info Card**
   - Phone: Text input (editable)
   - Website: URL input (editable)
   - Service Areas: Multi-select dropdown/checkboxes (editable)
     - Options: Takapuna, Albany, Glenfield, Browns Bay, Milford, etc.
   - Description: Textarea (max 500 chars, live count)

4. **Media Card**
   - Cover Image: Upload button + preview
   - Logo: Upload button + preview
   - Drag-to-reorder? (Phase 6+)

5. **Services Card**
   - Checkboxes:
     - ☐ Installation
     - ☐ Maintenance
     - ☐ Repairs

6. **Status Card** (Read-Only)
   - Business Name: [locked badge]
   - Public URL: `heatmatch.nz/en/installers/north-shore-climate` [copy button]
   - Verified: ✓ Verified on Oct 9, 2026

### Requirement 2: API Endpoints

#### Endpoint 1: GET `/api/installer/profile`
**Purpose:** Fetch installer's editable profile data  
**Input:** Session cookie  
**Output:**
```json
{
  "installer_id": "uuid",
  "business_name": "North Shore Climate",
  "email": "owner@example.com",
  "phone": "09 555 0004",
  "website": "northshoreclimate.co.nz",
  "description": "Family-owned...",
  "cover_image_url": "https://blob.vercel.co/...",
  "logo_url": "https://blob.vercel.co/...",
  "service_areas": ["Takapuna", "Albany"],
  "services": {
    "installation": true,
    "maintenance": false,
    "repairs": true
  },
  "verified_at": "2026-10-09T12:00:00Z"
}
```

#### Endpoint 2: POST `/api/installer/profile`
**Purpose:** Update profile (all fields at once)  
**Input:**
```json
{
  "phone": "09 555 0005",
  "website": "updated.co.nz",
  "description": "Updated description",
  "service_areas": ["Takapuna", "Albany", "Glenfield"],
  "services": {
    "installation": true,
    "maintenance": true,
    "repairs": false
  }
}
```
**Process:**
1. Validate session + installer_id
2. Validate phone (optional, basic format)
3. Validate website URL (optional)
4. Validate description (max 500 chars)
5. Validate service_areas (must be from whitelist)
6. Update installers table
7. Clear cache (public profile)
8. Return: `{ success: true, message: "Profile updated" }`

**Error cases:**
- Invalid service area: `{ success: false, error: "Invalid service area" }`
- Description too long: `{ success: false, error: "Description max 500 characters" }`

#### Endpoint 3: POST `/api/installer/upload-image`
**Purpose:** Upload cover image or logo  
**Input:** Multipart form data
- `image`: File (JPG/PNG, max 5MB)
- `type`: "cover" | "logo"

**Process:**
1. Validate file (size, type)
2. Upload to Vercel Blob
3. Store URL in installers table
4. Clear public profile cache
5. Return: `{ success: true, url: "https://blob.vercel.co/..." }`

#### Endpoint 4: POST `/api/installer/change-password`
**Purpose:** Change password  
**Input:**
```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass456"
}
```
**Process:**
1. Validate session
2. Fetch user.password_hash
3. Compare current_password (bcrypt)
4. If mismatch: `{ success: false, error: "Current password incorrect" }`
5. Validate new_password (8+ chars, 1 upper, 1 number)
6. Hash with bcrypt
7. Update users.password_hash
8. Return: `{ success: true, message: "Password updated" }`

#### Endpoint 5: GET `/api/installer/sessions`
**Purpose:** List active sessions  
**Input:** Session cookie  
**Output:**
```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "created_at": "2026-10-09T10:00:00Z",
      "last_seen": "2026-10-09T14:30:00Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Chrome/128 on macOS",
      "is_current": true
    },
    {
      "id": "session-uuid-2",
      "created_at": "2026-10-08T09:00:00Z",
      "last_seen": "2026-10-08T17:00:00Z",
      "ip_address": "192.168.1.101",
      "user_agent": "Safari/17 on iPhone",
      "is_current": false
    }
  ]
}
```

#### Endpoint 6: POST `/api/installer/sessions/{id}/logout`
**Purpose:** Logout a specific session  
**Input:** Session ID in URL  
**Process:**
1. Validate ownership (session belongs to user)
2. Delete session cookie / revoke token
3. Return: `{ success: true, message: "Session ended" }`

### Requirement 3: Database Changes

**Modify `installers` table:**
```sql
ALTER TABLE installers ADD COLUMN phone VARCHAR(20);
ALTER TABLE installers ADD COLUMN website VARCHAR(255);
ALTER TABLE installers ADD COLUMN description TEXT;
ALTER TABLE installers ADD COLUMN cover_image_url VARCHAR(500);
ALTER TABLE installers ADD COLUMN logo_url VARCHAR(500);
ALTER TABLE installers ADD COLUMN service_installation BOOLEAN DEFAULT true;
ALTER TABLE installers ADD COLUMN service_maintenance BOOLEAN DEFAULT false;
ALTER TABLE installers ADD COLUMN service_repairs BOOLEAN DEFAULT false;
```

**New table: `user_sessions`** (for active session tracking)
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

---

## 7. Non-Functional Requirements

### Security
- [ ] All endpoints require valid session (authenticated)
- [ ] Installers can only edit their own profile
- [ ] Passwords hashed with bcrypt
- [ ] Image upload validates MIME type (not just extension)
- [ ] CSRF protection on all form submissions
- [ ] Rate limiting on password change (max 3 per hour)

### Performance
- [ ] Profile load: <500ms
- [ ] Image upload: <2s (with progress bar)
- [ ] Save changes: <1s
- [ ] Cache public profile after edit (5 min TTL)

### Data Integrity
- [ ] Phone/website optional but validated if provided
- [ ] Description truncated to 500 chars
- [ ] Images stored in Vercel Blob (persistent, CDN)
- [ ] Service areas from predefined list only

### Availability
- [ ] Graceful error if image upload fails (user can retry)
- [ ] Validation errors shown in-form (no page reload)
- [ ] Session tracking handles concurrent requests

---

## 8. Acceptance Criteria

### Phase 5a: Basic Editing
- [ ] Profile page loads with current installer data
- [ ] Phone field editable and saves correctly
- [ ] Website field editable and saves correctly
- [ ] Description textarea editable (max 500 chars shown)
- [ ] Service areas multi-select works (checkboxes or dropdown)
- [ ] Services checkboxes work (Installation, Maint, Repairs)
- [ ] Locked fields show as read-only (Business name, URL, verified date)
- [ ] Save button validates all fields before submission
- [ ] Validation errors display inline (not modal)
- [ ] Success message shown after save
- [ ] Mobile responsive (tested at 375px)

### Phase 5b: Image Upload
- [ ] Upload button for cover image opens file picker
- [ ] Upload button for logo opens file picker
- [ ] File validation: JPG/PNG only, max 5MB
- [ ] Error shown if file too large or wrong type
- [ ] Image preview shown before save
- [ ] Images saved to Vercel Blob
- [ ] URLs stored in database
- [ ] Public profile reflects uploaded images
- [ ] Can replace image (re-upload)

### Phase 5c: Account Security
- [ ] Change Password button opens modal
- [ ] Modal validates current password + new password
- [ ] Validation: 8+ chars, 1 uppercase, 1 number
- [ ] Error if current password wrong
- [ ] Password updated in database (bcrypt)
- [ ] Session preserved after password change
- [ ] Active Sessions list shows current devices
- [ ] Can logout specific sessions
- [ ] "Logout all other sessions" option works

### Phase 5d: Integration
- [ ] Edits appear on public profile immediately
- [ ] No page refresh needed (smooth UX)
- [ ] Back button returns to dashboard
- [ ] Links from dashboard to profile work
- [ ] Installer can navigate: Dashboard → Profile → Dashboard

---

## 9. Metrics and Instrumentation

### Events to Log (Phase 6+)
- `profile_edit_started` — installer opened profile page
- `profile_updated` — installer saved profile (include fields changed)
- `image_uploaded` — installer uploaded cover/logo
- `password_changed` — installer changed password
- `session_logout` — installer logged out specific device

### Metrics to Track
- % of verified installers who complete profile (description + image)
- Avg description length (to gauge effort)
- Image upload success rate
- Password change frequency
- Active sessions per installer

---

## 10. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Image upload abuse** | Malicious files, storage spam | Validate MIME type, size limit (5MB), quarantine suspicious uploads |
| **Lost images** | Broken public profiles | Use Vercel Blob (redundant, CDN), test upload recovery |
| **Concurrent edits** | Data race, lost updates | Last-write-wins (acceptable for MVP), or add version check in Phase 6 |
| **Session tracking bugs** | Incorrect session list | Test with multiple devices/browsers, clear expired sessions daily |
| **Password change spam** | DoS via password endpoint | Rate limit (3 per hour), log failed attempts |
| **Installer forgets password** | Can't access account | Use existing password reset flow (Phase 4) |

---

## 11. Rollout Plan

### Phase 5a: Basic Editing (Days 1-2)
1. Create `/installer-dashboard/profile` page
2. Implement GET `/api/installer/profile` endpoint
3. Implement POST `/api/installer/profile` endpoint
4. Add form fields (phone, website, description, service areas, services)
5. Add validation (client + server)
6. Test happy path: load → edit → save → verify

### Phase 5b: Image Upload (Days 2-3)
1. Set up Vercel Blob integration (if not already done)
2. Implement POST `/api/installer/upload-image` endpoint
3. Add image input fields + preview
4. Test upload: select → preview → save → public profile

### Phase 5c: Account Security (Days 3-4)
1. Implement POST `/api/installer/change-password` endpoint
2. Build Change Password modal
3. Implement GET `/api/installer/sessions` endpoint
4. Implement POST `/api/installer/sessions/{id}/logout` endpoint
5. Add Active Sessions card to profile page
6. Test: change password → re-login works

### Phase 5d: Integration + Testing (Day 5)
1. Verify all edits appear on public profile
2. Test mobile responsiveness
3. Test concurrent edits (multiple tabs)
4. Smoke test full flow: login → profile → edit → view profile
5. Document any edge cases
6. Deploy to production

### Success Criteria
- ✅ All acceptance criteria (8.) pass
- ✅ No console errors or warnings
- ✅ Mobile responsive
- ✅ Public profile reflects all edits
- ✅ Performance: all endpoints <1s

---

## 12. Open Questions / Decisions

| Question | Decision | Why |
|----------|----------|-----|
| **Email change** | Defer to Phase 6 | Requires verification flow; complex |
| **Profile URL** | Use slug from claim; locked | Stability, SEO value |
| **Service areas** | Predefined checklist (not free-form) | Helps search/filtering |
| **Description char limit** | 500 chars | Balance between detail & brevity |
| **Image size limit** | 5MB | Fast uploads on mobile |
| **Password change rate limit** | 3 per hour | Prevent spam; reasonable for users |
| **Session expiry** | 7 days (from Phase 4) | Keep consistent |
| **Public profile cache** | 5 min TTL | Quick updates without overload |
| **Bulk photo gallery** | Phase 7+ | Keep Phase 5 focused on essentials |

---

## 13. Definitions

- **Profile:** Public listing shown at `/en/installers/[slug]`
- **Session:** Authenticated login state (7-day cookie)
- **Service Areas:** Suburbs where installer operates (multi-select)
- **Services:** Types of work offered (Installation/Maintenance/Repairs)
- **Blob:** Vercel Blob storage for images
- **Rate Limiting:** Max requests per time window (e.g., 3 password changes/hour)

---

## Files to Create/Modify

### New Files
- `src/app/installer-dashboard/profile/page.tsx` — Profile edit page
- `src/app/api/installer/profile/route.ts` — GET/POST profile endpoints
- `src/app/api/installer/upload-image/route.ts` — Image upload endpoint
- `src/app/api/installer/change-password/route.ts` — Password change endpoint
- `src/app/api/installer/sessions/route.ts` — Session list endpoint
- `src/app/api/installer/sessions/[id]/logout/route.ts` — Logout session endpoint

### Files to Modify
- `src/app/installer-dashboard/page.tsx` — Add "Edit Profile" button
- Database migration script — Add columns to installers + user_sessions table

---

## Implementation Checklist

**Phase 5a: Basic Editing**
- [ ] Database migration: add phone, website, description, service columns
- [ ] Create profile page layout (5 cards)
- [ ] Implement GET /api/installer/profile
- [ ] Implement POST /api/installer/profile
- [ ] Add form validation (client + server)
- [ ] Test phone/website/description edits

**Phase 5b: Image Upload**
- [ ] Set up Vercel Blob (or confirm it's ready)
- [ ] Implement POST /api/installer/upload-image
- [ ] Add file input + preview
- [ ] Test upload → public profile

**Phase 5c: Account Security**
- [ ] Database migration: create user_sessions table
- [ ] Implement POST /api/installer/change-password
- [ ] Build Change Password modal
- [ ] Implement GET /api/installer/sessions
- [ ] Implement POST /api/installer/sessions/{id}/logout
- [ ] Test password change + session logout

**Phase 5d: E2E Testing**
- [ ] Full flow: login → edit profile → save → view public
- [ ] Mobile responsive test
- [ ] Test all validation errors
- [ ] Test image upload edge cases
- [ ] Verify cache invalidation

---

**Phase 5 Ready for Approval** ✅

Next: User review, approval, then implementation.
