const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    // We can't really screenshot animation easily, but we can capture the final state which we already did
    
    await page.type('input[type="email"]', 'active@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Screenshot normal logout button
    const logoutBtn = await page.$('button[title="Keluar"]');
    await logoutBtn.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\logout_normal.png' });
    
    // Hover over logout button
    await page.hover('button[title="Keluar"]');
    await new Promise(r => setTimeout(r, 500)); // wait for transition
    
    // Screenshot hovered logout button
    await logoutBtn.screenshot({ path: 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\scratch\\logout_hover.png' });
    console.log('Screenshots saved.');
    
    // Click logout
    await page.click('button[title="Keluar"]');
    await page.waitForNavigation();
    console.log('Successfully logged out to:', page.url());

  } catch(e) { console.error(e); }
  await browser.close();
})();
