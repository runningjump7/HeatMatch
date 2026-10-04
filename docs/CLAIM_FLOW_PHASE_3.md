# Claim Business Flow — Phase 3: Email Notifications

**Status:** Ready for Specification  
**Date:** 2026-10-04  
**Version:** 1.0

---

## Overview

Phase 3 adds email notifications for all claim flow events. Users and admins receive timely updates at key milestones.

**Goal:** Keep users informed throughout claim lifecycle  
**Frequency:** 5 email events across Phase 1 & 2  
**Channels:** Email only (Phase 3)

---

## Email Templates

### Template 1: Verification Code Email

**When Sent:** Immediately after user submits claim (Phase 1 & 2)  
**Sent To:** User email (from claim submission)  
**Trigger:** POST `/api/installer/claim` completes

**Subject:** `Your HeatMatch Verification Code: {CODE}`

**Body (Text):**
```
Hi {FULL_NAME},

Thank you for claiming {BUSINESS_NAME} on HeatMatch!

Your 6-digit verification code is:

    {CODE}

This code expires in 10 minutes. If you didn't request this, please ignore this email.

Have questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team
```

**Body (HTML):**
```html
<h2>Your Verification Code</h2>
<p>Hi {FULL_NAME},</p>
<p>Thank you for claiming <strong>{BUSINESS_NAME}</strong> on HeatMatch!</p>

<p>Your 6-digit verification code is:</p>

<div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
  {CODE}
</div>

<p><strong>This code expires in 10 minutes.</strong></p>
<p>If you didn't request this, please ignore this email.</p>

<p>Questions? <a href="mailto:support@heatmatch.co.nz">Contact us</a></p>
```

**Variables:**
- `{CODE}` — 6-digit verification code
- `{FULL_NAME}` — User full name from claim
- `{BUSINESS_NAME}` — Installer business name

---

### Template 2: Claim Submitted Confirmation (Phase 2 Only)

**When Sent:** When email doesn't match (Phase 2 route)  
**Sent To:** User email (from claim submission)  
**Trigger:** POST `/api/installer/claim` with `requiresAdminReview: true`

**Subject:** `Your {BUSINESS_NAME} Claim Under Review`

**Body (Text):**
```
Hi {FULL_NAME},

Thank you for claiming {BUSINESS_NAME} on HeatMatch!

Your claim has been received and is now under admin review. We'll verify your 
claim and contact you within 24 hours with the outcome.

Claim Details:
  Business: {BUSINESS_NAME}
  Submitted: {DATE_TIME}
  Status: Pending Review

We'll email you at {EMAIL} with the result.

Questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team
```

**Variables:**
- `{FULL_NAME}` — User full name
- `{BUSINESS_NAME}` — Installer name
- `{DATE_TIME}` — Submission time (NZ timezone)
- `{EMAIL}` — Email submitted with claim

---

### Template 3: Claim Approved Email

**When Sent:** When admin approves claim (Phase 2)  
**Sent To:** User email (from claim)  
**Trigger:** Admin clicks [Approve] in admin portal

**Subject:** `Great News! Your {BUSINESS_NAME} Claim is Approved`

**Body (Text):**
```
Hi {FULL_NAME},

Congratulations! Your claim for {BUSINESS_NAME} has been approved.

Your account is now verified and active. Use the temporary password below to 
log in and access your dashboard:

    Temporary Password: {TEMP_PASSWORD}

We recommend changing this password after your first login.

Set Up Your Account:
  1. Visit: heatmatch.co.nz/installer-login
  2. Email: {EMAIL}
  3. Password: {TEMP_PASSWORD}
  4. Change password in settings after login

Your Next Steps:
  - Complete your profile
  - Add photos and service details
  - Start receiving leads!

Questions? Reply to this email or visit heatmatch.co.nz/support

—
HeatMatch Team
```

**Body (HTML):**
```html
<h2>Congratulations!</h2>
<p>Hi {FULL_NAME},</p>
<p>Your claim for <strong>{BUSINESS_NAME}</strong> has been approved! ✓</p>

<p>Your account is now verified and active.</p>

<h3>Your Temporary Password</h3>
<div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
  <p><strong>Email:</strong> {EMAIL}</p>
  <p><strong>Password:</strong> <code>{TEMP_PASSWORD}</code></p>
</div>

<p><a href="https://heatmatch.co.nz/installer-login" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
  Log In Now
</a></p>

<p style="margin-top: 30px; font-size: 12px; color: #666;">
  We recommend changing your password after your first login.
</p>
```

