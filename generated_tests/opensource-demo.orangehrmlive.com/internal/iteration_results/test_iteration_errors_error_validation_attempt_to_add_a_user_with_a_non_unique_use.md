## Test: error_validation_attempt_to_add_a_user_with_a_non-unique_use
**File**: error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js
**Iteration**: 1/5
**Timestamp**: 2026-01-08 10:51:22
**Status**: FAILED

### Error Details
```
Test: Error Validation: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.fill: Error: strict mode violation: locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox')[22m


  142 |   //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  143 |   // Using a label-based selector for better stability.
> 144 |   await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('admin123');
      |                                                                                               ^
  145 |
  146 |   // Step 9: Confirm the password
  147 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:144:95
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:144:95

Console Output (stderr):
Failed to capture accessibility state on test failure: ReferenceError: __dirname is not defined
    at [90mfile:///var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39merror_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:68:39
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:326:11
    at TimeoutManager.withRunnable [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/timeoutManager.js:67:14[90m)[39m
    at TestInfoImpl._runWithTimeout [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:324:7[90m)[39m
    at FixtureRunner.resolveParametersAndRunFunction [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/fixtureRunner.js:220:5[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:465:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runEachHooksForSuites [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:464:9[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:326:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runTest [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:317:5[90m)[39m
    at WorkerMain.runTestGroup [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:194:11[90m)[39m
    at process.<anonymous> [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/common/process.js:65:22[90m)[39m


Test Status: failed
Duration: 10406ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
      const domSnapshot = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   parseFloat(style.opacity) > 0.05;
          })
          .map(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              classes: el.className || null,
              text: (el.innerText || el.textContent || '').trim().substring(0, 100),
              value: el.value || null,
              role: el.getAttribute('role') || null,
              ariaLabel: el.getAttribute('aria-label') || null,
              type: el.type || null,
              href: el.href || null,
              cursor: style.cursor,
              display: style.display,
              hasOnclick: !!el['onclick'] || el.hasAttribute('onclick'),
              parent: {
                tag: el.parentElement?.tagName?.toLowerCase(),
                classes: el.parentElement?.className || null
              },
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            };
          });
      });
      
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      
      // Save screenshot as separate PNG file
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotDir, `${fileName}_failure.png`);
      fs.writeFileSync(screenshotPath, screenshot);
      
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url(),
        screenshot_path: screenshotPath
      }, null, 2));
    } catch (e) {
      console.error('Failed to capture accessibility state on test failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Error Validation: Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Load the main application dashboard after a successful login.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' for User Role
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'User Role' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Select 'Enabled' for Status
  // Captured selectors:
  //   1. page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2) (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'Status' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 6: Enter an employee name in the auto-suggest field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Peter');
  // Wait for the autocomplete suggestion to appear and click it
  await page.getByRole('option', { name: /Peter/ }).first().click();

  // Step 7: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('admin123');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('admin123');

  // Step 10: Click the 'Save' button to submit
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This confirms that the system correctly prevents duplicate usernames.
  const errorMessage = page.locator('.oxd-input-field-error-message');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Already exists');
});
```

### AI Fix Prompt Sent
```

You are a Playwright test debugging expert. Analyze the failing test and fix it efficiently.

═══════════════════════════════════════════════════════════════
⚠️ ERROR ANALYSIS - READ THIS FIRST
═══════════════════════════════════════════════════════════════

**WHAT FAILED:**
```
Test: Error Validation: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.fill: Error: strict mode violation: locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox')[22m


  142 |   //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  143 |   // Using a label-based selector for better stability.
> 144 |   await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('admin123');
      |                                                                                               ^
  145 |
  146 |   // Step 9: Confirm the password
  147 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:144:95
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:144:95

