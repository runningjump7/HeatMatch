# Phase 2 Testing Plan — Admin Review Workflow

**Status:** Ready for Testing  
**Date:** 2026-10-04

---

## Test Environment Setup

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000` (or port shown)
3. Open admin portal: `http://localhost:3000/admin/installers`

---

## Test Cases

### **Test 2.1: Email Mismatch Creates Pending Claim** ✓

**Steps:**
1. Go to any unclaimed installer profile (e.g., `/installers/north-shore-climate`)
2. Click "Claim This Business"
3. Enter:
   - Email: `random@gmail.com` (doesn't match business domain)
   - Full Name: `Alice Wonder`
4. Click "Send Verification Code"

**Expected Result:**
- Modal shows: "Email domain does not match. Admin will review..."
- Modal shows info box with next steps
- Only "Close" button visible (no continue action)
- **Database Check**: `SELECT * FROM installer_claims WHERE email='random@gmail.com'` should show `status='pending'`

---

### **Test 2.2: Admin Sees Pending Claims in List** ✓

**Steps:**
1. Create at least 2 pending claims (from Test 2.1)
2. Go to `/admin/installers`
3. Click button "Pending Claims"

**Expected Result:**
- Red badge shows count of pending claims (e.g., "2")
- Table displays pending claims with columns:
  - Business name
  - Claimed by name
  - Email submitted
  - Submitted date
  - "Review" button
- Only pending claims visible (verified installers hidden)

---

### **Test 2.3: Admin Approves Claim** ✓

**Steps:**
1. From pending claims list, click "Review" on any claim
2. Claim modal opens showing:
   - Installer name
   - Business email/phone
   - Claimed by name & email
   - Submitted date
   - Status badge "PENDING"
3. Click "Approve"
4. Enter optional admin notes (e.g., "Verified business registration")
5. Click "Confirm Approval"

**Expected Result:**
- Success modal appears with:
  - Title: "Success"
  - Temp password displayed (e.g., "TempPass123!")
  - Message: "Claim approved! Temp password sent to user"
- **Database Check:**
  ```sql
  -- Claim updated
  SELECT status, reviewed_by, admin_notes FROM installer_claims WHERE id='...'
  -- Should show: status='approved', reviewed_by=<admin-user-id>, admin_notes='Verified...'
  
  -- User created
  SELECT email, installer_id, verified_at FROM users WHERE email='random@gmail.com'
  -- Should have new row
  
  -- Installer verified
  SELECT account_status FROM installers WHERE id='...'
  -- Should show: 'verified'
  
  -- Other pending claims auto-rejected
  SELECT status FROM installer_claims WHERE installer_id='...' AND status='rejected'
  -- Should show rejection reason: "Another claim for this business was already approved"
  ```
- Pending claims list refreshes
- Approved claim no longer visible in list

---

### **Test 2.4: Admin Rejects Claim** ✓

**Steps:**
1. From pending claims list, click "Review" on a different pending claim
2. Click "Reject"
3. Enter rejection reason (e.g., "Business number doesn't match records")
4. Click "Confirm Rejection"

**Expected Result:**
- Success modal: "Claim rejected. User will be notified."
- **Database Check:**
  ```sql
  SELECT status, admin_notes FROM installer_claims WHERE id='...'
  -- Should show: status='rejected', admin_notes='Business number...'
  ```
- No user record created for this email
- Installer status unchanged (still unclaimed)
- Claim disappears from pending list

---

### **Test 2.5: Claim Exclusivity** ✓

**Setup:** One installer with one approved claim

**Steps:**
1. Go to same installer's profile again
2. Click "Claim This Business"
3. Enter any email + name
4. Try to submit

**Expected Result:**
- Error modal: "This business has already been claimed"
- No new claim created in database
- User cannot proceed

---

### **Test 2.6: Duplicate Pending Claims (Resend)** ✓

**Setup:** One pending claim with code "123456"

**Steps:**
1. Same user resubmits claim for same installer + same email (before first claim approved/rejected)

**Expected Result:**
- **NOT** a duplicate claim created
- Existing claim retrieved
- New code generated
- Modal shows code verification step (for new code)
- User can enter new code and continue
- Same claimId used (check API response)

---

### **Test 2.7: Email Mismatch with Multi-word Business** ✓

**Setup:** Installer "Eco Comfort Systems NZ"

**Steps:**
1. Go to profile
2. Claim with email: `john@mycompany.nz` (doesn't match)

**Expected Result:**
- Treated as Phase 2 (pending)
- Admin sees claim in pending list
- Admin can approve/reject

---

### **Test 2.8: API Endpoint Responses** ✓

**Test GET `/api/admin/installer-claims?status=pending`**

```bash
curl http://localhost:3000/api/admin/installer-claims?status=pending
```

**Expected:**
```json
{
  "success": true,
  "claims": [
    {
      "id": "uuid",
      "installer_name": "Business Name",
      "email": "claimed@email.com",
      "full_name": "John Smith",
      "status": "pending",
      "submitted_at": "2026-10-04T14:22:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

**Test POST `/api/admin/installer-claims/{id}/approve`**

```bash
curl -X POST http://localhost:3000/api/admin/installer-claims/UUID/approve \
  -H "Content-Type: application/json" \
  -d '{"admin_notes":"Verified"}'
```

**Expected:**
```json
{
  "success": true,
  "message": "Claim approved",
  "temp_password": "TempPass123!",
  "user_id": "new-uuid",
  "claim": {
    "id": "uuid",
    "status": "approved",
    "reviewed_at": "2026-10-04T14:25:00Z"
  }
}
```

---

## UI/UX Checks

- [ ] Modal text is clear and actionable
- [ ] No typos in error messages
- [ ] Buttons are appropriately colored (green=approve, red=reject)
- [ ] Pending claims badge shows correct count
- [ ] Table is responsive on mobile
- [ ] Dates format correctly (NZ format)
- [ ] Loading states show feedback
- [ ] Success/error modals close properly

---

## Edge Cases

### Case 1: No Pending Claims
- [ ] "Pending Claims" button still exists but shows badge "0"
- [ ] Click shows empty state: "No pending claims. All caught up!"

### Case 2: Mixed Claims (pending + approved + rejected)
- [ ] Filter "Pending Claims" shows ONLY pending
- [ ] Other statuses hidden

### Case 3: Approve with Empty Notes
- [ ] Admin notes field is optional
- [ ] Approve works without entering notes
- [ ] admin_notes in DB is NULL or empty string

### Case 4: Network Error During Approve
- [ ] Error modal shows: "Failed to approve claim"
- [ ] Modal stays open (user can retry)
- [ ] Claim does NOT change in DB

### Case 5: Stale Claim (very old date)
- [ ] Admin can still approve/reject
- [ ] Date displays correctly in NZ format

---

## Rollback Checklist

If anything breaks:
1. Check DB connection: `psql -U postgres -d tradeev2`
2. Verify schema columns exist:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='installer_claims' AND column_name IN ('status','submitted_at','reviewed_by');
   ```
3. Check API logs in terminal for errors
4. Verify `.env` has correct DB_URL

---

## Success Criteria

✅ All 8 test cases pass  
✅ All API endpoints return correct responses  
✅ All UI/UX checks pass  
✅ No console errors  
✅ Database state is correct after each action  

---

## Notes

- Temp password is randomly generated each approval
- Passwords use SHA256 hashing (will upgrade to bcrypt in Phase 4)
- Times stored in UTC but display in NZ timezone
- Phase 3 will add email notifications for all actions

