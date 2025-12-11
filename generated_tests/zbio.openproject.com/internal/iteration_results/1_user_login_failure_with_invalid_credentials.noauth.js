import 'dotenv/config';
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;
const LOGIN_URL = process.env.LOGIN_URL;

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

test('user_login_failure_with_invalid_credentials', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Use LOGIN_URL for login tests, fallback to BASE_URL.
  // The scenario expects a redirect from the project page to the login page.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp('.*/login.*'));

  // Step 2: Enter the username 'default' into the username field.
  // Captured selectors:
  //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }) (confidence: 97%, strategy: form_action_role, unique: true)
  //   2. page.getByRole('textbox', { name: 'Username' }) (confidence: 95%, strategy: role_name, unique: true)
  //   3. page.getByLabel('Username') (confidence: 93%, strategy: label_text, unique: true)
  //   4. page.locator('input[value="default"]') (confidence: 89%, strategy: css_tag_value, unique: false)
  //   5. page.locator('input[type="text"][name="username"]') (confidence: 89%, strategy: css_combined, unique: true)
  //   6. page.locator('input[name="username"]') (confidence: 87%, strategy: name_attribute, unique: true)
  //   7. page.locator('#username') (confidence: 75%, strategy: id, unique: true)
  const invalidUsername = 'default';
  await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }).fill(invalidUsername);

  // Step 3: Enter the password 'default' into the password field.
  // Captured selectors:
  //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role, unique: true)
  //   2. page.getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name, unique: true)
  //   3. page.getByLabel('Password') (confidence: 93%, strategy: label_text, unique: true)
  //   4. page.locator('input[type="password"][name="password"]') (confidence: 89%, strategy: css_combined, unique: true)
  //   5. page.locator('input[name="password"]') (confidence: 87%, strategy: name_attribute, unique: true)
  //   6. page.locator('#password') (confidence: 75%, strategy: id, unique: true)
  const invalidPassword = 'default';
  await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }).fill(invalidPassword);

  // Step 4: Click the 'Sign in' button to submit the credentials for verification.
  // Captured selectors:
  //   1. page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex, unique: true)
  //   2. page.getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('input[value="Sign in"]') (confidence: 89%, strategy: css_tag_value, unique: true)
  //   4. page.locator('input[type="submit"][name="login"][value="Sign in"]') (confidence: 89%, strategy: css_combined, unique: true)
  //   5. page.locator('input[data-controller="disable-when-clicked"]') (confidence: 85%, strategy: data_attr_controller, unique: true)
  //   6. page.locator('#login-form').getByRole('button', { name: 'Sign in' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

  // Step 5: Verify that the user remains on the login page, confirming the login attempt failed.
  // Using a regex to accommodate potential query parameters in the URL.
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/login`));
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/login`));
});