Console Output (stderr):
Failed to capture accessibility state on test failure: ReferenceError: __dirname is not defined
    at [90mfile:///var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39merror_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js:68:39
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:326:11
    at TimeoutManager.withRunnable [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/timeoutManager.js:67:14[90m)[39m
    at TestInfoImpl._runWithTimeout [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:324:7[90m)[39m
    at FixtureRunner.resolveParametersAndRunFunction [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/fixtureRunner.js:220:5[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:465:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runEachHooksForSuites [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:464:9[90m)[39m
    at [90m/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:326:11
    at TestInfoImpl._runAsStep [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/testInfo.js:315:7[90m)[39m
    at WorkerMain._runTest [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:317:5[90m)[39m
    at WorkerMain.runTestGroup [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/worker/workerMain.js:194:11[90m)[39m
    at process.<anonymous> [90m(/var/tmp/Roost/RoostGPT/orange-hrm-demo/0a155d0b-62c9-4418-8336-8da647890684/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/[39mnode_modules/[4mplaywright[24m/lib/common/process.js:65:22[90m)[39m


Test Status: failed
Duration: 10406ms
```

**YOUR TASK:**
1. Find the line number in the error above
2. Locate that line in the test code below
3. Fix ONLY that specific line (minimal change)
4. Return the complete fixed test code

**GOLDEN RULE:**
If error is at line 150 → Fix line 150 only.
Don't change line 50, 100, or 200 unless the error explicitly mentions them.

**COMMON MISTAKE:**
❌ Rewriting working code "for consistency"
✅ Surgical fix of the exact failing line only

═══════════════════════════════════════════════════════════════
📋 TEST INFORMATION
═══════════════════════════════════════════════════════════════

**Test Name:** error_validation_attempt_to_add_a_user_with_a_non-unique_use
**Test File:** error_validation_attempt_to_add_a_user_with_a_non_unique_use.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "error_validation_attempt_to_add_a_user_with_a_non-unique_use",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "e2e_business_workflow",
  "description": "This scenario tests the system's validation by attempting to create a new user with a username ('Admin') that already exists. It follows the complete workflow of navigating to the user creation form, filling in all required fields, and submitting the form to verify that the system correctly prevents the duplicate entry and displays an appropriate error message.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "component": "Global Navigation",
      "description": "Load the main application dashboard after a successful login.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "The application dashboard page is loaded successfully.",
      "business_impact": "Ensures the user can access the application's main entry point.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "click",
      "component": "Navigation Menu",
      "description": "Navigate to the Admin section to access user management features.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page URL should contain '/admin/viewSystemUsers'.",
      "business_impact": "Critical step for administrators to begin any user management task.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 95
        },
        {
          "selector": "page.locator('[role=\"navigation\"]').getByRole('link', { name: 'Admin' })",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('link', { name: 'Admin' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Admin$/ })",
          "confidence": 74
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[1]/aside/nav/div[2]/ul/li[1]/a')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/dashboard/index",
        "suggested_page_class": "DashboardPage"
      },
      "method_context": {
        "action_type": "navigate",
        "suggested_method_name": "clickAdmin",
        "causes_navigation": true
      }
    },
    {
      "step_number": 3,
      "action": "click",
      "component": "User Management Actions",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should contain '/admin/saveSystemUser'.",
      "business_impact": "Initiates the primary workflow for adding new users to the system.",
      "selector": "page.getByRole('button', { name: '\uf4fe Add' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: '\uf4fe Add' })",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: 'Add' })",
          "confidence": 95
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Add')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Add' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div[2]/div[1]/button')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/viewSystemUsers",
        "suggested_page_class": "ViewsystemusersPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickAdd",
        "causes_navigation": true
      }
    },
    {
      "step_number": 4,
      "action": "click",
      "component": "User Role Dropdown",
      "description": "Click the 'User Role' dropdown to open the list of available roles. The 'Admin' role is selected in the subsequent action.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigning a user role is a mandatory step for defining user permissions.",
      "selector": "page.getByText('-- Select --').first()",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --').first()",
          "confidence": 99
        },
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 88
        },
        {
          "selector": "page.getByText('Select')",
          "confidence": 80
        },
        {
          "selector": "page.locator('div.oxd-select-text-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('div[data-v-67d2aedf]')",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div/div[1]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickSelect",
        "causes_navigation": false
      }
    },
    {
      "step_number": 5,
      "action": "click",
      "component": "Status Dropdown",
      "description": "Click the 'Status' dropdown to open the list of statuses. The 'Enabled' status is selected in the subsequent action.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Setting the user status is a mandatory step to control if the account is active.",
      "selector": "page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2)",
      "all_selectors": [
        {
          "selector": "page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 88
        },
        {
          "selector": "page.getByText('Select')",
          "confidence": 80
        },
        {
          "selector": "page.locator('div[data-v-13cf171c]')",
          "confidence": 80
        },
        {
          "selector": "page.locator('div.oxd-select-text')",
          "confidence": 78
        },
        {
          "selector": "page.locator('div[data-v-67d2aedf]')",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickSelect",
        "causes_navigation": false
      }
    },
    {
      "step_number": 6,
      "action": "input_text",
      "component": "Add User Form",
      "description": "Enter an employee name in the auto-suggest field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Associating the system user with an employee record is a required step.",
      "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
      "input_value": "John Doe",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-75e744cd]')",
          "confidence": 90
        },
        {
          "selector": "page.getByPlaceholder('Type for hints...')",
          "confidence": 85
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactTypeforhints",
        "causes_navigation": false
      }
    },
    {
      "step_number": 7,
      "action": "input_text",
      "component": "Add User Form",
      "description": "Enter the non-unique username 'Admin' into the username field to trigger the validation error.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "This is the key validation step of the scenario to test duplicate username prevention.",
      "selector": "page.getByRole('textbox').nth(2)",
      "input_value": "Admin",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active')",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active')",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "performInput",
        "causes_navigation": false
      }
    },
    {
      "step_number": 8,
      "action": "input_text",
      "component": "Add User Form",
      "description": "Enter a valid password for the new user account.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Password entry is a mandatory security step for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
      "input_value": "admin123",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(3)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active')",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active')",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "performInput",
        "causes_navigation": false
      }
    },
    {
      "step_number": 9,
      "action": "input_text",
      "component": "Add User Form",
      "description": "Confirm the password by re-entering it in the confirmation field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the user has entered their intended password correctly.",
      "selector": "page.getByRole('textbox').nth(4)",
      "input_value": "admin123",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(4)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active')",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active')",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "performInput",
        "causes_navigation": false
      }
    },
    {
      "step_number": 10,
      "action": "click",
      "component": "Add User Form",
      "description": "Click the 'Save' button to submit the new user form for creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Form submission is attempted.",
      "business_impact": "Triggers the server-side validation for the new user data.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 95
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Save')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Save' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-left-space')",
          "confidence": 80
        },
        {
          "selector": "page.locator('button.oxd-button')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickSave",
        "causes_navigation": true
      }
    },
    {
      "step_number": 11,
      "action": "Verify error message",
      "component": "Add User Form",
      "description": "Verify that an error message is displayed on the page, indicating that the chosen username already exists.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should display an error message containing the text 'Already exists'.",
      "business_impact": "Confirms that the system's data validation rules are working correctly to protect data integrity.",
      "selector": "",
      "confidence": 100,
      "based_on_interaction": false
    }
  ]
}
```

**Current Test Code:**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
      const domSnapshot = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   parseFloat(style.opacity) > 0.05;
          })
          .map(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              classes: el.className || null,
              text: (el.innerText || el.textContent || '').trim().substring(0, 100),
              value: el.value || null,
              role: el.getAttribute('role') || null,
              ariaLabel: el.getAttribute('aria-label') || null,
              type: el.type || null,
              href: el.href || null,
              cursor: style.cursor,
              display: style.display,
              hasOnclick: !!el['onclick'] || el.hasAttribute('onclick'),
              parent: {
                tag: el.parentElement?.tagName?.toLowerCase(),
                classes: el.parentElement?.className || null
              },
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            };
          });
      });
      
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      
      // Save screenshot as separate PNG file
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotDir, `${fileName}_failure.png`);
      fs.writeFileSync(screenshotPath, screenshot);
      
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url(),
        screenshot_path: screenshotPath
      }, null, 2));
    } catch (e) {
      console.error('Failed to capture accessibility state on test failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Error Validation: Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Load the main application dashboard after a successful login.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' for User Role
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'User Role' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Select 'Enabled' for Status
  // Captured selectors:
  //   1. page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2) (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'Status' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 6: Enter an employee name in the auto-suggest field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Peter');
  // Wait for the autocomplete suggestion to appear and click it
  await page.getByRole('option', { name: /Peter/ }).first().click();

  // Step 7: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('admin123');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('admin123');

  // Step 10: Click the 'Save' button to submit
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This confirms that the system correctly prevents duplicate usernames.
  const errorMessage = page.locator('.oxd-input-field-error-message');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Already exists');
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**No DOM snapshot captured** (test may have passed before hook executed)

**Fallback Strategy:**
- Analyze error message for clues about missing element
- Check scenario's captured_selectors for alternatives
- Consider if step is optional or conditional


**📸 IMPORTANT: A screenshot of the failed page is attached. Please refer to it for visual context of the error.**

**How to use DOM snapshot:**
1. **Search by text**: Find failing element by its expected text content
2. **Check existence**: Is the element actually on the page?
3. **Get exact data**: Copy EXACT `classes`, `id`, `cursor`, `hasOnclick` values
4. **Build selector**: Use data from snapshot, don't invent selectors

**Key fields explained:**
- `classes`: EXACT full className string (e.g., "Modal_container__abc123")
- `cursor: "pointer"`: Element is likely clickable
- `hasOnclick: true`: Has click handler
- `parent.classes`: Parent context helps identify nested elements
- `position`: Element location helps verify it's not hidden off-screen

═══════════════════════════════════════════════════════════════
🔧 HOW TO FIX (Quick Reference)
═══════════════════════════════════════════════════════════════

**STEP 1: Identify the problem**
Look at error message - what type of failure?

**STEP 2: Apply the right fix**

1️⃣ **"resolved to 2 elements" / "strict mode violation"**
→ Selector too generic, add specificity:
```javascript
// Before: page.getByRole("checkbox")
// After:  page.getByRole("checkbox", { name: "exact text from DOM" })
```

2️⃣ **"waiting for selector" / "timeout"**
→ Element loads slowly, add wait:
```javascript
await page.waitForLoadState('networkidle');
await page.locator(selector).click();
```

3️⃣ **"waiting for selector" / "timeout" (RETRY WITH SLEEP)**
→ If `waitForLoadState` didn't work, the page might be updating dynamically (race condition). Add a hard wait:
```javascript
await page.waitForTimeout(2000); // Give UI time to settle
await page.locator(selector).click();
```

4️⃣ **"selector not found" / element doesn't exist**
→ Try alternative selector from scenario JSON OR use exact class/id from DOM snapshot:
```javascript
// From DOM: classes: "btn btn-primary submit-button"
await page.locator('.submit-button').click();
```

5️⃣ **Multiple similar elements**
→ Use .first() or .nth(index):
```javascript
await page.locator('button.submit').first().click();
```

6️⃣ **Optional element (conditional UI)**
→ Check existence first:
```javascript
const count = await page.locator(selector).count();
if (count > 0) {
  await page.locator(selector).click();
}
```

**STEP 3: Verify your fix**
- Changed only the failing line? ✓
- Used data from scenario JSON or DOM snapshot? ✓
- Kept rest of test unchanged? ✓

**When selector is not found:**
1. Check if code has selector comment block above the failing line
2. If YES: Inject try-catch with alternatives from comments
3. If NO: Look up alternatives in detailed_steps `all_selectors` array

**Fallback Injection Pattern:**
```javascript
// Step X: [description]
// Captured selectors:
//   1. [primary_selector] (confidence: X%)
//   2. [fallback_1] (confidence: Y%)
//   3. [fallback_2] (confidence: Z%)

try {
  await page.locator('[primary_selector]').click({ timeout: 60000 });
} catch (e1) {
  try {
    await page.locator('[fallback_1]').click({ timeout: 60000 });
  } catch (e2) {
    await page.locator('[fallback_2]').click({ timeout: 60000 });
  }
}
```

**Rules:**
- Keep original comments
- Use 5 second timeout per attempt
- Only add for steps that actually failed
- Try selectors in confidence order

═══════════════════════════════════════════════════════════════
✅ OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Return ONLY the corrected JavaScript test code:
- NO markdown fences (```javascript)
- NO explanations outside the code
- NO placeholder text
- Just pure, runnable JavaScript

The code must be directly savable as a .spec.js file.

```

### AI Fix Response Received
```javascript
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
      const domSnapshot = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   parseFloat(style.opacity) > 0.05;
          })
          .map(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              classes: el.className || null,
              text: (el.innerText || el.textContent || '').trim().substring(0, 100),
              value: el.value || null,
              role: el.getAttribute('role') || null,
              ariaLabel: el.getAttribute('aria-label') || null,
              type: el.type || null,
              href: el.href || null,
              cursor: style.cursor,
              display: style.display,
              hasOnclick: !!el['onclick'] || el.hasAttribute('onclick'),
              parent: {
                tag: el.parentElement?.tagName?.toLowerCase(),
                classes: el.parentElement?.className || null
              },
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            };
          });
      });
      
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      
      // Save screenshot as separate PNG file
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotDir, `${fileName}_failure.png`);
      fs.writeFileSync(screenshotPath, screenshot);
      
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url(),
        screenshot_path: screenshotPath
      }, null, 2));
    } catch (e) {
      console.error('Failed to capture accessibility state on test failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Error Validation: Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Load the main application dashboard after a successful login.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' for User Role
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'User Role' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Select 'Enabled' for Status
  // Captured selectors:
  //   1. page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2) (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'Status' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 6: Enter an employee name in the auto-suggest field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Peter');
  // Wait for the autocomplete suggestion to appear and click it
  await page.getByRole('option', { name: /Peter/ }).first().click();

  // Step 7: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('admin123');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('admin123');

  // Step 10: Click the 'Save' button to submit
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This confirms that the system correctly prevents duplicate usernames.
  const errorMessage = page.locator('.oxd-input-field-error-message');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Already exists');
});
```
```

---

