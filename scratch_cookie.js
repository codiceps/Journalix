import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 800 } });
  
  try {
    const runTest = async (rememberMe) => {
      const page = await browser.newPage();
      console.log(`\n=== Testing with Remember Me: ${rememberMe} ===`);
      await page.goto('http://localhost:3000/login');
      
      // Clear cookies first to start fresh
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');

      await page.type('input[type="email"]', 'admin@example.com');
      await page.type('input[type="password"]', 'Admin123!');
      
      if (rememberMe) {
        // Find the checkbox and click it
        await page.click('input[type="checkbox"]');
      }

      await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
      ]);

      const cookies = await page.cookies();
      const sessionCookie = cookies.find(c => c.name === 'next-auth.session-token' || c.name === '__Secure-next-auth.session-token');
      
      if (sessionCookie) {
        const expiresDate = new Date(sessionCookie.expires * 1000);
        console.log(`Session Cookie Name: ${sessionCookie.name}`);
        console.log(`Expires timestamp: ${sessionCookie.expires}`);
        console.log(`Expires Date: ${expiresDate.toISOString()}`);
        console.log(`Max Age (approx days): ${Math.round((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}`);
      } else {
        console.log('No session cookie found!');
      }

      // Logout
      await page.goto('http://localhost:3000/api/auth/signout');
      await page.click('button[type="submit"]');
      await page.waitForNavigation();
      await page.close();
      
      return sessionCookie;
    };

    const cookieChecked = await runTest(true);
    const cookieUnchecked = await runTest(false);

  } catch (e) {
    console.error('Error during test:', e);
  } finally {
    await browser.close();
  }
})();
