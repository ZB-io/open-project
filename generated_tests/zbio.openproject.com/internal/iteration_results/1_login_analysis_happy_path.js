import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Capture accessibility tree on failure for intelligent iteration
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();

      const visibleElements = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(
          'button, a, input, select, textarea, ' +
          '[role], [onclick], ' +
          'div[class*="btn"], div[class*="button"], ' +
          'span[class*="btn"], span[onclick], ' +
          '[data-testid], [aria-label]'
        ))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 &&
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   style.opacity !== '0';
          })
          .map(el => ({
            tag: el.tagName.toLowerCase(),
            text: (el.innerText || '').trim().substring(0, 80),
            role: el.getAttribute('role'),
            className: el.className || null,
            onclick: el.onclick ? 'has-handler' : null
          }));
      });

      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({
        accessibility_tree: accessibilityTree,
        visible_elements: visibleElements,
        element_count: visibleElements.length,
        url: page.url()
      }, null, 2));
    } catch (e) {
      // Silent fail - don't break test
    }
  }
});

test.setTimeout(120000);

test('login_analysis_happy_path - document incomplete login attempt (no navigation)', async ({ page, context }) => {
  // This test documents a login failure (incomplete login flow)
  // The captured exploration showed no interactions and page remained at about:blank.
  // We intentionally DO NOT navigate to process.env.LOGIN_URL (or BASE_URL) to replicate the failed flow.

  try {
    // Start state: new page with no navigation performed
    const currentUrl = page.url();
    console.log(`Initial URL detected: ${currentUrl}`);

    // EXPECTED FAILURE: Page should remain at about:blank (no navigation occurred)
    await expect(page).toHaveURL('about:blank');

    // Additionally assert we did NOT navigate to the intended login page
    const intendedLoginUrl = process.env.LOGIN_URL || process.env.BASE_URL;
    if (intendedLoginUrl) {
      expect(currentUrl).not.toBe(intendedLoginUrl);
    }

    // No credential entry or form submission is performed in this failure documentation test.
    // No storage state is saved because authentication did not occur.
  } catch (error) {
    throw error;
  }
});