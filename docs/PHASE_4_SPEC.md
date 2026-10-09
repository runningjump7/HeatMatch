# Phase 4: Installer Dashboard & Authentication
**Status:** Ready to spec & review  
**Date:** 2026-10-09

---

## 1. Problem Statement

After an installer claims their business (Phases 1-3), they need a secure way to:
1. **Log in** to manage their profile and track leads
2. **View their dashboard** with key metrics and actions
3. **Reset passwords** if they forget them
4. **Be protected** from unauthorized access

Currently, we have:
- ✅ Login page (exists but branded TRADEEV2, not HeatMatch)
- ✅ Login endpoint with bcrypt hashing
- ✅ Session-based auth with cookies
- ❌ No installer dashboard
- ❌ No auth middleware/guards for protected routes
- ❌ No password reset flow
- ❌ Password hashing in claim flow still uses SHA256 (inconsistent with login)

**Phase 4 fills these gaps** by building the dashboard, securing routes, and completing the auth flow.

---

## 2. Goals and Non-Goals

### Goals ✅
1. **Installer Dashboard** — Single-page hub for verified installers to see their profile status, leads, and next actions
2. **Rebranding** — Update login page from TRADEEV2 to HeatMatch professional aesthetic
3. **Auth Protection** — Middleware guards on `/installer-dashboard` and admin routes to prevent unauthorized access
4. **Password Consistency** — Upgrade `create-account` endpoint to use bcrypt instead of SHA256
5. **Password Reset Flow** — Email-based password reset (verification link + new password form)
6. **Seamless Integration** — Claim flow redirects automatically to login/dashboard

### Non-Goals ❌
- Installer profile editing (Phase 5)
- Lead management (Phase 5)
- Installer settings/preferences (Phase 5)
- Two-factor authentication (future)
- OAuth/social login (future)
- Public sign-in link on homepage (noted for Phase 5)

---

## 3. Users and Jobs-to-be-Done

### User: Verified Installer
**Job 1:** After claiming their business, log in to see their dashboard  
**Job 2:** Understand what they can do with their account (next steps)  
**Job 3:** Reset their password if they forget it  
**Job 4:** Log out safely

### User: Admin
**Job:** Access admin panel without being redirected to installer login  
**Job:** Approve/reject claims as before (no disruption)

### User: Public Visitor
**Job:** Browse installers (unchanged from Phase 3)  
**Job:** Claim a business without disruption (unchanged from Phase 3)

---

## 4. Scope (In/Out)

### In Scope ✅
| Feature | Why | Status |
|---------|-----|--------|
| Login page rebrand (TRADEEV2 → HeatMatch) | User-facing, brand consistency | New |
| Installer dashboard (basic home page) | Core feature, shows post-claim status | New |
| Auth middleware (protect `/installer-dashboard`) | Security, prevent unauthorized access | New |
| Password reset flow (3 endpoints) | UX essential, users forget passwords | New |
| Upgrade `create-account` to bcrypt | Consistency, security parity with login | Enhancement |
| Post-claim redirect to login/dashboard | UX polish, smooth onboarding | Integration |
| Logout endpoint (if missing) | Session cleanup | New |

### Out of Scope ❌
| Feature | Why | Defer To |
|---------|-----|----------|
| Installer profile editing | Scope creep; separate flow | Phase 5 |
| Lead management dashboard | Requires lead integration | Phase 5 |
| Settings/preferences page | Lower priority | Phase 5 |
| Public "Sign In" link | Listed in progress.md for later | Phase 5 |
| Account recovery (email verification) | Not critical for MVP | Phase 6 |

---

## 5. User Flows

### Flow 1: Installer Claims Business → Logs In → Sees Dashboard
```
1. User lands on unclaimed installer profile
2. Clicks "Claim This Business"
3. Enters email (Phase 1) → gets code → creates password → account approved (Phase 3)
4. Modal shows "Success! Redirecting to dashboard..."
5. Redirects to `/installer-login`
6. Pre-fills email (from claim) — user just enters password
7. Logs in → session cookie set
8. Redirects to `/installer-dashboard`
9. Dashboard shows:
   - Greeting: "Welcome back, [Business Name]"
   - Status badge: "✓ Verified"
   - Quick actions: Edit Profile (disabled - Phase 5), View Public Profile
   - Recent activity: "Claimed on [date]"
   - Help section: "What's next? Update your profile to start receiving leads"
```

