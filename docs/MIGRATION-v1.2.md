# v1.2 Installer Directory Migration Guide

## Overview
This migration prepares the database for the v1.2 Installer Directory feature. It adds multilingual support, slug-based URLs, and clarifies the installer verification status model.

## What Changes

### New Tables
- **`installer_translations`** — stores multilingual content (EN/ZH-CN/ZH-TW)
  - Columns: `id`, `installer_id`, `language`, `business_name`, `bio`, timestamps
  - Ready for future language support without schema changes

### New Columns on `installers`
- **`slug`** (VARCHAR, unique, indexed) — human-readable URL slug
  - Format: `business-name-abc12345` (auto-generated from business name + ID prefix)
- **`status`** (VARCHAR, indexed) — installer verification status
  - Values: `'verified'` | `'unclaimed'`
  - Replaces the boolean `approved` column
- **`verified_at`** (TIMESTAMP) — when installer was verified
  - Populated from existing `approved_at` if applicable

### Backfilled Data
- All existing installers get slugs auto-generated from `business_name`
- All EN content (`business_name`, `bio`) migrated to `installer_translations` table
- `approved=true` → `status='verified'` + sets `verified_at`
- `approved=false` → `status='unclaimed'` + `verified_at` is NULL

### New Indices (Performance)
- `idx_installers_slug` — fast URL lookups
- `idx_installers_status` — fast lead-assignment filtering
- `idx_installers_verified_at` — sorting/analytics
- `idx_installer_translations_installer_id` — translation lookups
- `idx_installer_translations_language` — language filtering

## Running the Migration

### Apply (UP)
```bash
npm run db:v1.2:migrate
```

**What it does:**
1. Creates `installer_translations` table
2. Adds `slug`, `status`, `verified_at` columns
3. Generates slugs for all installers
4. Migrates `approved → status`
5. Backfills English translations
6. Creates 5 indices

**Expected output:**
```
✅✅✅ Migration UP complete! ✅✅✅

📋 Summary:
  • Created installer_translations table (EN/ZH-CN/ZH-TW ready)
  • Added slug, status, verified_at columns
  • Backfilled slugs and English translations
  • Migrated approved → status (verified/unclaimed)
  • Created 5 new indices for performance
```

### Rollback (DOWN)
```bash
npm run db:v1.2:rollback
```

**What it does:**
1. Drops all new indices
2. Drops `installer_translations` table
3. Restores `approved` boolean from `status`
4. Removes `slug`, `status`, `verified_at` columns
5. Returns to pre-migration state

**Expected output:**
```
✅✅✅ Rollback complete! ✅✅✅

📋 Summary:
  • Dropped installer_translations table
  • Removed slug, status, verified_at columns
  • Restored approved boolean from status
```

## Safety & Rollback

✅ **Fully reversible** — if anything breaks, run `npm run db:v1.2:rollback` to restore the original schema.

✅ **No data loss** — rollback restores the exact pre-migration state.

⚠️ **Before running in production:**
1. Backup your database
2. Test in a staging environment first
3. Keep rollback command handy

## After Migration

### Code Changes Needed
Once migration is complete, update your code to:
- Use `installer.slug` instead of `installer.id` for URLs
- Check `installer.status === 'verified'` for lead assignment (instead of `approved`)
- Query translations: `SELECT * FROM installer_translations WHERE installer_id = $1 AND language = $2`
- Admin UI: toggle status dropdown (verified/unclaimed) instead of boolean checkbox

### API Changes
- Lead assignment should filter: `WHERE status = 'verified'`
- Directory pages: use `slug` for `/installers/[slug]` routing

## Troubleshooting

### Migration hangs or times out
- Check if your database connection is working
- Ensure `DATABASE_URL` is set correctly in `.env.local`
- Try running with a larger timeout

### Rollback fails
- Check database logs for errors
- Ensure you have write permissions to the database
- The migration is idempotent — you can retry

### Slugs are not unique after migration
- This shouldn't happen due to the ID suffix, but if it does:
  - Check for duplicate business names
  - Manually append a counter to duplicates
  - Re-run the migration

---

**Created:** 2026-10-03  
**Version:** 1.0  
**Status:** Ready for review and testing
