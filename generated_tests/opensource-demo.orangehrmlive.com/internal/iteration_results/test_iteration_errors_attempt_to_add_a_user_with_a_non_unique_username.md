## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 1/5
**Timestamp**: 2025-12-17 04:25:56
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: /Aniket QA/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: /Aniket QA/ }).click();
      |                                                         ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:57
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:57

Test Status: timedOut
Duration: 120283ms
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket QA/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: /Aniket QA/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: /Aniket QA/ }).click();
      |                                                         ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:57
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:57

Test Status: timedOut
Duration: 120283ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario verifies that the system correctly prevents an administrator from creating a new user with a username that already exists in the system and displays an appropriate error message.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main application dashboard after a successful login.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "The user is on the main dashboard page.",
      "business_impact": "Ensures the user can access the application's main interface.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Admin section to access user management features.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page URL should contain '/admin/viewSystemUsers'.",
      "business_impact": "Allows administrators to access the user administration panel.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should contain '/admin/saveSystemUser'.",
      "business_impact": "Initiates the new user creation workflow.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Select 'Admin' from the User Role dropdown to assign administrative privileges.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Admin' role is selected in the form.",
      "business_impact": "Defines the permission level for the new user.",
      "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Admin')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Admin$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the employee's name in the 'Employee Name' field.",
      "input_value": "Aniket QA",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The employee name field is populated correctly.",
      "business_impact": "Associates the system user account with a specific employee.",
      "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Select 'Enabled' from the Status dropdown to make the user account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Enabled' status is selected.",
      "business_impact": "Determines if the new user can log in immediately after creation.",
      "selector": "page.getByText('Enabled')",
      "all_selectors": [
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Enabled' })",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Enabled$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the existing username 'Admin' into the username field to trigger the duplicate validation.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The username field is populated with 'Admin'.",
      "business_impact": "Tests the system's core validation logic for unique usernames.",
      "selector": "page.getByRole('textbox').nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(1)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(1)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(1)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(2)",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input').nth(1)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "input_text",
      "description": "Enter a valid password for the new user account.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The password field is populated.",
      "business_impact": "Completes a required field for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(3)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').first()",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(2)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(2)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(2)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(3)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Confirm the password by re-entering it in the confirmation field.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The confirm password field is populated.",
      "business_impact": "Ensures the user has entered their intended password correctly.",
      "selector": "page.getByRole('textbox').nth(4)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(4)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').nth(1)",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(3)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(3)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(3)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(4)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Click the 'Save' button to submit the new user form.",
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
          "selector": "page.locator('button[data-v-10d463b7]').nth(1)",
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
          "selector": "page.locator('button.oxd-button').nth(1)",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "verify_text",
      "description": "Verify that the 'Already exists' error message is displayed under the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The error message 'Already exists' is visible on the page.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Already exists')",
      "confidence": 95,
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket QA/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 238
Relevant Elements Sent (Filtered): 50

**Filtering Strategy Applied:**
- ✅ Elements matching error selector
- ✅ Elements with expected text from scenario
- ✅ Parent/sibling context elements
- ✅ Interactive elements in same section

**Filtered DOM Elements (Most Relevant):**
```json
[
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-brand",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.orangehrm.com/",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sidepanel-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 256,
      "height": 103
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-brand-banner",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-brand"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 55
    }
  },
  {
    "tag": "img",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-brand-banner"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 50
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "oxd-input oxd-input--active",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 46,
      "y": 119,
      "width": 189,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "oxd-icon-button oxd-main-menu-button",
    "text": "",
    "value": null,
    "role": "none",
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 243,
      "y": 110,
      "width": 25,
      "height": 25
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-chevron-left",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "oxd-icon-button oxd-main-menu-button"
    },
    "position": {
      "x": 251,
      "y": 117,
      "width": 10,
      "height": 11
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item active",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 158,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 46,
      "y": 168,
      "width": 56,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPimModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 196,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 204,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 206,
      "width": 22,
      "height": 18
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 206,
      "width": 39,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewLeaveModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 234,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 244,
      "width": 50,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/time/viewTimeModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 272,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 295,
      "width": 22,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 29,
      "y": 280,
      "width": 13,
      "height": 13
    }
  },
  {
    "tag": "polygon",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 283,
      "width": 5,
      "height": 5
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 282,
      "width": 45,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewRecruitmentModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 310,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 324,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 30,
      "y": 321,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 320,
      "width": 91,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 348,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 356,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 22,
      "height": 21
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 14,
      "height": 18
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 366,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "g",
    "id": "svgg",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "path",
    "id": "path4",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 358,
      "width": 62,
      "height": 19
    }
  }
]
```

**How to Use This Data:**
1. These 50 elements are the MOST RELEVANT to your failure
2. Search for failing element by text, classes, or role
3. Check exact `classes`, `id`, `cursor`, `hasOnclick` attributes
4. Use EXACT data from snapshot to build robust selectors
5. If element not found here, it may not exist on the page


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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: 'Aniket Testing QA' }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 2/5
**Timestamp**: 2025-12-17 04:30:09
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: 'Aniket Testing QA' })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: 'Aniket Testing QA' }).click();
      |                                                                 ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:65
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:65

