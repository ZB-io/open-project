import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Generate unique names for the test entities to ensure idempotency
const uniqueId = Date.now();
const boardName1 = `Automated board ${uniqueId}`;
const listName = `Automated List ${uniqueId}`;
const boardNameToDelete = `Automated board for deletion ${uniqueId}`;

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

test('Discovered Workflow: Full Board Lifecycle - Create with List, then Create and Delete', async ({ page }) => {
  // Automatically accept any confirmation dialogs that appear, common for delete actions.
  page.on('dialog', dialog => dialog.accept());

  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 95%, strategy: role_name, unique: false)
  //   2. page.locator('#main-menu-boards-link') (confidence: 90%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/`);
  await page.waitForLoadState('networkidle');

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('a.Button--primary[href*="o-project/boards/new"]') (confidence: 88%, strategy: css_class_href_combined, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: false)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);
  await page.waitForLoadState('networkidle');

  // Step 4: Enter the name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName1);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.-primary').filter({ hasText: 'Create' }) (confidence: 85%, strategy: css_filter_text, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));
  await page.waitForLoadState('networkidle');

  // Step 6: Click the 'Add list to board' placeholder
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('span').filter({ hasText: 'Add list to board' }) (confidence: 69%, strategy: tag_filter_text, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter the name for the new list and press Enter
  // No selector was captured, so we use a common pattern for dynamically appearing inputs.
  const listNameInput = page.locator('input[name="name"]');
  await listNameInput.fill(listName);
  await page.keyboard.press('Enter');
  await expect(page.getByText(listName)).toBeVisible();

  // Step 8: Click the 'Boards' breadcrumb link
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: false)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?`));
  await page.waitForLoadState('networkidle');

  // Step 9: Verify that the newly created board is present
  await expect(page.getByText(boardName1)).toBeVisible();

  // Step 10: Click the 'Create new board' button again
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('a.Button--primary[href*="o-project/boards/new"]') (confidence: 88%, strategy: css_class_href_combined, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);
  await page.waitForLoadState('networkidle');

  // Step 11: Enter the name for the second board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardNameToDelete);

  // Step 12: Click the 'Create' button for the second board
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));
  await page.waitForLoadState('networkidle');

  // Step 13: Return to the main boards list page
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/?`));
  await page.waitForLoadState('networkidle');

  // Step 14: Locate and delete the second board
  // Captured selectors:
  //   1. page.getByRole('row', { name: 'Automated board for deletion' }).getByRole('link').nth(1) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('a.icon-delete[href*="/boards/110"]') (confidence: 88%, strategy: css_class_href_combined, unique: true)
  const boardRow = page.getByRole('row', { name: new RegExp(boardNameToDelete) });
  await boardRow.waitFor({ state: 'visible' });
  await boardRow.getByRole('link').nth(1).click();
  
  // The dialog handler at the top of the test will accept the confirmation.

  // Step 15: Verify that the second board is no longer visible
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(boardNameToDelete)).not.toBeVisible();
  
  // Final check: ensure the first board still exists
  await expect(page.getByText(boardName1)).toBeVisible();
});