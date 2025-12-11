import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Capture accessibility tree on failure for intelligent iteration
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      // Wait for any animations/modals to fully render
      // await page.waitForTimeout(5000);
      
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
  // This test documents a login failure.
  // It follows the captured steps but expects the login to fail,
  // as indicated by the 'login_completion_state: "failed"' status.
  
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
    await page.getByLabel('Username').fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the password into the password field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. page.getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. page.getByLabel('Password') (confidence: 93%, strategy: label_text, unique: false)
    //   4. page.locator('#password') (confidence: 75%, strategy: id, unique: true)
    //   5. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div/form/div[2]/div/span/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.getByLabel('Password').fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the 'Sign in' button to submit credentials.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex, unique: true)
    //   2. page.getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex, unique: false)
    //   3. page.locator('input[data-controller="disable-when-clicked"]') (confidence: 85%, strategy: data_attr_controller, unique: true)
    //   4. page.locator('#login-form').getByRole('button', { name: 'Sign in' }) (confidence: 82%, strategy: parent_id_role, unique: true)
    //   5. page.locator('xpath=html/body/div[2]/div[1]/main/div[2]/div/div/form/div[3]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

    // Step 5: Verify that the login failed and the user remains on the login page.
    // The test expects to stay on the login page, indicating an unsuccessful authentication attempt.
    // A short wait can help ensure any potential redirect has had time to fail.
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(process.env.LOGIN_URL);

    // Verify that an error message is displayed to the user, confirming the failure.
    const errorMessage = page.locator('.flash.error, [role="alert"]');
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
    console.log('Login failed as expected. Error message is visible.');

  } catch (error) {
    console.error("An error occurred during the login failure test:", error);
    throw error;
  }
});