Test Status: timedOut
Duration: 120294ms
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: 'Aniket Testing QA' }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: 'Aniket Testing QA' })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: 'Aniket Testing QA' }).click();
      |                                                                 ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:65
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:65

Test Status: timedOut
Duration: 120294ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario verifies that the system correctly prevents an administrator from creating a new user with a username that already exists in the system and displays an appropriate error message.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main application dashboard after a successful login.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "The user is on the main dashboard page.",
      "business_impact": "Ensures the user can access the application's main interface.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Admin section to access user management features.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page URL should contain '/admin/viewSystemUsers'.",
      "business_impact": "Allows administrators to access the user administration panel.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should contain '/admin/saveSystemUser'.",
      "business_impact": "Initiates the new user creation workflow.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Select 'Admin' from the User Role dropdown to assign administrative privileges.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Admin' role is selected in the form.",
      "business_impact": "Defines the permission level for the new user.",
      "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Admin')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Admin$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the employee's name in the 'Employee Name' field.",
      "input_value": "Aniket QA",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The employee name field is populated correctly.",
      "business_impact": "Associates the system user account with a specific employee.",
      "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Select 'Enabled' from the Status dropdown to make the user account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Enabled' status is selected.",
      "business_impact": "Determines if the new user can log in immediately after creation.",
      "selector": "page.getByText('Enabled')",
      "all_selectors": [
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Enabled' })",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Enabled$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the existing username 'Admin' into the username field to trigger the duplicate validation.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The username field is populated with 'Admin'.",
      "business_impact": "Tests the system's core validation logic for unique usernames.",
      "selector": "page.getByRole('textbox').nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(1)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(1)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(1)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(2)",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input').nth(1)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "input_text",
      "description": "Enter a valid password for the new user account.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The password field is populated.",
      "business_impact": "Completes a required field for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(3)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').first()",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(2)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(2)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(2)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(3)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Confirm the password by re-entering it in the confirmation field.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The confirm password field is populated.",
      "business_impact": "Ensures the user has entered their intended password correctly.",
      "selector": "page.getByRole('textbox').nth(4)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(4)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').nth(1)",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(3)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(3)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(3)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(4)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Click the 'Save' button to submit the new user form.",
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
          "selector": "page.locator('button[data-v-10d463b7]').nth(1)",
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
          "selector": "page.locator('button.oxd-button').nth(1)",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "verify_text",
      "description": "Verify that the 'Already exists' error message is displayed under the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The error message 'Already exists' is visible on the page.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Already exists')",
      "confidence": 95,
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: 'Aniket Testing QA' }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 237
Relevant Elements Sent (Filtered): 50

**Filtering Strategy Applied:**
- ✅ Elements matching error selector
- ✅ Elements with expected text from scenario
- ✅ Parent/sibling context elements
- ✅ Interactive elements in same section

**Filtered DOM Elements (Most Relevant):**
```json
[
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-brand",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.orangehrm.com/",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sidepanel-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 256,
      "height": 103
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-brand-banner",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-brand"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 55
    }
  },
  {
    "tag": "img",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-brand-banner"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 50
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "oxd-input oxd-input--active",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 46,
      "y": 119,
      "width": 189,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "oxd-icon-button oxd-main-menu-button",
    "text": "",
    "value": null,
    "role": "none",
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 243,
      "y": 110,
      "width": 25,
      "height": 25
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-chevron-left",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "oxd-icon-button oxd-main-menu-button"
    },
    "position": {
      "x": 251,
      "y": 117,
      "width": 10,
      "height": 11
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item active",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 158,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 46,
      "y": 168,
      "width": 56,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPimModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 196,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 204,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 206,
      "width": 22,
      "height": 18
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 206,
      "width": 39,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewLeaveModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 234,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 244,
      "width": 50,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/time/viewTimeModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 272,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 295,
      "width": 22,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 29,
      "y": 280,
      "width": 13,
      "height": 13
    }
  },
  {
    "tag": "polygon",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 283,
      "width": 5,
      "height": 5
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 282,
      "width": 45,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewRecruitmentModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 310,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 324,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 30,
      "y": 321,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 320,
      "width": 91,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 348,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 356,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 22,
      "height": 21
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 14,
      "height": 18
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 366,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "g",
    "id": "svgg",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "path",
    "id": "path4",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 358,
      "width": 62,
      "height": 19
    }
  }
]
```

