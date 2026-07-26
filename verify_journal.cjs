const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    
    await page.type('input[type="email"]', 'active@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Go to Journal
    console.log('Navigating to journal...');
    await page.goto('http://localhost:3000/journal');
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => console.log('Table not found'));
    await new Promise(r => setTimeout(r, 1000)); // wait for network
    
    // Screenshot dark mode
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\journal_dark.png' });
    console.log('Dark mode screenshot saved.');
    
    // Go to Profile to toggle Dark Mode
    console.log('Navigating to profile to toggle theme...');
    await page.goto('http://localhost:3000/profile');
    await page.waitForSelector('input[type="checkbox"]');
    
    // Uncheck Dark Mode
    await page.evaluate(() => {
      const el = document.querySelectorAll('input[type="checkbox"]')[0];
      if (el && el.checked) el.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    
    // Go back to Journal
    console.log('Navigating back to journal for light mode...');
    await page.goto('http://localhost:3000/journal');
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => console.log('Table not found'));
    await new Promise(r => setTimeout(r, 1000));
    
    // Screenshot light mode
    await page.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\journal_light.png' });
    console.log('Light mode screenshot saved.');
    
    // Reset Dark Mode
    console.log('Resetting theme...');
    await page.goto('http://localhost:3000/profile');
    await page.waitForSelector('input[type="checkbox"]');
    await page.evaluate(() => {
      const el = document.querySelectorAll('input[type="checkbox"]')[0];
      if (el && !el.checked) el.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    
    console.log('Done!');
  } catch(e) { console.error(e); }
  await browser.close();
})();
