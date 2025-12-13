## Test: full_board_lifecycle_-_create_with_list_then_create_and_dele
**File**: full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js
**Iteration**: 1/3
**Timestamp**: 2025-12-13 09:39:43
**Status**: FAILED

### Error Details
```
Test: Full Board Lifecycle - Create with List, then Create and Delete a Second Board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project/boards" until "load"
============================================================

  122 |   //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  123 |   await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
> 124 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
      |              ^
  125 |
  126 |   // Step 9: Click 'Create new board' again for the second board
  127 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14

Test Status: timedOut
Duration: 120243ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

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

test('Full Board Lifecycle - Create with List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the starting URL provided in the scenario.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the first board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  const listNameInput = page.getByRole('textbox', { name: 'Click to edit title of this' }).last();
  await listNameInput.fill(listName);
  await listNameInput.press('Enter'); // Press Enter to confirm the list name

  // Step 8: Return to the main 'Boards' page via breadcrumb
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 9: Click 'Create new board' again for the second board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter a name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Return to the main 'Boards' page again
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 13: Locate and delete the second board
  // This step requires handling a confirmation dialog
  page.on('dialog', dialog => dialog.accept());

  // Captured selectors:
  //   1. page.getByRole('row', { name: '...' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  // Adapt the selector to use the dynamic board name created earlier
  const boardRowToDelete = page.getByRole('row', { name: new RegExp(boardName2) });
  await boardRowToDelete.waitFor({ state: 'visible' });
  await boardRowToDelete.getByRole('link').nth(1).click(); // Clicks the delete icon in the row

  // Step 14: Verification
  // Wait for the page to reload after deletion
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  await page.waitForLoadState('networkidle');

  // Verify the second board is no longer visible
  await expect(page.getByRole('row', { name: new RegExp(boardName2) })).not.toBeVisible();

  // Verify the first board is still visible
  await expect(page.getByRole('row', { name: new RegExp(boardName1) })).toBeVisible();
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
Test: Full Board Lifecycle - Create with List, then Create and Delete a Second Board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project/boards" until "load"
============================================================

  122 |   //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  123 |   await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
> 124 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
      |              ^
  125 |
  126 |   // Step 9: Click 'Create new board' again for the second board
  127 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14

Test Status: timedOut
Duration: 120243ms
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

**Test Name:** full_board_lifecycle_-_create_with_list_then_create_and_dele
**Test File:** full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "full_board_lifecycle_-_create_with_list_then_create_and_dele",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This end-to-end scenario validates the complete lifecycle of project boards by following the exact path taken by the agent. It includes creating a board, adding a list, returning to the main view, creating a second board, and then deleting the second board to ensure all core CRUD operations function correctly.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main project page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project's main dashboard.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the 'Boards' section from the side menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page URL changes to the boards overview page.",
      "business_impact": "Verifies that users can access the core Boards feature.",
      "selector": "page.getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.boards-menu-item')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/div[1]/div/ul/li[5]/div[1]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Create new board' button to start the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
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
          "strategy": "aria_label_regex",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Create new board' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.Button.Button')",
          "strategy": "css_combined_classes",
          "confidence": 65
        },
        {
          "selector": "page.locator('a.Button')",
          "strategy": "css_stable_class",
          "confidence": 63
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter a name for the new board in the 'Title' field.",
      "input_value": "Automated board <uuid4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "The title field is populated with the specified board name.",
      "business_impact": "Defines the identity of the new board being created.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label_text",
          "confidence": 93
        },
        {
          "selector": "page.getByLabel('Title', { exact: true })",
          "strategy": "label_text_exact",
          "confidence": 92
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"boards_grid[name]\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"boards_grid[name]\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.locator('#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/section/div[1]/span/span/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the first board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Completes the board creation process.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Create')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        },
        {
          "selector": "page.locator('button.-primary')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('button, input[type=\"submit\"], input[type=\"button\"]').filter({ hasText: /^Create$/ })",
          "strategy": "button_filter_exact",
          "confidence": 75
        },
        {
          "selector": "page.locator('button').filter({ hasText: 'Create' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/button')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add list to board' button to add a new column/list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "An input field appears to name the new list.",
      "business_impact": "Allows users to structure and organize tasks within a board.",
      "selector": "page.getByText('Add list to board')",
      "all_selectors": [
        {
          "selector": "page.getByText('Add list to board')",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByText('Add list to board')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.getByText('board', { exact: true })",
          "strategy": "text_exact_extracted",
          "confidence": 80
        },
        {
          "selector": "page.locator('#cdk-drop-list-0').locator('span')",
          "strategy": "parent_id_tag",
          "confidence": 78
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Add list to board' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Add list to board$/ })",
          "strategy": "tag_filter_exact",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/div/span')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter a name for the new list.",
      "input_value": "Automated List <rand4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "The new list is created and named correctly.",
      "business_impact": "Completes the process of adding an organizational column to the board.",
      "selector": "page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2)",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"editable-toolbar-title\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"editable-toolbar-title\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Name of this view')",
          "strategy": "placeholder",
          "confidence": 85
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Return to the main 'Boards' page using the breadcrumb navigation.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the boards overview.",
      "business_impact": "Confirms navigation away from a specific board is functional.",
      "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
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
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 59
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Click 'Create new board' again to create a second board for the deletion test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Page navigates to the new board creation form.",
      "business_impact": "Initiates the creation of a second board to test deletion.",
      "selector": "page.getByRole('link', { name: 'Create new board' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Create new board' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "aria_label_regex",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Create new board' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.Button.Button')",
          "strategy": "css_combined_classes",
          "confidence": 65
        },
        {
          "selector": "page.locator('a.Button')",
          "strategy": "css_stable_class",
          "confidence": 63
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "input_text",
      "description": "Enter a name for the second board in the 'Title' field.",
      "input_value": "Automated board for deletion <uuid4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "The title field is populated with the second board's name.",
      "business_impact": "Defines the identity of the board that will be deleted.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label_text",
          "confidence": 93
        },
        {
          "selector": "page.getByLabel('Title', { exact: true })",
          "strategy": "label_text_exact",
          "confidence": 92
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"boards_grid[name]\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"boards_grid[name]\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.locator('#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/section/div[1]/span/span/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/132",
      "verification_point": "Page navigates to the second newly created board's view.",
      "business_impact": "Completes the setup for the deletion test.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Create')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        },
        {
          "selector": "page.locator('button.-primary')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('button, input[type=\"submit\"], input[type=\"button\"]').filter({ hasText: /^Create$/ })",
          "strategy": "button_filter_exact",
          "confidence": 75
        },
        {
          "selector": "page.locator('button').filter({ hasText: 'Create' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/button')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Return to the main 'Boards' page again to locate the board for deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the boards overview.",
      "business_impact": "Positions the user to perform the deletion action.",
      "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
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
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 59
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Locate the second newly created board in the list and click the delete icon.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "The board is removed from the list and the page reloads.",
      "business_impact": "Validates the critical functionality of deleting a board.",
      "selector": "page.getByRole('row', { name: 'Automated board 1765553595317' }).getByRole('link').nth(1)",
      "all_selectors": [
        {
          "selector": "page.getByRole('row', { name: 'Automated board 1765553595317' }).getByRole('link').nth(1)",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/121\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[href*=\"121\"]')",
          "strategy": "href_relative",
          "confidence": 79
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[20]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "Verification",
      "description": "Verify that the user is on the Boards page and the second board is no longer visible.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page URL confirms return to boards list, and deleted board is absent.",
      "business_impact": "Confirms the deletion was successful and the UI reflects the change.",
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

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

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

test('Full Board Lifecycle - Create with List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the starting URL provided in the scenario.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the first board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  const listNameInput = page.getByRole('textbox', { name: 'Click to edit title of this' }).last();
  await listNameInput.fill(listName);
  await listNameInput.press('Enter'); // Press Enter to confirm the list name

  // Step 8: Return to the main 'Boards' page via breadcrumb
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 9: Click 'Create new board' again for the second board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter a name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Return to the main 'Boards' page again
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 13: Locate and delete the second board
  // This step requires handling a confirmation dialog
  page.on('dialog', dialog => dialog.accept());

  // Captured selectors:
  //   1. page.getByRole('row', { name: '...' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  // Adapt the selector to use the dynamic board name created earlier
  const boardRowToDelete = page.getByRole('row', { name: new RegExp(boardName2) });
  await boardRowToDelete.waitFor({ state: 'visible' });
  await boardRowToDelete.getByRole('link').nth(1).click(); // Clicks the delete icon in the row

  // Step 14: Verification
  // Wait for the page to reload after deletion
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  await page.waitForLoadState('networkidle');

  // Verify the second board is no longer visible
  await expect(page.getByRole('row', { name: new RegExp(boardName2) })).not.toBeVisible();

  // Verify the first board is still visible
  await expect(page.getByRole('row', { name: new RegExp(boardName1) })).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/demo-project/boards/133
Total Visible Elements on Page: 326
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
    "id": "dialog-show-dialog-5972be1d-d6c3-4bd0-83ee-c1d9ba0a78e7",
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
    "tag": "a",
    "id": null,
    "classes": "upsell-colored-background hidden-for-mobile Button--secondary Button--medium Button flex-self-center",
    "text": "Buy now",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/admin/subscriptions",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-menu--item hidden-for-mobile"
    },
    "position": {
      "x": 966,
      "y": 12,
      "width": 80,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "Buy now",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "upsell-colored-background hidden-for-mobile Button--secondary Button--medium Button flex-self-center"
    },
    "position": {
      "x": 979,
      "y": 18,
      "width": 54,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "Buy now",
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
      "x": 979,
      "y": 18,
      "width": 54,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": "op-app-header--quick-add-menu-button",
    "classes": "op-app-header--primer-button Button--primary Button--medium Button px-2",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "action-menu",
      "classes": "op-app-menu--item"
    },
    "position": {
      "x": 1070,
      "y": 12,
      "width": 58,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "",
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
      "classes": "op-app-header--primer-button Button--primary Button--medium Button px-2"
    },
    "position": {
      "x": 1079,
      "y": 18,
      "width": 40,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-visual Button-leadingVisual",
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
      "x": 1079,
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
      "classes": "Button-visual Button-leadingVisual"
    },
    "position": {
      "x": 1079,
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
      "x": 1081,
      "y": 21,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
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
      "classes": "Button-content"
    },
    "position": {
      "x": 1103,
      "y": 18,
      "width": 16,
      "height": 20
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "img",
    "ariaLabel": "Add\u2026",
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-label"
    },
    "position": {
      "x": 1103,
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
      "x": 1107,
      "y": 26,
      "width": 7,
      "height": 4
    }
  },
  {
    "tag": "a",
    "id": "icon-button-cf8acc65-de27-490c-bf4c-f76ea51b5bac",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button op-ian-bell",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/notifications",
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-menu--item position-relative px-1"
    },
    "position": {
      "x": 1144,
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
      "tag": "a",
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button op-ian-bell"
    },
    "position": {
      "x": 1152,
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
      "x": 1152,
      "y": 21,
      "width": 16,
      "height": 14
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
      "x": 1184,
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
      "x": 1192,
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
      "x": 1192,
      "y": 20,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-5fc34ddb-0451-408d-8b23-c75943dfdeb0",
    "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button Button--invisible-noVisuals px-0",
    "text": "HA",
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
      "x": 1228,
      "y": 12,
      "width": 38,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "HA",
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
      "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button Button--invisible-noVisuals px-0"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "HA",
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
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "opce-principal",
    "id": null,
    "classes": "op-top-menu-user-avatar op-principal",
    "text": "HA",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-flex",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-label"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-principal--avatar op-avatar op-avatar_default op-avatar_user op-avatar--fallback",
    "text": "HA",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "opce-principal",
      "classes": "op-top-menu-user-avatar op-principal"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "spot-link main-menu--navigation-toggler open",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "submit",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "op-resizer",
      "classes": "main-menu--resizer"
    },
    "position": {
      "x": 264,
      "y": 405,
      "width": 16,
      "height": 21
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "resize-handle",
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
      "classes": "spot-link main-menu--navigation-toggler open"
    },
    "position": {
      "x": 264,
      "y": 405,
      "width": 16,
      "height": 21
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "img",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "resize-handle"
    },
    "position": {
      "x": 264,
      "y": 407,
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
      "x": 270,
      "y": 409,
      "width": 5,
      "height": 12
    }
  },
  {
    "tag": "button",
    "id": "projects-menu",
    "classes": "op-project-select--trigger-button",
    "text": "Demo project",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "spot-drop-modal",
      "classes": "op-project-list-modal spot-drop-modal"
    },
    "position": {
      "x": 12,
      "y": 71,
      "width": 136,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "ellipsis",
    "text": "Demo project",
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
      "classes": "op-project-select--trigger-button"
    },
    "position": {
      "x": 25,
      "y": 77,
      "width": 89,
      "height": 21
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "button--dropdown-indicator",
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
      "classes": "op-project-select--trigger-button"
    },
    "position": {
      "x": 114,
      "y": 80,
      "width": 21,
      "height": 13
    }
  },
  {
    "tag": "button",
    "id": "menu-toggle--collapse-button",
    "classes": "Button Button--iconOnly Button--invisible Button--medium",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "inline-grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "text-right flex-auto"
    },
    "position": {
      "x": 235,
      "y": 71,
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium"
    },
    "position": {
      "x": 243,
      "y": 79,
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
      "x": 247,
      "y": 84,
      "width": 3,
      "height": 5
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
      "x": 243,
      "y": 79,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "main-menu--arrow-left-to-project",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Go back one menu level",
    "type": null,
    "href": "https://zbio.openproject.com/#",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "main-menu--children-menu-header"
    },
    "position": {
      "x": 12,
      "y": 136,
      "width": 36,
      "height": 36
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
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "main-menu--arrow-left-to-project"
    },
    "position": {
      "x": 25,
      "y": 147,
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
      "x": 27,
      "y": 150,
      "width": 11,
      "height": 10
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "main-menu--parent-node ellipsis",
    "text": "Boards",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/demo-project/boards",
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "main-menu--children-menu-header"
    },
    "position": {
      "x": 48,
      "y": 136,
      "width": 219,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": "search",
    "classes": "FormControl-input FormControl-medium op-submenu--search-input",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Search",
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "FormControl-input-wrap FormControl-input-wrap--leadingVisual FormControl-input-width--auto"
    },
    "position": {
      "x": 12,
      "y": 176,
      "width": 255,
      "height": 32
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "op-submenu--title",
    "text": "Public",
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
      "classes": null
    },
    "position": {
      "x": 12,
      "y": 224,
      "width": 255,
      "height": 36
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "icon-small icon-arrow-up1",
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
      "classes": "op-submenu--title"
    },
    "position": {
      "x": 244,
      "y": 233,
      "width": 10,
      "height": 18
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "op-submenu--item-action ",
    "text": "Automated board 1",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/demo-project/boards/123",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "op-submenu--item"
    },
    "position": {
      "x": 12,
      "y": 262,
      "width": 255,
      "height": 36
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

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

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

test('Full Board Lifecycle - Create with List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the starting URL provided in the scenario.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the first board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  const listNameInput = page.getByRole('textbox', { name: 'Click to edit title of this' }).last();
  await listNameInput.fill(listName);
  await listNameInput.press('Enter'); // Press Enter to confirm the list name

  // Step 8: Return to the main 'Boards' page via breadcrumb
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`, { waitUntil: 'networkidle' });

  // Step 9: Click 'Create new board' again for the second board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter a name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Return to the main 'Boards' page again
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 13: Locate and delete the second board
  // This step requires handling a confirmation dialog
  page.on('dialog', dialog => dialog.accept());

  // Captured selectors:
  //   1. page.getByRole('row', { name: '...' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  // Adapt the selector to use the dynamic board name created earlier
  const boardRowToDelete = page.getByRole('row', { name: new RegExp(boardName2) });
  await boardRowToDelete.waitFor({ state: 'visible' });
  await boardRowToDelete.getByRole('link').nth(1).click(); // Clicks the delete icon in the row

  // Step 14: Verification
  // Wait for the page to reload after deletion
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  await page.waitForLoadState('networkidle');

  // Verify the second board is no longer visible
  await expect(page.getByRole('row', { name: new RegExp(boardName2) })).not.toBeVisible();

  // Verify the first board is still visible
  await expect(page.getByRole('row', { name: new RegExp(boardName1) })).toBeVisible();
});
```

---

## Test: full_board_lifecycle_-_create_with_list_then_create_and_dele
**File**: full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js
**Iteration**: 2/3
**Timestamp**: 2025-12-13 09:42:14
**Status**: FAILED

### Error Details
```
Test: Full Board Lifecycle - Create with List, then Create and Delete a Second Board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project/boards" until "networkidle"
============================================================

  122 |   //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  123 |   await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
