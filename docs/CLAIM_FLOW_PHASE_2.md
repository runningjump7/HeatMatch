# Claim Business Flow — Phase 2: Admin Review Workflow

**Status:** Ready for Development  
**Date:** 2026-10-04  
**Version:** 1.0

---

## Overview

Phase 2 implements the **unhappy path** for installer business claims: when an installer submits an email that doesn't match the business domain, the claim enters a pending state and waits for admin review and approval.

**Goal:** Route mismatched claims to admin for manual verification  
**Friction:** Admin approval within 24 hours  
**Expected Rate:** ~20% of claims (Phase 1 = 80% fast-track, Phase 2 = 20% manual)

---

## User Flow

```
Claim Form: Email Domain Check
├─ Email domain matches business name?
│  ├─ ✅ YES → Phase 1: Auto-approve (existing)
│  └─ ❌ NO → Phase 2: Pending Review (NEW)
│
User Flow (Email Mismatch):
↓
Modal shows: "Email doesn't match. Admin will review within 24 hours."
├─ Claim created with status='pending'
├─ User confirms (cannot proceed in modal)
└─ Modal closes
   ↓
Admin Portal:
↓
Admin sees "Pending Claims" filter in installers list
├─ Shows: installer name, submitted email, user full name, submitted date
├─ Each claim has: [View] [Approve] [Reject] actions
├─ Approval:
│  ├─ Creates user record automatically
│  ├─ Generates temp password (or sends password reset link in Phase 3)
│  ├─ Updates claim status to 'approved'
│  └─ Updates installer.account_status to 'verified'
│
└─ Rejection:
   ├─ Admin adds optional rejection reason
   ├─ Updates claim status to 'rejected'
   ├─ Updates claim with admin_notes
   └─ User notified (Phase 3 email)
```

---

## Requirements

### Requirement 2.1: Pending Claim Creation

**When:** Email domain doesn't match business name  
**What happens:**
- Claim inserted into `installer_claims` with:
  - `status = 'pending'` (NOT 'approved')
  - `submitted_at = NOW()`
  - All other fields from user input
- User shown modal: "Email doesn't match. Admin will review within 24 hours."
- Modal has close button only (no "Continue" action)
- Claim ID stored for admin lookup

**Database State:**
```sql
INSERT INTO installer_claims 
  (installer_id, email, full_name, status, submitted_at, created_at)
VALUES 
  (?, ?, ?, 'pending', NOW(), NOW())
```

---

### Requirement 2.2: Admin Installers List with Pending Claims Filter

**Where:** `/admin/installers` page  
**New Filter:** "Show: All / Verified / Pending Claims"

**UI Changes:**
- Add filter dropdown above installers table
- When "Pending Claims" selected, show only installers with pending claims
- Table displays:
  - Installer name
  - Business email (from claim)
  - User email (who submitted claim)
  - User full name
  - Submitted date
  - Status badge (pending)
  - Actions: [View Claim] [Approve] [Reject]

**Example:**
```
Filter: [Pending Claims ▼]

| Installer | Business Email | Claimed By | Submitted | Status | Actions |
|-----------|------|-----------|-----------|--------|---------|
| North Shore Climate | north-shore@local | john@gmail.com | John Smith | Oct 3 | pending | [View] [Approve] [Reject] |
```

---

### Requirement 2.3: Admin Approve Workflow

**When:** Admin clicks [Approve]

**Steps:**
1. Show modal with claim details + optional text field for admin notes
2. Admin reviews and clicks [Approve]
3. System:
   - Generates temporary password (random 12-char alphanumeric)
   - Creates `users` record:
     - email: from claim
     - password_hash: SHA256 of temp password (TODO: upgrade to bcrypt in Phase 4)
     - installer_id: linked
     - verified_at: NOW()
   - Updates `installer_claims`:
     - status = 'approved'
     - reviewed_at = NOW()
     - reviewed_by = admin user ID
     - admin_notes = optional text entered by admin
   - Updates `installers`:
     - account_status = 'verified'
   - Reject all other pending claims for same installer (see 2.5)
   - Show success modal: "Claim approved! Temp password: [password] will be emailed to user."

**Database Queries:**
```sql
-- Create user
INSERT INTO users (email, password_hash, installer_id, verified_at, created_at)
VALUES (?, ?, ?, NOW(), NOW());

-- Update claim
UPDATE installer_claims
SET status='approved', reviewed_at=NOW(), reviewed_by=?, admin_notes=?
WHERE id=?;

-- Update installer
UPDATE installers
SET account_status='verified'
WHERE id=?;

-- Reject other pending claims for same installer
UPDATE installer_claims
SET status='rejected', admin_notes='Another claim for this business was already approved'
WHERE installer_id=? AND status='pending' AND id!=?;
```

