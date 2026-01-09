import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;
const UI_SITE_PASSWORD = process.env.UI_SITE_PASSWORD;

// Capture accessibility tree and DOM snapshot on failure

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Load the main website dashboard page after a successful login.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Open the 'User Role' dropdown
  // Captured selectors:
  //   1. page.getByText('-- Select --').first() (confidence: 99%)
  await page.getByText('-- Select --').first().click();

  // Step 5: Select the 'Admin' role
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }) (confidence: 99%)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 6: Enter 'John Doe' into the Employee Name field and select from autocomplete
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%)
  await page.getByPlaceholder('Type for hints...').fill('John');
  // Wait for autocomplete options to appear and select the first one
  await page.waitForTimeout(2000);
  await page.getByRole('option').first().click();

  // Step 7: Open the 'Status' dropdown
  // Captured selectors:
  //   1. page.getByText('-- Select --') (confidence: 99%)
  await page.getByText('-- Select --').click();

  // Step 8: Select 'Enabled' from the status dropdown
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 9: Enter the non-unique username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%)
  // Using a more robust selector based on the label for stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 10: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%)
  // Using a more robust selector based on the label for stability.
  await page.locator('.oxd-input-group').filter({ hasText: /^Password$/ }).getByRole('textbox').fill(UI_SITE_PASSWORD);

  // Step 11: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%)
  // Using a more robust selector based on the label for stability.
  await page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).getByRole('textbox').fill(UI_SITE_PASSWORD);

  // Step 12: Click the 'Save' button to submit
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 13: Verify that an error message 'Already exists' is displayed
  // This confirms that the system's data integrity checks are functioning correctly.
  const errorMessage = page.locator('.oxd-input-group .oxd-input-field-error-message');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText('Already exists');
  
  // Final verification: Ensure the page URL has not changed, indicating a failed submission.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});