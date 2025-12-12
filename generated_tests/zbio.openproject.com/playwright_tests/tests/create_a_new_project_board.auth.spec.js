/*
 * ⚠️ TEST FAILED AFTER 3 ITERATIONS
 * Test: create_a_new_project_board
 *
 * Errors are captured in test_iteration_errors_create_a_new_project_board.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure

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