---

### Requirement 2.4: Admin Reject Workflow

**When:** Admin clicks [Reject]

**Steps:**
1. Show modal with claim details + text field for rejection reason (optional)
2. Admin enters reason (e.g., "Business number doesn't match") and clicks [Reject]
3. System:
   - Updates `installer_claims`:
     - status = 'rejected'
     - reviewed_at = NOW()
     - reviewed_by = admin user ID
     - admin_notes = rejection reason
   - Show success modal: "Claim rejected. User will be notified."
   - Optionally: offer admin option to "Reject & block email" (future feature)

**Database Query:**
```sql
UPDATE installer_claims
SET status='rejected', reviewed_at=NOW(), reviewed_by=?, admin_notes=?
WHERE id=?;
```

---

### Requirement 2.5: Claim Exclusivity

**Rule:** Only 1 approved claim per installer

**Enforcement:**
1. When admin approves a claim:
   - All other `pending` claims for same installer auto-reject
   - admin_notes: "Another claim for this business was already approved"

2. When user tries to claim already-verified installer:
   - Claim submission returns error: "This business has already been claimed"
   - Do NOT create new claim

**Implementation:** In `/api/installer/claim` endpoint:
```typescript
// Check if installer already has approved user
const existingUser = await db.query(
  'SELECT id FROM users WHERE installer_id = ? LIMIT 1',
  [installerId]
);

if (existingUser.rows.length > 0) {
  return res.status(400).json({ 
    error: 'This business has already been claimed' 
  });
}
```

---

### Requirement 2.6: Duplicate Claim Prevention (Pending + Pending)

**Scenario:** User submits claim for same installer with same email while first claim is pending

**Behavior:**
- Do NOT create duplicate claim
- Retrieve existing pending claim
- Resend verification code to existing claim
- Return same claimId (allow user to continue)

**Implementation:** In `/api/installer/claim` endpoint:
```typescript
// Check for existing pending claim
const existingClaim = await db.query(
  'SELECT id FROM installer_claims WHERE installer_id = ? AND email = ? AND status = ?',
  [installerId, email, 'pending']
);

if (existingClaim.rows.length > 0) {
  // Resend code to existing claim instead of creating new
  const claimId = existingClaim.rows[0].id;
  // Generate new code, update claim_token, claim_token_expires
  // Return claimId (user continues with verification)
}
```

---

## New API Endpoints

### 1. GET `/api/admin/installer-claims`

Fetch pending claims for admin portal.

**Query Params:**
- `status`: 'pending' | 'approved' | 'rejected' | 'all' (default: pending)
- `page`: pagination (default: 1)
- `limit`: items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "claims": [
    {
      "id": "uuid",
      "installer_id": "uuid",
      "installer_name": "North Shore Climate",
      "email": "john@gmail.com",
      "full_name": "John Smith",
      "status": "pending",
      "submitted_at": "2026-10-03T14:22:00Z",
      "claimed_business_email": "john@northshoreclimate.co.nz"
    }
  ],
  "total": 42,
  "page": 1
}
```

---

### 2. POST `/api/admin/installer-claims/{claimId}/approve`

Approve a pending claim.

**Request:**
```json
{
  "admin_notes": "Verified business registration"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim approved",
  "temp_password": "TempPass123!",
  "user_id": "uuid",
  "claim": {
    "id": "uuid",
    "status": "approved",
    "reviewed_at": "2026-10-03T14:25:00Z"
  }
}
```

---

### 3. POST `/api/admin/installer-claims/{claimId}/reject`

Reject a pending claim.

**Request:**
```json
{
  "reason": "Business number doesn't match records"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim rejected",
  "claim": {
    "id": "uuid",
    "status": "rejected",
    "reviewed_at": "2026-10-03T14:25:00Z"
  }
}
```

---

## UI Components

### AdminClaimDetails Modal

New modal component for reviewing/approving/rejecting claims.

**Props:**
```typescript
{
  claimId: string;
  claim: InstallationClaim;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}
