/*
 * ⚠️ TEST FAILED AFTER 5 ITERATIONS
 * Test: attempt_to_add_a_user_with_a_non-unique_username
 *
 * Errors are captured in test_iteration_errors_attempt_to_add_a_user_with_a_non_unique_username.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We start at the dashboard.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // The test is on the login page because authentication state is missing for this no-auth test.
  // We need to log in first.
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: css, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL('**/admin/viewSystemUsers');

  // Step 6: Click the 'Add' button to open the 'Add User' form
  // Captured selectors:
  //   1. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL('**/admin/saveSystemUser');

  // Step 7: Open the 'User Role' dropdown
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%, strategy: text, unique: false)
  //   2. page.locator('div.oxd-select-text-input') (confidence: 78%, strategy: css, unique: false)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of available user roles
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Peter Mac');
  // Wait for autocomplete options to appear and select one
  await page.getByRole('option', { name: /Peter Mac Anderson/ }).click();

  // Step 10: Open the 'Status' dropdown
  // Captured selectors:
  //   1. page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2) (confidence: 99%, strategy: css, unique: false)
  //   2. page.getByText('-- Select --') (confidence: 88%, strategy: text, unique: false)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the list of available statuses
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: true)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: role, unique: false)
  //   2. page.locator('input.oxd-input--active') (confidence: 74%, strategy: css, unique: false)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 13: Enter a password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: role, unique: false)
  //   2. page.locator('input[type="password"]') (confidence: 88%, strategy: css, unique: false)
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('ValidPassword123!');

  // Step 14: Re-enter the password in the confirmation field
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: role, unique: false)
  //   2. page.locator('input[type="password"]') (confidence: 88%, strategy: css, unique: false)
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('ValidPassword123!');

  // Step 15: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the 'Username already exists' error message is displayed
  // This is the final goal of the test.
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});