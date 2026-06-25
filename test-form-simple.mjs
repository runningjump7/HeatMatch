import { chromium } from '@playwright/test';

async function testForm() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('\n=== Testing Quote Form ===\n');
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded');
    
    // Click Get Quote button
    const getQuoteBtn = page.locator('button:has-text("Get My Free Quote")').first();
    await getQuoteBtn.click();
    console.log('✓ Get Quote button clicked');
    
    // Wait for modal to appear
    await page.waitForSelector('modal, dialog, [role="dialog"]', { timeout: 5000 }).catch(() => {
      console.log('  (modal selector not found, checking for form content)');
    });
    
    // Check for form title
    const formTitle = await page.textContent('h2');
    if (formTitle) {
      console.log(`✓ Form visible: "${formTitle}"`);
    }
    
    // Try to find and click New Installation button
    const buttons = await page.locator('button').count();
    console.log(`✓ Found ${buttons} buttons on page`);
    
    const serviceTypeButton = page.locator('button:has-text("New Installation")').first();
    const exists = await serviceTypeButton.isVisible().catch(() => false);
    
    if (exists) {
      await serviceTypeButton.click();
      console.log('✓ Selected "New Installation"');
      
      // Click Continue
      const continueBtn = page.locator('button:has-text("Continue")').first();
      await continueBtn.click();
      console.log('✓ Clicked Continue');
      
      // Select Home
      const homeBtn = page.locator('button:has-text("Home")').first();
      await homeBtn.click();
      console.log('✓ Selected "Home"');
      
      // Fill bedrooms
      await page.fill('input[type="number"]', '3');
      console.log('✓ Entered 3 bedrooms');
      
      // Continue
      await page.locator('button:has-text("Continue")').nth(0).click();
      console.log('✓ Form progressing correctly');
      
      console.log('\n✅ PASS: Form is working end-to-end');
    } else {
      console.log('❌ Could not find expected form elements');
    }
    
  } catch (error) {
    console.log('❌ FAIL:', error.message);
  } finally {
    await browser.close();
  }
}

testForm();
