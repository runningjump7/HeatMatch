# Claim Business Flow — Specification & Test Cases (Phase 1 & 2)

**Version:** 1.0  
**Date:** 2026-10-04  
**Status:** Ready for Development

---

## 1. Product Requirements

### 1.1 Objective

Enable heat pump installers to claim ownership of their unclaimed business profiles in HeatMatch directory. Prevent random people from claiming businesses that aren't theirs.

### 1.2 Users

| User | Goal | Constraints |
|------|------|-------------|
| **Installer (legitimate owner)** | Claim their business, create account, access dashboard | Must have access to business email |
| **Non-owner (random person)** | Cannot claim a business | Blocked by email domain verification + admin review |
| **Admin** | Review and approve/reject questionable claims | Reviews claims with mismatched emails |

### 1.3 Success Metrics

- **Phase 1 (Happy Path) Conversion:** 70%+ of legitimate installers complete claim in <5 minutes
- **Phase 2 (Admin Review) SLA:** Admin reviews claims within 24 hours
- **Security:** 0 unauthorized claims approved
- **Support Load:** <5% of claims require manual intervention beyond admin review

---

## 2. Functional Requirements

### 2.1 Phase 1: Happy Path (Email Match)

**Trigger:** Installer clicks "Claim This Business" on unclaimed profile

**Requirement 1.1:** Email Domain Validation
- System extracts email domain (e.g., `john@northshoreclimate.co.nz` → `northshoreclimate`)
- System normalizes business name (e.g., `"North Shore Climate Control"` → `northshoreclimate`)
- **Accept if:** Domain contains business name OR business name contains domain
- **Reject if:** No match found → Route to Phase 2 (admin review)

**Requirement 1.2:** Verification Code Generation & Delivery
- Generate random 6-digit code (000000-999999)
- Store code in `installer_claims.claim_token`
- Set expiry to 10 minutes from now
- Reset verification attempts to 0
- Code is sent via email (TODO: Phase 3 implementation)

**Requirement 1.3:** Code Verification (Max 3 Attempts)
- User enters code in modal
- System compares to stored token
- **If correct:** Proceed to password step
- **If incorrect:** 
  - Increment `verification_attempts`
  - Show error message
  - Allow retry (up to 3 total)
  - After 3rd failure, show "Request new code" or "Try different email"

**Requirement 1.4:** Code Expiry (10 Minutes)
- If current time > `claim_token_expires`: Reject with "Code expired" message
- User must resend code

**Requirement 1.5:** Code Resend (Max 3 Resends)
- User can request new code without re-entering email
- Increment `resend_count`
- Generate new 6-digit code, reset `verification_attempts` to 0
- **Allow max 3 resends** per claim submission
- After 3 resends, show: "Max resends reached. Contact support if still needed."

**Requirement 1.6:** Account Creation
- User sets password (min 8 characters)
- User confirms password
- System validates: passwords match AND ≥8 chars
- Create `users` record:
  - email: from claim
  - password_hash: SHA256 of password (TODO: upgrade to bcrypt)
  - installer_id: from claim
  - verified_at: NOW()
- Update `installer_claims`:
  - status = 'approved'
  - reviewed_at = NOW()
  - reviewed_by = new user's ID
- Update `installers`:
  - account_status = 'verified'
- Redirect to `/installer-dashboard`

### 2.2 Phase 2: Unhappy Path (Email Mismatch)

**Trigger:** Email domain doesn't match business name

**Requirement 2.1:** Create Pending Claim
- Insert into `installer_claims`:
  - installer_id, email, full_name (from user input)
  - status = 'pending'
  - submitted_at = NOW()
- Show user: "Email doesn't match. Admin will review within 24 hours."
- Send confirmation email to user (Phase 3)

**Requirement 2.2:** Admin Review Portal
- New filter in admin installers list: "Pending Claims"
- Show: installer name, submitted email, user full name, submitted date
- Each claim has: [View] [Approve] [Reject] actions

**Requirement 2.3:** Admin Approve Workflow
- Admin clicks [Approve]
- System creates `users` record automatically:
  - email: from claim
  - password_hash: random temp password (or null)
  - installer_id: linked
  - verified_at: NOW()
- Update `installer_claims`:
  - status = 'approved'
  - reviewed_at = NOW()
  - reviewed_by = admin user ID
  - admin_notes: optional reason
