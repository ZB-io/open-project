## Test: login_analysis_happy_path
**File**: login_analysis_happy_path_pom.spec.js
**Iteration**: 1/5
**Timestamp**: 2026-01-09 10:24:42
**Status**: FAILED

### Error Details
```
Test: login_analysis_happy_path: Successful login with valid credentials
======================================================================
Main Error:
Error: After login, the URL should be the dashboard URL.

[2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected string: [32m"https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"[39m
Received string: [31m""[39m
Timeout: 5000ms

Call log:
[2m  - After login, the URL should be the dashboard URL. with timeout 5000ms[22m
[2m    - waiting for" https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate" navigation to finish...[22m


Detailed Errors:

Error 1:
Error: After login, the URL should be the dashboard URL.

[2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected string: [32m"https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"[39m
Received string: [31m""[39m
Timeout: 5000ms

Call log:
[2m  - After login, the URL should be the dashboard URL. with timeout 5000ms[22m
[2m    - waiting for" https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate" navigation to finish...[22m


  76 |     // The URL should navigate to the dashboard upon successful authentication.
  77 |     const expectedDashboardUrl = `${BASE_HOST_URL}/web/index.php/dashboard/index`;
> 78 |     await expect(page, 'After login, the URL should be the dashboard URL.').toHaveURL(expectedDashboardUrl);
     |                                                                             ^
  79 |     
  80 |     // CRITICAL: Save the authentication state (cookies, local storage) to a file.
  81 |     // This allows other tests to bypass the login process and start in an authenticated state.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/login_analysis_happy_path_pom.spec.js:78:77
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/login_analysis_happy_path_pom.spec.js:78:77

Console Output (stderr):
Failed to capture or save screenshot: ReferenceError: __dirname is not defined
    at [90mfile:///var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mlogin_analysis_happy_path_pom.spec.js:38:39
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:326:11
    at TimeoutManager.withRunnable [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/timeoutManager.js:67:14[90m)[39m
    at TestInfoImpl._runWithTimeout [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:324:7[90m)[39m
    at FixtureRunner.resolveParametersAndRunFunction [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/fixtureRunner.js:220:5[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:465:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runEachHooksForSuites [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:464:9[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:326:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runTest [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:317:5[90m)[39m
    at WorkerMain.runTestGroup [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:194:11[90m)[39m
    at process.<anonymous> [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/common/process.js:65:22[90m)[39m


Test Status: failed
Duration: 14615ms
```

### Test Code at This Iteration
```javascript
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
```

### AI Fix Prompt Sent
```

You are a Playwright test debugging expert specializing in Page Object Models (POM). Analyze the failing test and fix it efficiently.

═══════════════════════════════════════════════════════════════
⚠️ ERROR ANALYSIS - READ THIS FIRST
═══════════════════════════════════════════════════════════════

**WHAT FAILED:**
```
Test: login_analysis_happy_path: Successful login with valid credentials
======================================================================
Main Error:
Error: After login, the URL should be the dashboard URL.

