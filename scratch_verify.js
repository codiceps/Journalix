import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();
  
  const artifactDir = 'C:\\Users\\Hasan\\.gemini\\antigravity-ide\\brain\\f8094f77-13d3-4fd2-a4fa-7d55ab129d58';

  try {
    // 1. Login as Admin
    console.log('Logging in as Admin...');
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', 'admin@example.com');
    await page.type('input[type="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    console.log('Navigating to Admin Panel...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForSelector('text/Reset Sandi');
    
    // Screenshot Admin Table
    await page.screenshot({ path: `${artifactDir}/admin_table.png` });
    
    // 2. Click Reset Password for the first non-admin user
    console.log('Clicking Reset Password...');
    
    // Override window.confirm to always return true
    await page.evaluate(() => {
      window.confirm = () => true;
    });

    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Reset Sandi'));
      if (resetBtn) resetBtn.click();
    });
    
    console.log('Waiting for modal...');
    await page.waitForSelector('text/Password Berhasil Direset!', { timeout: 10000 });
    
    // Read the new password from the modal
    const newPassword = await page.evaluate(() => {
      const codeEl = document.querySelector('code');
      return codeEl ? codeEl.textContent.trim() : null;
    });
    
    console.log(`New password extracted: ${newPassword}`);
    
    // Screenshot Reset Modal
    await page.screenshot({ path: `${artifactDir}/reset_modal.png` });
    
    // Close modal
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Tutup'));
      if (closeBtn) closeBtn.click();
    });
    
    // 3. Logout
    console.log('Logging out...');
    await page.goto('http://localhost:3000/api/auth/signout');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // 4. Test login with old password for user1@example.com (assuming it was active)
    console.log('Testing old password...');
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', 'user1@example.com');
    await page.type('input[type="password"]', 'User123!');
    await page.click('button[type="submit"]');
    
    // Wait a bit to see if error appears (login fails)
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: `${artifactDir}/login_fail.png` });
    
    // 5. Test login with new password
    console.log('Testing new password...');
    // Clear inputs
    await page.evaluate(() => {
      document.querySelectorAll('input').forEach(input => input.value = '');
    });
    
    await page.type('input[type="email"]', 'user1@example.com');
    await page.type('input[type="password"]', newPassword);
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation();
    console.log('Login successful with new password!');
    await page.screenshot({ path: `${artifactDir}/login_success.png` });
    
  } catch (e) {
    console.error('Error during test:', e);
    await page.screenshot({ path: `${artifactDir}/error.png` });
  } finally {
    await browser.close();
  }
})();