```

**Sections:**
1. **Claim Info:**
   - Installer: [name]
   - Business email: [email]
   - Claimed by: [full name] ([email])
   - Submitted: [date]

2. **Actions:**
   - [Approve] button (shows admin notes field)
   - [Reject] button (shows reason field)
   - [Close] button

**States:**
- View claim
- Approving (loading)
- Rejecting (loading)
- Success
- Error

---

## Integration Points

### Admin Installers Page (`/src/app/admin/installers/page.tsx`)

**Changes:**
1. Add filter state: `showPendingOnly` (boolean)
2. Add filter dropdown: "All / Verified / Pending Claims"
3. When "Pending Claims" selected:
   - Fetch from `/api/admin/installer-claims?status=pending`
   - Display claims in table with actions
4. Table rows have [View] [Approve] [Reject] buttons
5. Import and use `AdminClaimDetails` modal
6. Call `/api/admin/installer-claims/{id}/approve` or `/reject` on action

---

## Database Changes

### New Columns (if not already present)

```sql
-- installer_claims table (verify all exist)
-- id, installer_id, email, full_name, status, claim_token, claim_token_expires,
-- verification_attempts, resend_count, admin_notes, submitted_at, reviewed_at, reviewed_by, created_at
```

### New Indexes

```sql
CREATE INDEX idx_installer_claims_status ON installer_claims(status);
CREATE INDEX idx_installer_claims_installer_id ON installer_claims(installer_id);
CREATE INDEX idx_installer_claims_submitted_at ON installer_claims(submitted_at);
```

---

## Error Handling

| Scenario | Response | User Message |
|----------|----------|--------------|
| Email mismatch | 400, requiresAdminReview=true | "Email domain does not match. Admin will review within 24 hours." |
| Already verified | 400 | "This business has already been claimed." |
| Duplicate pending | 200 (resend code) | Continue with existing claim |
| Admin approve fails | 500 | "Approval failed. Please try again." |
| Admin reject fails | 500 | "Rejection failed. Please try again." |

---

## Acceptance Criteria

- [ ] Email mismatch routes to pending claim (not auto-approved)
- [ ] Pending claim created with correct status and timestamps
- [ ] Admin can see "Pending Claims" filter in installers list
- [ ] Pending claims table shows all required fields
- [ ] [Approve] button shows admin notes modal
- [ ] Admin approval creates user + updates statuses correctly
- [ ] Admin rejection updates claim status and notes
- [ ] Temp password generated and displayed to admin
- [ ] Other pending claims auto-reject when one is approved
- [ ] Cannot claim already-verified installer (shows error)
- [ ] Duplicate pending claims handled (resend code, same claimId)
- [ ] All timestamps in UTC
- [ ] Error messages clear and actionable

---

## Implementation Checklist

### Backend
- [ ] Add filter logic to `/api/admin/installer-claims` endpoint
- [ ] Implement `/api/admin/installer-claims/{id}/approve` endpoint
- [ ] Implement `/api/admin/installer-claims/{id}/reject` endpoint
- [ ] Add temp password generation function
- [ ] Add claim exclusivity check to `/api/installer/claim`
- [ ] Add duplicate pending claim handling
- [ ] Add database indexes
- [ ] Add input validation and error handling

### Frontend (Admin Portal)
- [ ] Create `AdminClaimDetailsModal` component
- [ ] Add filter dropdown to installers list
- [ ] Add fetch logic for pending claims
- [ ] Add table rows with [Approve] [Reject] actions
- [ ] Wire up API calls
- [ ] Add success/error modal feedback
- [ ] Add loading states

### Testing
- [ ] Run all Phase 2 test cases (below)
- [ ] Integration test: claim flow end-to-end
- [ ] Edge case: duplicate claims
- [ ] Edge case: claim exclusivity

---

## Test Cases

### 2.1: Email Domain Doesn't Match

**Given:** Installer "North Shore Climate Control"  
**When:** User submits email "random@gmail.com"  
**Then:**
- [ ] API returns `success=false, requiresAdminReview=true`
- [ ] Claim created in DB with `status='pending'`
- [ ] Modal shows: "Email domain does not match. Admin will review within 24 hours."
- [ ] Modal has only [Close] button (no continue action)

**Test Data:**
```
POST /api/installer/claim
{
  "slug": "north-shore-climate",
  "email": "alice@gmail.com",
  "fullName": "Alice Wonder"
}

Expected response:
{
  "success": false,
  "error": "Email domain does not match this business. Admin will review your claim.",
  "requiresAdminReview": true
}

