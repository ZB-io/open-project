## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 1/3
**Timestamp**: 2025-12-12 08:21:21
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('.oxd-select-wrapper').first()
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper')

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('.oxd-select-wrapper').first()
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper')

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper')[22m


  90 |   // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  91 |   // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
> 92 |   await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').click();
     |                                                                                                       ^
  93 |
  94 |   // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  95 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:92:103
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:92:103

Test Status: failed
Duration: 9233ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
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
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('.oxd-select-wrapper').first()
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper')

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('.oxd-select-wrapper').first()
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper')

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper')[22m


  90 |   // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  91 |   // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
> 92 |   await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').click();
     |                                                                                                       ^
  93 |
  94 |   // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  95 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:92:103
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:92:103

Test Status: failed
Duration: 9233ms
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
  "test_type": "e2e_business_workflow",
  "description": "This scenario tests the system's validation logic by attempting to create a new user with a username that already exists ('Admin'). It verifies that the system correctly prevents the duplicate entry and displays an appropriate error message to the administrator.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website login page",
      "description": "Load the website's login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "input_text",
      "description": "Enter the username 'Admin' into the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "User authentication is the first step for accessing secure areas.",
      "selector": "page.getByPlaceholder('Username')",
      "input_value": "Admin",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 95,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 90,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 3,
      "action": "input_text",
      "description": "Enter the password into the password field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Completes the credential entry for authentication.",
      "selector": "page.getByPlaceholder('Password')",
      "input_value": "admin123",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 95,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 90,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Successful login should redirect to the main dashboard.",
      "business_impact": "Grants access to the application's core functionality.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Navigate to the 'Admin' section by clicking the link in the main navigation menu.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users management view.",
      "business_impact": "Accesses the user management module.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add' button to initiate the new user creation workflow.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the 'Add User' form.",
      "business_impact": "Starts the process of adding a new user to the system.",
      "selector": "page.getByRole('button', { name: 'Add' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Add' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Open the 'User Role' dropdown menu to select a role for the new user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Allows assignment of permissions and access levels.",
      "selector": "page.locator('div.oxd-select-text-input') >> nth=0",
      "all_selectors": [
        {
          "selector": "page.locator('div.oxd-select-text-input') >> nth=0",
          "confidence": 78,
          "strategy": "css_stable_class",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div/div[1]')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 78,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Select 'Admin' from the 'User Role' dropdown list.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrator privileges to the new user account.",
      "selector": "page.getByRole('option', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Open the 'Status' dropdown menu to set the user's account status.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Determines if the user account will be active upon creation.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 88,
          "strategy": "text",
          "is_unique": true
        },
        {
          "selector": "page.getByText('Select')",
          "confidence": 80,
          "strategy": "text_phrase",
          "is_unique": true
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Select 'Enabled' from the 'Status' dropdown list.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
      "selector": "page.getByRole('option', { name: 'Enabled' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Enabled' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "input_text",
      "description": "Enter 'manda user' into the 'Employee Name' field to search for an employee.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Associates the system user account with an employee record.",
      "selector": "page.getByPlaceholder('Type for hints...')",
      "input_value": "manda user",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Type for hints...')",
          "confidence": 85,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.locator('input[data-v-75e744cd]')",
          "confidence": 90,
          "strategy": "data_attr_v-75e744cd_presence",
          "is_unique": true
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 90,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Select 'manda akhil user' from the autocomplete suggestions.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Confirms the link between the user account and the employee profile.",
      "selector": "page.getByRole('option', { name: 'manda akhil user' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'manda akhil user' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "input_text",
      "description": "Enter the non-unique username 'Admin' into the 'Username' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Triggers the system's duplicate username validation.",
      "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
      "input_value": "Admin",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        },
        {
          "selector": "page.locator('input.oxd-input--active') >> nth=1",
          "confidence": 74,
          "strategy": "css_tag_semantic_empty",
          "is_unique": false
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "input_text",
      "description": "Enter a password in the 'Password' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Sets the initial password for the user account.",
      "selector": "page.locator('input[type=\"password\"]') >> nth=0",
      "input_value": "S3cureP@ssw0rd!",
      "all_selectors": [
        {
          "selector": "page.locator('input[type=\"password\"]') >> nth=0",
          "confidence": 88,
          "strategy": "input_type",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 15,
      "action": "input_text",
      "description": "Confirm the password in the 'Confirm Password' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Verifies the password was typed correctly.",
      "selector": "page.locator('input[type=\"password\"]') >> nth=1",
      "input_value": "S3cureP@ssw0rd!",
      "all_selectors": [
        {
          "selector": "page.locator('input[type=\"password\"]') >> nth=1",
          "confidence": 88,
          "strategy": "input_type",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 16,
      "action": "click",
      "description": "Click the 'Save' button to attempt to create the new user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Submits the form for processing and validation.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        },
        {
          "selector": "page.getByText('Save')",
          "confidence": 88,
          "strategy": "text",
          "is_unique": true
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-left-space')",
          "confidence": 80,
          "strategy": "css_combined_classes",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 17,
      "action": "verify_text",
      "description": "Verify that the error message 'Username already exists' is displayed on the page.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The text 'Username already exists' should be visible.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Username already exists')",
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

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 235
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

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').first().click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js
**Iteration**: 2/3
**Timestamp**: 2025-12-12 08:22:09
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^Admin$/ }).nth(2)
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^-- Select --$/ }).nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^Admin$/ }).nth(2)
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^-- Select --$/ }).nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper')[22m


   99 |   // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  100 |   // Using a more robust selector that finds the dropdown associated with the 'Status' label.
