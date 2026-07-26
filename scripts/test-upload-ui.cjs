const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'active@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('http://localhost:3000/dashboard');
  console.log("Logged in!");

  console.log("Navigating to /journal/new...");
  await page.goto('http://localhost:3000/journal/new');

  await page.fill('input[name="pair"]', 'SOL/USD');
  await page.fill('input[name="positionSize"]', '10');
  await page.fill('input[name="entryPrice"]', '140');
  await page.fill('textarea[name="notes"]', 'Testing Supabase upload with playwright');

  console.log("Clicking FOMO tag...");
  await page.click('text="+ FOMO"');

  console.log("Uploading screenshot...");
  // Provide the path to the dummy image
  const imagePath = path.resolve('C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58\\dummy_screenshot_1784688749175.png');
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles(imagePath);

  console.log("Submitting...");
  await page.click('button[type="submit"]');

  // Wait for redirect to journal
  await page.waitForURL('http://localhost:3000/journal', { timeout: 15000 });
  console.log("Success! Trade submitted.");

  console.log("Fetching old trade to verify no crash (BUG FIX)...");
  const oldTradeRes = await page.request.get('http://localhost:3000/api/trades/cmrt7h6xm0001u4uhrxbdnb24');
  const oldTradeJson = await oldTradeRes.json();
  console.log("Old Trade JSON:", JSON.stringify(oldTradeJson, null, 2));

  console.log("Fetching new trades to get the newly created trade...");
  const recentTradesRes = await page.request.get('http://localhost:3000/api/trades?limit=1');
  const recentTradesJson = await recentTradesRes.json();
  const newTradeId = recentTradesJson.trades[0].id;

  console.log(`Fetching detail for new trade ${newTradeId}...`);
  const newTradeDetailRes = await page.request.get(`http://localhost:3000/api/trades/${newTradeId}`);
  const newTradeDetailJson = await newTradeDetailRes.json();
  console.log("New Trade JSON with Signed URL:", JSON.stringify(newTradeDetailJson, null, 2));

  await browser.close();
})();