- Update `installers`:
  - account_status = 'verified'
- Send email to user: "Your claim is approved. Set password here: [link]" (Phase 3)

**Requirement 2.4:** Admin Reject Workflow
- Admin clicks [Reject]
- Admin can optionally add rejection reason
- Update `installer_claims`:
  - status = 'rejected'
  - reviewed_at = NOW()
  - reviewed_by = admin user ID
  - admin_notes: rejection reason
- Send email to user: "Your claim was rejected: [reason]. Contact us to appeal." (Phase 3)

**Requirement 2.5:** Auto-Reject Stale Claims
- Pending claims older than 7 days without admin action → auto-reject
- Reason: "No response from admin within 7 days. Please contact support to appeal."

**Requirement 2.6:** Claim Exclusivity
- Only 1 approved claim per installer is allowed
- If admin approves a claim for installer X:
  - All other pending claims for installer X → auto-reject
  - Reason: "Another claim for this business was already approved"
- If new user tries to claim already-verified installer:
  - Show error: "This business has already been claimed"

---

## 3. Non-Functional Requirements

### 3.1 Security
- **Brute Force Protection:** Max 3 code attempts per claim
- **Email Validation:** Code only valid for email it was sent to
- **One-Time Use:** Code cannot be reused after accepted
- **Expiry:** Code invalid after 10 minutes
- **Password Hashing:** Use bcrypt (currently SHA256, TODO upgrade)
- **Rate Limiting:** Max 1 claim submission per email per 5 minutes (TODO)

### 3.2 Performance
- Claim submission response: <500ms
- Code verification: <200ms
- Admin approval: <1s

### 3.3 Data Integrity
- No orphaned claims (claims deleted if installer deleted)
- No duplicate approved claims per installer (unique constraint)
- All timestamps in UTC

---

## 4. Acceptance Criteria

### Phase 1 Complete When:

