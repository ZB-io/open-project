import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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
  // Step 1: Navigate to website homepage
  // Navigate to the main dashboard after authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/dashboard/index`);
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Admin section
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Admin' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('[role="navigation"]').getByRole('link', { name: 'Admin' }) (confidence: 88%, strategy: css, unique: true)
  //   3. page.locator('a').filter({ hasText: /^Admin$/ }) (confidence: 74%, strategy: text, unique: true)
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Add' }) (confidence: 95%, strategy: role, unique: true)
  //   2. page.getByRole('button', { name: '\uf4fe Add' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   3. page.locator('button.oxd-button') (confidence: 78%, strategy: css, unique: false)
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Step 4: Select 'Admin' from the User Role dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').first().click();
  // Captured selectors:
  //   1. page.getByRole('option', { name: 'Admin' }).locator('span') (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByText('Admin') (confidence: 88%, strategy: text, unique: false)
  await page.getByRole('option', { name: 'Admin' }).click();

  // Step 5: Enter the employee's name in the autocomplete field
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Type for hints...' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByPlaceholder('Type for hints...') (confidence: 85%, strategy: placeholder, unique: true)
  const employeeNameInput = page.getByPlaceholder('Type for hints...');
  await employeeNameInput.fill('Aniket QA');
  // Wait for autocomplete options to appear and select the correct one.
  await page.getByRole('option', { name: 'Aniket Testing QA' }).click();

  // Step 6: Select 'Enabled' from the Status dropdown
  // This is a two-step action: click to open the dropdown, then click the option.
  await page.locator('.oxd-select-text').nth(1).click();
  // Captured selectors:
  //   1. page.getByText('Enabled') (confidence: 99%, strategy: text, unique: false)
  //   2. page.getByRole('option', { name: 'Enabled' }) (confidence: 99%, strategy: role, unique: true)
  await page.getByRole('option', { name: 'Enabled' }).click();

  // Step 7: Enter the existing username 'Admin'
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(2) (confidence: 99%, strategy: roost_primary, unique: true)
  // Using a more robust selector based on the associated label.
  await page.locator('.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox').fill('Admin');

  // Step 8: Enter a valid password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(3) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').first() (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Password' }).first().locator('input').fill('ValidPassword123!');

  // Step 9: Confirm the password
  // Captured selectors:
  //   1. page.getByRole('textbox').nth(4) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('input[type="password"]').nth(1) (confidence: 88%, strategy: css, unique: true)
  await page.locator('.oxd-form-row').filter({ hasText: 'Confirm Password' }).locator('input').fill('ValidPassword123!');

  // Step 10: Click the 'Save' button to submit the form
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('button.oxd-button.orangehrm-left-space') (confidence: 80%, strategy: css, unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 11: Verify that the 'Already exists' error message is displayed
  // This is the final goal of the test.
  // Captured selectors:
  //   1. page.getByText('Already exists') (confidence: 95%, strategy: text, unique: true)
  const errorMessage = page.getByText('Already exists');
  await expect(errorMessage).toBeVisible({ timeout: 10000 });

  // Also verify that the user remains on the same page.
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`));
});