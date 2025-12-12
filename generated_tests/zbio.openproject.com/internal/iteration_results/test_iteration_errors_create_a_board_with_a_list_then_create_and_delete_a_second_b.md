## Test: create_a_board_with_a_list_then_create_and_delete_a_second_b
**File**: create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js
**Iteration**: 1/3
**Timestamp**: 2025-12-12 11:02:48
**Status**: FAILED

### Error Details
```
Test: Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  locator('h3').getByText('Automated List 1 - 1765537283284')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('h3').getByText('Automated List 1 - 1765537283284')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  locator('h3').getByText('Automated List 1 - 1765537283284')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('h3').getByText('Automated List 1 - 1765537283284')[22m


  129 |   await page.keyboard.press('Enter');
  130 |   // Verify the list was created before proceeding
> 131 |   await expect(page.locator('h3').getByText(listName1)).toBeVisible();
      |                                                         ^
  132 |
  133 |   // Step 9: Click the 'Boards' breadcrumb link to navigate back
  134 |   // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:131:57
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:131:57

Test Status: failed
Duration: 13199ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.locator('h3').getByText(listName1)).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
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
Test: Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  locator('h3').getByText('Automated List 1 - 1765537283284')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('h3').getByText('Automated List 1 - 1765537283284')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  locator('h3').getByText('Automated List 1 - 1765537283284')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('h3').getByText('Automated List 1 - 1765537283284')[22m


  129 |   await page.keyboard.press('Enter');
  130 |   // Verify the list was created before proceeding
> 131 |   await expect(page.locator('h3').getByText(listName1)).toBeVisible();
      |                                                         ^
  132 |
  133 |   // Step 9: Click the 'Boards' breadcrumb link to navigate back
  134 |   // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:131:57
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:131:57

Test Status: failed
Duration: 13199ms
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

**Test Name:** create_a_board_with_a_list_then_create_and_delete_a_second_b
**Test File:** create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "create_a_board_with_a_list_then_create_and_delete_a_second_b",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This comprehensive end-to-end scenario validates the core board management functionality. It covers creating a board, adding a list to it, verifying its creation, then creating a second board and immediately deleting it, confirming its removal. This flow combines two user-provided scenarios into a single, sequential test.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the project's main dashboard page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project dashboard.",
      "business_impact": "Ensures the user can access the starting point of the project.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Boards section from the main project menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page URL changes to the boards list page.",
      "business_impact": "Allows users to access the board management feature.",
      "selector": "page.getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('#main-menu-boards')",
          "confidence": 85,
          "strategy": "id"
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Create new board' button to initiate the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Navigated to the new board creation page.",
      "business_impact": "Starts the primary workflow for creating a new project board.",
      "selector": "page.getByRole('link', { name: /Create new board/ })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "confidence": 96,
          "strategy": "aria_label_regex"
        },
        {
          "selector": "page.locator('#add-board-button')",
          "confidence": 75,
          "strategy": "id"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 96,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter the name for the new board in the 'Title' input field.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "input_value": "Automated board 1",
      "verification_point": "The input field is populated with the board name.",
      "business_impact": "Defines the identity of the new board.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.getByLabel('Title')",
          "confidence": 93,
          "strategy": "label_text"
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "confidence": 75,
          "strategy": "id"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the new board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Completes the board creation process.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "confidence": 80,
          "strategy": "css_combined_classes"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add list to board' button to create a new column/list on the board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "verification_point": "An input field appears to name the new list.",
      "business_impact": "Allows users to structure their board with workflow stages.",
      "selector": "page.getByText('Add list to board')",
      "all_selectors": [
        {
          "selector": "page.getByText('Add list to board')",
          "confidence": 88,
          "strategy": "text"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the name for the new list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "input_value": "Automated List 1",
      "verification_point": "The input field is populated with the list name.",
      "business_impact": "Defines the name of the new workflow stage.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByPlaceholder('Name of this view')",
          "confidence": 85,
          "strategy": "placeholder"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "send_keys",
      "description": "Press the 'Enter' key to confirm the new list name and create the list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "input_value": "Enter",
      "verification_point": "The new list is created and visible on the board.",
      "business_impact": "Completes the list creation process.",
      "selector": "page.keyboard.press('Enter')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Click the 'Boards' breadcrumb link to navigate back to the main boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the list of all boards.",
      "business_impact": "Allows the user to return to the main view to see all their boards.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 85,
          "strategy": "role_name"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "verify_state",
      "description": "Verify that the newly created board 'Automated board 1' is visible on the boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "The text 'Automated board 1' is present on the page.",
      "business_impact": "Confirms the success of the board creation workflow.",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Click the 'Create new board' button again to start creating a second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Navigated to the new board creation page.",
      "business_impact": "Initiates the creation of another board for deletion testing.",
      "selector": "page.getByRole('link', { name: /Create new board/ })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "confidence": 96,
          "strategy": "aria_label_regex"
        },
        {
          "selector": "page.locator('#add-board-button')",
          "confidence": 75,
          "strategy": "id"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 96,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "input_text",
      "description": "Enter the name 'Automated board 2' for the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "input_value": "Automated board 2",
      "verification_point": "The input field is populated with the second board's name.",
      "business_impact": "Defines the identity of the board to be deleted.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.getByLabel('Title')",
          "confidence": 93,
          "strategy": "label_text"
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "confidence": 75,
          "strategy": "id"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/91",
      "verification_point": "Page navigates to the newly created second board's view.",
      "business_impact": "Completes the setup for the deletion test.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "confidence": 80,
          "strategy": "css_combined_classes"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "click",
      "description": "Click the 'Boards' breadcrumb link to navigate back to the main boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page navigates back to the list of all boards.",
      "business_impact": "Returns the user to the main view to perform the deletion.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 85,
          "strategy": "role_name"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 15,
      "action": "click",
      "description": "Click the delete icon associated with the 'Automated board 2'.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "A confirmation dialog may appear, and upon confirmation, the page should refresh.",
      "business_impact": "Tests the critical functionality of removing unwanted boards.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/91\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/91\"]')",
          "confidence": 88,
          "strategy": "css_class_href_combined"
        },
        {
          "selector": "page.locator('a[href*=\"91\"]')",
          "confidence": 79,
          "strategy": "href_relative"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[5]/td[4]/a')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 16,
      "action": "verify_state",
      "description": "Verify that the board named 'Automated board 2' is no longer visible on the boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "The text 'Automated board 2' is not present on the page.",
      "business_impact": "Confirms the success of the board deletion workflow.",
      "confidence": 100,
      "based_on_interaction": true
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

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.locator('h3').getByText(listName1)).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/demo-project/boards/92
Total Visible Elements on Page: 273
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
    "tag": "button",
    "id": null,
    "classes": "spot-link op-toast--close",
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
      "tag": "div",
      "classes": "op-toast--content"
    },
    "position": {
      "x": 890,
      "y": 77,
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
    "role": "img",
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "button",
      "classes": "spot-link op-toast--close"
    },
    "position": {
      "x": 890,
      "y": 77,
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
      "x": 894,
      "y": 80,
      "width": 9,
      "height": 9
    }
  },
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
    "id": "dialog-show-dialog-3a1fd31f-1425-4223-98fa-ba133b1071af",
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
    "id": "icon-button-9ebb9ee4-3626-441c-9f59-80fa0e7b3ba8",
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
    "id": "dialog-show-dialog-fc4d3cf0-3af1-4c66-a7a1-0c4cebb9e5be",
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

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.getByRole('heading', { name: listName1 })).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
});
```

