import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage.js';
import * as fs from 'node:fs';
import path from 'path';

// ------------------------------------------------------------------
// Environment Variables & Constants
// ------------------------------------------------------------------

// The URL for the login page, falling back to a default if not provided.
const LOGIN_URL = process.env.LOGIN_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

// The base host URL for constructing post-login URLs.
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Credentials sourced securely from environment variables.
const UI_SITE_USERNAME = process.env.UI_SITE_USERNAME;
const UI_SITE_PASSWORD = process.env.UI_SITE_PASSWORD;

// The file path for storing the authentication state.
const AUTH_FILE = '.auth/storage-state.json';

// ------------------------------------------------------------------
// Test Hooks
// ------------------------------------------------------------------

/**
 * This hook runs after each test. If the test fails, it captures a screenshot
 * for debugging purposes.
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Sanitize the test file name to create a valid screenshot file name.
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const screenshotPath = path.join(screenshotDir, `${fileName}_${testInfo.title.replace(/\s+/g, '_')}_failure.png`);
      
      // Capture and save the screenshot.
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved for failed test: ${screenshotPath}`);
    } catch (e) {
      console.error('Failed to capture or save screenshot:', e);
    }
  }
});

// ------------------------------------------------------------------
// Test Suite for Authentication
// ------------------------------------------------------------------

test.describe('Authentication Scenarios', () => {
  /**
   * Test Case: Successful Login and Authentication State Saving
   *
   * This test verifies the happy path for user login.
   * It navigates to the login page, enters valid credentials,
   * verifies the successful redirect to the dashboard, and saves
   * the authentication state for use in other tests.
   */
  test('User can login successfully and save authentication state', async ({ page }) => {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(LOGIN_URL);
    const loginPage = new LoginPage(page);

    // Verify that the page URL is the login page before proceeding.
    await expect(page).toHaveURL(LOGIN_URL);

    // Step 2, 3 & 4: Enter credentials and click the login button.
    // The `loginAs` method from the LoginPage POM encapsulates these actions.
    console.log('Attempting login with provided credentials...');
    const dashboardPage = await loginPage.loginAs(UI_SITE_USERNAME, UI_SITE_PASSWORD);
    
    // Step 5: Verify successful login by checking the URL.
    // The URL should redirect to the dashboard upon successful authentication.
    const expectedUrlPattern = new RegExp(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
    await expect(page).toHaveURL(expectedUrlPattern, { timeout: 10000 });
    console.log('Login successful. Redirected to the dashboard.');

    // CRITICAL: Save the authentication state to a file.
    // This allows other tests to bypass the login process by reusing the session.
    await page.context().storageState({ path: AUTH_FILE });
    console.log(`✅ Authentication state successfully saved to: ${AUTH_FILE}`);
  });
});