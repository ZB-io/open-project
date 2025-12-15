import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Dynamic test data for unique board and list names
const uniqueId = Date.now();
const boardName = `Automated board ${uniqueId}`;
const listName = `Automated List ${uniqueId}`;

// Capture accessibility tree on failure

test.setTimeout(120000);

test('Discovered Workflow: Create a New Board and Add a List', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project`);

  // Step 2: Navigate to the 'Boards' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: false)
  //   2. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.locator('a.Button--primary[href*="o-project/boards/new"]') (confidence: 88%, strategy: css_class_href_combined, unique: true)
  //   2. page.locator('a.Button--primary') (confidence: 84%, strategy: css_tag_semantic_empty, unique: true)
  await page.locator('a.Button--primary[href*="o-project/boards/new"]').first().click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards/new`);

  // Step 4: Enter a unique name for the new board
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role, unique: true)
  //   3. page.getByLabel('Title') (confidence: 93%, strategy: label_text, unique: true)
  //   4. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 5: Click the 'Create' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Wait for navigation to the newly created board's page
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 6: Click the 'Add list to board' button
  // Captured selectors:
  //   1. page.getByText('Add list to board') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('board', { exact: true }) (confidence: 80%, strategy: text_exact_extracted, unique: true)
  //   3. page.locator('span').filter({ hasText: 'Add list to board' }) (confidence: 69%, strategy: tag_filter_text, unique: true)
  await page.getByText('Add list to board').click();

  // Step 7: Enter a name for the new list
  // Captured selectors:
  //   1. page.locator('div:nth-child(7) > board-list > .op-board-list > .op-board-list--header > .toolbar-title--container > .-small > .editable-toolbar-title--container > .editable-toolbar-title--input.-border-on-hover-only') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[name="editable-toolbar-title"]').nth(7) (confidence: 69%, strategy: name_attribute, unique: false)
  //   3. page.getByPlaceholder('Name of this view').nth(7) (confidence: 67%, strategy: placeholder, unique: false)
  // Note: The provided primary selector is highly specific. A more robust approach would be to target the last visible input of its kind.
  const listNameInput = page.locator('input.editable-toolbar-title--input').last();
  await listNameInput.waitFor({ state: 'visible' });
  await listNameInput.fill(listName);

  // Step 8: Press the 'Enter' key to save the new list
  await listNameInput.press('Enter');
  
  // Verify the new list is created and displayed on the board
  await expect(page.locator('.op-board-list', { hasText: listName })).toBeVisible();

  // Step 9: Click the 'Boards' breadcrumb link
  // Captured selectors:
  //   1. page.locator('#content-body').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }).nth(3) (confidence: 85%, strategy: role_name, unique: false)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/openproject-base/div/ui-view/openproject-base/div/ui-view/boards-entry/ui-view/ng-component/div/op-breadcrumbs/div/nav[1]/ol/li[3]/a') (confidence: 50%, strategy: xpath, unique: true)
  await page.locator('#content-body').getByRole('link', { name: 'Boards' }).click();

  // Step 10: Verify navigation to the main Boards page and confirm creation
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);
  
  // Final goal verification: Ensure the newly created board is visible on the boards page.
  await expect(page.getByText(boardName)).toBeVisible();
});