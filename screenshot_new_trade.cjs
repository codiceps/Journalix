const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 1200 });
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    
    await page.type('input[type="email"]', 'active@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation();
    
    console.log('Navigating to journal/new...');
    await page.goto('http://localhost:3000/journal/new');
    await page.waitForSelector('input[name="pair"]');
    
    // Switch to light mode
    await page.evaluate(() => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    });

    await page.type('input[name="pair"]', 'BTC/USD');
    
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\\light_mode_top.png' });
    
    // hover the button
    await page.hover('button[type="submit"]');
    await new Promise(r => setTimeout(r, 500));
    
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\\light_mode_full.png', fullPage: true });

    console.log('Screenshots saved.');

  } catch (err) {
    console.log('SCRIPT_ERROR:', err);
  } finally {
    await browser.close();
  }
})();