- [ ] Email domain validation works for variations (e.g., "North Shore Climate" matches "northshoreclimate")
- [ ] 6-digit code generated and stored with 10min expiry
- [ ] Code verification rejects after 3 wrong attempts
- [ ] Code rejects if expired
- [ ] User can resend code (max 3 times)
- [ ] Password validated: 8+ chars, must match confirmation
- [ ] User record created and linked to installer
- [ ] installer_claims marked as 'approved' after successful account creation
- [ ] installers.account_status updated to 'verified'
- [ ] Modal closes and redirects to dashboard
- [ ] All error messages are user-friendly and actionable
- [ ] Network errors handled gracefully (don't lose user input)
- [ ] Modal can be closed at any step

### Phase 2 Complete When:

- [ ] Email mismatch creates pending claim (not approved immediately)
- [ ] Admin can see "Pending Claims" filter in installers list
- [ ] Admin can approve claim → user auto-created
- [ ] Admin can reject claim with optional reason
- [ ] User gets email notification of approval/rejection
- [ ] Pending claims >7 days auto-reject with notification
- [ ] Only 1 approved claim allowed per installer
- [ ] Other pending claims for same installer auto-reject when one approved
- [ ] Cannot claim already-verified installer (shows error)

---

## 5. Test Cases

### 5.1 Phase 1: Happy Path Tests

#### Test 1.1: Email Domain Matches (Simple)
```
Given: Unclaimed installer "North Shore Climate Control" (slug: north-shore-climate)
When: User submits email "john@northshoreclimate.co.nz" + fullname "John Smith"
Then: 
  - Claim created with status 'pending'
  - 6-digit code generated
  - Response: success=true, claimId returned
```

#### Test 1.2: Email Domain Matches (Multi-word business, hyphenated domain)
```
Given: Installer "Eco Comfort Systems" (slug: eco-comfort-systems)
When: User submits "alex@eco-comfort-systems.nz"
Then: Accepted (domain "eco-comfort-systems" matches business name)
```

#### Test 1.3: Email Domain Matches (Reversed word order)
```
Given: Installer "Thermal Comfort NZ" (slug: thermal-comfort-nz)
When: User submits "support@comfort-thermal.nz"
Then: Accepted (both contain "thermal" and "comfort")
```

#### Test 1.4: Code Verification - Correct Code
```
Given: Claim with code "123456" generated
When: User enters "123456"
Then: 
  - Response: success=true, nextStep='createPassword'
  - verification_attempts stays at 0
```

#### Test 1.5: Code Verification - Wrong Code (1st attempt)
```
Given: Claim with code "123456"
When: User enters "999999"
Then:
  - Response: success=false, error="Invalid code. Please try again."
  - verification_attempts incremented to 1
  - Allow retry
```

#### Test 1.6: Code Verification - Wrong Code (3rd attempt - blocked)
```
Given: Claim with verification_attempts = 2, code = "123456"
When: User enters wrong code "999999"
Then:
  - Response: success=false, error="Too many attempts. Request a new code."
  - verification_attempts = 3
  - Show [Resend Code] button only
```

#### Test 1.7: Code Expiry
```
Given: Claim with claim_token_expires = 5 minutes ago
When: User enters correct code "123456"
Then:
  - Response: success=false, error="Code has expired. Request a new one."
  - Do NOT increment verification_attempts
```

#### Test 1.8: Code Resend (1st resend)
```
Given: Claim with resend_count = 0
When: User clicks [Resend Code]
Then:
  - New code generated and stored
  - verification_attempts reset to 0
  - resend_count = 1
  - Response: success=true, message="Code resent. Check your email."
```

#### Test 1.9: Code Resend (Max resends - blocked)
```
Given: Claim with resend_count = 3
When: User clicks [Resend Code]
Then:
  - Response: success=false, error="Max resends reached. Contact support..."
  - Code NOT regenerated
```

#### Test 1.10: Password Creation - Valid
```
Given: Code verified, user on password step
When: User enters password "SecurePass123" + confirm "SecurePass123"
Then:
  - User record created
  - installer linked to user
  - verified_at set to NOW()
  - installer_claims.status = 'approved'
  - Response: success=true, nextStep='redirect_to_dashboard'
```

#### Test 1.11: Password Creation - Password Too Short
```
Given: User on password step
When: User enters "short" + "short"
Then:
  - Response: success=false, error="Password must be at least 8 characters"
  - User record NOT created
  - [Create Account] button disabled
```

#### Test 1.12: Password Creation - Passwords Don't Match
```
Given: User on password step
When: User enters "SecurePass123" + "DifferentPass123"
Then:
  - Response: success=false, error="Passwords do not match"
  - User record NOT created
  - [Create Account] button disabled
```

#### Test 1.13: Duplicate Claim Submission
```
Given: User already has pending claim for installer X
When: User submits another claim for installer X with same email
Then:
  - Claim NOT created (duplicate)
  - Existing claim retrieved and new code sent
  - Same claimId returned
```

---

### 5.2 Phase 2: Unhappy Path Tests

#### Test 2.1: Email Domain Doesn't Match
```
Given: Installer "North Shore Climate Control"
When: User submits email "random@gmail.com" + fullname "Alice"
Then:
  - Response: success=false, error="Email domain does not match...", requiresAdminReview=true
  - Claim created with status='pending'
  - User shown: "Admin will review within 24 hours"
```

#### Test 2.2: Admin Approves Claim
```
Given: Pending claim for installer X with email "xyz@custom.co.nz"
When: Admin clicks [Approve]
Then:
  - User record created with:
    - email="xyz@custom.co.nz"
    - installer_id linked
    - verified_at = NOW()
  - claim.status = 'approved'
  - installer.account_status = 'verified'
  - Confirmation email sent (Phase 3)
```

#### Test 2.3: Admin Rejects Claim with Reason
```
Given: Pending claim for installer X
When: Admin clicks [Reject] and enters reason "Business not found in records"
Then:
  - claim.status = 'rejected'
  - claim.admin_notes = "Business not found in records"
  - Rejection email sent (Phase 3)
  - Claim removed from pending list
```

#### Test 2.4: Claim Exclusivity - Auto-Reject Others
```
Given: 2 pending claims for installer X (emails: a@domain.nz, b@domain.nz)
When: Admin approves claim for a@domain.nz
Then:
  - Claim for a@domain.nz: status='approved'
  - Claim for b@domain.nz: status='rejected', reason="Another claim for this business was already approved"
  - Email sent to b@domain.nz user (Phase 3)
```

#### Test 2.5: Already Verified Installer - Cannot Claim
```
Given: Installer X with account_status='verified'
When: User tries to claim installer X
Then:
  - Response: success=false, error="This business has already been claimed"
  - No claim created
```

#### Test 2.6: Auto-Reject Stale Claims
```
Given: Pending claim submitted 8 days ago (submitted_at = NOW() - 8 days)
When: System runs auto-reject job (midnight UTC)
Then:
  - claim.status = 'rejected'
  - claim.admin_notes = "Auto-rejected: No response within 7 days. Contact us to appeal."
  - Email sent to user (Phase 3)
```

---

### 5.3 Edge Cases & Error Handling

#### Test E1: Network Failure During Code Verification
```
When: User submits code but network fails (500 error)
Then:
  - Modal shows: "Network error. Please try again."
  - Code input preserved (user doesn't lose input)
  - Claim NOT marked as verified
  - User can retry
```

#### Test E2: Missing Required Fields
```
When: User submits claim without email
Then:
  - Response: success=false, error="Missing required fields: email, fullName"
  - [Send Code] button disabled
```

#### Test E3: Invalid Email Format
```
When: User submits "notanemail"
Then:
  - Browser native email validation triggers
  - [Send Code] button disabled
  - Clear error message shown
```

#### Test E4: Code Contains Non-Digits
```
When: User tries to enter "12AB56"
Then:
  - Input auto-filters to "1256" (letters removed)
  - Only digits accepted
```

#### Test E5: Installer Deleted After Claim Started
```
Given: Claim in progress for installer X
When: Admin deletes installer X
Then:
  - Claim cascade-deleted
  - User session invalid
  - Clear error: "Installer no longer exists"
```

#### Test E6: User Tries to Verify Code from Different Claim
```
Given: User has 2 active claims (claims A and B)
When: User submits code from claim A with claimId from claim B
Then:
  - Response: success=false, error="Code doesn't match"
  - Does NOT increment attempts for claim B
```

---

### 5.4 Security Tests

#### Test S1: Brute Force Protection
```
When: Attacker submits 100 wrong codes rapidly
Then:
  - After 3 wrong codes: "Too many attempts" error
  - Code marked as unusable
  - Attacker must request new code
```

#### Test S2: Code Reuse Prevention
```
Given: Code "123456" already verified
When: Attacker tries to use same code "123456" again
Then:
  - Response: success=false, error="Code has already been used"
```

#### Test S3: Code Cannot Reach Email It Wasn't Sent To
```
Given: Code sent to "john@business.nz"
When: Different person gets code and tries to use it for "alice@gmail.com"
Then:
  - At account creation: email mismatch detected
  - Error shown (implementation detail)
```

---

## 6. Test Execution Plan

### Before Code Review:
1. Run all Phase 1 tests (1.1-1.13) → 13 tests
2. Run Phase 2 tests (2.1-2.6) → 6 tests
3. Run edge case tests (E1-E6) → 6 tests
4. Run security tests (S1-S3) → 3 tests

**Total: 28 test cases**

### Manual Testing:
- [ ] Test on mobile (375px viewport)
- [ ] Test with slow network (DevTools throttling)
- [ ] Test with browser autofill
- [ ] Test with Caps Lock on

### Automated Testing (Future):
- Unit tests for email validation logic
- Integration tests for endpoint chains
- E2E tests with Playwright/Cypress

---

## 7. Rollout Plan

### Phase 1 Rollout (Happy Path)
- Deploy to preview environment
- Internal testing with team (48 hours)
- Deploy to production
- Monitor error rates + completion rate

### Phase 2 Rollout (Admin Review)
- Deploy after Phase 1 stable
- Admin training on pending claims workflow
- Monitor time-to-review (target: <24h)

### Success Criteria to Go Live
- Phase 1: 95%+ code paths passing tests
- Phase 1: 0 critical bugs in 7 days
- Phase 2: Admin can approve/reject in <2 min

---

## 8. Open Questions / Decisions Needed

| Question | Impact | Decision |
|----------|--------|----------|
| Should we send actual verification emails in Phase 1, or mock them? | UX | Mock via console log for now |
| Should password reset be in Phase 1 or later? | Security | Later (Phase 4) |
| Should we support social login (Google, etc)? | Complexity | Later consideration |
| Rate limit on new accounts per IP? | Security | Defer to Phase 3 if abuse appears |

---

## 9. Definitions

**Claim:** Request by installer to own their business profile  
**Verified:** Installer has completed claim flow and created account  
**Unclaimed:** Installer profile exists but no one has verified ownership  
**Happy Path:** Email matches → instant verification  
**Unhappy Path:** Email doesn't match → admin review required  
