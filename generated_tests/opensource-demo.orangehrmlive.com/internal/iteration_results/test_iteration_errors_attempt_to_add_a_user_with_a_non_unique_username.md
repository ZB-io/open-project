## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
**Iteration**: 1/5
**Timestamp**: 2026-01-09 12:33:29
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
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


  100 |   // Captured selectors:
  101 |   //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
> 102 |   await page.getByRole('link', { name: 'Admin' }).click();
      |                                                   ^
  103 |   await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);
  104 |
  105 |   // Step 6: Click the 'Add' button to open the form for creating a new system user.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:102:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:102:51

Test Status: timedOut
Duration: 120222ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


  100 |   // Captured selectors:
  101 |   //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
> 102 |   await page.getByRole('link', { name: 'Admin' }).click();
      |                                                   ^
  103 |   await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);
  104 |
  105 |   // Step 6: Click the 'Add' button to open the form for creating a new system user.
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:102:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:102:51

Test Status: timedOut
Duration: 120222ms
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
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario tests the form validation on the 'Add User' page. It verifies that the system prevents the creation of a new user if the chosen username already exists, as per the user-provided test case.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "component": "Global Navigation",
      "description": "Load the OrangeHRM login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "input_text",
      "component": "Username Field",
      "description": "Enter the administrator's username to log in.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Username' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[name=\"username\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactUsername",
        "causes_navigation": false
      }
    },
    {
      "step_number": 3,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter the administrator's password to log in.",
      "input_value": "admin123",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"password\"][name=\"password\"]')",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[name=\"password\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactPassword",
        "causes_navigation": false
      }
    },
    {
      "step_number": 4,
      "action": "click",
      "component": "Login Button",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Page should navigate to the dashboard.",
      "business_impact": "Grants access to the application's features.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"validate\"]').getByRole('button', { name: 'Login' })",
          "confidence": 97
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('button[data-v-0af708be]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Login')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Login' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-login-button')",
          "confidence": 80
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickLogin",
        "causes_navigation": true
      }
    },
    {
      "step_number": 5,
      "action": "click",
      "component": "Left Navigation Menu",
      "description": "Click on the 'Admin' menu item to navigate to the user management section.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users view.",
      "business_impact": "Accesses the core user administration functionality.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 99
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
      "step_number": 6,
      "action": "click",
      "component": "Add User Button",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the Add User form.",
      "business_impact": "Initiates the user creation workflow.",
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
      "step_number": 7,
      "action": "click",
      "component": "User Role Dropdown",
      "description": "Click the 'User Role' dropdown to reveal the list of available roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "First step in assigning permissions to the new user.",
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
      "step_number": 8,
      "action": "click",
      "component": "User Role Dropdown Option",
      "description": "Select 'Admin' from the list of user roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrative privileges to the new user account.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickAdmin",
        "causes_navigation": false
      }
    },
    {
      "step_number": 9,
      "action": "input_text",
      "component": "Employee Name Input",
      "description": "Enter an employee name to associate with the new user account.",
      "input_value": "John Doe",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Links the system user to an employee record.",
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
      "step_number": 10,
      "action": "click",
      "component": "Status Dropdown",
      "description": "Click the 'Status' dropdown to reveal account status options.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Prepares to set the account's active state.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div/div[1]')",
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
      "step_number": 11,
      "action": "click",
      "component": "Status Dropdown Option",
      "description": "Select 'Enabled' from the status dropdown to make the account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickEnabled",
        "causes_navigation": false
      }
    },
    {
      "step_number": 12,
      "action": "input_text",
      "component": "Username Input",
      "description": "Enter 'Admin' into the username field, which is a known existing username.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "This is the key step to trigger the duplicate username validation.",
      "selector": "page.getByRole('textbox').nth(2)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
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
      "step_number": 13,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter a valid password for the new user.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
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
      "step_number": 14,
      "action": "input_text",
      "component": "Confirm Password",
      "description": "Confirm the password to ensure it was typed correctly.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(4)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
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
      "step_number": 15,
      "action": "click",
      "component": "Save Button",
      "description": "Click the 'Save' button to attempt to submit the new user form.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should not change, indicating a validation error occurred.",
      "business_impact": "Triggers the server-side validation for the form data.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
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
      "step_number": 16,
      "action": "verify_state",
      "component": "Add User Form",
      "description": "Verify that the form submission was blocked and the user remains on the 'Add User' page, confirming an error message was displayed.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The page URL remains '/admin/saveSystemUser', confirming the form was not successfully submitted.",
      "business_impact": "Confirms that the validation logic is working correctly.",
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
Total Visible Elements on Page: 59
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
    "tag": "input",
    "id": null,
    "classes": "oxd-input oxd-input--focus",
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
      "classes": null
    },
    "position": {
      "x": 301,
      "y": 373,
      "width": 422,
      "height": 45
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
    "type": "password",
    "href": null,
    "cursor": "text",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": null
    },
    "position": {
      "x": 301,
      "y": 459,
      "width": 422,
      "height": 45
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "oxd-button oxd-button--medium oxd-button--main orangehrm-login-button",
    "text": "Login",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "submit",
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-form-actions orangehrm-login-action"
    },
    "position": {
      "x": 301,
      "y": 536,
      "width": 422,
      "height": 46
    }
  },
  {
    "tag": "p",
    "id": null,
    "classes": "oxd-text oxd-text--p orangehrm-login-forgot-header",
    "text": "Forgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-forgot"
    },
    "position": {
      "x": 439,
      "y": 598,
      "width": 146,
      "height": 19
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.linkedin.com/company/orangehrm/mycompany/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-footer-sm"
    },
    "position": {
      "x": 20,
      "y": 682,
      "width": 22,
      "height": 22
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
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": null
    },
    "position": {
      "x": 20,
      "y": 682,
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
      "x": 20,
      "y": 682,
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
      "x": 20,
      "y": 682,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.facebook.com/OrangeHRM/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-footer-sm"
    },
    "position": {
      "x": 50,
      "y": 682,
      "width": 22,
      "height": 22
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
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": null
    },
    "position": {
      "x": 50,
      "y": 682,
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
      "x": 50,
      "y": 682,
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
      "x": 50,
      "y": 682,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://twitter.com/orangehrm?lang=en",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-footer-sm"
    },
    "position": {
      "x": 80,
      "y": 682,
      "width": 22,
      "height": 22
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
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": null
    },
    "position": {
      "x": 80,
      "y": 682,
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
      "x": 80,
      "y": 682,
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
      "x": 80,
      "y": 682,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://www.youtube.com/c/OrangeHRMInc",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-footer-sm"
    },
    "position": {
      "x": 110,
      "y": 682,
      "width": 22,
      "height": 22
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
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": null
    },
    "position": {
      "x": 110,
      "y": 682,
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
      "x": 110,
      "y": 682,
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
      "x": 110,
      "y": 682,
      "width": 22,
      "height": 22
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": null,
    "text": "OrangeHRM, Inc",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "http://www.orangehrm.com/",
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "p",
      "classes": "oxd-text oxd-text--p orangehrm-copyright"
    },
    "position": {
      "x": 453,
      "y": 643,
      "width": 96,
      "height": 18
    }
  },
  {
    "tag": "html",
    "id": null,
    "classes": null,
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "classes": null
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  },
  {
    "tag": "body",
    "id": null,
    "classes": null,
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "html",
      "classes": null
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  },
  {
    "tag": "div",
    "id": "app",
    "classes": null,
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "body",
      "classes": null
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-layout",
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "table",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": null
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-layout-blob",
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-layout"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 720
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-container",
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-layout-blob"
    },
    "position": {
      "x": 0,
      "y": 35,
      "width": 1024,
      "height": 649
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-slot-wrapper",
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-container"
    },
    "position": {
      "x": 0,
      "y": 35,
      "width": 1024,
      "height": 649
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-branding",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-slot-wrapper"
    },
    "position": {
      "x": 236,
      "y": 51,
      "width": 552,
      "height": 106
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
    "cursor": "auto",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-branding"
    },
    "position": {
      "x": 375,
      "y": 75,
      "width": 275,
      "height": 54
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-slot",
    "text": "Login\n\nUsername : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?\n\nOrange",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-slot-wrapper"
    },
    "position": {
      "x": 160,
      "y": 189,
      "width": 704,
      "height": 472
    }
  },
  {
    "tag": "h5",
    "id": null,
    "classes": "oxd-text oxd-text--h5 orangehrm-login-title",
    "text": "Login",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-slot"
    },
    "position": {
      "x": 160,
      "y": 189,
      "width": 704,
      "height": 34
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-form",
    "text": "Username : Admin\n\nPassword : admin123\n\nUsername\nPassword\nLogin\n\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-slot"
    },
    "position": {
      "x": 301,
      "y": 239,
      "width": 422,
      "height": 378
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "orangehrm-login-error",
    "text": "Username : Admin\n\nPassword : admin123",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-form"
    },
    "position": {
      "x": 301,
      "y": 239,
      "width": 422,
      "height": 94
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-sheet oxd-sheet--rounded oxd-sheet--gutters oxd-sheet--gray-lighten-2 orangehrm-demo-credentials",
    "text": "Username : Admin\n\nPassword : admin123",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-error"
    },
    "position": {
      "x": 301,
      "y": 239,
      "width": 422,
      "height": 94
    }
  },
  {
    "tag": "p",
    "id": null,
    "classes": "oxd-text oxd-text--p",
    "text": "Username : Admin",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sheet oxd-sheet--rounded oxd-sheet--gutters oxd-sheet--gray-lighten-2 orangehrm-demo-credentials"
    },
    "position": {
      "x": 326,
      "y": 264,
      "width": 372,
      "height": 22
    }
  },
  {
    "tag": "p",
    "id": null,
    "classes": "oxd-text oxd-text--p",
    "text": "Password : admin123",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-sheet oxd-sheet--rounded oxd-sheet--gutters oxd-sheet--gray-lighten-2 orangehrm-demo-credentials"
    },
    "position": {
      "x": 326,
      "y": 286,
      "width": 372,
      "height": 22
    }
  },
  {
    "tag": "form",
    "id": null,
    "classes": "oxd-form",
    "text": "Username\nPassword\nLogin\n\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "orangehrm-login-form"
    },
    "position": {
      "x": 301,
      "y": 349,
      "width": 422,
      "height": 268
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-form-row",
    "text": "Username",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "form",
      "classes": "oxd-form"
    },
    "position": {
      "x": 301,
      "y": 349,
      "width": 422,
      "height": 69
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-input-group oxd-input-field-bottom-space",
    "text": "Username",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-form-row"
    },
    "position": {
      "x": 301,
      "y": 349,
      "width": 422,
      "height": 69
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-input-group__label-wrapper",
    "text": "Username",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group oxd-input-field-bottom-space"
    },
    "position": {
      "x": 301,
      "y": 349,
      "width": 422,
      "height": 18
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-person oxd-input-group__label-icon",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group__label-wrapper"
    },
    "position": {
      "x": 301,
      "y": 349,
      "width": 16,
      "height": 18
    }
  },
  {
    "tag": "label",
    "id": null,
    "classes": "oxd-label",
    "text": "Username",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group__label-wrapper"
    },
    "position": {
      "x": 321,
      "y": 351,
      "width": 54,
      "height": 16
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group oxd-input-field-bottom-space"
    },
    "position": {
      "x": 301,
      "y": 373,
      "width": 422,
      "height": 45
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-form-row",
    "text": "Password",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "form",
      "classes": "oxd-form"
    },
    "position": {
      "x": 301,
      "y": 434,
      "width": 422,
      "height": 69
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-input-group oxd-input-field-bottom-space",
    "text": "Password",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-form-row"
    },
    "position": {
      "x": 301,
      "y": 434,
      "width": 422,
      "height": 69
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "oxd-input-group__label-wrapper",
    "text": "Password",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group oxd-input-field-bottom-space"
    },
    "position": {
      "x": 301,
      "y": 434,
      "width": 422,
      "height": 18
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "oxd-icon bi-key oxd-input-group__label-icon",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group__label-wrapper"
    },
    "position": {
      "x": 301,
      "y": 434,
      "width": 16,
      "height": 18
    }
  },
  {
    "tag": "label",
    "id": null,
    "classes": "oxd-label",
    "text": "Password",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group__label-wrapper"
    },
    "position": {
      "x": 321,
      "y": 436,
      "width": 54,
      "height": 16
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": null,
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "oxd-input-group oxd-input-field-bottom-space"
    },
    "position": {
      "x": 301,
      "y": 459,
      "width": 422,
      "height": 45
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
**Iteration**: 2/5
**Timestamp**: 2026-01-09 12:34:31
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --') resolved to 2 elements:
    1) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').first()
    2) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --') resolved to 2 elements:
    1) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').first()
    2) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --')[22m


  118 |   // Captured selectors:
  119 |   //   1. page.getByText('-- Select --').first() (confidence: 99%)