**Variables:**
- `{FULL_NAME}` — User full name
- `{BUSINESS_NAME}` — Installer name
- `{EMAIL}` — User email
- `{TEMP_PASSWORD}` — Generated temporary password

---

### Template 4: Claim Rejected Email

**When Sent:** When admin rejects claim (Phase 2)  
**Sent To:** User email (from claim)  
**Trigger:** Admin clicks [Reject] in admin portal

**Subject:** `Update on Your {BUSINESS_NAME} Claim`

**Body (Text):**
```
Hi {FULL_NAME},

Thank you for your interest in claiming {BUSINESS_NAME} on HeatMatch.

Unfortunately, we were unable to verify your claim at this time. The reason given:

    {REJECTION_REASON}

What You Can Do:
  - If you believe this is an error, please reply to this email
  - Provide additional documentation to support your claim
  - Contact our support team: support@heatmatch.co.nz
  - Try claiming again with a verified business email address

We're here to help! Feel free to reach out with any questions.

—
HeatMatch Team
```

**Variables:**
- `{FULL_NAME}` — User full name
- `{BUSINESS_NAME}` — Installer name
- `{REJECTION_REASON}` — Admin's rejection reason (or default: "The business details could not be verified")

---

### Template 5: Welcome Email (Phase 1 Happy Path)

**When Sent:** After account creation (Phase 1 happy path completes)  
**Sent To:** User email  
**Trigger:** POST `/api/installer/create-account` succeeds

**Subject:** `Welcome to HeatMatch, {BUSINESS_NAME}!`

**Body (Text):**
```
Hi {FULL_NAME},

Welcome to HeatMatch! Your account for {BUSINESS_NAME} is now active and verified.

You're All Set!
  ✓ Email verified
  ✓ Account created
  ✓ Business verified

Next Steps:
  1. Log in to your dashboard
  2. Complete your business profile
  3. Add high-quality photos
  4. Set your service areas
  5. Start receiving leads!

Your Dashboard: heatmatch.co.nz/installer-dashboard

Quick Links:
  - Profile Settings: heatmatch.co.nz/settings
  - Lead Management: heatmatch.co.nz/leads
  - Support: heatmatch.co.nz/support

Questions? We're here to help. Reply to this email anytime.

—
HeatMatch Team
```

**Variables:**
- `{FULL_NAME}` — User full name
- `{BUSINESS_NAME}` — Installer business name

---

## Testing Strategy

### Development (Console Logging)
```typescript
// In development, log emails to console instead of sending
if (process.env.NODE_ENV === 'development') {
  console.log(`[EMAIL] To: ${email}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body:\n${body}`);
  return { success: true, sent: false, logged: true };
}
```

### Testing (Resend)
Use **Resend** (resend.io) for real email testing:
- Free tier: 100 emails/day
- Easy setup: Install `resend` npm package
- Test addresses: Resend provides test domains
- Real rendering: See actual email clients

**Setup:**
```bash
npm install resend
```

**ENV:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@heatmatch.co.nz
```

**Usage:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: userEmail,
  subject: 'Your HeatMatch Verification Code',
  html: htmlContent,
  text: textContent,
});
```

---

## Implementation Plan

### Phase 3.1: Email Service Setup
- [ ] Install `resend` package
- [ ] Add env vars (RESEND_API_KEY, RESEND_FROM_EMAIL)
- [ ] Create `src/lib/email.ts` utility with send function
- [ ] Add console logging in dev mode

### Phase 3.2: Email Templates
- [ ] Create template for verification code (Template 1)
- [ ] Create template for claim submitted (Template 2)
- [ ] Create template for claim approved (Template 3)
- [ ] Create template for claim rejected (Template 4)
- [ ] Create template for welcome (Template 5)
- [ ] Store templates in `src/lib/email-templates.ts`

### Phase 3.3: Integration
- [ ] Call email send in `/api/installer/claim` (verification code)
- [ ] Call email send in `/api/installer/claim` with requiresAdminReview (claim submitted)
- [ ] Call email send in `/api/installer/create-account` (welcome)
- [ ] Call email send in `/api/admin/installer-claims/{id}/approve` (claim approved)
- [ ] Call email send in `/api/admin/installer-claims/{id}/reject` (claim rejected)

