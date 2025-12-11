## Test: delete_all_existing_boards_from_the_project
**File**: delete_all_existing_boards_from_the_project.auth.spec.js
**Iteration**: 1/3
**Timestamp**: 2025-12-11 05:51:01
**Status**: FAILED

### Error Details
```
Test: Delete All Existing Boards from the Project
======================================================================
Main Error:
[31mTest timeout of 180000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 180000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Boards' }).nth(1)[22m


  85 |   //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  86 |   //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
> 87 |   await page.getByRole('link', { name: 'Boards' }).nth(1).click();
     |                                                           ^
  88 |   await page.waitForURL(`${BASE_URL}/boards`);
  89 |   await page.waitForLoadState('networkidle');
  90 |
    at /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:87:59
  Location: /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:87:59

Test Status: timedOut
Duration: 180306ms
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.getByRole('link', { name: 'Boards' }).nth(1).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
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
Test: Delete All Existing Boards from the Project
======================================================================
Main Error:
[31mTest timeout of 180000ms exceeded.[39m

Detailed Errors:

Error 1:
[31mTest timeout of 180000ms exceeded.[39m

Error 2:
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
[2m  - waiting for getByRole('link', { name: 'Boards' }).nth(1)[22m


  85 |   //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  86 |   //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
> 87 |   await page.getByRole('link', { name: 'Boards' }).nth(1).click();
     |                                                           ^
  88 |   await page.waitForURL(`${BASE_URL}/boards`);
  89 |   await page.waitForLoadState('networkidle');
  90 |
    at /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:87:59
  Location: /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:87:59

Test Status: timedOut
Duration: 180306ms
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

**Test Name:** delete_all_existing_boards_from_the_project
**Test File:** delete_all_existing_boards_from_the_project.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "delete_all_existing_boards_from_the_project",
  "site_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990",
  "test_type": "e2e_business_workflow",
  "description": "This scenario tests the end-to-end workflow of deleting all available boards from the project's board list. The user navigates to the boards section and systematically deletes each board, handling the page refresh after each deletion, until the list is empty.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main project overview page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990",
      "verification_point": "Page URL is the project homepage.",
      "business_impact": "Ensures the user can access the project starting point.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Boards page by clicking the 'Boards' link in the side navigation menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards",
      "verification_point": "Page URL should navigate to the boards list.",
      "business_impact": "Critical for accessing the board management feature.",
      "selector": "page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' }) >> nth=1",
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
        }
      ],
      "confidence": 82,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the delete icon for the first board in the list to initiate its removal.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The first board should be removed from the system.",
      "business_impact": "Tests the core delete functionality for a single board.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/62\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/62\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]') >> nth=0",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete') >> nth=0",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[1]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "navigate",
      "description": "Navigate back to the Boards page to refresh the list after the first deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page reloaded to show the updated list of boards.",
      "business_impact": "Simulates user recovery after a post-action redirect, which is necessary to continue the workflow.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the delete icon for the second board in the updated list.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The second board should be removed from the system.",
      "business_impact": "Continues testing the iterative deletion process.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/63\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/63\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]') >> nth=0",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete') >> nth=0",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[1]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "navigate",
      "description": "Navigate back to the Boards page again to refresh the list after the second deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page reloaded to show the list with one remaining board.",
      "business_impact": "Ensures the workflow can continue after multiple deletions.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Click the delete icon for the final remaining board.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The final board should be removed from the system.",
      "business_impact": "Completes the deletion sequence, leading to an empty state.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/64\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/64\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]')",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete')",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "navigate",
      "description": "Perform a final navigation to the Boards page to verify that it is now empty.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page loaded successfully and now shows an empty state, confirming all boards were deleted.",
      "business_impact": "Final validation of the entire workflow and confirmation of the empty state.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.getByRole('link', { name: 'Boards' }).nth(1).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/meeting-test-project-1764854348990
Total Visible Elements on Page: 410
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
    "id": "dialog-show-dialog-d3369cd5-d3b1-433f-a082-72c4e3f0153f",
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
    "id": "icon-button-1365e7d6-3e1e-4715-a5f1-623d7a9172d4",
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
    "id": "dialog-show-dialog-e84d9e13-e962-4508-880b-68c7a20ee956",
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
    "text": "Meeting Test Project 1764854348990",
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
      "width": 223,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "ellipsis",
    "text": "Meeting Test Project 1764854348990",
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
      "width": 176,
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
      "x": 201,
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
    "classes": "overview-menu-item selected op-menu--item-action",
    "text": "Overview",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "li",
      "classes": "main-menu-item"
    },
    "position": {
      "x": 12,
      "y": 136,
      "width": 255,
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
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "overview-menu-item selected op-menu--item-action"
    },
    "position": {
      "x": 25,
      "y": 146,
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
      "x": 25,
      "y": 146,
      "width": 16,
      "height": 16
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "op-menu--item-title",
    "text": "Overview",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": null,
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "overview-menu-item selected op-menu--item-action"
    },
    "position": {
      "x": 57,
      "y": 136,
      "width": 58,
      "height": 36
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "ellipsis",
    "text": "Overview",
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
      "classes": "op-menu--item-title"
    },
    "position": {
      "x": 57,
      "y": 136,
      "width": 58,
      "height": 36
    }
  },
  {
    "tag": "a",
    "id": "main-menu-work-packages",
    "classes": "work-packages-menu-item op-menu--item-action",
    "text": "Work packages",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/work_packages",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "main-item-wrapper"
    },
    "position": {
      "x": 12,
      "y": 174,
      "width": 219,
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
    "display": "block",
    "hasOnclick": false,
    "parent": {
      "tag": "a",
      "classes": "work-packages-menu-item op-menu--item-action"
    },
    "position": {
      "x": 25,
      "y": 184,
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
      "x": 25,
      "y": 184,
      "width": 16,
      "height": 16
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
});
```