### Flow 2: Installer Forgets Password
```
1. Visits `/installer-login`
2. Clicks "Forgot Password?"
3. Enters email
4. Receives email with "Reset Password" link (valid 1 hour)
5. Clicks link → lands on `/reset-password?token=xxx`
6. Enters new password (8+ chars, 1 uppercase, 1 number)
7. Submits → password updated → redirects to login
8. Logs in with new password
```

### Flow 3: Admin Approves Claim → Sends Password Reset Link
```
1. Admin reviews claim in admin panel
2. Clicks "Approve"
3. System generates temp password (12-char random) → shows to admin (displays once)
4. Email sent to installer with:
   - "Your claim was approved!"
   - "Set your password: [link valid 24h]"
   - Link to `/reset-password?token=xxx`
5. Installer clicks link → sets new password → logs in
```

### Flow 4: Session Expiry & Protected Routes
```
1. Installer logs in → session cookie set (valid 7 days)
2. Session expires OR cookie deleted
3. Tries to visit `/installer-dashboard`
4. Middleware detects missing/invalid session
5. Redirects to `/installer-login?redirect=/installer-dashboard`
6. After login, redirects back to dashboard (if redirect param present)
```

---

## 6. Functional Requirements

### Requirement 1: Login Page Rebrand
**Status:** Update existing page  
**Files:** `src/app/installer-login/page.tsx`

- [ ] Replace "TRADEEV2" with "HeatMatch" logo (or text logo with emerald color)
- [ ] Update colors: blue-600 → emerald-600 (match brand)
- [ ] Update tagline: "Installer Portal" → "Manage Your HeatMatch Profile"
- [ ] Add light emerald background (subtle, not white)
- [ ] Keep form layout (email + password + submit)
- [ ] Keep "Back to site" and "Sign up" links

**Email pre-fill (nice-to-have):**
- If user came from claim flow, pre-fill email from URL param or session

### Requirement 2: Installer Dashboard Page
**Status:** New page  
**File:** `src/app/installer-dashboard/page.tsx`

**Required sections:**
1. **Header**
   - HeatMatch logo (links to home)
   - Logout button (top-right)

2. **Welcome Card**
   - Greeting: "Welcome back, [Business Name]"
   - Status badge: "✓ Verified" (emerald)
   - Verification date: "Verified on Oct 9, 2026"

3. **Quick Actions Card**
   - "View Your Public Profile" button (links to installer profile page)
   - "Edit Profile" button (disabled with tooltip "Coming soon")
   - (No contact/lead info yet)

4. **Help & Next Steps Card**
   - "What's next?" heading
   - Bullet points:
     - ✓ Your business is verified on HeatMatch
     - • Update your profile to attract more leads (coming soon)
     - • Monitor leads from your dashboard (coming soon)
     - • Need help? Email support@heatmatch.co.nz

5. **Footer**
   - Standard HeatMatch footer (consistent with public site)

**Data required:**
- User email (from session)
- Installer ID (from user.installer_id)
- Business name (from installers table)
- Verified date (from users.verified_at)

### Requirement 3: Auth Middleware
**Status:** New middleware  
**File:** `src/middleware.ts` (or `src/app/middleware.ts`)

**Protected routes:**
- `/installer-dashboard` — requires valid session (tradeev2_session cookie)
- `/admin/*` — requires valid session + admin role

**Unprotected routes:**
- `/installer-login`
- `/` (home) and all public pages
- `/en/installers/*` (public directory)

**Behavior:**
- Missing/invalid session → redirect to `/installer-login?redirect=/original-path`
- After login, check `redirect` param and go there (or default to dashboard)
- Admin routes: check `role='admin'` in session

### Requirement 4: Password Reset Flow (3 Endpoints + 1 Page)

#### Endpoint 1: POST `/api/auth/password-reset`
**Purpose:** Start password reset (send email)  
**Input:**
```json
{ "email": "installer@example.com" }
```

**Process:**
1. Look up user by email
2. Generate 32-char random token
3. Store token in DB with 1-hour expiry: `password_reset_tokens(user_id, token, expires_at)`
4. Send email with reset link: `https://heatmatch.co.nz/reset-password?token=xxx`
5. Return: `{ success: true, message: "Check your email for reset link" }`

