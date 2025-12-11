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
    } catch (e) {
      console.error('Failed to capture accessibility tree:', e);
    }
  }
});

test.setTimeout(120000);

test('Create, Verify, and Delete a Task Work Package', async ({ page }) => {
  // Generate unique data for the work package to ensure test isolation
  const uniqueId = Date.now();
  const taskSubject = `Auto WP ${uniqueId}`;
  const taskDescription = `Auto description created at ${new Date().toISOString()}`;

  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(BASE_URL || BASE_HOST_URL);

  // Step 2: Navigate to the 'Work packages' section
  // Captured selectors:
  //   1. page.locator('#main-menu-work-packages') (confidence: 95%, strategy: id, is_unique: true)
  //   2. page.getByRole('link', { name: 'Work packages' }) (confidence: 90%, strategy: role_name, is_unique: true)
  await page.locator('#main-menu-work-packages').click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages`);

  // Step 3: Click the 'Create' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: /Create new work package/ }) (confidence: 96%, strategy: aria_label_regex, is_unique: false)
  //   2. page.locator('button.button.-primary') (confidence: 80%, strategy: css_combined_classes, is_unique: true)
  //   3. page.locator('button, input[type="submit"], input[type="button"]').filter({ hasText: /^Create$/ }) (confidence: 75%, strategy: button_filter_exact, is_unique: true)
  await page.getByRole('button', { name: /Create new work package/ , exact: true}).nth(0).click();

  // Step 4: Select 'Task' from the creation dropdown menu
  // Captured selectors:
  //   1. page.getByRole('menuitem', { name: 'Task' }) (confidence: 95%, strategy: role_name, is_unique: true)
  await page.getByRole('menuitem', { name: 'Task', exact: true }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/work_packages/create_new\\?type=1`));

  // Step 5: Enter the subject line for the new task
  // Captured selectors:
  //   1. page.getByLabel('Subject', { exact: true }) (confidence: 92%, strategy: label_text_exact, is_unique: true)
  //   2. page.locator('input.inline-edit--field') (confidence: 84%, strategy: css_tag_semantic_empty, is_unique: false)
  //   3. page.locator('#wp-new-inline-edit--field-subject') (confidence: 75%, strategy: id, is_unique: false)
  await page.getByLabel('Subject', { exact: true }).fill(taskSubject);

  // Step 6: Enter a detailed description for the new task
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: /Rich Text Editor\\. Editing area: main\\. Press Alt\\+0 for help\\./ }) (confidence: 96%, strategy: aria_label_regex, is_unique: true)
  //   2. page.locator('div.ck-blurred') (confidence: 78%, strategy: css_stable_class, is_unique: true)
  await page.getByRole('textbox', { name: /Rich Text Editor/ }).click();
  await page.keyboard.type(taskDescription);

  // Step 7: Click the 'Save' button to create the new task
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role_name, is_unique: true)
  //   2. page.getByText('Save') (confidence: 88%, strategy: text, is_unique: true)
  //   3. page.locator('#work-packages--edit-actions-save') (confidence: 75%, strategy: id, is_unique: true)
  await page.getByRole('button', { name: 'Save' }).click();

  // Verification: Wait for navigation to the new task's detail page and verify the subject is displayed.
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/work_packages/details/\\d+/overview`));
  await expect(page.getByText(taskSubject).first()).toBeVisible();
  
  // Step 8 from the scenario (filtering) is skipped as it's redundant.
  // We are already on the details page, which confirms creation. We proceed to delete from here.

  // Step 9: Click the 'More' actions button
  // Captured selectors:
  //   1. page.locator('button.button.dropdown-relative') (confidence: 80%, strategy: css_combined_classes, is_unique: true)
  // Using a more specific selector for the 'More' button in the details header
  await page.locator('.work-packages--details-toolbar-options-dropdown-button').click();

  // Step 10: Select the 'Delete' option from the menu
  // Captured selectors:
  //   1. page.locator('[role="menu"]').getByRole('menuitem', { name: 'Delete' }) (confidence: 97%, strategy: portal_role_name, is_unique: true)
  //   2. page.getByRole('menuitem', { name: 'Delete', exact: true }) (confidence: 96%, strategy: aria_label_exact, is_unique: true)
  //   3. page.getByText('Delete') (confidence: 88%, strategy: text, is_unique: true)
  await page.locator('[role="menu"]').getByRole('menuitem', { name: 'Delete' }).click();

  // Step 11: Confirm the deletion
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Delete' }) (confidence: 95%, strategy: role_name, is_unique: true)
  // Wait for the confirmation dialog to be visible before clicking
  const confirmationDialog = page.locator('.op-modal');
  await confirmationDialog.waitFor({ state: 'visible' });
  await confirmationDialog.getByRole('button', { name: 'Delete' }).click();

  // Final Verification: Ensure redirection to the work packages list and the task is gone.
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages`);
  
  // Check for the success notification toast
  await expect(page.locator('.op-toast--content').first()).toBeVisible();
  await expect(page.getByText('Successful deletion.')).toBeVisible();

  // Verify the deleted task subject is no longer on the page
  await expect(page.getByText(taskSubject)).not.toBeVisible();
});