> 120 |   await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();
      |                                                                                                  ^
  121 |
  122 |   // Step 8: Select 'Admin' from the list of user roles.
  123 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:120:98
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:120:98

Test Status: failed
Duration: 28026ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --') resolved to 2 elements:
    1) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').first()
    2) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --')[22m


Detailed Errors:

Error 1:
Error: locator.click: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --') resolved to 2 elements:
    1) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').first()
    2) <div tabindex="0" data-v-67d2aedf="" class="oxd-select-text-input">-- Select --</div> aka getByText('-- Select --').nth(1)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --')[22m


  118 |   // Captured selectors:
  119 |   //   1. page.getByText('-- Select --').first() (confidence: 99%)
> 120 |   await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();
      |                                                                                                  ^
  121 |
  122 |   // Step 8: Select 'Admin' from the list of user roles.
  123 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:120:98
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:120:98

Test Status: failed
Duration: 28026ms
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
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario tests the form validation on the 'Add User' page. It verifies that the system prevents the creation of a new user if the chosen username already exists, as per the user-provided test case.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "component": "Global Navigation",
      "description": "Load the OrangeHRM login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "input_text",
      "component": "Username Field",
      "description": "Enter the administrator's username to log in.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Username' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[name=\"username\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactUsername",
        "causes_navigation": false
      }
    },
    {
      "step_number": 3,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter the administrator's password to log in.",
      "input_value": "admin123",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"password\"][name=\"password\"]')",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[name=\"password\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactPassword",
        "causes_navigation": false
      }
    },
    {
      "step_number": 4,
      "action": "click",
      "component": "Login Button",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Page should navigate to the dashboard.",
      "business_impact": "Grants access to the application's features.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"validate\"]').getByRole('button', { name: 'Login' })",
          "confidence": 97
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('button[data-v-0af708be]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Login')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Login' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-login-button')",
          "confidence": 80
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickLogin",
        "causes_navigation": true
      }
    },
    {
      "step_number": 5,
      "action": "click",
      "component": "Left Navigation Menu",
      "description": "Click on the 'Admin' menu item to navigate to the user management section.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users view.",
      "business_impact": "Accesses the core user administration functionality.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 99
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
      "step_number": 6,
      "action": "click",
      "component": "Add User Button",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the Add User form.",
      "business_impact": "Initiates the user creation workflow.",
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
      "step_number": 7,
      "action": "click",
      "component": "User Role Dropdown",
      "description": "Click the 'User Role' dropdown to reveal the list of available roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "First step in assigning permissions to the new user.",
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
      "step_number": 8,
      "action": "click",
      "component": "User Role Dropdown Option",
      "description": "Select 'Admin' from the list of user roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrative privileges to the new user account.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickAdmin",
        "causes_navigation": false
      }
    },
    {
      "step_number": 9,
      "action": "input_text",
      "component": "Employee Name Input",
      "description": "Enter an employee name to associate with the new user account.",
      "input_value": "John Doe",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Links the system user to an employee record.",
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
      "step_number": 10,
      "action": "click",
      "component": "Status Dropdown",
      "description": "Click the 'Status' dropdown to reveal account status options.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Prepares to set the account's active state.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div/div[1]')",
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
      "step_number": 11,
      "action": "click",
      "component": "Status Dropdown Option",
      "description": "Select 'Enabled' from the status dropdown to make the account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickEnabled",
        "causes_navigation": false
      }
    },
    {
      "step_number": 12,
      "action": "input_text",
      "component": "Username Input",
      "description": "Enter 'Admin' into the username field, which is a known existing username.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "This is the key step to trigger the duplicate username validation.",
      "selector": "page.getByRole('textbox').nth(2)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
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
      "step_number": 13,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter a valid password for the new user.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
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
      "step_number": 14,
      "action": "input_text",
      "component": "Confirm Password",
      "description": "Confirm the password to ensure it was typed correctly.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(4)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
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
      "step_number": 15,
      "action": "click",
      "component": "Save Button",
      "description": "Click the 'Save' button to attempt to submit the new user form.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should not change, indicating a validation error occurred.",
      "business_impact": "Triggers the server-side validation for the form data.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
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
      "step_number": 16,
      "action": "verify_state",
      "component": "Add User Form",
      "description": "Verify that the form submission was blocked and the user remains on the 'Add User' page, confirming an error message was displayed.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The page URL remains '/admin/saveSystemUser', confirming the form was not successfully submitted.",
      "business_impact": "Confirms that the validation logic is working correctly.",
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
**Iteration**: 3/5
**Timestamp**: 2026-01-09 12:35:57
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox') resolved to 2 elements:
    1) <input data-v-75e744cd="" placeholder="Type for hints..."/> aka getByRole('textbox', { name: 'Type for hints...' })
    2) <input data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(2)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox') resolved to 2 elements:
    1) <input data-v-75e744cd="" placeholder="Type for hints..."/> aka getByRole('textbox', { name: 'Type for hints...' })
    2) <input data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(2)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox')[22m


  147 |   // Captured selectors:
  148 |   //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
