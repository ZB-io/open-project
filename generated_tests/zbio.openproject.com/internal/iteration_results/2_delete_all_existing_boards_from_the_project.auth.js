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

test.setTimeout(180000); // Increased timeout for potentially long-running loop

test('Delete All Existing Boards from the Project', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_URL || BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the Boards page
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards' }) >> nth=1 (confidence: 95%, strategy: role_name)
  //   2. page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class)
  //   4. page.locator('a').filter({ hasText: /^Boards$/ }) (confidence: 74%, strategy: link_filter_exact)
  await page.locator('#boards-wrapper').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_URL}/boards`);
  await page.waitForLoadState('networkidle');

  // Automatically accept any confirmation dialogs that appear when deleting
  page.on('dialog', dialog => dialog.accept());

  // This loop implements the repetitive deletion steps (3, 5, 7) in a robust way.
  // It will continue to delete the first board in the list until no boards are left.
  const deleteIconSelector = 'a.icon-delete';
  while (await page.locator(deleteIconSelector).count() > 0) {
    // Click the delete icon for the first available board
    // Captured selectors (representative for all delete steps):
    //   1. a.icon-delete[href*="/boards/"] (confidence: 88%, strategy: css_class_href_combined)
    //   2. a[data-turbo-method="delete"] >> nth=0 (confidence: 85%, strategy: data_attr_turbo-method)
    //   3. a.icon-delete >> nth=0 (confidence: 84%, strategy: css_tag_semantic_empty)
    await page.locator(deleteIconSelector).first().click();

    // The scenario explicitly requests navigating back to the boards page after each deletion
    // to ensure the list is refreshed correctly. This also handles redirects after deletion.
    await page.waitForLoadState('networkidle'); // Wait for the post-delete action to complete
    if (!page.url().endsWith('/boards')) {
      await page.goto(`${BASE_URL}/boards`);
      await page.waitForLoadState('networkidle');
    }
  }

  // Final verification: Confirm that no delete icons are present on the page.
  await expect(page.locator(deleteIconSelector)).toHaveCount(0);

  // Further verify the empty state by checking for the message indicating no boards exist.
  await expect(page.getByText('There are no boards in this project yet.')).toBeVisible();
});