### Phase 3.4: Testing
- [ ] Manual test: Send verification code email
- [ ] Manual test: Send claim submitted email
- [ ] Manual test: Send welcome email
- [ ] Manual test: Send approval email with temp password
- [ ] Manual test: Send rejection email with reason
- [ ] Check email rendering in multiple clients

---

## New API Changes

### Modified: POST `/api/installer/claim`

Add email sending after claim creation:
```typescript
if (emailMatch) {
  // Phase 1: Send verification code email
  await sendEmail({
    to: email,
    template: 'verification-code',
    variables: { code, fullName, businessName }
  });
} else {
  // Phase 2: Send claim submitted email
  await sendEmail({
    to: email,
    template: 'claim-submitted',
    variables: { fullName, businessName, email, dateTime }
  });
}
```

### Modified: POST `/api/installer/create-account`

Add welcome email after account creation:
```typescript
// Send welcome email
await sendEmail({
  to: email,
  template: 'welcome',
  variables: { fullName, businessName }
});
```

### Modified: POST `/api/admin/installer-claims/{id}/approve`

Add approval email:
```typescript
// Send approval email with temp password
await sendEmail({
  to: claim.email,
  template: 'claim-approved',
  variables: { fullName: claim.full_name, businessName, email: claim.email, tempPassword }
});
```

### Modified: POST `/api/admin/installer-claims/{id}/reject`

Add rejection email:
```typescript
// Send rejection email
await sendEmail({
  to: claim.email,
  template: 'claim-rejected',
  variables: { fullName: claim.full_name, businessName, rejectionReason: reason }
});
```

---

## Email Flow Diagram

```
Phase 1: Happy Path
  ↓
User submits matching email
  ↓
[Email] Verification Code Sent → User receives code
  ↓
User enters code + creates password
  ↓
Account created
  ↓
[Email] Welcome Email Sent → User logs in

---

Phase 2: Unhappy Path
  ↓
User submits non-matching email
  ↓
[Email] Claim Submitted Confirmation → User waits
  ↓
Admin Reviews Claim
  ↓
  ├─ [Email] Claim Approved → User sets password
  │
  └─ [Email] Claim Rejected → User can appeal
```

---

## Acceptance Criteria

- [ ] All 5 email templates created and tested
- [ ] Verification code email sent immediately
- [ ] Claim submitted email sent for Phase 2 claims
- [ ] Welcome email sent after account creation
- [ ] Approval email sent with temp password
- [ ] Rejection email sent with reason
- [ ] Console logs show email content in dev mode
- [ ] Real emails sent via Resend in test mode
- [ ] Email variables correctly substituted
- [ ] No email sent on errors (graceful degradation)

---

## Test Cases

### 3.1: Verification Code Email

**Setup:** Create a Phase 1 claim (matching email)  
**Expected:** Email sent with:
- Subject contains code
- Body shows 6-digit code
- 10-minute expiry mentioned
- Business name in content

**Test:** Check Resend dashboard or console log

---

### 3.2: Claim Submitted Email (Phase 2)

**Setup:** Create a Phase 2 claim (non-matching email)  
**Expected:** Email sent with:
- Confirmation of claim submission
- "Under Review" status
- 24-hour SLA mentioned
- Claim details listed

---

### 3.3: Welcome Email

**Setup:** Complete Phase 1 flow (claim + verify code + create password)  
**Expected:** Email sent with:
- "Welcome" greeting
- Checkmarks for completed steps
- Next steps listed
- Dashboard link provided

---

### 3.4: Approval Email

**Setup:** Admin approves a pending Phase 2 claim  
**Expected:** Email sent with:
- "Congratulations" message
- Temp password included
- Login instructions
- Change password recommendation

---

### 3.5: Rejection Email

**Setup:** Admin rejects a pending claim with reason "Business number mismatch"  
**Expected:** Email sent with:
- Clear rejection message
- Specific rejection reason
- Appeal/support options
- Contact information

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Email send fails | Log error, continue (don't block user flow) |
| Invalid email address | Skip email, log warning |
| Resend API down | Fall back to console log |
| Missing email template | Use fallback plain text |

---

## Non-Goals (Phase 3)

- SMS notifications
- Push notifications
- Email unsubscribe management
- Email scheduling/delays
- Email retry logic (beyond Resend defaults)
- Email analytics

---

## Next Steps

1. Decide on email provider (Resend recommended)
2. Set up Resend account and API key
3. Create email template component/renderer
4. Implement email sending utility
5. Integrate with Phase 1 & 2 endpoints
6. Test all 5 email scenarios
7. Deploy to Vercel with env vars

