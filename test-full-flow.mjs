import { chromium } from '@playwright/test';

async function testForm() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('\n=== TESTING FULL FORM FLOW ===\n');
  
  try {
    // Load home page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Home page loaded');
    
    // Click Get Quote
    await page.click('button:has-text("Get Quote")');
    console.log('✓ Modal opened');
    
    // Step 1: Select service type
    await page.click('button:has-text("New Heat Pump Installation")');
    console.log('✓ Selected "New Heat Pump Installation"');
    
    // Click Continue
    await page.click('button:has-text("Continue")');
    console.log('✓ Moving to Step 2');
    
    // Step 2: Select property type and bedrooms
    await page.waitForTimeout(500);
    await page.click('button:has-text("Home")');
    console.log('✓ Selected "Home" property');
    
    await page.fill('input[type="number"]', '3');
    console.log('✓ Entered 3 bedrooms');
    
    await page.click('button:nth-child(1):has-text("Continue")');
    console.log('✓ Moving to Step 3');
    
    // Step 3: Job details
    await page.waitForTimeout(500);
    await page.click('button:has-text("1 Heat Pump")');
    console.log('✓ Selected "1 Heat Pump"');
    
    await page.click('button:has-text("Lounge")');
    console.log('✓ Selected "Lounge"');
    
    await page.click('button:has-text("Yes, I have an existing unit")');
    console.log('✓ Selected existing unit option');
    
    await page.click('button:nth-child(1):has-text("Continue")');
    console.log('✓ Moving to Step 4');
    
    // Step 4: Timeline
    await page.waitForTimeout(500);
    await page.click('button:has-text("ASAP")');
    console.log('✓ Selected "ASAP"');
    
    await page.click('button:nth-child(1):has-text("Continue")');
    console.log('✓ Moving to Step 5');
    
    // Step 5: Contact info
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="John Smith"]', 'Test User');
    await page.fill('input[placeholder="09 123 4567"]', '0912345678');
    await page.fill('input[placeholder="john@example.com"]', 'test@example.com');
    
    // Select suburb
    await page.selectOption('select', 'Takapuna');
    console.log('✓ Filled contact info');
    
    // Check consent
    await page.click('input[type="checkbox"]');
    console.log('✓ Checked consent');
    
    // Submit
    await page.click('button:has-text("Get Your Quote")');
    console.log('✓ Form submitted');
    
    // Wait for success
    await page.waitForTimeout(3000);
    const text = await page.textContent('body');
    
    if (text.includes('received') || text.includes('success') || text.includes('confirmation')) {
      console.log('\n✅ SUCCESS: Form submitted successfully!');
    } else {
      console.log('\n❌ FAIL: No success message found');
      console.log('Page text:', text.substring(0, 300));
    }
    
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

testForm();