> 149 |   await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');
      |                                                                                            ^
  150 |
  151 |   // Step 13: Enter a valid password for the new user.
  152 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:149:92
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:149:92

Test Status: failed
Duration: 23852ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox') resolved to 2 elements:
    1) <input data-v-75e744cd="" placeholder="Type for hints..."/> aka getByRole('textbox', { name: 'Type for hints...' })
    2) <input data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(2)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox') resolved to 2 elements:
    1) <input data-v-75e744cd="" placeholder="Type for hints..."/> aka getByRole('textbox', { name: 'Type for hints...' })
    2) <input data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(2)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox')[22m


  147 |   // Captured selectors:
  148 |   //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
> 149 |   await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');
      |                                                                                            ^
  150 |
  151 |   // Step 13: Enter a valid password for the new user.
  152 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:149:92
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:149:92

Test Status: failed
Duration: 23852ms
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
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario tests the form validation on the 'Add User' page. It verifies that the system prevents the creation of a new user if the chosen username already exists, as per the user-provided test case.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "component": "Global Navigation",
      "description": "Load the OrangeHRM login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "input_text",
      "component": "Username Field",
      "description": "Enter the administrator's username to log in.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Username' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[name=\"username\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactUsername",
        "causes_navigation": false
      }
    },
    {
      "step_number": 3,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter the administrator's password to log in.",
      "input_value": "admin123",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"password\"][name=\"password\"]')",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[name=\"password\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactPassword",
        "causes_navigation": false
      }
    },
    {
      "step_number": 4,
      "action": "click",
      "component": "Login Button",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Page should navigate to the dashboard.",
      "business_impact": "Grants access to the application's features.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"validate\"]').getByRole('button', { name: 'Login' })",
          "confidence": 97
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('button[data-v-0af708be]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Login')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Login' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-login-button')",
          "confidence": 80
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickLogin",
        "causes_navigation": true
      }
    },
    {
      "step_number": 5,
      "action": "click",
      "component": "Left Navigation Menu",
      "description": "Click on the 'Admin' menu item to navigate to the user management section.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users view.",
      "business_impact": "Accesses the core user administration functionality.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 99
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
      "step_number": 6,
      "action": "click",
      "component": "Add User Button",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the Add User form.",
      "business_impact": "Initiates the user creation workflow.",
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
      "step_number": 7,
      "action": "click",
      "component": "User Role Dropdown",
      "description": "Click the 'User Role' dropdown to reveal the list of available roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "First step in assigning permissions to the new user.",
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
      "step_number": 8,
      "action": "click",
      "component": "User Role Dropdown Option",
      "description": "Select 'Admin' from the list of user roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrative privileges to the new user account.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickAdmin",
        "causes_navigation": false
      }
    },
    {
      "step_number": 9,
      "action": "input_text",
      "component": "Employee Name Input",
      "description": "Enter an employee name to associate with the new user account.",
      "input_value": "John Doe",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Links the system user to an employee record.",
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
      "step_number": 10,
      "action": "click",
      "component": "Status Dropdown",
      "description": "Click the 'Status' dropdown to reveal account status options.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Prepares to set the account's active state.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div/div[1]')",
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
      "step_number": 11,
      "action": "click",
      "component": "Status Dropdown Option",
      "description": "Select 'Enabled' from the status dropdown to make the account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickEnabled",
        "causes_navigation": false
      }
    },
    {
      "step_number": 12,
      "action": "input_text",
      "component": "Username Input",
      "description": "Enter 'Admin' into the username field, which is a known existing username.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "This is the key step to trigger the duplicate username validation.",
      "selector": "page.getByRole('textbox').nth(2)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
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
      "step_number": 13,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter a valid password for the new user.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
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
      "step_number": 14,
      "action": "input_text",
      "component": "Confirm Password",
      "description": "Confirm the password to ensure it was typed correctly.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(4)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
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
      "step_number": 15,
      "action": "click",
      "component": "Save Button",
      "description": "Click the 'Save' button to attempt to submit the new user form.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should not change, indicating a validation error occurred.",
      "business_impact": "Triggers the server-side validation for the form data.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
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
      "step_number": 16,
      "action": "verify_state",
      "component": "Add User Form",
      "description": "Verify that the form submission was blocked and the user remains on the 'Add User' page, confirming an error message was displayed.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The page URL remains '/admin/saveSystemUser', confirming the form was not successfully submitted.",
      "business_impact": "Confirms that the validation logic is working correctly.",
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').last().fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
**Iteration**: 4/5
**Timestamp**: 2026-01-09 12:37:14
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox')[22m


  152 |   // Captured selectors:
  153 |   //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
> 154 |   await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');
      |                                                                                                    ^
  155 |
  156 |   // Step 14: Confirm the password.
  157 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:154:100
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:154:100

Test Status: failed
Duration: 15567ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').last().fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
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
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox')[22m


Detailed Errors:

Error 1:
Error: locator.fill: Error: strict mode violation: locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox') resolved to 2 elements:
    1) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(3)
    2) <input type="password" data-v-1f99f73c="" autocomplete="off" class="oxd-input oxd-input--active"/> aka getByRole('textbox').nth(4)

