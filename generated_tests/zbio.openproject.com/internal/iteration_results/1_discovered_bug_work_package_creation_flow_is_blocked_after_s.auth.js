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

test('Discovered Bug: Work Package Creation Flow is Blocked After Selecting Type', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // The test starts at the project dashboard, authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project`);

  // Step 2: Navigate to the 'Work packages' section
  // Captured selectors:
  //   1. page.locator('#main-menu-work-packages-wrapper').getByRole('link', { name: 'Work packages' }) (confidence: 82%, strategy: parent_id_role)
  //   2. page.getByRole('link', { name: /Work packages/ }) (confidence: 80%, strategy: role_name_regex)
  //   3. page.locator('a.work-packages-menu-item.selected') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('#main-menu-work-packages-wrapper').getByRole('link', { name: 'Work packages' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages`);

  // Step 3: Click the 'Create' button to open the dropdown menu
  // Captured selectors:
  //   1. page.getByRole('button', { name: /Create new work package/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.getByRole('button', { name: /Create new work package/ }) (confidence: 95%, strategy: role_name_regex)
  //   3. page.locator('#content-body').getByRole('button', { name: 'Create new work package' }) (confidence: 82%, strategy: parent_id_role)
  // Using the most stable selector with the highest confidence.
  await page.getByRole('button', { name: /Create new work package/ }).click();

  // Step 4: Select 'Tasks' from the creation dropdown
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Tasks' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#work_packages_sidemenu').getByRole('link', { name: 'Tasks' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/div[1]/div/ul/li[2]/ul/li/turbo-frame/div/div[2]/div[2]/ul/li[2]/a') (confidence: 50%, strategy: xpath)
  // This click is expected to trigger the bug.
  await page.getByRole('link', { name: 'Tasks' }).click();

  // Verification: Confirm the bug by checking that the page navigates but the creation form does not appear.
  // The URL changes, indicating a navigation event occurred.
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages?query_id=3`);
  
  // The core of the bug is that the creation form is missing.
  // We verify this by asserting that a key input field, like 'Subject', is NOT visible.
  await expect(page.getByLabel('Subject')).not.toBeVisible();
});