# Pre-Deployment Checklist

## Phase 1: Smoke Tests (Automated)
Before pushing to Vercel, run the automated smoke test suite:

```bash
npm run test:smoke
```

This validates:
- ✅ Homepage loads in all 3 languages (English, Simplified Chinese, Traditional Chinese)
- ✅ Quote form can be triggered without errors
- ✅ API leads endpoint is accessible (no 500 errors)
- ✅ No unhandled 500 errors on page load
- ✅ All critical pages return valid HTTP status codes

**Acceptance:** All 8 tests must pass. If any test fails, investigate and fix before deploying.

---

## Phase 2: Manual Pre-Deployment Dev Server Check
Before committing to a deploy:

1. Start the dev server: `npm run dev`
2. Test in browser:
   - Open http://localhost:3000/en — page loads, hero section visible
   - Open http://localhost:3000/zh-CN — page loads, Chinese text visible
   - Open http://localhost:3000/zh-TW — page loads, Traditional Chinese visible
   - Click "Get Quote" button — form modal appears
   - Select a service option and advance through form steps

3. Check the console in DevTools:
   - No red error messages in console
   - No "500" responses in Network tab

**Acceptance:** All manual checks pass without errors. No module-not-found or SSR errors.

---

## Phase 3: Post-Deployment Verification (Vercel)
After deployment to production:

1. Visit the live site:
   - https://heatmatch.nz/en
   - https://heatmatch.nz/zh-CN
   - https://heatmatch.nz/zh-TW

2. Verify:
   - Pages load without 500 errors
   - Language switcher works and redirects correctly
   - Quote form opens and functions

3. Check Vercel logs:
   - No "Cannot find module" errors
   - No "undefined locale" errors
   - All pages render successfully

**Acceptance:** All three languages live and functional.

---

## What to watch for

### Common failures (Phase 1 automation):
- `expect(received).toBe(200)` — page returned non-200 status (e.g., 500, 404)
- Timeout errors — page took too long to load or form didn't appear
- "no response" — server didn't start or crashed

**Action:** Check server logs (`npm run dev` terminal output) for module errors or missing environment variables.

### Common failures (Phase 2 manual):
- "Cannot find module" in terminal — missing translation files or incorrect import paths
- Page blank or error message — component failed to render
- Console errors about locale being undefined — SSR/Client mismatch

**Action:** Review the error stack trace in the terminal. Check [src/app/[locale]/client-layout.tsx](src/app/[locale]/client-layout.tsx) if imports fail.

### Common failures (Phase 3 post-deploy):
- Pages return 500 on Vercel — environment variables missing or module resolution differs
- "undefined locale" errors in Vercel logs — request context not injected by middleware

**Action:** Check Vercel deployment logs. Redeploy if needed.

---

## Future: Phase 2 & 3 Testing (Not yet implemented)
These are placeholders for future work:

- **Phase 2 (Unit + Integration Tests):** Vitest for form validation, auth logic, lead-tier calculations
- **Phase 3 (Full E2E):** Comprehensive Playwright suite testing all user flows, suburb pages, admin portal

For now, Phase 1 smoke tests + Phase 2 manual checks prevent production failures.