[2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected string: [32m"https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"[39m
Received string: [31m""[39m
Timeout: 5000ms

Call log:
[2m  - After login, the URL should be the dashboard URL. with timeout 5000ms[22m
[2m    - waiting for" https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate" navigation to finish...[22m


Detailed Errors:

Error 1:
Error: After login, the URL should be the dashboard URL.

[2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected string: [32m"https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"[39m
Received string: [31m""[39m
Timeout: 5000ms

Call log:
[2m  - After login, the URL should be the dashboard URL. with timeout 5000ms[22m
[2m    - waiting for" https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate" navigation to finish...[22m


  76 |     // The URL should navigate to the dashboard upon successful authentication.
  77 |     const expectedDashboardUrl = `${BASE_HOST_URL}/web/index.php/dashboard/index`;
> 78 |     await expect(page, 'After login, the URL should be the dashboard URL.').toHaveURL(expectedDashboardUrl);
     |                                                                             ^
  79 |     
  80 |     // CRITICAL: Save the authentication state (cookies, local storage) to a file.
  81 |     // This allows other tests to bypass the login process and start in an authenticated state.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/login_analysis_happy_path_pom.spec.js:78:77
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/login_analysis_happy_path_pom.spec.js:78:77

Console Output (stderr):
Failed to capture or save screenshot: ReferenceError: __dirname is not defined
    at [90mfile:///var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mlogin_analysis_happy_path_pom.spec.js:38:39
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:326:11
    at TimeoutManager.withRunnable [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/timeoutManager.js:67:14[90m)[39m
    at TestInfoImpl._runWithTimeout [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:324:7[90m)[39m
    at FixtureRunner.resolveParametersAndRunFunction [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/fixtureRunner.js:220:5[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:465:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runEachHooksForSuites [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:464:9[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:326:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runTest [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:317:5[90m)[39m
    at WorkerMain.runTestGroup [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:194:11[90m)[39m
    at process.<anonymous> [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/a47642e5-fbb7-49ca-962c-df7db40abacc/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/common/process.js:65:22[90m)[39m


Test Status: failed
Duration: 14615ms
```
**YOUR TASK:**
1. Determine if the error originates in the **Test Spec** (usage) or the **POM File** (implementation/selectors).
2. Locate the specific failing line in the relevant file.
3. Fix ONLY that specific line (minimal change).
4. **Verify Imports**: Check the **Project Map** below. If you need a file that isn't imported, add the import. Ensure paths are correct relative to the test file.
5. Return the complete code for **ONLY the file(s) that were modified**.

**GOLDEN RULE:**
- If the error is a bad selector defined in the POM -> Fix the **POM file**.
- If the error is incorrect data, logic, or missing waits in the Test -> Fix the **Test Spec**.
- **DO NOT** rewrite working code "for consistency".
- **DO NOT** change selectors in the POM if the error is just a timeout in the Test Spec needing a retry.

═══════════════════════════════════════════════════════════════
📂 CODE CONTEXT
═══════════════════════════════════════════════════════════════

**Test Name:** login_analysis_happy_path

**FILE: ./pom/LoginPage.js**
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class LoginPage
 * @description Represents the OrangeHRM Login Page and its interactions.
 */
class LoginPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);
    this.url = '/web/index.php/auth/login';

    // --- Locators ---
    // Primary: page.getByRole('textbox', { name: 'Username' })
    // Alt 1: page.locator('input[name="username"]')
    // Alt 2: page.getByPlaceholder('Username')
    // Alt 3: page.locator('input.oxd-input').first()
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    // Primary: page.getByRole('textbox', { name: 'Password' })
    // Alt 1: page.locator('input[type="password"]')
    // Alt 2: page.getByPlaceholder('Password')
    // Alt 3: page.locator('input[name="password"]')
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Primary: page.getByRole('button', { name: 'Login' })
    // Alt 1: page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
    // Alt 2: page.locator('button.oxd-button.orangehrm-login-button')
    // Alt 3: page.locator('button[type="submit"]')
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigates to the login page.
   * @returns {Promise<this>}
   */
  async navigateTo() {
    await this.navigate(this.url);
    return this;
  }

  /**
   * Enters the given username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the given password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<this>}
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Clicks the login button and waits for navigation to the dashboard.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async clickLogin() {
    await this.loginButton.click();
    // The action causes navigation, so we import and return the next page object.
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A comprehensive service method to log in with a username and password.
   * This encapsulates the entire login flow on this page.
   * @param {string} username - The username to log in with.
   * @param {string} password - The password to log in with.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.clickLogin();
  }
}

export { LoginPage };
```

**FILE: ./pom/BasePage.js**
```javascript
/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * This class should be extended by all other page object classes.
 */
class BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url - The URL to navigate to.
   * @returns {Promise<void>}
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Waits for the page to be fully loaded, specifically waiting for network activity to be idle.
   * @returns {Promise<void>}
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} The page title.
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Retrieves the URL of the current page.
   * @returns {string} The current page URL.
   */
  getCurrentUrl() {
    return this.page.url();
  }
}

export { BasePage };
```

**FILE: login_analysis_happy_path_pom.spec.js (TEST SPEC)**
```javascript
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
```

═══════════════════════════════════════════════════════════════
🗺️ PROJECT MAP (File Explorer)
═══════════════════════════════════════════════════════════════
This map shows available files in the project. Use it to check for correct import paths or available utilities.

  📄 login_analysis_happy_path.spec.js
  📄 login_analysis_happy_path_pom.spec.js
  📄 playwright.config.js
  📁 utils/
    📄 otp.js
  📁 pom/
    📄 BasePage.js
    📄 DashboardPage.js
    📄 LoginPage.js

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**No DOM snapshot captured** (test may have passed before hook executed)

**Fallback Strategy:**
- Analyze error message for clues about missing element
- Check scenario's captured_selectors for alternatives
- Consider if step is optional or conditional


📸 IMPORTANT: A screenshot of the failed page is attached. Please refer to it for visual context.

How to use DOM snapshot:
- Search by text: Find failing element by its expected text content
- Check existence: Is the element actually on the page?
- Get exact data: Copy EXACT classes, id, cursor, hasOnclick values
- Update POM: If fixing the POM, use these attributes to refine this.page.locator(...)

═══════════════════════════════════════════════════════════════
🔧 HOW TO FIX (POM Edition)
═══════════════════════════════════════════════════════════════

STEP 1: Identify the Failing Layer
- POM Failure: Error inside a method like await this.loginPage.submit() because the selector button.submit inside that method is wrong.
  -> Action: Return fixed POM code.
- Spec Failure: Error at expect(page).toHaveURL(...) or passing wrong arguments loginPage.login(undefined).
  -> Action: Return fixed Test Spec code.

STEP 2: Apply the right fix
1. "resolved to 2 elements" (Ambiguous Selector)
   In POM: Update the locator definition.
   ```javascript
   // Before: this.submitBtn = page.getByRole('button');
   // After:  this.submitBtn = page.getByRole('button', { name: 'Submit Order' });
   ```
2. "waiting for selector" / "timeout" (Timing)
   In Spec: Add a wait before the action.
   ```javascript
   await page.waitForLoadState('networkidle');
   await loginPage.submitForm();
   ```
   In POM: If the method implies waiting, ensure the locator uses auto-waiting.

3. "selector not found" (Broken Selector)
   In POM: Update the locator using the DOM snapshot.
   ```javascript
   // DOM: classes: "btn-primary confirm-btn"
   // Before: this.btn = page.locator('.btn-success');
   // After:  this.btn = page.locator('.confirm-btn');
   ```

4. Fallback Injection (for POM methods) If a locator is flaky, you can update the POM method to use a fallback:
   ```javascript
   async clickSubmit() {
       try {
           await this.primarySelector.click({ timeout: 2000 });
       } catch (e) {
           await this.fallbackSelector.click();
       }
   }
   ```

═══════════════════════════════════════════════════════════════
✅ OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

You must return the corrected code for ANY file that needs changes (POM, Spec, or both).
Use the following XML format to separate the files.

<file path="relative/path/to/file.js">
... full fixed code ...
</file>

Rules:
1. Only include <file> blocks for files that were modified.
2. The "path" attribute must match the Reference name provided in the context exactly.
3. Do NOT include markdown fences (```) around the XML blocks.
4. Ensure the code inside the tags is complete and runnable.

```

### AI Fix Response Received
```javascript
An analysis of the error indicates a classic race condition. The test fails because the `expect().toHaveURL()` assertion in the **Test Spec** is executed before the page navigation, triggered by the login button click, has completed. The `loginAs` method in the `LoginPage` POM initiates the login but doesn't wait for the subsequent page load, causing the assertion to check the URL prematurely.

The root cause lies in the `clickLogin` method within the **POM File** (`./pom/LoginPage.js`). This method is responsible for the action that causes the navigation, and therefore, it should also be responsible for ensuring the navigation completes before control is returned to the test.

The fix is to modify the `clickLogin` method to explicitly wait for the URL to change to the dashboard URL after clicking the login button. Using `Promise.all` with `page.waitForURL()` and the click action is the most robust way to handle this, as it prevents race conditions by starting the wait *before* the click is performed.

<file path="./pom/LoginPage.js">
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class LoginPage
 * @description Represents the OrangeHRM Login Page and its interactions.
 */
class LoginPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);
    this.url = '/web/index.php/auth/login';

    // --- Locators ---
    // Primary: page.getByRole('textbox', { name: 'Username' })
    // Alt 1: page.locator('input[name="username"]')
    // Alt 2: page.getByPlaceholder('Username')
    // Alt 3: page.locator('input.oxd-input').first()
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    // Primary: page.getByRole('textbox', { name: 'Password' })
    // Alt 1: page.locator('input[type="password"]')
    // Alt 2: page.getByPlaceholder('Password')
    // Alt 3: page.locator('input[name="password"]')
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Primary: page.getByRole('button', { name: 'Login' })
    // Alt 1: page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
    // Alt 2: page.locator('button.oxd-button.orangehrm-login-button')
    // Alt 3: page.locator('button[type="submit"]')
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigates to the login page.
   * @returns {Promise<this>}
   */
  async navigateTo() {
    await this.navigate(this.url);
    return this;
  }

  /**
   * Enters the given username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the given password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<this>}
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Clicks the login button and waits for navigation to the dashboard.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async clickLogin() {
    // FIX: The original 'click' did not wait for navigation.
    // Using Promise.all ensures we wait for the URL to change to the dashboard
    // right after the click action is performed, preventing a race condition.
    await Promise.all([
      this.page.waitForURL('**/dashboard/index'),
      this.loginButton.click(),
    ]);
    // The action causes navigation, so we import and return the next page object.
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A comprehensive service method to log in with a username and password.
   * This encapsulates the entire login flow on this page.
   * @param {string} username - The username to log in with.
   * @param {string} password - The password to log in with.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.clickLogin();
  }
}

export { LoginPage };
```
</file>
```

---

