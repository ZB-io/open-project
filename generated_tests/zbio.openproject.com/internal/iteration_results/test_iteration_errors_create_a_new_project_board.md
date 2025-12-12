## Test: create_a_new_project_board
**File**: create_a_new_project_board.auth.spec.js
**Iteration**: 1/3
**Timestamp**: 2025-12-12 15:58:32
**Status**: FAILED

### Error Details
```
Test: Create a new project board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project" until "load"
============================================================

  79 |   // Authentication is handled by storage state, so we navigate directly to the starting URL.
  80 |   await page.goto(BASE_URL || BASE_HOST_URL);
> 81 |   await page.waitForURL(BASE_URL || BASE_HOST_URL);
     |              ^
  82 |   await page.waitForLoadState('networkidle');
  83 |
  84 |   // Step 7: Navigate to the Boards section using the main sidebar menu.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:81:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:81:14

Test Status: timedOut
Duration: 120149ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
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
Test: Create a new project board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project" until "load"
============================================================

  79 |   // Authentication is handled by storage state, so we navigate directly to the starting URL.
  80 |   await page.goto(BASE_URL || BASE_HOST_URL);
> 81 |   await page.waitForURL(BASE_URL || BASE_HOST_URL);
     |              ^
  82 |   await page.waitForLoadState('networkidle');
  83 |
  84 |   // Step 7: Navigate to the Boards section using the main sidebar menu.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:81:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:81:14

Test Status: timedOut
Duration: 120149ms
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

**Test Name:** create_a_new_project_board
**Test File:** create_a_new_project_board.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "create_a_new_project_board",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This scenario covers the end-to-end process of a user logging in, navigating to the boards section, and successfully creating a new board for a project. It includes handling the mandatory project selection step that was discovered during exploration.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the project's main page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project homepage.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Click the user avatar button to open the user menu for logging out.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "User menu opens.",
      "business_impact": "Initiates the user authentication flow.",
      "selector": "page.getByRole('button', { name: 'HA', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'HA', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: 'HA' })",
          "strategy": "role_name",
          "confidence": 85
        },
        {
          "selector": "page.locator('button[data-show-dialog-id=\"dialog-75b98a33-4590-499a-afb6-4ffdd844f1fe\"]')",
          "strategy": "data_attr_show-dialog-id",
          "confidence": 85
        },
        {
          "selector": "page.locator('#dialog-show-dialog-75b98a33-4590-499a-afb6-4ffdd844f1fe')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Sign out' link to log out the current user and navigate to the login page.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "verification_point": "Page navigates to the login screen.",
      "business_impact": "Prepares the application for authentication with the test user.",
      "selector": "page.getByRole('link', { name: 'Sign out' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Sign out' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Sign out/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Sign out')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#item-7f9aa436-c9d6-420a-9c04-c21cc0021dac')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter the username for the default test user.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "input_value": "<UI_SITE_USERNAME>",
      "verification_point": "Username field is populated.",
      "business_impact": "Part of the critical user authentication process.",
      "selector": "page.getByRole('textbox', { name: 'Username*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Username')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#username')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the password for the default test user.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "input_value": "<UI_SITE_PASSWORD>",
      "verification_point": "Password field is populated.",
      "business_impact": "Completes the credential entry for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Password')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#password')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Sign in' button to submit credentials and log in.",
      "expected_page_url": "https://zbio.openproject.com/",
      "verification_point": "User is redirected to the main project page after successful login.",
      "business_impact": "Grants user access to the application's features.",
      "selector": "page.locator('#login-form').getByRole('button', { name: 'Sign in' })",
      "all_selectors": [
        {
          "selector": "page.locator('#login-form').getByRole('button', { name: 'Sign in' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: /Sign in/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('input[type=\"submit\"]')",
          "strategy": "input_type",
          "confidence": 88
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Navigate to the Boards section using the main sidebar menu.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "verification_point": "Page navigates to the main Boards list view.",
      "business_impact": "Allows user to access the board management feature.",
      "selector": "page.getByRole('link', { name: 'Boards', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.boards-menu-item')",
          "strategy": "css_stable_class",
          "confidence": 78
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Click the 'Create new board' button to start the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/boards/new",
      "verification_point": "Page navigates to the new board creation form.",
      "business_impact": "Initiates the primary workflow for creating a new board.",
      "selector": "page.getByRole('link', { name: 'Create new board' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Create new board' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Enter the name 'Automated board 1' into the title field for the new board.",
      "expected_page_url": "https://zbio.openproject.com/boards/new",
      "input_value": "Automated board 1",
      "verification_point": "Title field is populated with the board name.",
      "business_impact": "Defines the identity of the new board.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "input_text",
      "description": "Enter 'demo-project' into the project search field to associate the board with a project.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "input_value": "demo-project",
      "verification_point": "Project search field is populated.",
      "business_impact": "Fulfills a mandatory requirement for board creation.",
      "selector": "page.getByRole('combobox', { name: 'Search', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('combobox', { name: 'Search', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form#board-form').getByRole('combobox', { name: 'Search' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.locator('#project_id').getByRole('combobox', { name: 'Search' })",
          "strategy": "parent_id_role",
          "confidence": 82
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Select the 'Demo project' from the populated dropdown list.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "verification_point": "Project is selected in the form.",
      "business_impact": "Confirms the project association for the new board.",
      "selector": "page.locator('div.ng-option-label')",
      "all_selectors": [
        {
          "selector": "page.locator('div.ng-option-label')",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        }
      ],
      "confidence": 84,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Click the 'Create' button to submit the form and create the new board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/123",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Finalizes the board creation workflow.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Return to the main Boards page to verify the new board is listed.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the Boards list.",
      "business_impact": "Completes the user flow and allows for verification of the created asset.",
      "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "role_name",
          "confidence": 85
        },
        {
          "selector": "page.getByText('Boards')",
          "strategy": "text",
          "confidence": 78
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    }
  ]
}
```