Call log:
[2m  - waiting for locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox')[22m


  152 |   // Captured selectors:
  153 |   //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
> 154 |   await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');
      |                                                                                                    ^
  155 |
  156 |   // Step 14: Confirm the password.
  157 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:154:100
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js:154:100

Test Status: failed
Duration: 15567ms
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
**Test File:** attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "attempt_to_add_a_user_with_a_non-unique_username",
  "site_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
  "test_type": "error_validation",
  "description": "This scenario tests the form validation on the 'Add User' page. It verifies that the system prevents the creation of a new user if the chosen username already exists, as per the user-provided test case.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "component": "Global Navigation",
      "description": "Load the OrangeHRM login page to begin the test.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "Page URL should be the login page.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "input_text",
      "component": "Username Field",
      "description": "Enter the administrator's username to log in.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Username' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[name=\"username\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Username')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactUsername",
        "causes_navigation": false
      }
    },
    {
      "step_number": 3,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter the administrator's password to log in.",
      "input_value": "admin123",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      "verification_point": "",
      "business_impact": "Required step for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[data-v-1f99f73c]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"password\"][name=\"password\"]')",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[type=\"password\"]')",
          "confidence": 88
        },
        {
          "selector": "page.locator('input[name=\"password\"]')",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Password')",
          "confidence": 85
        },
        {
          "selector": "page.locator('input.oxd-input')",
          "confidence": 78
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "interact",
        "suggested_method_name": "interactPassword",
        "causes_navigation": false
      }
    },
    {
      "step_number": 4,
      "action": "click",
      "component": "Login Button",
      "description": "Click the 'Login' button to submit credentials and access the dashboard.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
      "verification_point": "Page should navigate to the dashboard.",
      "business_impact": "Grants access to the application's features.",
      "selector": "page.getByRole('button', { name: 'Login' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Login' })",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"validate\"]').getByRole('button', { name: 'Login' })",
          "confidence": 97
        },
        {
          "selector": "page.locator('button[data-v-10d463b7]')",
          "confidence": 90
        },
        {
          "selector": "page.locator('button[data-v-0af708be]')",
          "confidence": 90
        },
        {
          "selector": "page.getByText('Login')",
          "confidence": 88
        },
        {
          "selector": "page.locator('#app').getByRole('button', { name: 'Login' })",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.oxd-button.orangehrm-login-button')",
          "confidence": 80
        },
        {
          "selector": "page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button')",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/auth/login",
        "suggested_page_class": "LoginPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickLogin",
        "causes_navigation": true
      }
    },
    {
      "step_number": 5,
      "action": "click",
      "component": "Left Navigation Menu",
      "description": "Click on the 'Admin' menu item to navigate to the user management section.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers",
      "verification_point": "Page should navigate to the System Users view.",
      "business_impact": "Accesses the core user administration functionality.",
      "selector": "page.getByRole('link', { name: 'Admin' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Admin' })",
          "confidence": 99
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
      "step_number": 6,
      "action": "click",
      "component": "Add User Button",
      "description": "Click the 'Add' button to open the form for creating a new system user.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page should navigate to the Add User form.",
      "business_impact": "Initiates the user creation workflow.",
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
      "step_number": 7,
      "action": "click",
      "component": "User Role Dropdown",
      "description": "Click the 'User Role' dropdown to reveal the list of available roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "First step in assigning permissions to the new user.",
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
      "step_number": 8,
      "action": "click",
      "component": "User Role Dropdown Option",
      "description": "Select 'Admin' from the list of user roles.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Assigns administrative privileges to the new user account.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickAdmin",
        "causes_navigation": false
      }
    },
    {
      "step_number": 9,
      "action": "input_text",
      "component": "Employee Name Input",
      "description": "Enter an employee name to associate with the new user account.",
      "input_value": "John Doe",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Links the system user to an employee record.",
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
      "step_number": 10,
      "action": "click",
      "component": "Status Dropdown",
      "description": "Click the 'Status' dropdown to reveal account status options.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Prepares to set the account's active state.",
      "selector": "page.getByText('-- Select --')",
      "all_selectors": [
        {
          "selector": "page.getByText('-- Select --')",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[3]/div/div[2]/div/div/div[1]')",
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
      "step_number": 11,
      "action": "click",
      "component": "Status Dropdown Option",
      "description": "Select 'Enabled' from the status dropdown to make the account active upon creation.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Ensures the new user can log in immediately after creation.",
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
      "based_on_interaction": true,
      "page_context": {
        "page_title": "OrangeHRM",
        "page_url_pattern": "/web/index.php/admin/saveSystemUser",
        "suggested_page_class": "SavesystemuserPage"
      },
      "method_context": {
        "action_type": "click",
        "suggested_method_name": "clickEnabled",
        "causes_navigation": false
      }
    },
    {
      "step_number": 12,
      "action": "input_text",
      "component": "Username Input",
      "description": "Enter 'Admin' into the username field, which is a known existing username.",
      "input_value": "Admin",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "This is the key step to trigger the duplicate username validation.",
      "selector": "page.getByRole('textbox').nth(2)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input')",
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
      "step_number": 13,
      "action": "input_text",
      "component": "Password Field",
      "description": "Enter a valid password for the new user.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(3)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[1]/div/div[2]/input')",
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
      "step_number": 14,
      "action": "input_text",
      "component": "Confirm Password",
      "description": "Confirm the password to ensure it was typed correctly.",
      "input_value": "Password123!",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "",
      "business_impact": "Completes the required credential fields for user creation.",
      "selector": "page.getByRole('textbox').nth(4)",
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[2]/div/div[2]/div/div[2]/input')",
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
      "step_number": 15,
      "action": "click",
      "component": "Save Button",
      "description": "Click the 'Save' button to attempt to submit the new user form.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "Page URL should not change, indicating a validation error occurred.",
      "business_impact": "Triggers the server-side validation for the form data.",
      "selector": "page.getByRole('button', { name: 'Save' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Save' })",
          "confidence": 99
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
          "selector": "page.locator('xpath=html/body/div[1]/div[1]/div[2]/div[2]/div/div/form/div[3]/button[2]')",
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
      "step_number": 16,
      "action": "verify_state",
      "component": "Add User Form",
      "description": "Verify that the form submission was blocked and the user remains on the 'Add User' page, confirming an error message was displayed.",
      "expected_page_url": "https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser",
      "verification_point": "The page URL remains '/admin/saveSystemUser', confirming the form was not successfully submitted.",
      "business_impact": "Confirms that the validation logic is working correctly.",
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').last().fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser
Total Visible Elements on Page: 220
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
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
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
    } catch (e) {}
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').last().fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').first().fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
**Iteration**: 1/5
**Timestamp**: 2026-01-09 12:38:28
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30154ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30154ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username

**FILE: ./pom/DashboardPage.js**
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```

**FILE: ./pom/BasePage.js**
```javascript
/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * It provides methods for navigation, waiting for page loads, and retrieving page titles.
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
   * Waits for the page to be in the 'networkidle' state.
   * This is useful to ensure all dynamic content has loaded.
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
}

