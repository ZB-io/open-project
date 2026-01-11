import 'dotenv/config';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree and screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
      // Capture screenshot on failure for visual analysis
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
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
              hasOnclick: !!el['onclick'] || el.hasAttribute('onclick'),
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
      
      // Save screenshot as separate PNG file
      const screenshotDir = path.join(__dirname, '..', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotDir, `${fileName}_failure.png`);
      fs.writeFileSync(screenshotPath, screenshot);
      
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url(),
        screenshot_path: screenshotPath
      }, null, 2));
    } catch (e) {
      console.error('Failed to capture accessibility tree or screenshot on failure:', e);
    }
  }
});

test.setTimeout(120000);

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Authentication is handled by storage state. We start at the dashboard.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

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
  await page.locator('.oxd-form-row').filter({ hasText: 'User Role' }).getByText('-- Select --').click();

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