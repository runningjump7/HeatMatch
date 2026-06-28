# Installer Feedback Mechanism

## Overview
When an admin assigns an installer to a lead, the system automatically sends an email to the installer with:
- Full lead details (homeowner contact, property info, photos, timeline)
- Three action buttons: Accept, Reject, Need More Info
- No login required — installers click a button and respond instantly

## Architecture

### 1. JWT Token System (`src/lib/jwt.ts`)
- Generates signed tokens that include: `lead_id`, `installer_id`, `installer_email`, expiration (7 days)
- Tokens are URL-safe and verified using HMAC-SHA256
- No external JWT library dependency

### 2. Email Sending (`/api/installer/send-lead-email`)
**When triggered:**
- Admin assigns installer to lead in admin portal
- PATCH request to `/api/admin/leads/[id]` detects new assignments
- For each newly assigned installer, POST to `/api/installer/send-lead-email`

**Email content:**
- Professional HTML template with lead details
- Photos count included (if available)
- Three action buttons with signed response links
- Valid for 7 days

**Example email link:**
```
https://heat-match.vercel.app/installer/respond?token=eyJhbGc...&response=accept
```

### 3. Response Page (`/installer/respond`)
**Public page, no auth required**
- Displays three action buttons:
  - ✅ Yes, I'll Follow Up (accept)
  - ❌ Not Interested (reject)
  - ❓ Need More Info (need_info)
- Shows success/error confirmation
- Valid for 7 days from email send

### 4. Response Handler (`/api/installer/respond`)
**Updates lead with response**
```json
POST /api/installer/respond
Body: {
  "token": "JWT_TOKEN",
  "response": "accept|reject|need_info"
}
```

**Updates in leads table:**
- `installer_response` — accept/reject/need_info
- `installer_response_at` — timestamp
- `installer_response_from` — installer UUID

### 5. Admin Dashboard Display
**Lead detail page shows:**
- Colored response status box (green for accept, red for reject, amber for need_info)
- Response timestamp
- Easy tracking of which installers are interested

## Database Schema Changes

Added three columns to `leads` table:
```sql
ALTER TABLE leads
ADD COLUMN installer_response VARCHAR(50),
ADD COLUMN installer_response_at TIMESTAMP,
ADD COLUMN installer_response_from UUID;

CREATE INDEX idx_leads_installer_response ON leads(installer_response);
```

**Run migration:**
```bash
node -r dotenv/config -r ts-node/register scripts/add-installer-response-columns.ts
```

## Flow Diagram

```
1. Admin assigns installer to lead
   ↓
2. PATCH /api/admin/leads/[id] detects change
   ↓
3. Calls POST /api/installer/send-lead-email
   ↓
4. Email sent to installer with response links
   ↓
5. Installer clicks button in email
   ↓
6. Opens /installer/respond?token=...&response=...
   ↓
7. Page auto-submits to POST /api/installer/respond
   ↓
8. Installer response saved to database
   ↓
9. Admin sees response status on lead detail page
```

## Key Features

✅ **Zero Friction for Installers**
- No login required
- One-click responses
- Works on mobile/desktop
- No form filling

✅ **Secure**
- JWT tokens verified and expired after 7 days
- Only valid for specific installer + lead combination
- HMAC signature prevents tampering

✅ **Real-time Feedback**
- Responses available immediately in admin dashboard
- Track which installers are interested
- Identify low-quality leads (rejected by most installers)

✅ **Analytics Ready**
- Can track acceptance rate by installer
- Can identify patterns: "Leads without photos get 50% rejection"
- Feedback loop to improve form questions

## Environment Variables Required

```bash
# .env.local or Vercel
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_BASE_URL=https://heat-match.vercel.app  # Used for email links
JWT_SECRET=your-secret-key  # Optional, falls back to 'dev-secret-change-in-production'
```

## Usage in Admin Portal

### Step-by-step:
1. Go to `/admin/leads`
2. Click "View" on a lead
3. In the "Assign Installer" dropdown, select an installer
4. Click "💾 Save Changes"
5. Email automatically sent to installer
6. Wait for response
7. Response appears in the colored status box above the installer dropdown

### Tracking responses:
- **Green box (✅ Accepted)** — Installer confirmed interest
- **Red box (❌ Rejected)** — Installer not interested
- **Amber box (❓ Needs More Info)** — Installer requested clarification
- **No box** — No response yet (check email was sent, check mailbox)

## Future Enhancements (Phase 2)

- [ ] Send reminder email after 2 days if no response
- [ ] Auto-escalate "need_info" responses to admin
- [ ] Track response time (how quickly did installer respond?)
- [ ] Bulk assign to multiple installers with one-click
- [ ] SMS fallback if email bounces
- [ ] Integration with installer calendar (show availability)
