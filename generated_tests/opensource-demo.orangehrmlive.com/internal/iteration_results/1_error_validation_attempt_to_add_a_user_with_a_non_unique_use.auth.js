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
      console.error('Failed to capture accessibility state on test failure:', e);
    }
  }
});

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
  await page.locator('.oxd-input-group').filter({ hasText: 'Password' }).getByRole('textbox').fill('admin123');

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