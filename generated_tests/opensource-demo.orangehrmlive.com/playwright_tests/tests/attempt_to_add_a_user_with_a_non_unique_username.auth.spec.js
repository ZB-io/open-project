/*
 * ⚠️ TEST FAILED AFTER 3 ITERATIONS
 * Test: attempt_to_add_a_user_with_a_non-unique_username
 *
 * Errors are captured in test_iteration_errors_attempt_to_add_a_user_with_a_non_unique_username.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We navigate directly to the app's starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 5: Navigate to the 'Admin' section by clicking the link in the main navigation menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 6: Click the 'Add' button to initiate the new user creation workflow.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 7: Open the 'User Role' dropdown menu to select a role for the new user.
  // Using a more robust selector that finds the dropdown associated with the 'User Role' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).locator('.oxd-select-wrapper').first().click();

  // Step 8: Select 'Admin' from the 'User Role' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 9: Open the 'Status' dropdown menu to set the user's account status.
  // Using a more robust selector that finds the dropdown associated with the 'Status' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').first().click();

  // Step 10: Select 'Enabled' from the 'Status' dropdown list.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 11: Enter 'manda user' into the 'Employee Name' field to search for an employee.
  // Captured selectors:
  //   1. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  await page.getByPlaceholder('Type for hints...').fill('manda user');

  // Step 12: Select 'manda akhil user' from the autocomplete suggestions.
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'manda akhil user' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('option', { name: 'manda akhil user' }).click();

  // Step 13: Enter the non-unique username 'Admin' into the 'Username' field.
  // Using a robust selector based on the 'Username' label to avoid fragile XPath.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).locator('input').fill('Admin');

  // Step 14: Enter a password in the 'Password' field.
  // Using a robust selector based on the 'Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 15: Confirm the password in the 'Confirm Password' field.
  // Using a robust selector based on the 'Confirm Password' label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('S3cureP@ssw0rd!');

  // Step 16: Click the 'Save' button to attempt to create the new user.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 17: Verify that the error message 'Username already exists' is displayed on the page.
  const errorMessage = page.getByText('Username already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
});