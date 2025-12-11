import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Capture accessibility tree on failure for intelligent iteration
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Wait for any animations/modals to fully render
      // await page.waitForTimeout(15000);
      
      const accessibilityTree = await page.accessibility.snapshot();
      
      // UNIVERSAL SOLUTION: Capture complete DOM snapshot (like Chrome DevTools)
      // AI analyzes actual DOM instead of relying on pattern matching
      const domSnapshot = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(el => {
            // Only visible elements
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
              classes: el.className || null,  // EXACT full class string
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
      // Remove .spec.js and optional .auth/.noauth prefixes
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

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OpenProject login page.
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);
    await expect(page).toHaveURL(process.env.LOGIN_URL);

    // Step 2: Enter the username into the username field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. page.getByRole('textbox', { name: 'Username' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. page.getByLabel('Username') (confidence: 93%, strategy: label_text, unique: false)
    //   4. page.locator('#username') (confidence: 75%, strategy: id, unique: true)
    //   5. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div/form/div[1]/div/span/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the password into the password field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. page.getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. page.getByLabel('Password') (confidence: 93%, strategy: label_text, unique: false)
    //   4. page.locator('#password') (confidence: 75%, strategy: id, unique: true)
    //   5. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div/form/div[2]/div/span/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the 'Sign in' button to submit credentials.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex, unique: true)
    //   2. page.getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex, unique: false)
    //   3. page.locator('input[data-controller="disable-when-clicked"]') (confidence: 85%, strategy: data_attr_controller, unique: true)
    //   4. page.locator('#login-form').getByRole('button', { name: 'Sign in' }) (confidence: 82%, strategy: parent_id_role, unique: true)
    //   5. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div/form/div[3]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

    // Step 5: Verify successful login by checking for navigation to the main application page.
    const expectedUrl = `${process.env.LOGIN_HOST_URL || process.env.BASE_HOST_URL}/`;
    await page.waitForURL(new RegExp(`${expectedUrl}?$`)); // Handles optional trailing slash
    await expect(page).toHaveURL(new RegExp(`${expectedUrl}?$`));

    // Wait for authentication to fully propagate
    await page.waitForLoadState('networkidle');
    
    // Save authenticated state for other tests to reuse
    await context.storageState({ path: '../.auth/storage-state.json' });
    console.log('✅ Storage state saved - other tests can now skip login!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
});