> 101 |   await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();
      |                                                                                                    ^
  102 |
  103 |   // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  104 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:101:100
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:101:100

Test Status: failed
Duration: 9777ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').first().click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
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
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^Admin$/ }).nth(2)
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^-- Select --$/ }).nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper') resolved to 2 elements:
    1) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^Admin$/ }).nth(2)
    2) <div data-v-13cf171c="" class="oxd-select-wrapper">…</div> aka locator('div').filter({ hasText: /^-- Select --$/ }).nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper')[22m


   99 |   // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  100 |   // Using a more robust selector that finds the dropdown associated with the 'Status' label.
> 101 |   await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();
      |                                                                                                    ^
  102 |
  103 |   // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  104 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:101:100
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo/2b3fcfa5-2d06-4e71-8ca0-e33b0745d88a/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.auth.spec.js:101:100

Test Status: failed
Duration: 9777ms
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
  "test_type": "e2e_business_workflow",
  "description": "This scenario tests the system's validation logic by attempting to create a new user with a username that already exists ('Admin'). It verifies that the system correctly prevents the duplicate entry and displays an appropriate error message to the administrator.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website login page",
      "description": "Load the website's login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "input_text",
      "description": "Enter the username 'Admin' into the username field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "User authentication is the first step for accessing secure areas.",
      "selector": "page.getByPlaceholder('Username')",
      "input_value": "Admin",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 95,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 90,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 3,
      "action": "input_text",
      "description": "Enter the password into the password field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Completes the credential entry for authentication.",
      "selector": "page.getByPlaceholder('Password')",
      "input_value": "admin123",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 95,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 90,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 4,
      "action": "click",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Successful login should redirect to the main dashboard.",
      "business_impact": "Grants access to the application's core functionality.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": false
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Navigate to the 'Admin' section by clicking the link in the main navigation menu.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users management view.",
      "business_impact": "Accesses the user management module.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add' button to initiate the new user creation workflow.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the 'Add User' form.",
      "business_impact": "Starts the process of adding a new user to the system.",
      "selector": "page.getByRole('button', { name: 'Add' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Add' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Open the 'User Role' dropdown menu to select a role for the new user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Allows assignment of permissions and access levels.",
      "selector": "page.locator('div.oxd-select-text-input') >> nth=0",
      "all_selectors": [
        {
          "selector": "page.locator('div.oxd-select-text-input') >> nth=0",
          "confidence": 78,
          "strategy": "css_stable_class",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[1]/div/div[2]/div/div/div[1]')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 78,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Select 'Admin' from the 'User Role' dropdown list.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrator privileges to the new user account.",
      "selector": "page.getByRole('option', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Admin' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Open the 'Status' dropdown menu to set the user's account status.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Determines if the user account will be active upon creation.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 88,
          "strategy": "text",
          "is_unique": true
        },
        {
          "selector": "page.getByText('Select')",
          "confidence": 80,
          "strategy": "text_phrase",
          "is_unique": true
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "click",
      "description": "Select 'Enabled' from the 'Status' dropdown list.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
      "selector": "page.getByRole('option', { name: 'Enabled' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'Enabled' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "input_text",
      "description": "Enter 'manda user' into the 'Employee Name' field to search for an employee.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Associates the system user account with an employee record.",
      "selector": "page.getByPlaceholder('Type for hints...')",
      "input_value": "manda user",
      "all_selectors": [
        {
          "selector": "page.getByPlaceholder('Type for hints...')",
          "confidence": 85,
          "strategy": "placeholder",
          "is_unique": true
        },
        {
          "selector": "page.locator('input[data-v-75e744cd]')",
          "confidence": 90,
          "strategy": "data_attr_v-75e744cd_presence",
          "is_unique": true
        },
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[2]/div/div[2]/div/div/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 90,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Select 'manda akhil user' from the autocomplete suggestions.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Confirms the link between the user account and the employee profile.",
      "selector": "page.getByRole('option', { name: 'manda akhil user' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('option', { name: 'manda akhil user' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "input_text",
      "description": "Enter the non-unique username 'Admin' into the 'Username' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Triggers the system's duplicate username validation.",
      "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
      "input_value": "Admin",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        },
        {
          "selector": "page.locator('input.oxd-input--active') >> nth=1",
          "confidence": 74,
          "strategy": "css_tag_semantic_empty",
          "is_unique": false
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "input_text",
      "description": "Enter a password in the 'Password' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Sets the initial password for the user account.",
      "selector": "page.locator('input[type=\"password\"]') >> nth=0",
      "input_value": "S3cureP@ssw0rd!",
      "all_selectors": [
        {
          "selector": "page.locator('input[type=\"password\"]') >> nth=0",
          "confidence": 88,
          "strategy": "input_type",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 15,
      "action": "input_text",
      "description": "Confirm the password in the 'Confirm Password' field.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Verifies the password was typed correctly.",
      "selector": "page.locator('input[type=\"password\"]') >> nth=1",
      "input_value": "S3cureP@ssw0rd!",
      "all_selectors": [
        {
          "selector": "page.locator('input[type=\"password\"]') >> nth=1",
          "confidence": 88,
          "strategy": "input_type",
          "is_unique": false
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
          "confidence": 50,
          "strategy": "xpath",
          "is_unique": true
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 16,
      "action": "click",
      "description": "Click the 'Save' button to attempt to create the new user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Submits the form for processing and validation.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 95,
          "strategy": "role_name",
          "is_unique": true
        },
        {
          "selector": "page.getByText('Save')",
          "confidence": 88,
          "strategy": "text",
          "is_unique": true
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-left-space')",
          "confidence": 80,
          "strategy": "css_combined_classes",
          "is_unique": true
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 17,
      "action": "verify_text",
      "description": "Verify that the error message 'Username already exists' is displayed on the page.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The text 'Username already exists' should be visible.",
      "business_impact": "Confirms that the validation is working correctly and providing clear user feedback.",
      "selector": "page.getByText('Username already exists')",
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

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').first().click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 235
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

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
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
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').first().click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').first().click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});
```

---