**Current Test Code:**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/login?back_url=https%3A%2F%2Fzbio.openproject.com%2Fprojects%2Fdemo-project
Total Visible Elements on Page: 68
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
    "id": "skip-navigation--content",
    "classes": "sr-only skip-navigation-link",
    "text": "Jump to content",
    "value": null,
    "role": null,
    "ariaLabel": "Click here to skip over the menu and go to the content",
    "type": null,
    "href": "https://zbio.openproject.com/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-9c80f9cf-82c9-46c3-8cc6-d91785b5b128",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "ul",
      "classes": "op-app-menu op-app-menu_drop-left"
    },
    "position": {
      "x": 4,
      "y": 12,
      "width": 32,
      "height": 32
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button"
    },
    "position": {
      "x": 12,
      "y": 20,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 13,
      "y": 21,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "op-logo--link",
    "text": "Home",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-logo"
    },
    "position": {
      "x": 44,
      "y": 16,
      "width": 130,
      "height": 24
    }
  },
  {
    "tag": "button",
    "id": "top-menu-search-button",
    "classes": "top-menu-search--button search-form-normal",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Search",
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "top-menu-search"
    },
    "position": {
      "x": 473,
      "y": 0,
      "width": 30,
      "height": 55
    }
  },
  {
    "tag": "op-icon",
    "id": null,
    "classes": "op-icon--wrapper",
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
      "tag": "button",
      "classes": "top-menu-search--button search-form-normal"
    },
    "position": {
      "x": 473,
      "y": 19,
      "width": 30,
      "height": 16
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "icon5 icon-search ellipsis",
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
      "tag": "op-icon",
      "classes": "op-icon--wrapper"
    },
    "position": {
      "x": 473,
      "y": 19,
      "width": 30,
      "height": 16
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "global-search--input",
    "text": "",
    "value": null,
    "role": "combobox",
    "ariaLabel": "Search in zbio.openproject.com",
    "type": "text",
    "href": null,
    "cursor": "default",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "ng-input"
    },
    "position": {
      "x": 482,
      "y": 18,
      "width": 276,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "op-app-header--help-menu-button",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button hidden-for-mobile",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "action-menu",
      "classes": "op-app-menu--item pl-1"
    },
    "position": {
      "x": 1145,
      "y": 12,
      "width": 32,
      "height": 32
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button hidden-for-mobile"
    },
    "position": {
      "x": 1153,
      "y": 20,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 1153,
      "y": 20,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-1275f0b9-8760-4158-a229-d02713309128",
    "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button px-1",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-header--end"
    },
    "position": {
      "x": 1189,
      "y": 12,
      "width": 77,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button px-1"
    },
    "position": {
      "x": 1194,
      "y": 18,
      "width": 67,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-content"
    },
    "position": {
      "x": 1194,
      "y": 18,
      "width": 43,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-visual Button-trailingVisual",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-content"
    },
    "position": {
      "x": 1245,
      "y": 19,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "tag": "span",
      "classes": "Button-visual Button-trailingVisual"
    },
    "position": {
      "x": 1245,
      "y": 19,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 1249,
      "y": 26,
      "width": 7,
      "height": 4
    }
  },
  {
    "tag": "input",
    "id": "username",
    "classes": "form--text-field",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "form--text-field-container"
    },
    "position": {
      "x": 562,
      "y": 224,
      "width": 313,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": "password",
    "classes": "form--text-field -password",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "password",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "form--text-field-container"
    },
    "position": {
      "x": 562,
      "y": 273,
      "width": 313,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "button -primary button_no-margin",
    "text": "",
    "value": "Sign in",
    "role": null,
    "ariaLabel": null,
    "type": "submit",
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "login-form--footer"
    },
    "position": {
      "x": 406,
      "y": 322,
      "width": 61,
      "height": 34
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "login-form--footer-link",
    "text": "Forgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/account/lost_password",
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "login-links"
    },
    "position": {
      "x": 731,
      "y": 324,
      "width": 143,
      "height": 16
    }
  },
  {
    "tag": "html",
    "id": null,
    "classes": null,
    "text": "Open link in a new tab\nTop Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\n",
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
    "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run",
    "text": "Open link in a new tab\nTop Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\n",
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
    "id": "wrapper",
    "classes": "can-hide-navigation nosidebar",
    "text": "Top Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\nSign in\nUsername\nPasswo",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "body",
      "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run"
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
    "id": "main",
    "classes": "can-hide-navigation nosidebar",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "main",
    "id": "content-wrapper",
    "classes": "can-hide-navigation nosidebar",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
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
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "div",
    "id": "content",
    "classes": "can-hide-navigation nosidebar ",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "main",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "div",
    "id": "content-body",
    "classes": null,
    "text": "Sign in\nUsername\nPassword\nForgot your password?",
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
      "classes": "can-hide-navigation nosidebar "
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "span",
    "id": "open-blank-target-link-description",
    "classes": "sr-only",
    "text": "Open link in a new tab",
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
      "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "header",
    "id": null,
    "classes": "op-app-header",
    "text": "Top Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--start",
    "text": "Top Menu\nJump to content\nHome",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 456,
      "height": 55
    }
  },
  {
    "tag": "h1",
    "id": null,
    "classes": "sr-only",
    "text": "Top Menu",
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
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "ul",
    "id": null,
    "classes": "op-app-menu op-app-menu_drop-left",
    "text": "Home",
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
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 178,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-logo",
    "text": "Home",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "ul",
      "classes": "op-app-menu op-app-menu_drop-left"
    },
    "position": {
      "x": 44,
      "y": 0,
      "width": 130,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--center",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-search",
    "text": "Search in zbio.openproject.com",
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
      "classes": "op-app-header--center"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "opce-global-search",
    "id": null,
    "classes": "op-angular-component",
    "text": "Search in zbio.openproject.com",
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
      "classes": "op-app-search"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "top-menu-search",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": "search",
    "ariaLabel": "Search in zbio.openproject.com",
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "opce-global-search",
      "classes": "op-angular-component"
    },
    "position": {
      "x": 471,
      "y": 0,
      "width": 338,
      "height": 55
    }
  },
  {
    "tag": "op-autocompleter",
    "id": null,
    "classes": "global-search op-autocompleter",
    "text": "Search in zbio.openproject.com",
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
      "classes": "top-menu-search"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "inline-label",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "op-autocompleter",
      "classes": "global-search op-autocompleter"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "ng-select",
    "id": "global-search-input",
    "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid",
    "text": "Search in zbio.openproject.com",
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
      "classes": "inline-label"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-select-container",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "ng-select",
      "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-value-container",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "ng-select-container"
    },
    "position": {
      "x": 472,
      "y": 12,
      "width": 336,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-placeholder",
    "text": "Search in zbio.openproject.com",
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
      "classes": "ng-value-container"
    },
    "position": {
      "x": 507,
      "y": 12,
      "width": 271,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-input",
    "text": "",
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
      "classes": "ng-value-container"
    },
    "position": {
      "x": 472,
      "y": 18,
      "width": 336,
      "height": 16
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-visually-hidden",
    "text": "",
    "value": null,
    "role": "status",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "ng-select",
      "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid"
    },
    "position": {
      "x": 470,
      "y": 43,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--end",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 824,
      "y": 0,
      "width": 456,
      "height": 55
    }
  },
  {
    "tag": "action-menu",
    "id": null,
    "classes": "op-app-menu--item pl-1",
    "text": "Help\n\n\n\n  \n    \n            \n  \n    \n        \n  \n      \n  \n    Getting started\n  \n\n    \n        \n   ",
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
      "classes": "op-app-header--end"
    },
    "position": {
      "x": 1141,
      "y": 0,
      "width": 48,
      "height": 55
    }
  },
  {
    "tag": "h1",
    "id": null,
    "classes": "sr-only accessibility-helper",
    "text": "Content",
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
      "classes": "can-hide-navigation nosidebar "
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1,
      "height": 1
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
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
});
```

---

## Test: create_a_new_project_board
**File**: create_a_new_project_board.auth.spec.js
**Iteration**: 2/3
**Timestamp**: 2025-12-12 16:01:18
**Status**: FAILED

### Error Details
```
Test: Create a new project board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Boards', exact: true })[22m


  87 |   //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  88 |   //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
