import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Navigate to the login page
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);

    // Step 1: Enter username into the username field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. page.getByRole('textbox', { name: 'Username' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. page.locator('#username') (confidence: 75%, strategy: id, unique: true)
    await page.locator('#username').fill(process.env.UI_SITE_USERNAME);

    // Step 2: Enter password into the password field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. page.getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. page.locator('#password') (confidence: 75%, strategy: id, unique: true)
    await page.locator('#password').fill(process.env.UI_SITE_PASSWORD);

    // Step 3: Click the 'Sign in' button to submit credentials.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex, unique: true)
    //   2. page.getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex, unique: false)
    //   3. page.locator('input[data-controller="disable-when-clicked"]') (confidence: 85%, strategy: data_attr_controller, unique: true)
    await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

    // Step 4: Verify successful login by checking the URL has changed to the authenticated homepage.
    // Using a regular expression to handle optional trailing slashes
    const expectedUrlPattern = new RegExp(`^${process.env.LOGIN_HOST_URL || process.env.BASE_HOST_URL}/?$`);
    await expect(page).toHaveURL(expectedUrlPattern, { timeout: 30000 });

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