---

## Test: create_a_board_with_a_list_then_create_and_delete_a_second_b
**File**: create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js
**Iteration**: 2/3
**Timestamp**: 2025-12-12 11:03:49
**Status**: FAILED

### Error Details
```
Test: Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('Automated board 1 - 1765537370228')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Automated board 1 - 1765537370228')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('Automated board 1 - 1765537370228')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Automated board 1 - 1765537370228')[22m


  140 |
  141 |   // Step 10: Verify that the newly created board is visible
> 142 |   await expect(page.getByText(boardName1)).toBeVisible();
      |                                            ^
  143 |
  144 |   // Step 11: Click the 'Create new board' button again
  145 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:142:44
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:142:44

Test Status: failed
Duration: 19391ms
```

### Test Code at This Iteration
```javascript
import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.getByRole('heading', { name: listName1 })).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
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
Test: Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('Automated board 1 - 1765537370228')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Automated board 1 - 1765537370228')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('Automated board 1 - 1765537370228')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Automated board 1 - 1765537370228')[22m


  140 |
  141 |   // Step 10: Verify that the newly created board is visible
> 142 |   await expect(page.getByText(boardName1)).toBeVisible();
      |                                            ^
  143 |
  144 |   // Step 11: Click the 'Create new board' button again
  145 |   // Captured selectors:
    at /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:142:44
  Location: /var/tmp/Roost/RoostGPT/open-project-board_gemini/a2b48c50-18c3-4dc6-924f-0e29813b7103/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js:142:44

Test Status: failed
Duration: 19391ms
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

**Test Name:** create_a_board_with_a_list_then_create_and_delete_a_second_b
**Test File:** create_a_board_with_a_list_then_create_and_delete_a_second_b.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "create_a_board_with_a_list_then_create_and_delete_a_second_b",
  "site_url": "https://zbio.openproject.com/projects/demo-project",
  "test_type": "e2e_business_workflow",
  "description": "This comprehensive end-to-end scenario validates the core board management functionality. It covers creating a board, adding a list to it, verifying its creation, then creating a second board and immediately deleting it, confirming its removal. This flow combines two user-provided scenarios into a single, sequential test.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the project's main dashboard page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project",
      "verification_point": "Page URL is the project dashboard.",
      "business_impact": "Ensures the user can access the starting point of the project.",
      "selector": "page.goto('https://zbio.openproject.com/projects/demo-project')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Boards section from the main project menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page URL changes to the boards list page.",
      "business_impact": "Allows users to access the board management feature.",
      "selector": "page.getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('#main-menu-boards')",
          "confidence": 85,
          "strategy": "id"
        }
      ],
      "confidence": 95,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the 'Create new board' button to initiate the board creation process.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Navigated to the new board creation page.",
      "business_impact": "Starts the primary workflow for creating a new project board.",
      "selector": "page.getByRole('link', { name: /Create new board/ })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "confidence": 96,
          "strategy": "aria_label_regex"
        },
        {
          "selector": "page.locator('#add-board-button')",
          "confidence": 75,
          "strategy": "id"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 96,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "input_text",
      "description": "Enter the name for the new board in the 'Title' input field.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "input_value": "Automated board 1",
      "verification_point": "The input field is populated with the board name.",
      "business_impact": "Defines the identity of the new board.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.getByLabel('Title')",
          "confidence": 93,
          "strategy": "label_text"
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "confidence": 75,
          "strategy": "id"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the new board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "verification_point": "Page navigates to the newly created board's view.",
      "business_impact": "Completes the board creation process.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "confidence": 80,
          "strategy": "css_combined_classes"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "click",
      "description": "Click the 'Add list to board' button to create a new column/list on the board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "verification_point": "An input field appears to name the new list.",
      "business_impact": "Allows users to structure their board with workflow stages.",
      "selector": "page.getByText('Add list to board')",
      "all_selectors": [
        {
          "selector": "page.getByText('Add list to board')",
          "confidence": 88,
          "strategy": "text"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "input_text",
      "description": "Enter the name for the new list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "input_value": "Automated List 1",
      "verification_point": "The input field is populated with the list name.",
      "business_impact": "Defines the name of the new workflow stage.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]/board-list/div/div[1]/h3/editable-toolbar-title/div/input')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByPlaceholder('Name of this view')",
          "confidence": 85,
          "strategy": "placeholder"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "send_keys",
      "description": "Press the 'Enter' key to confirm the new list name and create the list.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/90",
      "input_value": "Enter",
      "verification_point": "The new list is created and visible on the board.",
      "business_impact": "Completes the list creation process.",
      "selector": "page.keyboard.press('Enter')",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 9,
      "action": "click",
      "description": "Click the 'Boards' breadcrumb link to navigate back to the main boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "Page navigates back to the list of all boards.",
      "business_impact": "Allows the user to return to the main view to see all their boards.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 85,
          "strategy": "role_name"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 10,
      "action": "verify_state",
      "description": "Verify that the newly created board 'Automated board 1' is visible on the boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards",
      "verification_point": "The text 'Automated board 1' is present on the page.",
      "business_impact": "Confirms the success of the board creation workflow.",
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 11,
      "action": "click",
      "description": "Click the 'Create new board' button again to start creating a second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "verification_point": "Navigated to the new board creation page.",
      "business_impact": "Initiates the creation of another board for deletion testing.",
      "selector": "page.getByRole('link', { name: /Create new board/ })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: /Create new board/ })",
          "confidence": 96,
          "strategy": "aria_label_regex"
        },
        {
          "selector": "page.locator('#add-board-button')",
          "confidence": 75,
          "strategy": "id"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 96,
      "based_on_interaction": true
    },
    {
      "step_number": 12,
      "action": "input_text",
      "description": "Enter the name 'Automated board 2' for the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/new",
      "input_value": "Automated board 2",
      "verification_point": "The input field is populated with the second board's name.",
      "business_impact": "Defines the identity of the board to be deleted.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('textbox', { name: 'Title' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('textbox', { name: 'Title' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.getByLabel('Title')",
          "confidence": 93,
          "strategy": "label_text"
        },
        {
          "selector": "page.locator('#boards_grid_name')",
          "confidence": 75,
          "strategy": "id"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 13,
      "action": "click",
      "description": "Click the 'Create' button to finalize the creation of the second board.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/91",
      "verification_point": "Page navigates to the newly created second board's view.",
      "business_impact": "Completes the setup for the deletion test.",
      "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
      "all_selectors": [
        {
          "selector": "page.locator('form[action*=\"boards\"]').getByRole('button', { name: 'Create' })",
          "confidence": 97,
          "strategy": "form_action_role"
        },
        {
          "selector": "page.getByRole('button', { name: 'Create' })",
          "confidence": 95,
          "strategy": "role_name"
        },
        {
          "selector": "page.locator('button.-primary.button')",
          "confidence": 80,
          "strategy": "css_combined_classes"
        }
      ],
      "confidence": 97,
      "based_on_interaction": true
    },
    {
      "step_number": 14,
      "action": "click",
      "description": "Click the 'Boards' breadcrumb link to navigate back to the main boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "Page navigates back to the list of all boards.",
      "business_impact": "Returns the user to the main view to perform the deletion.",
      "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
      "all_selectors": [
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a')",
          "confidence": 50,
          "strategy": "xpath"
        },
        {
          "selector": "page.getByRole('link', { name: 'Boards' })",
          "confidence": 85,
          "strategy": "role_name"
        }
      ],
      "confidence": 50,
      "based_on_interaction": true
    },
    {
      "step_number": 15,
      "action": "click",
      "description": "Click the delete icon associated with the 'Automated board 2'.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "A confirmation dialog may appear, and upon confirmation, the page should refresh.",
      "business_impact": "Tests the critical functionality of removing unwanted boards.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/91\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/91\"]')",
          "confidence": 88,
          "strategy": "css_class_href_combined"
        },
        {
          "selector": "page.locator('a[href*=\"91\"]')",
          "confidence": 79,
          "strategy": "href_relative"
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[5]/td[4]/a')",
          "confidence": 50,
          "strategy": "xpath"
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 16,
      "action": "verify_state",
      "description": "Verify that the board named 'Automated board 2' is no longer visible on the boards list page.",
      "expected_page_url": "https://zbio.openproject.com/projects/demo-project/boards/",
      "verification_point": "The text 'Automated board 2' is not present on the page.",
      "business_impact": "Confirms the success of the board deletion workflow.",
      "confidence": 100,
      "based_on_interaction": true
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

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.getByRole('heading', { name: listName1 })).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/demo-project/boards/
Total Visible Elements on Page: 307
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
    "id": "dialog-show-dialog-391774be-2ec6-47d8-a59b-3ab42436b801",
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
    "id": "icon-button-47e7d5ed-2d6e-4815-acb7-8db77c351650",
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
    "id": "dialog-show-dialog-ef813601-812a-4cde-94ff-642ec368cda0",
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
    "href": "https://zbio.openproject.com/projects/demo-project/boards/90",
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

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board with a List, then Create and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Navigate to the project's main dashboard page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#main-menu-boards') (confidence: 85%, strategy: id)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%, strategy: text)
  //   2. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/div[3]/div[1]/ng-component/div/div[2]') (confidence: 50%, strategy: xpath)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list
  // Using the more stable placeholder selector over the fragile XPath.
  // Captured selectors:
  //   1. page.getByPlaceholder('Name of this view') (confidence: 85%, strategy: placeholder)
  //   2. page.locator('xpath=.../input') (confidence: 50%, strategy: xpath)
  await page.getByPlaceholder('Name of this view').fill(listName1);

  // Step 8: Press the 'Enter' key to confirm the new list name
  await page.keyboard.press('Enter');
  // Verify the list was created before proceeding
  await expect(page.getByRole('heading', { name: listName1 })).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link to navigate back
  // Using a more specific locator for the breadcrumb to avoid ambiguity with the main menu link.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 10: Verify that the newly created board is visible
  await expect(page.getByRole('link', { name: boardName1 })).toBeVisible();

  // Step 11: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/sub-header/div[3]/a[1]') (confidence: 50%, strategy: xpath)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 12: Enter the name for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 13: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 14: Click the 'Boards' breadcrumb link again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   2. page.locator('xpath=.../li[3]/a') (confidence: 50%, strategy: xpath)
  await page.locator('op-breadcrumbs').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?$`));

  // Step 15: Click the delete icon for the second board
  // Handle the confirmation dialog that appears upon clicking delete.
  page.on('dialog', dialog => dialog.accept());
  // Locate the row containing the second board's name, then find the delete icon within that row.
  // Captured selectors:
  //   1. page.locator('a.icon-delete[href*="/boards/91"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="91"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('xpath=.../tr[5]/td[4]/a') (confidence: 50%, strategy: xpath)
  await page.locator('tr').filter({ hasText: boardName2 }).locator('a.icon-delete').click();

  // Step 16: Verify that the second board is no longer visible
  // Wait for the element to be hidden to confirm deletion.
  await expect(page.getByText(boardName2)).toBeHidden();
});
```

---