**Error cases:**
- Email not found: Still return success (don't reveal user exists)
- Email send fails: Log error, return user-friendly message

#### Endpoint 2: GET `/api/auth/password-reset-validate`
**Purpose:** Validate token before showing form  
**Input:** `?token=xxx`  
**Process:**
1. Look up token in `password_reset_tokens` table
2. Check expiry (current_time < expires_at)
3. Return: `{ valid: true, email: "user@example.com" }` or `{ valid: false }`

**Error cases:**
- Token not found: `valid: false`
- Expired: `valid: false`

#### Endpoint 3: POST `/api/auth/password-reset-confirm`
**Purpose:** Set new password  
**Input:**
```json
{
  "token": "xxx",
  "password": "NewPass123",
  "confirmPassword": "NewPass123"
}
```

**Process:**
1. Validate token (same as Endpoint 2)
2. Validate password (8+ chars, 1 uppercase, 1 number) using auth.ts
3. Hash password with bcrypt
4. Update user's password_hash
5. Delete token from password_reset_tokens (one-time use)
6. Return: `{ success: true, message: "Password updated. Please log in." }`

**Error cases:**
- Invalid token: `{ success: false, error: "Invalid or expired token" }`
- Weak password: `{ success: false, error: "Password must be 8+ chars with 1 uppercase, 1 number" }`
- Passwords don't match: `{ success: false, error: "Passwords do not match" }`

#### Page: `/reset-password?token=xxx`
**Purpose:** Password reset form  
**File:** `src/app/reset-password/page.tsx`

**Steps:**
1. Load page with token from URL
2. Call `/api/auth/password-reset-validate` to check token validity
3. If invalid → show error "Link expired or invalid"
4. If valid → show form:
   - Heading: "Set Your New Password"
   - Input: New Password (type=password, 8+ chars)
   - Input: Confirm Password
   - Button: "Update Password"
   - Link: "Back to Login"

**Form submission:**
1. Validate passwords match + meet requirements
2. Call `/api/auth/password-reset-confirm`
3. On success → show "Password updated!" → redirect to login
4. On error → show error message

### Requirement 5: Upgrade create-account Endpoint
**Status:** Enhancement  
**File:** `src/app/api/installer/create-account/route.ts`

**Change:** Use bcrypt instead of SHA256

**Current code (lines 7-9):**
```typescript
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
```

**Updated code:**
```typescript
import { hashPassword } from '@/lib/auth';

// In endpoint:
const passwordHash = await hashPassword(password);
```

**Why:** Consistency with login endpoint + better security

### Requirement 6: Post-Claim Redirect
**Status:** Integration  
**File:** `src/components/ClaimBusinessModal.tsx`

**Current behavior:**
- On success: Redirects to `/installer-dashboard`

**New behavior:**
- On success: Redirects to `/installer-login?email=claimed@example.com`
- Login form pre-fills email (auto-focused on password field)
- After login: Redirects to `/installer-dashboard`

**Rationale:**
- User has account but hasn't logged in yet (just set password)
- Need to establish session before accessing dashboard
- Email pre-fill improves UX

### Requirement 7: Logout Endpoint
**Status:** Check/enhance  
**File:** `src/app/api/auth/logout/route.ts`

**Purpose:** Clear session cookie  
**Input:** None (POST)  
**Process:**
1. Clear `tradeev2_session` cookie
2. Return: `{ success: true }`

**Redirect:** Client redirects to `/` or `/installer-login`

---

## 7. Non-Functional Requirements

### Security
- [ ] Password reset tokens expire after 1 hour
- [ ] Password reset tokens are one-time use (deleted after confirmation)
- [ ] Session cookie is `httpOnly` (cannot be accessed by JavaScript)
- [ ] Session cookie is `secure` in production (HTTPS only)
- [ ] Session cookie `sameSite=strict` (CSRF protection)
- [ ] Unguarded POST endpoints validate CSRF (Next.js default)
- [ ] Bcrypt hashing for all new passwords (consistent)

### Performance
- [ ] Dashboard loads in <1s (simple queries, cached where possible)
- [ ] Auth middleware is lightweight (cookie validation only, no DB calls)
- [ ] Password reset email sent within 2s

### Data Integrity
- [ ] One session per user (or allow multiple devices)
- [ ] Password reset tokens are unique (use UUID)
- [ ] Installer_id always links to valid installer record

### Availability
- [ ] If email service fails, password reset fails gracefully (user sees error)
- [ ] If DB is down, auth redirects to 500 page (not blank)

---

## 8. Acceptance Criteria

### Phase 4a: Rebrand & Dashboard (Testable Without Claims)

- [ ] Login page shows HeatMatch branding (emerald colors, not blue)
- [ ] Dashboard page loads without errors
- [ ] Dashboard shows hardcoded/test business name (Eco Comfort Systems)
- [ ] Dashboard shows verified badge and date
- [ ] "View Public Profile" button links to installer's profile
- [ ] "Edit Profile" button exists but disabled with tooltip
- [ ] Footer is consistent with public site
- [ ] Mobile responsive (test on 375px viewport)

### Phase 4b: Password Reset Flow

- [ ] POST `/api/auth/password-reset` accepts email → sends email (logs to console in dev)
- [ ] GET `/api/auth/password-reset-validate?token=xxx` returns valid/invalid
- [ ] POST `/api/auth/password-reset-confirm` updates password with valid token
- [ ] Invalid tokens rejected with clear error
- [ ] Expired tokens rejected
- [ ] Weak passwords rejected (must show validation errors)
- [ ] Reset page shows appropriate UI (token valid → form, invalid → error)
- [ ] After reset → user can log in with new password

### Phase 4c: Auth Protection & Integration

- [ ] Session middleware protects `/installer-dashboard` (not `/installer-login`)
- [ ] Missing session → redirects to `/installer-login?redirect=/installer-dashboard`
- [ ] After login with redirect param → goes to dashboard (not home)
- [ ] Admin routes (`/admin/*`) still require session + `role='admin'`
- [ ] Logout clears session cookie and redirects
- [ ] Public routes (`/`, `/en/installers/*`, `/installer-login`) work without session

### Phase 4d: Bcrypt Upgrade

- [ ] `create-account` endpoint uses bcrypt (not SHA256)
- [ ] New accounts created during claim flow use bcrypt
- [ ] Existing accounts (if any) still log in (no migration needed for Phase 4)
- [ ] Login endpoint still uses bcrypt (unchanged)

### Phase 4e: Post-Claim Integration

- [ ] Claim modal redirects to login (not dashboard) on success
- [ ] Login form pre-fills email from URL param
- [ ] After login → redirects to dashboard
- [ ] Email pre-fill focused on password field (better UX)

---

## 9. Metrics and Instrumentation

### Events to Log (for Phase 5+ analytics)
- `login_success` — email, timestamp, installer_id
- `login_failed` — email, timestamp, reason (invalid email/password)
- `password_reset_requested` — email, timestamp
- `password_reset_success` — email, timestamp
- `dashboard_viewed` — installer_id, timestamp
- `logout` — installer_id, session_duration_seconds

### Alerts (for operations)
- High login failure rate (>5 fails per minute) → potential attack
- Password reset spam (>10 per minute for same email) → potential abuse

### Metrics (for product)
- % of claimers who complete login flow (claim → login → dashboard)
- Average time from claim to first dashboard visit
- Password reset usage rate (% of users)

---

## 10. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **SQL injection in middleware** | Critical data breach | Use parameterized queries; middleware just reads cookie (no SQL) |
| **Session fixation attack** | Account takeover | Regenerate session ID on login; httpOnly cookie |
| **Password reset token leaked** | Account takeover | 1-hour expiry, one-time use, sent via email only (not URL preview) |
| **Brute force login** | Account lockout | Rate limiting (Phase 5) or login attempt tracking |
| **Email service down** | Users can't reset password | Graceful error message; retry available |
| **Admin locked out of `/admin`** | Operational blocker | Hardcoded admin check or backup super-admin user |
| **Installer forgets email** | Can't reset password | Phase 5: Add account recovery flow |

---

## 11. Rollout Plan

### Phase 4a: Rebrand + Dashboard (Day 1-2)
1. Update login page styles (HeatMatch branding)
2. Create dashboard page scaffold
3. Add static content (hardcoded business name for testing)
4. Test manually in browser
5. Deploy to preview

### Phase 4b: Password Reset (Day 2-3)
1. Create `password_reset_tokens` table (migration)
2. Implement 3 API endpoints + 1 page
3. Add email template for reset
4. Test happy path: request → email → reset → login
5. Deploy to preview

### Phase 4c: Auth Middleware (Day 3-4)
1. Create middleware to check session
2. Protect `/installer-dashboard` and `/admin/*`
3. Test redirect behavior (missing session → login)
4. Test redirect param (after login → original page)
5. Deploy to preview

### Phase 4d: Upgrade Bcrypt (Day 4)
1. Update `create-account` endpoint
2. Test claim flow → account created with bcrypt
3. Test login with claimed account
4. No migration needed (old SHA256 accounts stay, new are bcrypt)
5. Deploy to preview

### Phase 4e: Integration + Smoke Test (Day 5)
1. Update claim modal to redirect to login (not dashboard)
2. Add email pre-fill to login form
3. Test full flow: claim → login → dashboard
4. Test password reset flow end-to-end
5. Test admin flow (claim approval → password reset email)
6. Deploy to production

### Success Criteria
- ✅ All 5 acceptance criteria sections pass
- ✅ Full claim → login → dashboard flow works end-to-end
- ✅ No existing tests break
- ✅ Claim flow still works (no regressions)
- ✅ Admin panel still accessible (no regressions)

---

## 12. Open Questions / Decisions

| Question | Decision | Why |
|----------|----------|-----|
| **Session duration** | 7 days (cookie maxAge) | Balance between security and UX (don't re-login every day) |
| **Multiple devices** | Allow multiple sessions (no forced logout) | Better UX; can add "end other sessions" later |
| **Password reset token format** | UUID v4 (32 chars, secure random) | Industry standard, hard to guess |
| **Email pre-fill on login** | Yes, from URL param `?email=xxx` | Better UX after claiming |
| **Dashboard: show leads?** | No, Phase 5+ feature | Too much scope for Phase 4; focus on auth |
| **Admin password reset** | Use same flow (email link) | Consistency; admins don't need special flow |
| **Rate limiting** | Not Phase 4 (defer to Phase 5) | Add if brute force becomes issue |
| **Analytics tracking** | Log events but don't report (Phase 5) | Foundation ready; Phase 5 can send to analytics tool |

---

## 13. Definitions

- **Session:** Logged-in state, stored as httpOnly cookie, valid 7 days
- **Password Reset Token:** One-time, short-lived (1 hour) UUID used to verify password reset request
- **Auth Middleware:** Code that checks for valid session before allowing access to protected routes
- **Bcrypt:** Industry-standard password hashing (iterative, salted, resistant to brute force)
- **CSRF:** Cross-Site Request Forgery; prevented by Next.js by default with httpOnly cookies
- **Dashboard:** Post-login home page showing installer's status and next actions

---

## Files to Create/Modify

### New Files
- `src/app/installer-dashboard/page.tsx` — Dashboard page
- `src/app/reset-password/page.tsx` — Password reset form page
- `src/app/api/auth/password-reset/route.ts` — Request password reset (send email)
- `src/app/api/auth/password-reset-validate/route.ts` — Validate reset token
- `src/app/api/auth/password-reset-confirm/route.ts` — Confirm new password
- `src/lib/email-templates.ts` — Add password reset email template (if not already there)
- `src/middleware.ts` — Auth middleware for protected routes
- Database migration: Create `password_reset_tokens` table

### Files to Modify
- `src/app/installer-login/page.tsx` — Rebrand to HeatMatch, add email pre-fill
- `src/app/api/installer/create-account/route.ts` — Use bcrypt instead of SHA256
- `src/components/ClaimBusinessModal.tsx` — Redirect to login instead of dashboard
- `src/app/api/auth/logout/route.ts` — Enhance if needed (check it exists and works)

---

## Implementation Checklist

**Phase 4a: Rebrand + Dashboard**
- [ ] Design decision: HeatMatch logo/text for login page
- [ ] Update login page HTML/CSS (colors, text, logo)
- [ ] Create dashboard page scaffold
- [ ] Add hardcoded test data
- [ ] Mobile test at 375px
- [ ] Visual review (matches brand)

**Phase 4b: Password Reset**
- [ ] Create migration: `password_reset_tokens` table
- [ ] Implement POST `/api/auth/password-reset` endpoint
- [ ] Implement GET `/api/auth/password-reset-validate` endpoint
- [ ] Implement POST `/api/auth/password-reset-confirm` endpoint
- [ ] Create `/reset-password` page
- [ ] Add email template for password reset
- [ ] Test happy path: request → email (console) → reset → login
- [ ] Test error cases: invalid token, weak password, mismatch

**Phase 4c: Auth Middleware**
- [ ] Create `src/middleware.ts` with session check
- [ ] Protect `/installer-dashboard`
- [ ] Protect `/admin/*`
- [ ] Test redirect behavior (missing session → login)
- [ ] Test redirect param (after login → original page)
- [ ] Verify public routes work without session

**Phase 4d: Bcrypt Upgrade**
- [ ] Update `create-account` to use bcrypt
- [ ] Test claim flow → account → login
- [ ] Verify password validation rules match auth.ts

**Phase 4e: Integration + E2E Test**
- [ ] Update ClaimBusinessModal to redirect to `/installer-login?email=xxx`
- [ ] Add email pre-fill to login form
- [ ] Test: Claim → Login (email pre-filled) → Dashboard
- [ ] Test: Password Reset flow end-to-end
- [ ] Test: Admin Approve → Password Reset Email → Set Password → Login
- [ ] Verify no regressions in existing flows

---

**Phase 4 Ready for Review** ✅

Next step: User review and approval before development begins.