> 124 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`, { waitUntil: 'networkidle' });
      |              ^
  125 |
  126 |   // Step 9: Click 'Create new board' again for the second board
  127 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14

Test Status: timedOut
Duration: 120253ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

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

test('Full Board Lifecycle - Create with List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the starting URL provided in the scenario.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the first board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  const listNameInput = page.getByRole('textbox', { name: 'Click to edit title of this' }).last();
  await listNameInput.fill(listName);
  await listNameInput.press('Enter'); // Press Enter to confirm the list name

  // Step 8: Return to the main 'Boards' page via breadcrumb
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`, { waitUntil: 'networkidle' });

  // Step 9: Click 'Create new board' again for the second board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter a name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Return to the main 'Boards' page again
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 13: Locate and delete the second board
  // This step requires handling a confirmation dialog
  page.on('dialog', dialog => dialog.accept());

  // Captured selectors:
  //   1. page.getByRole('row', { name: '...' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  // Adapt the selector to use the dynamic board name created earlier
  const boardRowToDelete = page.getByRole('row', { name: new RegExp(boardName2) });
  await boardRowToDelete.waitFor({ state: 'visible' });
  await boardRowToDelete.getByRole('link').nth(1).click(); // Clicks the delete icon in the row

  // Step 14: Verification
  // Wait for the page to reload after deletion
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  await page.waitForLoadState('networkidle');

  // Verify the second board is no longer visible
  await expect(page.getByRole('row', { name: new RegExp(boardName2) })).not.toBeVisible();

  // Verify the first board is still visible
  await expect(page.getByRole('row', { name: new RegExp(boardName1) })).toBeVisible();
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
Test: Full Board Lifecycle - Create with List, then Create and Delete a Second Board
======================================================================
Main Error:
[31mTest timeout of 120000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 120000ms exceeded.[39m

Error 2:
Error: page.waitForURL: Test timeout of 120000ms exceeded.
=========================== logs ===========================
waiting for navigation to "https://zbio.openproject.com/projects/demo-project/boards" until "networkidle"
============================================================

  122 |   //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  123 |   await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
> 124 |   await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`, { waitUntil: 'networkidle' });
      |              ^
  125 |
  126 |   // Step 9: Click 'Create new board' again for the second board
  127 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/d7371ae6-afb0-44d1-a93e-7a150e7e9748/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js:124:14

Test Status: timedOut
Duration: 120253ms
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

**Test Name:** full_board_lifecycle_-_create_with_list_then_create_and_dele
**Test File:** full_board_lifecycle___create_with_list_then_create_and_dele.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "full_board_lifecycle_-_create_with_list_then_create_and_dele",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This end-to-end scenario validates the complete lifecycle of project boards by following the exact path taken by the agent. It includes creating a board, adding a list, returning to the main view, creating a second board, and then deleting the second board to ensure all core CRUD operations function correctly.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main project page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project's main dashboard.",
      "business_impact": "Ensures the application's entry point is accessible.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the 'Boards' section from the side menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page URL changes to the boards overview page.",
      "business_impact": "Verifies that users can access the core Boards feature.",
      "selector": "page.getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.boards-menu-item')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/div[1]/div/ul/li[5]/div[1]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Create new board' button to start the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
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
          "strategy": "aria_label_regex",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Create new board' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.Button.Button')",
          "strategy": "css_combined_classes",
          "confidence": 65
        },
        {
          "selector": "page.locator('a.Button')",
          "strategy": "css_stable_class",
          "confidence": 63
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter a name for the new board in the 'Title' field.",
      "input_value": "Automated board <uuid4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "The title field is populated with the specified board name.",
      "business_impact": "Defines the identity of the new board being created.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label_text",
          "confidence": 93
        },
        {
          "selector": "page.getByLabel('Title', { exact: true })",
          "strategy": "label_text_exact",
          "confidence": 92
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"boards_grid[name]\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"boards_grid[name]\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.locator('#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/section/div[1]/span/span/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the first board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Completes the board creation process.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Create')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        },
        {
          "selector": "page.locator('button.-primary')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('button, input[type=\"submit\"], input[type=\"button\"]').filter({ hasText: /^Create$/ })",
          "strategy": "button_filter_exact",
          "confidence": 75
        },
        {
          "selector": "page.locator('button').filter({ hasText: 'Create' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/button')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add list to board' button to add a new column/list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "An input field appears to name the new list.",
      "business_impact": "Allows users to structure and organize tasks within a board.",
      "selector": "page.getByText('Add list to board')",
      "all_selectors": [
        {
          "selector": "page.getByText('Add list to board')",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByText('Add list to board')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.getByText('board', { exact: true })",
          "strategy": "text_exact_extracted",
          "confidence": 80
        },
        {
          "selector": "page.locator('#cdk-drop-list-0').locator('span')",
          "strategy": "parent_id_tag",
          "confidence": 78
        },
        {
          "selector": "page.locator('span').filter({ hasText: 'Add list to board' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('span').filter({ hasText: /^Add list to board$/ })",
          "strategy": "tag_filter_exact",
          "confidence": 67
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/div/span')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter a name for the new list.",
      "input_value": "Automated List <rand4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/131",
      "verification_point": "The new list is created and named correctly.",
      "business_impact": "Completes the process of adding an organizational column to the board.",
      "selector": "page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2)",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2)",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"editable-toolbar-title\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"editable-toolbar-title\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.getByPlaceholder('Name of this view')",
          "strategy": "placeholder",
          "confidence": 85
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "click",
      "description": "Return to the main 'Boards' page using the breadcrumb navigation.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the boards overview.",
      "business_impact": "Confirms navigation away from a specific board is functional.",
      "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
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
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 59
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Click 'Create new board' again to create a second board for the deletion test.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Page navigates to the new board creation form.",
      "business_impact": "Initiates the creation of a second board to test deletion.",
      "selector": "page.getByRole('link', { name: 'Create new board' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Create new board' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "aria_label_regex",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "strategy": "role_name_regex",
          "confidence": 95
        },
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Create new board' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('a.Button.Button')",
          "strategy": "css_combined_classes",
          "confidence": 65
        },
        {
          "selector": "page.locator('a.Button')",
          "strategy": "css_stable_class",
          "confidence": 63
        },
        {
          "selector": "page.locator('#add-board-button')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "input_text",
      "description": "Enter a name for the second board in the 'Title' field.",
      "input_value": "Automated board for deletion <uuid4>",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "The title field is populated with the second board's name.",
      "business_impact": "Defines the identity of the board that will be deleted.",
      "selector": "page.getByRole('textbox', { name: 'Title*' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('textbox', { name: 'Title*' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label_text",
          "confidence": 93
        },
        {
          "selector": "page.getByLabel('Title', { exact: true })",
          "strategy": "label_text_exact",
          "confidence": 92
        },
        {
          "selector": "page.getByLabel('Title')",
          "strategy": "label",
          "confidence": 90
        },
        {
          "selector": "page.locator('input[type=\"text\"][name=\"boards_grid[name]\"]')",
          "strategy": "css_combined",
          "confidence": 89
        },
        {
          "selector": "page.locator('input[name=\"boards_grid[name]\"]')",
          "strategy": "name_attribute",
          "confidence": 87
        },
        {
          "selector": "page.locator('#board-form').getByRole('textbox', { name: 'Title' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "strategy": "id",
          "confidence": 75
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/section/div[1]/span/span/input')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/132",
      "verification_point": "Page navigates to the second newly created board's view.",
      "business_impact": "Completes the setup for the deletion test.",
      "selector": "page.getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "strategy": "form_action_role",
          "confidence": 97
        },
        {
          "selector": "page.locator('form#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "form_id_role",
          "confidence": 96
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "strategy": "role_name",
          "confidence": 95
        },
        {
          "selector": "page.getByText('Create')",
          "strategy": "text",
          "confidence": 88
        },
        {
          "selector": "page.locator('#board-form').getByRole('button', { name: 'Create' })",
          "strategy": "parent_id_role",
          "confidence": 82
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "strategy": "css_combined_classes",
          "confidence": 80
        },
        {
          "selector": "page.locator('button.-primary')",
          "strategy": "css_stable_class",
          "confidence": 78
        },
        {
          "selector": "page.locator('button, input[type=\"submit\"], input[type=\"button\"]').filter({ hasText: /^Create$/ })",
          "strategy": "button_filter_exact",
          "confidence": 75
        },
        {
          "selector": "page.locator('button').filter({ hasText: 'Create' })",
          "strategy": "tag_filter_text",
          "confidence": 69
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/form/button')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "click",
      "description": "Return to the main 'Boards' page again to locate the board for deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the boards overview.",
      "business_impact": "Positions the user to perform the deletion action.",
      "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.locator('#content-body').getByRole('link', { name: 'Boards' })",
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
        },
        {
          "selector": "page.locator('a').filter({ hasText: /^Boards$/ })",
          "strategy": "link_filter_exact",
          "confidence": 74
        },
        {
          "selector": "page.locator('a').filter({ hasText: 'Boards' })",
          "strategy": "tag_filter_text",
          "confidence": 59
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Locate the second newly created board in the list and click the delete icon.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "The board is removed from the list and the page reloads.",
      "business_impact": "Validates the critical functionality of deleting a board.",
      "selector": "page.getByRole('row', { name: 'Automated board 1765553595317' }).getByRole('link').nth(1)",
      "all_selectors": [
        {
          "selector": "page.getByRole('row', { name: 'Automated board 1765553595317' }).getByRole('link').nth(1)",
          "strategy": "roost_primary",
          "confidence": 99
        },
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/121\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[href*=\"121\"]')",
          "strategy": "href_relative",
          "confidence": 79
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[20]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 99,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "Verification",
      "description": "Verify that the user is on the Boards page and the second board is no longer visible.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page URL confirms return to boards list, and deleted board is absent.",
      "business_impact": "Confirms the deletion was successful and the UI reflects the change.",
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

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

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

test('Full Board Lifecycle - Create with List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the starting URL provided in the scenario.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the first board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Click to edit title of this' }).nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  const listNameInput = page.getByRole('textbox', { name: 'Click to edit title of this' }).last();
  await listNameInput.fill(listName);
  await listNameInput.press('Enter'); // Press Enter to confirm the list name

  // Step 8: Return to the main 'Boards' page via breadcrumb
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`, { waitUntil: 'networkidle' });

  // Step 9: Click 'Create new board' again for the second board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter a name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Return to the main 'Boards' page again
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 13: Locate and delete the second board
  // This step requires handling a confirmation dialog
  page.on('dialog', dialog => dialog.accept());

  // Captured selectors:
  //   1. page.getByRole('row', { name: '...' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  // Adapt the selector to use the dynamic board name created earlier
  const boardRowToDelete = page.getByRole('row', { name: new RegExp(boardName2) });
  await boardRowToDelete.waitFor({ state: 'visible' });
  await boardRowToDelete.getByRole('link').nth(1).click(); // Clicks the delete icon in the row

  // Step 14: Verification
  // Wait for the page to reload after deletion
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  await page.waitForLoadState('networkidle');

  // Verify the second board is no longer visible
  await expect(page.getByRole('row', { name: new RegExp(boardName2) })).not.toBeVisible();

  // Verify the first board is still visible
  await expect(page.getByRole('row', { name: new RegExp(boardName1) })).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/demo-project/boards/134
Total Visible Elements on Page: 344
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
    "id": "dialog-show-dialog-24ab8b4a-549c-4205-b23d-452e8469d9f6",
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
    "tag": "a",
    "id": null,
    "classes": "upsell-colored-background hidden-for-mobile Button--secondary Button--medium Button flex-self-center",
    "text": "Buy now",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/admin/subscriptions",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-menu--item hidden-for-mobile"
    },
    "position": {
      "x": 966,
      "y": 12,
      "width": 80,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "Buy now",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "upsell-colored-background hidden-for-mobile Button--secondary Button--medium Button flex-self-center"
    },
    "position": {
      "x": 979,
      "y": 18,
      "width": 54,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "Buy now",
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
      "x": 979,
      "y": 18,
      "width": 54,
      "height": 20
    }
  },
  {
    "tag": "button",
    "id": "op-app-header--quick-add-menu-button",
    "classes": "op-app-header--primer-button Button--primary Button--medium Button px-2",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "action-menu",
      "classes": "op-app-menu--item"
    },
    "position": {
      "x": 1070,
      "y": 12,
      "width": 58,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "",
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
      "classes": "op-app-header--primer-button Button--primary Button--medium Button px-2"
    },
    "position": {
      "x": 1079,
      "y": 18,
      "width": 40,
      "height": 20
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-visual Button-leadingVisual",
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
      "x": 1079,
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
      "classes": "Button-visual Button-leadingVisual"
    },
    "position": {
      "x": 1079,
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
      "x": 1081,
      "y": 21,
      "width": 12,
      "height": 12
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
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
      "classes": "Button-content"
    },
    "position": {
      "x": 1103,
      "y": 18,
      "width": 16,
      "height": 20
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "img",
    "ariaLabel": "Add\u2026",
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-label"
    },
    "position": {
      "x": 1103,
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
      "x": 1107,
      "y": 26,
      "width": 7,
      "height": 4
    }
  },
  {
    "tag": "a",
    "id": "icon-button-56d4f054-3064-487f-a5a6-448f0e0c39ec",
    "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button op-ian-bell",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/notifications",
    "cursor": "pointer",
    "display": "grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-app-menu--item position-relative px-1"
    },
    "position": {
      "x": 1144,
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
      "tag": "a",
      "classes": "Button Button--iconOnly Button--invisible Button--medium op-app-header--primer-button op-ian-bell"
    },
    "position": {
      "x": 1152,
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
      "x": 1152,
      "y": 21,
      "width": 16,
      "height": 14
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
      "x": 1184,
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
      "x": 1192,
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
      "x": 1192,
      "y": 20,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "button",
    "id": "dialog-show-dialog-952bb00c-93f2-4fe2-bae5-18464fdb03a8",
    "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button Button--invisible-noVisuals px-0",
    "text": "HA",
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
      "x": 1228,
      "y": 12,
      "width": 38,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "HA",
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
      "classes": "op-app-header--primer-button op-app-menu--item Button--invisible Button--medium Button Button--invisible-noVisuals px-0"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-label",
    "text": "HA",
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
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "opce-principal",
    "id": null,
    "classes": "op-top-menu-user-avatar op-principal",
    "text": "HA",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-flex",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "Button-label"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "div",
    "id": null,
    "classes": "op-principal--avatar op-avatar op-avatar_default op-avatar_user op-avatar--fallback",
    "text": "HA",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "opce-principal",
      "classes": "op-top-menu-user-avatar op-principal"
    },
    "position": {
      "x": 1229,
      "y": 10,
      "width": 36,
      "height": 36
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "spot-link main-menu--navigation-toggler open",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "submit",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "op-resizer",
      "classes": "main-menu--resizer"
    },
    "position": {
      "x": 264,
      "y": 405,
      "width": 16,
      "height": 21
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "resize-handle",
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
      "classes": "spot-link main-menu--navigation-toggler open"
    },
    "position": {
      "x": 264,
      "y": 405,
      "width": 16,
      "height": 21
    }
  },
  {
    "tag": "svg",
    "id": null,
    "classes": {},
    "text": "",
    "value": null,
    "role": "img",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "span",
      "classes": "resize-handle"
    },
    "position": {
      "x": 264,
      "y": 407,
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
      "x": 270,
      "y": 409,
      "width": 5,
      "height": 12
    }
  },
  {
    "tag": "button",
    "id": "projects-menu",
    "classes": "op-project-select--trigger-button",
    "text": "Demo project",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "spot-drop-modal",
      "classes": "op-project-list-modal spot-drop-modal"
    },
    "position": {
      "x": 12,
      "y": 71,
      "width": 136,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "ellipsis",
    "text": "Demo project",
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
      "classes": "op-project-select--trigger-button"
    },
    "position": {
      "x": 25,
      "y": 77,
      "width": 89,
      "height": 21
    }
  },
  {
    "tag": "i",
    "id": null,
    "classes": "button--dropdown-indicator",
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
      "classes": "op-project-select--trigger-button"
    },
    "position": {
      "x": 114,
      "y": 80,
      "width": 21,
      "height": 13
    }
  },
  {
    "tag": "button",
    "id": "menu-toggle--collapse-button",
    "classes": "Button Button--iconOnly Button--invisible Button--medium",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": "button",
    "href": null,
    "cursor": "pointer",
    "display": "inline-grid",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "text-right flex-auto"
    },
    "position": {
      "x": 235,
      "y": 71,
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
      "classes": "Button Button--iconOnly Button--invisible Button--medium"
    },
    "position": {
      "x": 243,
      "y": 79,
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
      "x": 247,
      "y": 84,
      "width": 3,
      "height": 5
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
      "x": 243,
      "y": 79,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "main-menu--arrow-left-to-project",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Go back one menu level",
    "type": null,
    "href": "https://zbio.openproject.com/#",
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "main-menu--children-menu-header"
    },
    "position": {
      "x": 12,
      "y": 136,
      "width": 36,
      "height": 36
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
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "main-menu--arrow-left-to-project"
    },
    "position": {
      "x": 25,
      "y": 147,
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
      "x": 27,
      "y": 150,
      "width": 11,
      "height": 10
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "main-menu--parent-node ellipsis",
    "text": "Boards",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/demo-project/boards",
    "cursor": "pointer",
    "display": "inline-block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "main-menu--children-menu-header"
    },
    "position": {
      "x": 48,
      "y": 136,
      "width": 219,
      "height": 36
    }
  },
  {
    "tag": "input",
    "id": "search",
    "classes": "FormControl-input FormControl-medium op-submenu--search-input",
    "text": "",
    "value": null,
    "role": null,
    "ariaLabel": "Search",
    "type": "text",
    "href": null,
    "cursor": "text",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "FormControl-input-wrap FormControl-input-wrap--leadingVisual FormControl-input-width--auto"
    },
    "position": {
      "x": 12,
      "y": 176,
      "width": 255,
      "height": 32
    }
  },
  {
    "tag": "button",
    "id": null,
    "classes": "op-submenu--title",
    "text": "Public",
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
      "classes": null
    },
    "position": {
      "x": 12,
      "y": 224,
      "width": 255,
      "height": 36
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "icon-small icon-arrow-up1",
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
      "classes": "op-submenu--title"
    },
    "position": {
      "x": 244,
      "y": 233,
      "width": 10,
      "height": 18
    }
  },
  {
    "tag": "a",
    "id": null,
    "classes": "op-submenu--item-action ",
    "text": "Automated board 1",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/demo-project/boards/123",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "op-submenu--item"
    },
    "position": {
      "x": 12,
      "y": 262,
      "width": 255,
      "height": 36
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
AI failed to generate fix
```

---

