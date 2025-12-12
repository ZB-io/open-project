/*
 * ⚠️ TEST FAILED AFTER 3 ITERATIONS
 * Test: create_a_board_with_a_list_then_create_and_delete_a_second_b
 *
 * Errors are captured in test_iteration_errors_create_a_board_with_a_list_then_create_and_delete_a_second_b.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Dynamic test data to ensure test isolation and prevent failures on re-runs.
const uniqueId = Date.now();
const boardName1 = `Automated board 1 - ${uniqueId}`;
const listName1 = `Automated List 1 - ${uniqueId}`;
const boardName2 = `Automated board 2 - ${uniqueId}`;

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