**How to Use This Data:**
1. These 50 elements are the MOST RELEVANT to your failure
2. Search for failing element by text, classes, or role
3. Check exact `classes`, `id`, `cursor`, `hasOnclick` attributes
4. Use EXACT data from snapshot to build robust selectors
5. If element not found here, it may not exist on the page


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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 3/5
**Timestamp**: 2025-12-17 04:34:25
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: /Aniket/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: /Aniket/ }).click();
      |                                                      ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:54
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:54

Test Status: timedOut
Duration: 120252ms
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option', { name: /Aniket/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option', { name: /Aniket/ }).click();
      |                                                      ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:54
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:54

Test Status: timedOut
Duration: 120252ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario verifies that the system correctly prevents an administrator from creating a new user with a username that already exists in the system and displays an appropriate error message.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main application dashboard after a successful login.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "The user is on the main dashboard page.",
      "business_impact": "Ensures the user can access the application's main interface.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Admin section to access user management features.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page URL should contain '/admin/viewSystemUsers'.",
      "business_impact": "Allows administrators to access the user administration panel.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should contain '/admin/saveSystemUser'.",
      "business_impact": "Initiates the new user creation workflow.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Select 'Admin' from the User Role dropdown to assign administrative privileges.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Admin' role is selected in the form.",
      "business_impact": "Defines the permission level for the new user.",
      "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Admin')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Admin$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the employee's name in the 'Employee Name' field.",
      "input_value": "Aniket QA",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The employee name field is populated correctly.",
      "business_impact": "Associates the system user account with a specific employee.",
      "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Select 'Enabled' from the Status dropdown to make the user account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Enabled' status is selected.",
      "business_impact": "Determines if the new user can log in immediately after creation.",
      "selector": "page.getByText('Enabled')",
      "all_selectors": [
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Enabled' })",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Enabled$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the existing username 'Admin' into the username field to trigger the duplicate validation.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The username field is populated with 'Admin'.",
      "business_impact": "Tests the system's core validation logic for unique usernames.",
      "selector": "page.getByRole('textbox').nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(1)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(1)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(1)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(2)",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input').nth(1)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "input_text",
      "description": "Enter a valid password for the new user account.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The password field is populated.",
      "business_impact": "Completes a required field for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(3)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').first()",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(2)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(2)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(2)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(3)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Confirm the password by re-entering it in the confirmation field.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The confirm password field is populated.",
      "business_impact": "Ensures the user has entered their intended password correctly.",
      "selector": "page.getByRole('textbox').nth(4)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(4)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').nth(1)",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(3)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(3)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(3)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(4)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Click the 'Save' button to submit the new user form.",
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
          "selector": "page.locator('button[data-v-10d463b7]').nth(1)",
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
          "selector": "page.locator('button.oxd-button').nth(1)",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "verify_text",
      "description": "Verify that the 'Already exists' error message is displayed under the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The error message 'Already exists' is visible on the page.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Already exists')",
      "confidence": 95,
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 237
Relevant Elements Sent (Filtered): 50

**Filtering Strategy Applied:**
- ✅ Elements matching error selector
- ✅ Elements with expected text from scenario
- ✅ Parent/sibling context elements
- ✅ Interactive elements in same section

**Filtered DOM Elements (Most Relevant):**
```json
[
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-brand",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.orangehrm.com/",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sidepanel-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 256,
      "height": 103
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-brand-banner",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-brand"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 55
    }
  },
  {
    "tag": "img",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-brand-banner"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 50
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "oxd-input oxd-input--active",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 46,
      "y": 119,
      "width": 189,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "oxd-icon-button oxd-main-menu-button",
    "text": "",
    "value": null,
    "role": "none",
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 243,
      "y": 110,
      "width": 25,
      "height": 25
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-chevron-left",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "oxd-icon-button oxd-main-menu-button"
    },
    "position": {
      "x": 251,
      "y": 117,
      "width": 10,
      "height": 11
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item active",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 158,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 46,
      "y": 168,
      "width": 56,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPimModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 196,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 204,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 206,
      "width": 22,
      "height": 18
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 206,
      "width": 39,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewLeaveModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 234,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 244,
      "width": 50,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/time/viewTimeModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 272,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 295,
      "width": 22,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 29,
      "y": 280,
      "width": 13,
      "height": 13
    }
  },
  {
    "tag": "polygon",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 283,
      "width": 5,
      "height": 5
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 282,
      "width": 45,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewRecruitmentModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 310,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 324,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 30,
      "y": 321,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 320,
      "width": 91,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 348,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 356,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 22,
      "height": 21
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 14,
      "height": 18
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 366,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "g",
    "id": "svgg",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "path",
    "id": "path4",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 358,
      "width": 62,
      "height": 19
    }
  }
]
```

**How to Use This Data:**
1. These 50 elements are the MOST RELEVANT to your failure
2. Search for failing element by text, classes, or role
3. Check exact `classes`, `id`, `cursor`, `hasOnclick` attributes
4. Use EXACT data from snapshot to build robust selectors
5. If element not found here, it may not exist on the page


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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option').filter({ hasText: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 4/5
**Timestamp**: 2025-12-17 04:38:18
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option').filter({ hasText: /Aniket/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option').filter({ hasText: /Aniket/ }).click();
      |                                                                ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:64
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:64

