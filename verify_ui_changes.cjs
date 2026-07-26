const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    // 1. Verify Login Page
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    
    await page.type('input[type="email"]', 'active@example.com');
    await page.type('input[type="password"]', 'password123');
    
    // Click the show password eye icon
    console.log('Clicking show password...');
    await page.click('button[type="button"]'); // This should be the eye icon
    await new Promise(r => setTimeout(r, 500));
    
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\login_page_verify.png' });
    console.log('Login page screenshot saved.');
    
    // 2. Login as TRADER and verify TopNavbar and Sidebar
    console.log('Logging in as TRADER...');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    console.log('Current URL (Trader):', page.url());
    
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\trader_dashboard_verify.png' });
    console.log('Trader dashboard screenshot saved.');
    
    // 3. Logout
    console.log('Logging out...');
    await page.click('button[title="Keluar"]');
    await page.waitForNavigation();
    
    // 4. Login as ADMIN and verify Sidebar
    console.log('Logging in as ADMIN...');
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    console.log('Current URL (Admin):', page.url());
    
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\admin_dashboard_verify.png' });
    console.log('Admin dashboard screenshot saved.');

  } catch (err) {
    console.error('SCRIPT_ERROR:', err);
  } finally {
    await browser.close();
  }
})();