Expected DB state:
installer_claims.status = 'pending'
installer_claims.email = 'alice@gmail.com'
installer_claims.full_name = 'Alice Wonder'
```

---

### 2.2: Admin Sees Pending Claims in List

**Given:** 3 pending claims exist in DB  
**When:** Admin navigates to `/admin/installers` and selects filter "Pending Claims"  
**Then:**
- [ ] Page shows "Pending Claims (3)" badge
- [ ] Table displays only pending claims
- [ ] Each row shows: installer name, claimed email, claimed by name, date, [View] [Approve] [Reject]
- [ ] Verified installers are hidden

**Test Data:**
```
installer_claims table:
- Claim 1: installer_id=X, email=alice@gmail.com, status=pending, submitted_at=2h ago
- Claim 2: installer_id=Y, email=bob@yahoo.com, status=pending, submitted_at=1h ago
- Claim 3: installer_id=Z, email=carol@custom.co.nz, status=rejected (hidden)

Expected UI:
- Filter dropdown: "Pending Claims" selected
- Table rows: 2 visible (Claim 1, 2)
```

---

### 2.3: Admin Approves Claim

**Given:** Pending claim for installer X from user "john@gmail.com"  
**When:** Admin clicks [Approve], reviews details, enters notes "Verified registration", clicks [Approve]  
**Then:**
- [ ] User record created: email=john@gmail.com, installer_id=X, verified_at=NOW()
- [ ] Temp password generated (12-char) and displayed: "TempPass123"
- [ ] Claim updated: status='approved', reviewed_at=NOW(), reviewed_by=admin_id, admin_notes="Verified registration"
- [ ] Installer updated: account_status='verified'
- [ ] Success modal shown: "Claim approved! Temp password: TempPass123 sent to user"
- [ ] All other pending claims for installer X auto-rejected

**Test Data:**
```
Before:
installer_claims:
  - Claim A: installer_id=X, status=pending, email=john@gmail.com
  - Claim B: installer_id=X, status=pending, email=jane@hotmail.com

POST /api/admin/installer-claims/A/approve
{ "admin_notes": "Verified registration" }

After:
users:
  - Created: email=john@gmail.com, installer_id=X, verified_at=NOW()
  
installer_claims:
  - Claim A: status=approved, reviewed_by=admin, admin_notes="Verified registration"
  - Claim B: status=rejected, admin_notes="Another claim for this business was already approved"

installers:
  - X: account_status=verified
```

---

### 2.4: Admin Rejects Claim with Reason

**Given:** Pending claim for installer Y  
**When:** Admin clicks [Reject], enters reason "Business number doesn't match", clicks [Reject]  
**Then:**
- [ ] Claim updated: status='rejected', reviewed_at=NOW(), reviewed_by=admin_id, admin_notes="Business number doesn't match"
- [ ] NO user record created
- [ ] Installer status unchanged (still unclaimed/unverified)
- [ ] Success modal shown: "Claim rejected. User will be notified."

**Test Data:**
```
Before:
installer_claims:
  - Claim X: installer_id=Y, status=pending

POST /api/admin/installer-claims/X/reject
{ "reason": "Business number doesn't match" }

After:
installer_claims:
  - Claim X: status=rejected, admin_notes="Business number doesn't match"
  
users:
  - (no new user created)
  
installers:
  - Y: account_status still 'unclaimed'
```

---

### 2.5: Claim Exclusivity - Cannot Claim Verified Installer

**Given:** Installer X already has account_status='verified'  
**When:** Different user tries to claim installer X with email "random@domain.com"  
**Then:**
- [ ] API returns: `success=false, error="This business has already been claimed"`
- [ ] NO claim record created
- [ ] Modal shows error message

**Test Data:**
```
Before:
installers:
  - X: account_status=verified

POST /api/installer/claim
{
  "slug": "installer-x",
  "email": "attacker@domain.com",
  "fullName": "Attacker"
}

Expected response:
{
  "success": false,
  "error": "This business has already been claimed"
}

Expected DB state:
- No new claim created
- installer_claims count unchanged
```

---

### 2.6: Duplicate Pending Claims - Resend Code

**Given:** User has submitted claim for installer X, claim is pending with code "123456"  
**When:** Same user submits claim again for same installer with same email  
**Then:**
- [ ] NO duplicate claim created
- [ ] Existing claim retrieved
- [ ] NEW code generated and stored
- [ ] verification_attempts reset to 0
- [ ] Same claimId returned
- [ ] Modal shows verification code step with new code

**Test Data:**
```
Before:
installer_claims:
  - Claim A: installer_id=X, email=john@gmail.com, status=pending, claim_token=123456

