import { chromium } from '@playwright/test';

async function testForm() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('\n=== Testing Quote Form End-to-End ===\n');
  
  try {
    await page.goto('http://localhost:3000');
    
    // Click "Get My Free Quote" button
    await page.click('text=Get My Free Quote');
    await page.waitForSelector('text=Which of these best describes your project?');
    
    // Step 1: Select "New Installation"
    await page.click('text=New Installation');
    await page.click('text=Continue');
    
    // Step 2: Select "Home" property type
    await page.waitForSelector('text=What type of property');
    await page.click('text=Home');
    await page.fill('input[placeholder="e.g., 2, 3, 4"]', '3');
    await page.click('text=Continue');
    
    // Step 3: Select locations
    await page.waitForSelector('text=Tell us about the job');
    await page.click('text=1 Heat Pump');
    await page.click('text=Lounge');
    await page.click('text=Yes, I have an existing unit');
    await page.click('text=Continue');
    
    // Step 4: Select timeline
    await page.waitForSelector('text=When would you like this done?');
    await page.click('text=ASAP');
    await page.click('text=Continue');
    
    // Step 5: Contact info
    await page.waitForSelector('text=Your contact information');
    await page.fill('input[placeholder="John Smith"]', 'Test Homeowner');
    await page.fill('input[placeholder="09 123 4567"]', '0912345678');
    await page.fill('input[placeholder="john@example.com"]', 'home@test.com');
    
    // Select suburb
    await page.selectOption('select', 'Takapuna');
    
    // Check consent
    await page.click('input[type="checkbox"]');
    
    // Submit
    await page.click('text=Get Your Quote');
    
    // Wait for success page
    await page.waitForSelector('text=received', { timeout: 8000 }).catch(() => null);
    const bodyText = await page.textContent('body');
    
    if (bodyText.includes('received') || bodyText.includes('confirmation')) {
      console.log('✅ PASS: Residential form submitted successfully');
    } else {
      console.log('❌ FAIL: Form did not submit');
      console.log('Page text:', bodyText.substring(0, 300));
    }
    
  } catch (error) {
    console.log('❌ FAIL: Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testForm();
