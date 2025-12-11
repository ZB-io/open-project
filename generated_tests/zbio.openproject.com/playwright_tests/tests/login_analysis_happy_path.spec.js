import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OpenProject login page.
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);
    await expect(page).toHaveURL(process.env.LOGIN_URL);

    // Step 2: Enter a valid username into the username field.
    // Captured selectors:
    //   1. form[action*="login"] >> getByRole('textbox', { name: 'Username' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. getByRole('textbox', { name: 'Username' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. getByLabel('Username') (confidence: 93%, strategy: label_text, unique: false)
    //   4. #username (confidence: 75%, strategy: id, unique: true)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the corresponding password into the password field.
    // Captured selectors:
    //   1. form[action*="login"] >> getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role, unique: false)
    //   2. getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name, unique: false)
    //   3. getByLabel('Password') (confidence: 93%, strategy: label_text, unique: false)
    //   4. #password (confidence: 75%, strategy: id, unique: true)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the 'Sign in' button to submit the login credentials.
    // Captured selectors:
    //   1. form[action*="login"] >> getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex, unique: true)
    //   2. getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex, unique: false)
    //   3. input[data-controller="disable-when-clicked"] (confidence: 85%, strategy: data_attr_controller, unique: true)
    //   4. #login-form >> getByRole('button', { name: 'Sign in' }) (confidence: 82%, strategy: parent_id_role, unique: true)
    await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

    // Step 5: Verify successful login by confirming navigation to the application's main page.
    // Using a regex to handle optional trailing slashes or query parameters
    const expectedUrlPattern = new RegExp(`^${process.env.LOGIN_HOST_URL || process.env.BASE_HOST_URL}/?(\\?.*)?$`);
    await expect(page).toHaveURL(expectedUrlPattern);

    // Wait for authentication to fully propagate and the page to be stable
    await page.waitForLoadState('networkidle');
    
    // Save authenticated state for other tests to reuse
    await context.storageState({ path: '../.auth/storage-state.json' });
    console.log('✅ Storage state saved - other tests can now skip login!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
});