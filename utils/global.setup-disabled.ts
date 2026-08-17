import { chromium } from '@playwright/test';
import path from 'path';

async function globalSetup() {
  console.log('🔐 Starting global setup - Logging in...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    console.log(' Navigate to login page...');
    await page.goto('http://13.95.199.223/Account/Login', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Fill login credentials
    console.log('📝 Filling login credentials...');
    await page.locator('#Email').fill('admin@pia.com');
    await page.locator('#Password').fill('Admin@123');
    
    // Click login button
    console.log('🔑 Clicking login button...');
    await page.locator('//input[@value="Log in"]').click();
    
    // Wait for login to complete - wait for home page or Terminal Operations to appear
    console.log('⏳ Waiting for login to complete...');
    try {
      await page.waitForSelector('//div[contains(text(),"Terminal Operations")]', { timeout: 30000 });
      console.log('✅ Login successful - Terminal Operations found');
    } catch (error) {
      // Fallback: wait for URL change or any element that indicates successful login
      await page.waitForURL('**/#/home**', { timeout: 30000 }).catch(() => {
        console.log('⚠️ Waiting for page load...');
        return page.waitForLoadState('networkidle', { timeout: 30000 });
      });
      console.log('✅ Login successful - Home page loaded');
    }
    
    // Wait a bit to ensure session is fully established
    await page.waitForTimeout(2000);
    
    // Save login session
    const authStatePath = path.resolve('authState.json');
    console.log('💾 Saving session state...');
    await context.storageState({ path: authStatePath });
    
    console.log(`✅ Login successful! Session saved to: ${authStatePath}`);
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    // Take screenshot for debugging
    try {
      await page.screenshot({ path: 'global-setup-error.png', fullPage: true });
      console.log('📸 Screenshot saved to: global-setup-error.png');
    } catch (screenshotError) {
      console.error('Failed to take screenshot:', screenshotError);
    }
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}
export default globalSetup;
