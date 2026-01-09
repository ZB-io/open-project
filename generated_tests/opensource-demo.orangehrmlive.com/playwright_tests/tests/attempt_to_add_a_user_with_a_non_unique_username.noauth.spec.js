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

// Capture accessibility tree on failure

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state.
  // Navigate to the dashboard, which is the default post-login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  
  // Perform login since the test is running in a no-auth context
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/dashboard/index');

  // Step 5: Click on the 'Admin' menu item to navigate to the user management section.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to open the form for creating a new system user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Click the 'User Role' dropdown to reveal the list of available roles.
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').first().click();

  // Step 8: Select 'Admin' from the list of user roles.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Enter an employee name to associate with the new user account.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('John');
  // Wait for autocomplete options to appear
  await page.waitForTimeout(1500);
  await page.getByRole('option').first().click();

  // Step 10: Click the 'Status' dropdown to reveal account status options.
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).getByText('-- Select --').click();

  // Step 11: Select 'Enabled' from the status dropdown.
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 12: Enter 'Admin' into the username field, which is a known existing username.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').last().fill('Admin');

  // Step 13: Enter a valid password for the new user.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().getByRole('textbox').first().fill('Password123!');

  // Step 14: Confirm the password.
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('Password123!');

  // Step 15: Click the 'Save' button to attempt to submit the form.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 16: Verify that the form submission was blocked and an error message is displayed.
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible();
});