> 89 |   await page.getByRole('link', { name: 'Boards', exact: true }).click();
     |                                                                 ^
  90 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  91 |
  92 |   // Step 8: Click the 'Create new board' button to start the board creation process.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:89:65
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:89:65

Test Status: timedOut
Duration: 120187ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
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
Test: Create a new project board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Boards', exact: true })[22m


  87 |   //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  88 |   //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
> 89 |   await page.getByRole('link', { name: 'Boards', exact: true }).click();
     |                                                                 ^
  90 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  91 |
  92 |   // Step 8: Click the 'Create new board' button to start the board creation process.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:89:65
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/79367f3a-367a-4cd5-aac0-ff55458f9376/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_new_project_board.auth.spec.js:89:65

Test Status: timedOut
Duration: 120187ms
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

**Test Name:** create_a_new_project_board
**Test File:** create_a_new_project_board.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "create_a_new_project_board",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This scenario covers the end-to-end process of a user logging in, navigating to the boards section, and successfully creating a new board for a project. It includes handling the mandatory project selection step that was discovered during exploration.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the project's main page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project homepage.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Click the user avatar button to open the user menu for logging out.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "User menu opens.",
      "business_impact": "Initiates the user authentication flow.",
      "selector": "page.getByRole('button', { name: 'HA', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'HA', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: 'HA' })",
          "strategy": "role_name",
          "confidence": 85
        },
        {
          "selector": "page.locator('button[data-show-dialog-id=\"dialog-75b98a33-4590-499a-afb6-4ffdd844f1fe\"]')",
          "strategy": "data_attr_show-dialog-id",
          "confidence": 85
        },
        {
          "selector": "page.locator('#dialog-show-dialog-75b98a33-4590-499a-afb6-4ffdd844f1fe')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Sign out' link to log out the current user and navigate to the login page.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "verification_point": "Page navigates to the login screen.",
      "business_impact": "Prepares the application for authentication with the test user.",
      "selector": "page.getByRole('link', { name: 'Sign out' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Sign out' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Sign out/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Sign out')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#item-7f9aa436-c9d6-420a-9c04-c21cc0021dac')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter the username for the default test user.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "input_value": "<UI_SITE_USERNAME>",
      "verification_point": "Username field is populated.",
      "business_impact": "Part of the critical user authentication process.",
      "selector": "page.getByRole('textbox', { name: 'Username*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Username*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Username')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#username')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "input_text",
      "description": "Enter the password for the default test user.",
      "expected_page_url": "https://zbio.openproject.com/login",
      "input_value": "<UI_SITE_PASSWORD>",
      "verification_point": "Password field is populated.",
      "business_impact": "Completes the credential entry for authentication.",
      "selector": "page.getByRole('textbox', { name: 'Password*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Password*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Password')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#password')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Sign in' button to submit credentials and log in.",
      "expected_page_url": "https://zbio.openproject.com/",
      "verification_point": "User is redirected to the main project page after successful login.",
      "business_impact": "Grants user access to the application's features.",
      "selector": "page.locator('#login-form').getByRole('button', { name: 'Sign in' })",
      "all_selectors": [
        {
          "selector": "page.locator('#login-form').getByRole('button', { name: 'Sign in' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('button', { name: /Sign in/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('input[type=\"submit\"]')",
          "strategy": "input_type",
          "confidence": 88
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Navigate to the Boards section using the main sidebar menu.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "verification_point": "Page navigates to the main Boards list view.",
      "business_impact": "Allows user to access the board management feature.",
      "selector": "page.getByRole('link', { name: 'Boards', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.boards-menu-item')",
          "strategy": "css_stable_class",
          "confidence": 78
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Click the 'Create new board' button to start the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/boards/new",
      "verification_point": "Page navigates to the new board creation form.",
      "business_impact": "Initiates the primary workflow for creating a new board.",
      "selector": "page.getByRole('link', { name: 'Create new board' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Create new board' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "input_text",
      "description": "Enter the name 'Automated board 1' into the title field for the new board.",
      "expected_page_url": "https://zbio.openproject.com/boards/new",
      "input_value": "Automated board 1",
      "verification_point": "Title field is populated with the board name.",
      "business_impact": "Defines the identity of the new board.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "input_text",
      "description": "Enter 'demo-project' into the project search field to associate the board with a project.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "input_value": "demo-project",
      "verification_point": "Project search field is populated.",
      "business_impact": "Fulfills a mandatory requirement for board creation.",
      "selector": "page.getByRole('combobox', { name: 'Search', exact: true })",
      "all_selectors": [
        {
          "selector": "page.getByRole('combobox', { name: 'Search', exact: true })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form#board-form').getByRole('combobox', { name: 'Search' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.locator('#project_id').getByRole('combobox', { name: 'Search' })",
          "strategy": "parent_id_role",
          "confidence": 82
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Select the 'Demo project' from the populated dropdown list.",
      "expected_page_url": "https://zbio.openproject.com/boards",
      "verification_point": "Project is selected in the form.",
      "business_impact": "Confirms the project association for the new board.",
      "selector": "page.locator('div.ng-option-label')",
      "all_selectors": [
        {
          "selector": "page.locator('div.ng-option-label')",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        }
      ],
      "confidence": 84,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Click the 'Create' button to submit the form and create the new board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/123",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Finalizes the board creation workflow.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Return to the main Boards page to verify the new board is listed.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the Boards list.",
      "business_impact": "Completes the user flow and allows for verification of the created asset.",
      "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "role_name",
          "confidence": 85
        },
        {
          "selector": "page.getByText('Boards')",
          "strategy": "text",
          "confidence": 78
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    }
  ]
}
```

**Current Test Code:**
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/login?back_url=https%3A%2F%2Fzbio.openproject.com%2Fprojects%2Fdemo-project
Total Visible Elements on Page: 68
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
    "id": "skip-navigation--content",
    "classes": "sr-only skip-navigation-link",
    "text": "Jump to content",
    "value": null,
    "role": null,
    "ariaLabel": "Click here to skip over the menu and go to the content",
    "type": null,
    "href": "https://zbio.openproject.com/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-bd7e9805-b513-45cd-85a3-a45f9ed3119f",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "ul",
      "classes": "op-app-menu op-app-menu_drop-left"
    },
    "position": {
      "x": 4,
      "y": 12,
      "width": 32,
      "height": 32
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button"
    },
    "position": {
      "x": 12,
      "y": 20,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 13,
      "y": 21,
      "width": 14,
      "height": 14
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "op-logo--link",
    "text": "Home",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-logo"
    },
    "position": {
      "x": 44,
      "y": 16,
      "width": 130,
      "height": 24
    }
  },
  {
    "tag": "button",
    "id": "top-menu-search-button",
    "classes": "top-menu-search--button search-form-normal",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Search",
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "top-menu-search"
    },
    "position": {
      "x": 473,
      "y": 0,
      "width": 30,
      "height": 55
    }
  },
  {
    "tag": "op-icon",
    "id": null,
    "classes": "op-icon--wrapper",
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
      "tag": "button",
      "classes": "top-menu-search--button search-form-normal"
    },
    "position": {
      "x": 473,
      "y": 19,
      "width": 30,
      "height": 16
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "icon5 icon-search ellipsis",
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
      "tag": "op-icon",
      "classes": "op-icon--wrapper"
    },
    "position": {
      "x": 473,
      "y": 19,
      "width": 30,
      "height": 16
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "global-search--input",
    "text": "",
    "value": null,
    "role": "combobox",
    "ariaLabel": "Search in zbio.openproject.com",
    "type": "text",
    "href": null,
    "cursor": "default",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "ng-input"
    },
    "position": {
      "x": 482,
      "y": 18,
      "width": 276,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "op-app-header--help-menu-button",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button hidden-for-mobile",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "action-menu",
      "classes": "op-app-menu--item pl-1"
    },
    "position": {
      "x": 1145,
      "y": 12,
      "width": 32,
      "height": 32
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button hidden-for-mobile"
    },
    "position": {
      "x": 1153,
      "y": 20,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 1153,
      "y": 20,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-06c8ebcd-af86-4335-b81a-d310b7414753",
    "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button px-1",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-header--end"
    },
    "position": {
      "x": 1189,
      "y": 12,
      "width": 77,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button px-1"
    },
    "position": {
      "x": 1194,
      "y": 18,
      "width": 67,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-content"
    },
    "position": {
      "x": 1194,
      "y": 18,
      "width": 43,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-visual Button-trailingVisual",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-content"
    },
    "position": {
      "x": 1245,
      "y": 19,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
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
      "tag": "span",
      "classes": "Button-visual Button-trailingVisual"
    },
    "position": {
      "x": 1245,
      "y": 19,
      "width": 16,
      "height": 16
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
      "tag": "svg",
      "classes": {}
    },
    "position": {
      "x": 1249,
      "y": 26,
      "width": 7,
      "height": 4
    }
  },
  {
    "tag": "input",
    "id": "username",
    "classes": "form--text-field",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "form--text-field-container"
    },
    "position": {
      "x": 562,
      "y": 224,
      "width": 313,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": "password",
    "classes": "form--text-field -password",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "password",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "form--text-field-container"
    },
    "position": {
      "x": 562,
      "y": 273,
      "width": 313,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": null,
    "classes": "button -primary button_no-margin",
    "text": "",
    "value": "Sign in",
    "role": null,
    "ariaLabel": null,
    "type": "submit",
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "login-form--footer"
    },
    "position": {
      "x": 406,
      "y": 322,
      "width": 61,
      "height": 34
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "login-form--footer-link",
    "text": "Forgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/account/lost_password",
    "cursor": "pointer",
    "display": "inline",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "login-links"
    },
    "position": {
      "x": 731,
      "y": 324,
      "width": 143,
      "height": 16
    }
  },
  {
    "tag": "html",
    "id": null,
    "classes": null,
    "text": "Open link in a new tab\nTop Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\n",
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
    "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run",
    "text": "Open link in a new tab\nTop Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\n",
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
    "id": "wrapper",
    "classes": "can-hide-navigation nosidebar",
    "text": "Top Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in\nContent\nSign in\nUsername\nPasswo",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "body",
      "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run"
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
    "id": "main",
    "classes": "can-hide-navigation nosidebar",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "main",
    "id": "content-wrapper",
    "classes": "can-hide-navigation nosidebar",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
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
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "div",
    "id": "content",
    "classes": "can-hide-navigation nosidebar ",
    "text": "Content\nSign in\nUsername\nPassword\nForgot your password?",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "main",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "div",
    "id": "content-body",
    "classes": null,
    "text": "Sign in\nUsername\nPassword\nForgot your password?",
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
      "classes": "can-hide-navigation nosidebar "
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1280,
      "height": 665
    }
  },
  {
    "tag": "span",
    "id": "open-blank-target-link-description",
    "classes": "sr-only",
    "text": "Open link in a new tab",
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
      "classes": "theme-core_design controller-account action-login env-production -browser-chrome -browser-windows bcf-deactivated __overflowing_element_container __overflowing_body __ng2-bootstrap-has-run"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "header",
    "id": null,
    "classes": "op-app-header",
    "text": "Top Menu\nJump to content\nHome\nSearch in zbio.openproject.com\nSign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "can-hide-navigation nosidebar"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 1280,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--start",
    "text": "Top Menu\nJump to content\nHome",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 0,
      "y": 0,
      "width": 456,
      "height": 55
    }
  },
  {
    "tag": "h1",
    "id": null,
    "classes": "sr-only",
    "text": "Top Menu",
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
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "ul",
    "id": null,
    "classes": "op-app-menu op-app-menu_drop-left",
    "text": "Home",
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
      "classes": "op-app-header--start"
    },
    "position": {
      "x": 4,
      "y": 0,
      "width": 178,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-logo",
    "text": "Home",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "ul",
      "classes": "op-app-menu op-app-menu_drop-left"
    },
    "position": {
      "x": 44,
      "y": 0,
      "width": 130,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--center",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-search",
    "text": "Search in zbio.openproject.com",
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
      "classes": "op-app-header--center"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "opce-global-search",
    "id": null,
    "classes": "op-angular-component",
    "text": "Search in zbio.openproject.com",
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
      "classes": "op-app-search"
    },
    "position": {
      "x": 456,
      "y": 0,
      "width": 368,
      "height": 55
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "top-menu-search",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": "search",
    "ariaLabel": "Search in zbio.openproject.com",
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "opce-global-search",
      "classes": "op-angular-component"
    },
    "position": {
      "x": 471,
      "y": 0,
      "width": 338,
      "height": 55
    }
  },
  {
    "tag": "op-autocompleter",
    "id": null,
    "classes": "global-search op-autocompleter",
    "text": "Search in zbio.openproject.com",
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
      "classes": "top-menu-search"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "inline-label",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "op-autocompleter",
      "classes": "global-search op-autocompleter"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "ng-select",
    "id": "global-search-input",
    "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid",
    "text": "Search in zbio.openproject.com",
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
      "classes": "inline-label"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-select-container",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "ng-select",
      "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid"
    },
    "position": {
      "x": 471,
      "y": 12,
      "width": 338,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-value-container",
    "text": "Search in zbio.openproject.com",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "default",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "ng-select-container"
    },
    "position": {
      "x": 472,
      "y": 12,
      "width": 336,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-placeholder",
    "text": "Search in zbio.openproject.com",
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
      "classes": "ng-value-container"
    },
    "position": {
      "x": 507,
      "y": 12,
      "width": 271,
      "height": 32
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-input",
    "text": "",
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
      "classes": "ng-value-container"
    },
    "position": {
      "x": 472,
      "y": 18,
      "width": 336,
      "height": 16
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "ng-visually-hidden",
    "text": "",
    "value": null,
    "role": "status",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "ng-select",
      "classes": "top-menu-search--input ng-select--primerized ng-select-typeahead ng-select-searchable ng-select-clearable ng-select ng-select-single ng-untouched ng-pristine ng-valid"
    },
    "position": {
      "x": 470,
      "y": 43,
      "width": 1,
      "height": 1
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-app-header--end",
    "text": "Sign in",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "auto",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "header",
      "classes": "op-app-header"
    },
    "position": {
      "x": 824,
      "y": 0,
      "width": 456,
      "height": 55
    }
  },
  {
    "tag": "action-menu",
    "id": null,
    "classes": "op-app-menu--item pl-1",
    "text": "Help\n\n\n\n  \n    \n            \n  \n    \n        \n  \n      \n  \n    Getting started\n  \n\n    \n        \n   ",
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
      "classes": "op-app-header--end"
    },
    "position": {
      "x": 1141,
      "y": 0,
      "width": 48,
      "height": 55
    }
  },
  {
    "tag": "h1",
    "id": null,
    "classes": "sr-only accessibility-helper",
    "text": "Content",
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
      "classes": "can-hide-navigation nosidebar "
    },
    "position": {
      "x": 0,
      "y": 55,
      "width": 1,
      "height": 1
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
import testData from './create_a_new_project_board.test-data.json';
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

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
});
```

---