---

## Test: delete_all_existing_boards_from_the_project
**File**: delete_all_existing_boards_from_the_project.auth.spec.js
**Iteration**: 2/3
**Timestamp**: 2025-12-11 05:51:57
**Status**: FAILED

### Error Details
```
Test: Delete All Existing Boards from the Project
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('There are no boards in this project yet.')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('There are no boards in this project yet.')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('There are no boards in this project yet.')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('There are no boards in this project yet.')[22m


  116 |
  117 |   // Further verify the empty state by checking for the message indicating no boards exist.
> 118 |   await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
      |                                                                            ^
  119 | });
    at /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:118:76
  Location: /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:118:76

Test Status: failed
Duration: 10708ms
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
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
Test: Delete All Existing Boards from the Project
======================================================================
Main Error:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('There are no boards in this project yet.')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('There are no boards in this project yet.')[22m


Detailed Errors:

Error 1:
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m()[22m failed

Locator:  getByText('There are no boards in this project yet.')
Expected: visible
Received: <element(s) not found>
Timeout:  5000ms

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('There are no boards in this project yet.')[22m


  116 |
  117 |   // Further verify the empty state by checking for the message indicating no boards exist.
> 118 |   await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
      |                                                                            ^
  119 | });
    at /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:118:76
  Location: /var/tmp/Roost/RoostGPT/open-project-delete-all-boards/f8a8febb-8f17-4ca9-8518-5a8b3cdc9d79/source/open-project/generated_tests/zbio.openproject.com/playwright_tests/tests/delete_all_existing_boards_from_the_project.auth.spec.js:118:76

Test Status: failed
Duration: 10708ms
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

**Test Name:** delete_all_existing_boards_from_the_project
**Test File:** delete_all_existing_boards_from_the_project.auth.spec.js

**Original Scenario from which test was created (Reference Data):**
```json
{
  "test_name": "delete_all_existing_boards_from_the_project",
  "site_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990",
  "test_type": "e2e_business_workflow",
  "description": "This scenario tests the end-to-end workflow of deleting all available boards from the project's board list. The user navigates to the boards section and systematically deletes each board, handling the page refresh after each deletion, until the list is empty.",
  "detailed_steps": [
    {
      "step_number": 1,
      "action": "Navigate to website homepage",
      "description": "Load the main project overview page to begin the test.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990",
      "verification_point": "Page URL is the project homepage.",
      "business_impact": "Ensures the user can access the project starting point.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": false
    },
    {
      "step_number": 2,
      "action": "click",
      "description": "Navigate to the Boards page by clicking the 'Boards' link in the side navigation menu.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards",
      "verification_point": "Page URL should navigate to the boards list.",
      "business_impact": "Critical for accessing the board management feature.",
      "selector": "page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' })",
      "all_selectors": [
        {
          "selector": "page.getByRole('link', { name: 'Boards' }) >> nth=1",
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
        }
      ],
      "confidence": 82,
      "based_on_interaction": true
    },
    {
      "step_number": 3,
      "action": "click",
      "description": "Click the delete icon for the first board in the list to initiate its removal.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The first board should be removed from the system.",
      "business_impact": "Tests the core delete functionality for a single board.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/62\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/62\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]') >> nth=0",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete') >> nth=0",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[1]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 4,
      "action": "navigate",
      "description": "Navigate back to the Boards page to refresh the list after the first deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page reloaded to show the updated list of boards.",
      "business_impact": "Simulates user recovery after a post-action redirect, which is necessary to continue the workflow.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 5,
      "action": "click",
      "description": "Click the delete icon for the second board in the updated list.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The second board should be removed from the system.",
      "business_impact": "Continues testing the iterative deletion process.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/63\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/63\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]') >> nth=0",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete') >> nth=0",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr[1]/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 6,
      "action": "navigate",
      "description": "Navigate back to the Boards page again to refresh the list after the second deletion.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page reloaded to show the list with one remaining board.",
      "business_impact": "Ensures the workflow can continue after multiple deletions.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
      "confidence": 100,
      "based_on_interaction": true
    },
    {
      "step_number": 7,
      "action": "click",
      "description": "Click the delete icon for the final remaining board.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "The final board should be removed from the system.",
      "business_impact": "Completes the deletion sequence, leading to an empty state.",
      "selector": "page.locator('a.icon-delete[href*=\"/boards/64\"]')",
      "all_selectors": [
        {
          "selector": "page.locator('a.icon-delete[href*=\"/boards/64\"]')",
          "strategy": "css_class_href_combined",
          "confidence": 88
        },
        {
          "selector": "page.locator('a[data-turbo-method=\"delete\"]')",
          "strategy": "data_attr_turbo-method",
          "confidence": 85
        },
        {
          "selector": "page.locator('a.icon-delete')",
          "strategy": "css_tag_semantic_empty",
          "confidence": 84
        },
        {
          "selector": "page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div[1]/div/table/tbody/tr/td[4]/a')",
          "strategy": "xpath",
          "confidence": 50
        }
      ],
      "confidence": 88,
      "based_on_interaction": true
    },
    {
      "step_number": 8,
      "action": "navigate",
      "description": "Perform a final navigation to the Boards page to verify that it is now empty.",
      "expected_page_url": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/",
      "verification_point": "Page loaded successfully and now shows an empty state, confirming all boards were deleted.",
      "business_impact": "Final validation of the entire workflow and confirmation of the empty state.",
      "selector": "page.goto('https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/')",
      "all_selectors": [],
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
});
```

═══════════════════════════════════════════════════════════════
📊 DOM SNAPSHOT (Filtered - Most Relevant Elements)
═══════════════════════════════════════════════════════════════


**CAPTURED PAGE STATE - INTELLIGENTLY FILTERED DOM SNAPSHOT:**

URL: https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/
Total Visible Elements on Page: 157
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
    "id": "dialog-show-dialog-390ea711-9099-442d-bb3d-380e90ad9e79",
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
    "id": "icon-button-c297167a-050c-4273-a4b0-c40e012907ca",
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
    "id": "dialog-show-dialog-84f45759-6e67-403d-b72e-be198f4939d2",
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
    "text": "Meeting Test Project 1764854348990",
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
      "width": 223,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "ellipsis",
    "text": "Meeting Test Project 1764854348990",
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
      "width": 176,
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
      "x": 201,
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
    "href": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards",
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
    "tag": "a",
    "id": null,
    "classes": "op-submenu--footer-action Button--primary Button--medium Button",
    "text": "Board",
    "value": null,
    "role": null,
    "ariaLabel": null,
    "type": null,
    "href": "https://zbio.openproject.com/projects/meeting-test-project-1764854348990/boards/new",
    "cursor": "pointer",
    "display": "flex",
    "hasOnclick": false,
    "parent": {
      "tag": "div",
      "classes": "op-submenu--footer"
    },
    "position": {
      "x": 28,
      "y": 463,
      "width": 223,
      "height": 32
    }
  },
  {
    "tag": "span",
    "id": null,
    "classes": "Button-content",
    "text": "Board",
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
      "classes": "op-submenu--footer-action Button--primary Button--medium Button"
    },
    "position": {
      "x": 41,
      "y": 469,
      "width": 197,
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
      "x": 109,
      "y": 471,
      "width": 16,
      "height": 16
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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo_method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText(/no boards.*yet/i)).toBeVisible();
});
```

---

