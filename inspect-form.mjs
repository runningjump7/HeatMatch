import { chromium } from '@playwright/test';

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.click('button:nth-child(1)');
  
  await page.waitForTimeout(1000);
  
  // Get all button text
  const buttons = await page.locator('button').allTextContents();
  console.log('Button texts:', buttons);
  
  // Get h2 text
  const h2s = await page.locator('h2').allTextContents();
  console.log('H2s:', h2s);
  
  // Get visible text on page
  const bodyText = await page.textContent('body');
  console.log('\nPage content snippet:');
  console.log(bodyText.substring(0, 500));
  
  await browser.close();
}

inspect();
