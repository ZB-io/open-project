import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage.js';
import * as fs from 'node:fs';
import path from 'path';

// --- Environment Variables ---
// Fetches the login URL from environment variables, with a fallback to the base URL.
const LOGIN_URL = process.env.LOGIN_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
// Fetches the base host URL for post-login URL assertions.
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';
// Fetches the username from environment variables.
const UI_SITE_USERNAME = process.env.UI_SITE_USERNAME;
// Fetches the password from environment variables.
const UI_SITE_PASSWORD = process.env.UI_SITE_PASSWORD;
// Defines the path for storing the authentication state file.
const AUTH_FILE = '.auth/storage-state.json';

// --- Test Hooks ---
// This hook runs after each test. It's used here to capture a screenshot on test failure.
test.afterEach(async ({ page }, testInfo) => {
  // Only take a screenshot if the test did not pass.
  if (testInfo.status !== 'passed') {
    try {
      // Capture a full-page screenshot in PNG format.
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
      // Sanitize the test file name to use as the screenshot file name.
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      
      // Define the directory to save screenshots.
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      // Create the directory if it doesn't exist.
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      // Define the full path for the screenshot file.
      const screenshotPath = path.join(screenshotDir, `${fileName}_failure.png`);
      // Save the screenshot to the specified path.
      fs.writeFileSync(screenshotPath, screenshot);
    } catch (e) {
      // Log any errors that occur during screenshot capture, but don't fail the test run.
      console.error('Failed to capture or save screenshot:', e);
    }
  }
});

// --- Test Suite ---
test.describe('Authentication and Login Scenarios', () => {

  /**
   * @description Test case for a successful user login.
   * This test navigates to the login page, enters valid credentials,
   * verifies successful navigation to the dashboard, and saves the
   * authentication state for use in other tests.
   */
  test('login_analysis_happy_path: Successful login with valid credentials', async ({ page }) => {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(LOGIN_URL);
    
    // Instantiate the LoginPage Page Object Model.
    const loginPage = new LoginPage(page);
    
    // Step 2-4: Perform the login action using the comprehensive 'loginAs' method from the POM.
    // This encapsulates entering the username, password, and clicking the login button.
    // The method returns the next page object, in this case, the DashboardPage.
    const dashboardPage = await loginPage.loginAs(UI_SITE_USERNAME, UI_SITE_PASSWORD);
    
    // Step 5: Verify successful login by checking the URL.
    // The URL should navigate to the dashboard upon successful authentication.
    const expectedDashboardUrl = `${BASE_HOST_URL}/web/index.php/dashboard/index`;
    await expect(page, 'After login, the URL should be the dashboard URL.').toHaveURL(expectedDashboardUrl);
    
    // CRITICAL: Save the authentication state (cookies, local storage) to a file.
    // This allows other tests to bypass the login process and start in an authenticated state.
    await page.context().storageState({ path: AUTH_FILE });
    console.log(`Authentication state saved to: ${AUTH_FILE}`);
  });
});