export { BasePage };
```

**FILE: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js (TEST SPEC)**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
🗺️ PROJECT MAP (File Explorer)
═══════════════════════════════════════════════════════════════
This map shows available files in the project. Use it to check for correct import paths or available utilities.

  📄 attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
  📄 attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
  📄 playwright.config.js
  📁 utils/
    📄 otp.js
  📁 pom/
    📄 BasePage.js
    📄 DashboardPage.js
    📄 LoginPage.js
    📄 SaveSystemUserPage.js
    📄 ViewSystemUsersPage.js

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
An analysis of the error log indicates the test timed out while trying to click the 'Admin' link on the dashboard. The specific error, `waiting for getByRole('link', { name: 'Admin' })`, points to a problem with the selector defined in the `DashboardPage.js` Page Object Model file.

The `getByRole` locator with the name 'Admin' is likely too generic or is failing because the accessible name of the link is not being correctly identified. This is a common issue in complex web applications where elements are nested.

The fix is to replace this locator with a more robust and specific one. Based on the alternative selectors provided in the code comments, which are common for this application's structure, using an XPath that finds a link containing a span with the text 'Admin' is a reliable solution. This change is confined to the POM file, as the error lies in the element's implementation, not the test's logic.

<file path="./pom/DashboardPage.js">
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('xpath=//a[.//span[text()="Admin"]]');
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```
</file>
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
**Iteration**: 2/5
**Timestamp**: 2026-01-09 12:39:15
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for locator('//a[.//span[text()="Admin"]]')[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30123ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for locator('//a[.//span[text()="Admin"]]')[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30123ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username

**FILE: ./pom/DashboardPage.js**
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('xpath=//a[.//span[text()="Admin"]]');
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```

**FILE: ./pom/BasePage.js**
```javascript
/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * It provides methods for navigation, waiting for page loads, and retrieving page titles.
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
   * Waits for the page to be in the 'networkidle' state.
   * This is useful to ensure all dynamic content has loaded.
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
}

export { BasePage };
```

**FILE: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js (TEST SPEC)**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
🗺️ PROJECT MAP (File Explorer)
═══════════════════════════════════════════════════════════════
This map shows available files in the project. Use it to check for correct import paths or available utilities.

  📄 attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
  📄 attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
  📄 playwright.config.js
  📁 utils/
    📄 otp.js
  📁 pom/
    📄 BasePage.js
    📄 DashboardPage.js
    📄 LoginPage.js
    📄 SaveSystemUserPage.js
    📄 ViewSystemUsersPage.js

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
The error originates in the **POM File**.

The test timed out while waiting for the locator `//a[.//span[text()="Admin"]]` to become available. This indicates that the selector for the 'Admin' link in `DashboardPage.js` is incorrect or no longer valid for the current state of the application's UI.

The fix is to replace the failing XPath selector with a more robust, user-facing selector recommended by Playwright. The code comments in the POM file itself provide an excellent alternative: `page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })`. This selector is more resilient to minor UI changes as it relies on accessibility roles and visible text.

<file path="./pom/DashboardPage.js">
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```
</file>
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
**Iteration**: 3/5
**Timestamp**: 2026-01-09 12:40:04
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for locator('[role="navigation"]').getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30126ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for locator('[role="navigation"]').getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30126ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username

**FILE: ./pom/DashboardPage.js**
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```

**FILE: ./pom/BasePage.js**
```javascript
/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * It provides methods for navigation, waiting for page loads, and retrieving page titles.
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
   * Waits for the page to be in the 'networkidle' state.
   * This is useful to ensure all dynamic content has loaded.
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
}

export { BasePage };
```

**FILE: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js (TEST SPEC)**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
🗺️ PROJECT MAP (File Explorer)
═══════════════════════════════════════════════════════════════
This map shows available files in the project. Use it to check for correct import paths or available utilities.

  📄 attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
  📄 attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
  📄 playwright.config.js
  📁 utils/
    📄 otp.js
  📁 pom/
    📄 BasePage.js
    📄 DashboardPage.js
    📄 LoginPage.js
    📄 SaveSystemUserPage.js
    📄 ViewSystemUsersPage.js

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
An analysis of the error log indicates the test is timing out while trying to click the 'Admin' link on the dashboard. The error originates in the `DashboardPage.js` Page Object Model, specifically with the selector for `this.adminLink`.

The current selector, `page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })`, is too restrictive. It assumes the 'Admin' link is a direct child of an element with `role="navigation"`. This can fail if the page structure changes slightly.

The fix is to simplify the selector to be more direct and robust, relying on Playwright's powerful `getByRole` locator without the chained parent selector. This directly targets the link by its accessible name, which is less prone to breaking.

<file path="./pom/DashboardPage.js">
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```
</file>
```

---

## Test: attempt_to_add_a_user_with_a_non-unique_username
**File**: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
**Iteration**: 4/5
**Timestamp**: 2026-01-09 12:40:52
**Status**: FAILED

### Error Details
```
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30132ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
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
Test: Attempt to Add a User with a Non-Unique Username
======================================================================
Main Error:
[31mTest timeout of 30000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 30000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Admin' })[22m


   at pom/DashboardPage.js:34

  32 |    */
  33 |   async navigateToAdminPage() {
> 34 |     await this.adminLink.click();
     |                          ^
  35 |     const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
  36 |     return new ViewSystemUsersPage(this.page);
  37 |   }
    at DashboardPage.navigateToAdminPage (/var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26)
    at /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js:43:51
  Location: /var/tmp/Roost/RoostGPT/orange-hrm-demo_clone/9df4302e-860f-4d20-a683-fb98f0c882ee/source/open-project/generated_tests/opensource-demo.orangehrmlive.com/playwright_tests/tests/pom/DashboardPage.js:34:26

Test Status: timedOut
Duration: 30132ms
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

**Test Name:** attempt_to_add_a_user_with_a_non-unique_username

**FILE: ./pom/DashboardPage.js**
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.getByRole('link', { name: 'Admin' });
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```

**FILE: ./pom/BasePage.js**
```javascript
/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * It provides methods for navigation, waiting for page loads, and retrieving page titles.
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
   * Waits for the page to be in the 'networkidle' state.
   * This is useful to ensure all dynamic content has loaded.
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
}

export { BasePage };
```

**FILE: attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js (TEST SPEC)**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import fs from 'fs';
import path from 'path';

// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
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
    } catch (e) {}
  }
});

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
🗺️ PROJECT MAP (File Explorer)
═══════════════════════════════════════════════════════════════
This map shows available files in the project. Use it to check for correct import paths or available utilities.

  📄 attempt_to_add_a_user_with_a_non_unique_username.noauth.spec.js
  📄 attempt_to_add_a_user_with_a_non_unique_username_pom.noauth.spec.js
  📄 playwright.config.js
  📁 utils/
    📄 otp.js
  📁 pom/
    📄 BasePage.js
    📄 DashboardPage.js
    📄 LoginPage.js
    📄 SaveSystemUserPage.js
    📄 ViewSystemUsersPage.js

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
This is a classic selector issue. The test is timing out because it cannot find the 'Admin' link using `page.getByRole('link', { name: 'Admin' })`. This often happens when the link's text is inside a child element (like a `<span>`), which can affect how the accessible name is calculated.

The error originates in the **POM File** (`./pom/DashboardPage.js`) where the failing selector is defined.

To fix this, I will replace the brittle `getByRole` selector with a more robust one that specifically targets the link containing the text "Admin", as suggested by the alternative selectors in the code comments. The XPath selector is the most precise for this structure.

<file path="./pom/DashboardPage.js">
```javascript
import { BasePage } from './BasePage.js';

/**
 * @class DashboardPage
 * @description Represents the main Dashboard page after a successful login.
 * It provides access to the main navigation elements, such as the Admin panel.
 */
class DashboardPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Dashboard page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the 'Admin' link in the main navigation menu.
     * Alternative selectors:
     * - page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' })
     * - page.locator('a').filter({ hasText: /^Admin$/ })
     * - page.locator('xpath=//a[.//span[text()="Admin"]]')
     */
    this.adminLink = page.locator('xpath=//a[.//span[text()="Admin"]]');
  }

  /**
   * Clicks the 'Admin' link to navigate to the user management page.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} A new instance of the ViewSystemUsersPage.
   */
  async navigateToAdminPage() {
    await this.adminLink.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }
}

export { DashboardPage };
```
</file>
```

---

