import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure

test.setTimeout(120000);

test('Error Validation: Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Load the main application dashboard after a successful login.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: ' Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' for User Role
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'User Role' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Select 'Enabled' for Status
  // Captured selectors:
  //   1. page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2) (confidence: 99%, strategy: text, unique: false)
  // Locate the dropdown associated with the 'Status' label for robustness.
  await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('.oxd-select-text-input').click();
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 6: Enter an employee name in the auto-suggest field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Peter');
  // Wait for the autocomplete suggestion to appear and click it
  await page.getByRole('option', { name: /Peter/ }).first().click();

  // Step 7: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).first().getByRole('textbox').fill('admin123');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: index, unique: true)
  // Using a label-based selector for better stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill('admin123');

  // Step 10: Click the 'Save' button to submit
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This confirms that the system correctly prevents duplicate usernames.
  const errorMessage = page.locator('.oxd-input-field-error-message');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Already exists');
});