import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

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
  await page.locator('.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper').click();

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