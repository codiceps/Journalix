const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Log console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_CONSOLE_ERROR:', msg.text());
    } else {
      console.log('BROWSER_CONSOLE_LOG:', msg.text());
    }
  });

  // Log network responses
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/trades')) {
      console.log(`NETWORK_RESPONSE: ${response.status()} ${url}`);
    }
  });

  try {
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    
    await page.type('input[type="email"]', 'active@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation();
    
    console.log('Navigating to journal/new...');
    await page.goto('http://localhost:3000/journal/new');
    
    // We will NOT fill anything and just click Save Trade
    console.log('Clicking Save Trade...');
    
    // We will evaluate a script to click the submit button so we can catch unhandled errors
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.click();
      }
    });

    await new Promise(r => setTimeout(r, 2000)); // Wait to see what happens
    console.log('Done waiting.');

  } catch (err) {
    console.log('SCRIPT_ERROR:', err);
  } finally {
    await browser.close();
  }
})();
