import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Pre-Deployment Checks', () => {
  test('Homepage loads in English (200)', async ({ page }) => {
    const response = await page.goto('/en');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/HeatMatch/);
    await expect(page.getByRole('heading', { name: /Get Matched With Trusted Local Installers/i })).toBeVisible();
  });

  test('Homepage loads in Simplified Chinese (200)', async ({ page }) => {
    const response = await page.goto('/zh-CN');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/HeatMatch/);
  });

  test('Homepage loads in Traditional Chinese (200)', async ({ page }) => {
    const response = await page.goto('/zh-TW');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/HeatMatch/);
  });

  test('Quote form modal can be triggered', async ({ page }) => {
    await page.goto('/en');
    // Click get quote button
    await page.getByRole('button', { name: /Get Quote/i }).first().click();
    // Just verify form logic triggered without error
    await page.waitForTimeout(1000);
    // Form should not cause a 500
  });

  test('API leads endpoint returns valid status', async ({ page }) => {
    const response = await page.request.get('/api/leads', {
      headers: { 'Content-Type': 'application/json' },
    });
    // Accept any non-5xx error
    expect(response.status()).toBeLessThan(500);
  });

  test('English site does not have unhandled 500 errors on load', async ({ page }) => {
    page.on('response', response => {
      if (response.status() === 500) {
        throw new Error(`Got 500 response from ${response.url()}`);
      }
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('Simplified Chinese homepage does not have unhandled 500 errors', async ({ page }) => {
    page.on('response', response => {
      if (response.status() === 500) {
        throw new Error(`Got 500 response from ${response.url()}`);
      }
    });

    await page.goto('/zh-CN');
    await page.waitForLoadState('networkidle');
  });

  test('Traditional Chinese homepage does not have unhandled 500 errors', async ({ page }) => {
    page.on('response', response => {
      if (response.status() === 500) {
        throw new Error(`Got 500 response from ${response.url()}`);
      }
    });

    await page.goto('/zh-TW');
    await page.waitForLoadState('networkidle');
  });
});
