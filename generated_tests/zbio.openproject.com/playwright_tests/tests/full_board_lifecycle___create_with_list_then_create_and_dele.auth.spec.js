/*
 * ⚠️ TEST FAILED AFTER 3 ITERATIONS
 * Test: full_board_lifecycle_-_create_with_list_then_create_and_dele
 *
 * Errors are captured in test_iteration_errors_full_board_lifecycle___create_with_list_then_create_and_dele.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Generate unique names for the boards and list to ensure test idempotency
const boardName1 = `Automated board ${Date.now()}`;
const listName = `Automated List ${Math.random().toString(36).substring(2, 8)}`;
const boardName2 = `Automated board for deletion ${Date.now()}`;

// Capture accessibility tree on failure

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