POST /api/installer/claim (2nd time)
{
  "slug": "installer-x",
  "email": "john@gmail.com",
  "fullName": "John Smith"
}

Expected response:
{
  "success": true,
  "claimId": "A" (same as before),
  "message": "New code sent to your email"
}

Expected DB state:
installer_claims:
  - Claim A: claim_token=789012 (new), verification_attempts=0
  - (no Claim B created)
```

---

### 2.7: Approval Creates User with Temp Password

**Given:** Pending claim with email "bob@custom.co.nz"  
**When:** Admin approves claim  
**Then:**
- [ ] User record created with password_hash = SHA256(temp_password)
- [ ] Temp password is random 12-char alphanumeric (e.g., "TempPass123!")
- [ ] User can login with temp password
- [ ] verified_at timestamp set to NOW()
- [ ] Temp password displayed to admin

**Test Data:**
```
POST /api/admin/installer-claims/ABC/approve
{ "admin_notes": "" }

Response:
{
  "success": true,
  "temp_password": "TempPass123!",
  "user_id": "new-user-uuid"
}

DB state:
users:
  - id: new-user-uuid
  - email: bob@custom.co.nz
  - password_hash: SHA256("TempPass123!")
  - verified_at: NOW()
```

---

### 2.8: Other Pending Claims Auto-Reject on Approval

**Given:** 3 pending claims for same installer X  
**When:** Admin approves the first claim  
**Then:**
- [ ] First claim: status='approved'
- [ ] Other 2 claims: status='rejected', admin_notes="Another claim for this business was already approved"
- [ ] Only 1 user record created (for approved claim)

**Test Data:**
```
Before:
installer_claims:
  - Claim A: installer_id=X, email=alice@gmail.com, status=pending
  - Claim B: installer_id=X, email=bob@yahoo.com, status=pending
  - Claim C: installer_id=X, email=carol@custom.co.nz, status=pending

POST /api/admin/installer-claims/A/approve
{ "admin_notes": "Verified" }

After:
installer_claims:
  - Claim A: status=approved, reviewed_by=admin
  - Claim B: status=rejected, admin_notes="Another claim for this business was already approved"
  - Claim C: status=rejected, admin_notes="Another claim for this business was already approved"

users:
  - Only 1 created (for Claim A)
```

---

### 2.9: Reject Doesn't Create User or Verify Installer

**Given:** Pending claim for installer Y  
**When:** Admin rejects claim  
**Then:**
- [ ] Claim updated: status='rejected'
- [ ] NO user record created
- [ ] Installer status unchanged (still unclaimed/unverified)
- [ ] Installer NOT in "Pending Claims" list anymore

**Test Data:**
```
Before:
installer_claims:
  - Claim X: installer_id=Y, status=pending

POST /api/admin/installer-claims/X/reject
{ "reason": "Doesn't match records" }

After:
users:
  - (unchanged, no new user)

installers:
  - Y: account_status unchanged

installer_claims:
  - Claim X: status=rejected
```

---

### 2.10: Email Mismatch with Multi-Word Business Name

**Given:** Installer "Eco Comfort Systems NZ"  
**When:** User submits email "john@mycompany.nz" (doesn't match)  
**Then:**
- [ ] Treated as Phase 2 (pending)
- [ ] Admin sees claim in pending list
- [ ] Email contains both words? NO → Phase 2 confirmed

**Test Data:**
```
Installer: "Eco Comfort Systems NZ" (slug: eco-comfort-systems-nz)
Submitted email: john@mycompany.nz

Email domain: mycompany
Business name: eco-comfort-systems-nz

Match check: 'mycompany' in 'eco-comfort-systems-nz'? NO
'eco-comfort-systems-nz' in 'mycompany'? NO

Result: Phase 2 (pending) ✓
```

---

## Success Metrics

After Phase 2 is complete:

- Admin can review all pending claims within dashboard
- 100% of mismatch claims route to pending state
- Admin approval SLA: <24 hours per claim
- Zero claims approved without admin review
- Claim exclusivity enforced: max 1 approved claim per installer
- All test cases pass

---

## Notes & TODOs

- **Phase 3:** Add email notifications (approval, rejection, temp password)
- **Phase 4:** Add installer dashboard + password reset for temp password
- **Security:** Upgrade SHA256 password hashing to bcrypt in Phase 4
- **Future:** Add auto-reject for claims >7 days pending (Phase 2.5)
- **Future:** Add ban list for repeat rejection attempts from same email