Test Status: timedOut
Duration: 120272ms
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option').filter({ hasText: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('option').filter({ hasText: /Aniket/ })[22m


  127 |   await employeeNameInput.fill('Aniket QA');
  128 |   // Wait for autocomplete options to appear and select the correct one.
> 129 |   await page.getByRole('option').filter({ hasText: /Aniket/ }).click();
      |                                                                ^
  130 |
  131 |   // Step 6: Select 'Enabled' from the Status dropdown
  132 |   // This is a two-step action: click to open the dropdown, then click the option.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:64
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/70f7d11e-8c5b-4c8f-984d-507e6e968811/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:129:64

Test Status: timedOut
Duration: 120272ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario verifies that the system correctly prevents an administrator from creating a new user with a username that already exists in the system and displays an appropriate error message.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main application dashboard after a successful login.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "The user is on the main dashboard page.",
      "business_impact": "Ensures the user can access the application's main interface.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Admin section to access user management features.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page URL should contain '/admin/viewSystemUsers'.",
      "business_impact": "Allows administrators to access the user administration panel.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should contain '/admin/saveSystemUser'.",
      "business_impact": "Initiates the new user creation workflow.",
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
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Select 'Admin' from the User Role dropdown to assign administrative privileges.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Admin' role is selected in the form.",
      "business_impact": "Defines the permission level for the new user.",
      "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' }).locator('span')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Admin')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Admin$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the employee's name in the 'Employee Name' field.",
      "input_value": "Aniket QA",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The employee name field is populated correctly.",
      "business_impact": "Associates the system user account with a specific employee.",
      "selector": "page.getByRole('textbox', { name: 'Type for hints...' })",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Select 'Enabled' from the Status dropdown to make the user account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The 'Enabled' status is selected.",
      "business_impact": "Determines if the new user can log in immediately after creation.",
      "selector": "page.getByText('Enabled')",
      "all_selectors": [
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 99
        },
        {
          "selector": "page.locator('span[data-v-13cf171c]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Enabled')",
          "confidence": 88
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Enabled' })",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Enabled$/ })",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div[2]/div[2]/span')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the existing username 'Admin' into the username field to trigger the duplicate validation.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The username field is populated with 'Admin'.",
      "business_impact": "Tests the system's core validation logic for unique usernames.",
      "selector": "page.getByRole('textbox').nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(2)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(1)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(1)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(1)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(2)",
          "confidence": 68
        },
        {
          "selector": "page.locator('input.oxd-input').nth(1)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "input_text",
      "description": "Enter a valid password for the new user account.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The password field is populated.",
      "business_impact": "Completes a required field for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(3)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').first()",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(2)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(2)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(2)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(3)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Confirm the password by re-entering it in the confirmation field.",
      "input_value": "ValidPassword123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The confirm password field is populated.",
      "business_impact": "Ensures the user has entered their intended password correctly.",
      "selector": "page.getByRole('textbox').nth(4)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox').nth(4)",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"password\"]').nth(1)",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]').nth(3)",
          "confidence": 80
        },
        {
          "selector": "page.locator('input.oxd-input--active').nth(3)",
          "confidence": 74
        },
        {
          "selector": "page.locator('.oxd-input--active').nth(3)",
          "confidence": 72
        },
        {
          "selector": "page.locator('#app').locator('input').nth(4)",
          "confidence": 68
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Click the 'Save' button to submit the new user form.",
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
          "selector": "page.locator('button[data-v-10d463b7]').nth(1)",
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
          "selector": "page.locator('button.oxd-button').nth(1)",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "verify_text",
      "description": "Verify that the 'Already exists' error message is displayed under the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The error message 'Already exists' is visible on the page.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Already exists')",
      "confidence": 95,
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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option').filter({ hasText: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 237
Relevant Elements Sent (Filtered): 50

**Filtering Strategy Applied:**
- ✅ Elements matching error selector
- ✅ Elements with expected text from scenario
- ✅ Parent/sibling context elements
- ✅ Interactive elements in same section

**Filtered DOM Elements (Most Relevant):**
```json
[
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-brand",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.orangehrm.com/",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sidepanel-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 256,
      "height": 103
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-brand-banner",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-brand"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 55
    }
  },
  {
    "tag": "img",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-brand-banner"
    },
    "position": {
      "x": 16,
      "y": 24,
      "width": 182,
      "height": 50
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "oxd-input oxd-input--active",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 46,
      "y": 119,
      "width": 189,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "oxd-icon-button oxd-main-menu-button",
    "text": "",
    "value": null,
    "role": "none",
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-main-menu-search"
    },
    "position": {
      "x": 243,
      "y": 110,
      "width": 25,
      "height": 25
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-chevron-left",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "oxd-icon-button oxd-main-menu-button"
    },
    "position": {
      "x": 251,
      "y": 117,
      "width": 10,
      "height": 11
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item active",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewAdminModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 158,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 166,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item active"
    },
    "position": {
      "x": 46,
      "y": 168,
      "width": 56,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPimModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 196,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 204,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 206,
      "width": 22,
      "height": 18
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 214,
      "width": 22,
      "height": 10
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 25,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 31,
      "y": 206,
      "width": 8,
      "height": 8
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 39,
      "y": 210,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "PIM",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 206,
      "width": 39,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewLeaveModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 234,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 242,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Leave",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 244,
      "width": 50,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/time/viewTimeModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 272,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 280,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 295,
      "width": 22,
      "height": 8
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 29,
      "y": 280,
      "width": 13,
      "height": 13
    }
  },
  {
    "tag": "polygon",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 283,
      "width": 5,
      "height": 5
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Time",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 282,
      "width": 45,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewRecruitmentModule",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 310,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 324,
      "width": 6,
      "height": 6
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 30,
      "y": 321,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 318,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "Recruitment",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 320,
      "width": 91,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "oxd-main-menu-item",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "oxd-main-menu-item-wrapper"
    },
    "position": {
      "x": 0,
      "y": 348,
      "width": 246,
      "height": 38
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "presentation",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 24,
      "y": 356,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "g",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 22,
      "height": 21
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 24,
      "y": 357,
      "width": 14,
      "height": 18
    }
  },
  {
    "tag": "path",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 34,
      "y": 366,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "g",
    "id": "svgg",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "path",
    "id": "path4",
    "classes": {},
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "g",
      "classes": {}
    },
    "position": {
      "x": 36,
      "y": 368,
      "width": 6,
      "height": 7
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "oxd-text oxd-text--span oxd-main-menu-item--name",
    "text": "My Info",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "oxd-main-menu-item"
    },
    "position": {
      "x": 46,
      "y": 358,
      "width": 62,
      "height": 19
    }
  }
]
```

**How to Use This Data:**
1. These 50 elements are the MOST RELEVANT to your failure
2. Search for failing element by text, classes, or role
3. Check exact `classes`, `id`, `cursor`, `hasOnclick` attributes
4. Use EXACT data from snapshot to build robust selectors
5. If element not found here, it may not exist on the page


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
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
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
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: /Aniket/ }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});
```

---

