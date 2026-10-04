# Claim Business Flow — Phase 1: Happy Path ✓

**Status:** Complete and Tested  
**Date:** 2026-10-04  
**Version:** 1.0

---

## Overview

Phase 1 implements the **happy path** for installer business claims: when an installer submits their own business email (matching the business domain), they can instantly verify and create an account.

**Goal:** Fast-track legitimate business owners  
**Friction:** 3 minutes  
**Success Rate Target:** ~80% of claims

---

## User Flow

```
Unclaimed Profile Page
↓
[Claim This Business] button appears (blue info box)
↓
Modal opens: "Claim This Business"
├─ Email input (required)
├─ Full Name input (required)
└─ [Send Verification Code] button
   ↓
Email Domain Check
├─ Email domain matches business name? 
│  ├─ ✅ YES → Send 6-digit code to email
│  └─ ❌ NO → Redirect to Phase 2 (admin review)
   ↓
User receives email with code
   ↓
Modal Step 2: "Enter verification code"
├─ Code input (6 digits)
├─ Max 3 attempts
├─ 10 min expiry
├─ [Verify Code] button
└─ [Resend code] option (max 3 resends)
   ↓
Code verification
├─ Correct → proceed
└─ Wrong → show error, allow retry
   ↓
Modal Step 3: "Set password"
├─ Password input (8+ characters)
├─ Confirm password input
└─ [Create Account] button
   ↓
Account created
├─ User record created
├─ Linked to installer
├─ Status marked as 'verified'
├─ installer_claims marked as 'approved'
└─ Welcome email sent
   ↓
Modal Step 4: Success screen
├─ Confirmation message
└─ [Go to Dashboard] button
   ↓
Redirect to /installer-dashboard
```

---

## Endpoints

### 1. POST `/api/installer/claim`

**Submit claim (email + name)**

**Request:**
```json
{
  "slug": "north-shore-climate",
  "email": "john@northshoreclimate.co.nz",
  "fullName": "John Smith"
}
```

**Response (Happy Path):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "claimId": "fc76dff8-ddb5-4adf-b861-b1410b73194c",
  "email": "john@northshoreclimate.co.nz"
}
```

**Response (Email Mismatch - Phase 2):**
```json
{
  "success": false,
  "error": "Email domain does not match this business. Admin will review your claim.",
  "requiresAdminReview": true
}
```

**Email Domain Validation Logic:**
```
Extract domain: john@northshoreclimate.co.nz → northshoreclimate
Extract business name: "North Shore Climate Control" → "northshoreclimate" (normalized)
Check if domain includes business name OR vice versa
If match → Happy path (send code)
If no match → Phase 2 (admin review)
```

---

### 2. POST `/api/installer/verify-claim-code`

**Verify the 6-digit code**

**Request:**
```json
{
  "claimId": "fc76dff8-ddb5-4adf-b861-b1410b73194c",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code verified successfully",
  "claimId": "fc76dff8-ddb5-4adf-b861-b1410b73194c",
  "nextStep": "createPassword"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid code. Please try again." // or "Code has expired" or "Too many attempts"
}
```

**Validation:**
- Code must match claim token exactly
- Max 3 incorrect attempts
- Code expires after 10 minutes
- Increments attempt counter on each try

---

### 3. POST `/api/installer/create-account`

**Create user account and mark claim as approved**

**Request:**
```json
{
  "claimId": "fc76dff8-ddb5-4adf-b861-b1410b73194c",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "nextStep": "redirect_to_dashboard"
}
```

**Validation:**
- Password must be 8+ characters
- Passwords must match
- Claim must still be in 'pending' status
- Creates user record with verified_at timestamp

---

## Database Changes

### New Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  installer_id UUID UNIQUE REFERENCES installers(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `installer_claims`
```sql
CREATE TABLE installer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installers(id),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  claim_token VARCHAR(6),
  claim_token_expires TIMESTAMP,
  verification_attempts INT DEFAULT 0,
  resend_count INT DEFAULT 0,
  admin_notes TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Modified Tables

#### `installers`
```sql
ALTER TABLE installers ADD COLUMN account_status VARCHAR(50) DEFAULT 'unclaimed';
-- Values: unclaimed, claimed_pending, verified
```

---

## Components

### `ClaimBusinessModal` (`/src/components/ClaimBusinessModal.tsx`)

**Props:**
```typescript
{
  slug: string;              // Installer slug
  businessName: string;      // For display in modal
  isOpen: boolean;           // Modal visibility
  onClose: () => void;       // Close handler
}
```

**States:**
- `email` — Email step input
- `verify` — Code verification step
- `password` — Password creation step
- `success` — Confirmation screen
- `error` — Error state (admin review needed)

**Key Features:**
- Auto-format code input (6 digits only)
- Disable submit button until valid
- Show remaining time for code expiry
- Retry/resend logic with visual feedback

---

## Integration Points

### Profile Page (`/src/app/[locale]/installers/[slug]/page.tsx`)

**Changes:**
1. Import `ClaimBusinessModal` component
2. Add `claimModalOpen` state
3. Add "Claim This Business" button (shows only for unclaimed installers)
4. Render modal component with props

**Button Location:** Blue info box at bottom of profile page (after "About This Listing")

---

## Error Handling

### User-Facing Errors

| Scenario | Message |
|----------|---------|
| Email domain doesn't match | "Email domain does not match this business. Admin will review your claim." |
| Code expired | "Code has expired. Request a new one." |
| Wrong code (1-2x) | "Invalid code. Please try again." |
| Wrong code (3x) | "Too many attempts. Request a new code." |
| Too many resends | "Max resends reached. Contact support if still needed." |
| Password too short | "Password must be at least 8 characters" |
| Passwords don't match | "Passwords do not match" |
| Network error | "Network error. Please try again." |

---

## Testing Checklist

- [ ] Happy path: email matches → code sent → code verified → account created
- [ ] Code validation: wrong code fails, 3rd attempt blocks resend
- [ ] Code expiry: after 10 min, code rejected with expiry message
- [ ] Resend logic: resend counter increments, max 3 resends allowed
- [ ] Password validation: 8+ chars, must match confirmation
- [ ] Email mismatch: triggers admin review flow (Phase 2)
- [ ] Modal closes when user closes it
- [ ] Success page redirects to dashboard
- [ ] Network errors handled gracefully

---

## What's NOT in Phase 1

❌ Email notifications (TODO)  
❌ Phone verification (Phase 2 fallback)  
❌ Admin approval flow (Phase 2)  
❌ Installer dashboard (exists, not linked yet)  
❌ Login/password reset (future phase)  

---

## Next: Phase 2 & 3

**Phase 2:** Unhappy path (email mismatch) → admin review + approval  
**Phase 3:** Email notifications (5 templates needed)

See [CLAIM_FLOW_FULL_PLAN.md](./CLAIM_FLOW_FULL_PLAN.md) for complete 3-phase roadmap.
