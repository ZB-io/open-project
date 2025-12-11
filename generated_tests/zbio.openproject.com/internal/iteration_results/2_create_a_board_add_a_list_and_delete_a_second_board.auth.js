import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Using a unique ID to prevent test collisions on subsequent runs
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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

test('Discovered Workflow: Create a Board, Add a List, and Delete a Second Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Use BASE_URL for initial navigation to the authenticated app
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL));

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%)
  //   3. page.getByText('Boards') (confidence: 78%)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%)
  //   2. page.locator('#content-body').getByRole('link', { name: 'Create new board' }) (confidence: 82%)
  //   3. page.locator('#add-board-button') (confidence: 75%)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter title for the first board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%)
  //   2. page.getByLabel('Title') (confidence: 93%)
  //   3. page.locator('#boards_grid_name') (confidence: 75%)
  await page.getByRole('textbox', { name: 'Title' }).fill(boardName1);

  // Step 5: Click the 'Create' button to finalize the board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%)
  //   2. page.getByRole('button', { name: 'Create' }) (confidence: 95%)
  //   3. page.locator('button.-primary.button') (confidence: 80%)
  await page.getByRole('button', { name: 'Create' }).click();
  // Wait for navigation to the newly created board, which will have a dynamic ID
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click 'Add list to board'
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 88%)
  //   2. page.getByText('board', { exact: true }) (confidence: 80%)
  //   3. page.locator('div').filter({ hasText: /^Add list to board$/ }) (confidence: 68%)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list and press Enter
  // Captured selectors:
  //   1. page.locator('input[type="text"][name="editable-toolbar-title"]') (confidence: 89%)
  //   2. page.locator('input[name="editable-toolbar-title"]') (confidence: 87%)
  //   3. page.getByPlaceholder('Name of this view') (confidence: 85%)
  const listInput = page.locator('input[name="editable-toolbar-title"]');
  await listInput.fill(listName1);
  await listInput.press('Enter');
  // Verify the list has been created on the board
  await expect(page.getByRole('heading', { name: listName1 })).toBeVisible();

  // Step 8: Navigate back to the main Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%)
  //   3. page.getByText('Boards') (confidence: 78%)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);

  // Step 9: Click 'Create new board' for the second time
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%)
  //   2. page.locator('#content-body').getByRole('link', { name: 'Create new board' }) (confidence: 82%)
  //   3. page.locator('#add-board-button') (confidence: 75%)
  await page.getByRole('link', { name: /Create new board/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 10: Enter title for the second board
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%)
  //   2. page.getByLabel('Title') (confidence: 93%)
  //   3. page.locator('#boards_grid_name') (confidence: 75%)
  await page.getByRole('textbox', { name: 'Title' }).fill(boardName2);

  // Step 11: Click the 'Create' button to finalize the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 95%)
  //   2. page.locator('button.-primary.button') (confidence: 80%)
  //   3. page.locator('button, input[type="submit"], input[type="button"]').filter({ hasText: /^Create$/ }) (confidence: 75%)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 12: Navigate back to the main Boards page to find and delete the board
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%)
  //   3. page.getByText('Boards') (confidence: 78%)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);
  await page.waitForLoadState('networkidle');

  // Step 13: Find and delete the second board
  // The deletion triggers a browser confirmation dialog, which we auto-accept.
  page.on('dialog', dialog => dialog.accept());

  // Locate the row containing the second board's name and click the delete icon within it
  const board2Row = page.locator('tr').filter({ hasText: boardName2 });
  await board2Row.locator('a.icon-delete').click();

  // Final Verification: Check that the first board remains and the second is gone
  await expect(page.getByText(boardName1).first()).toBeVisible();
  await expect(page.getByText(boardName2).first()).not.toBeVisible();
});