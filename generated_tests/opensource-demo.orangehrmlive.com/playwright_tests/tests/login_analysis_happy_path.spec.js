import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);
    await expect(page).toHaveURL(process.env.LOGIN_URL);

    // Step 2: Enter username into the username field.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'Username' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[name="username"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   3. page.getByPlaceholder('Username') (confidence: 85%, strategy: placeholder, unique: true)
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter password into the password field.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'Password' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[type="password"]') (confidence: 88%, strategy: input_type, unique: true)
    //   3. page.locator('input[name="password"]') (confidence: 87%, strategy: name_attribute, unique: true)
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the login button to submit credentials.
    // Captured selectors:
    //   1. page.getByRole('button', { name: 'Login' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' }) (confidence: 97%, strategy: form_action_role, unique: true)
    //   3. page.locator('button.oxd-button.orangehrm-login-button') (confidence: 80%, strategy: css_combined_classes, unique: true)
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify successful login by checking that the URL has changed to the dashboard.
    const expectedDashboardUrl = `${process.env.BASE_HOST_URL}/web/index.php/dashboard/index`;
    await page.waitForURL(/\/dashboard\/index/);
    await expect(page).toHaveURL(expectedDashboardUrl);

    // Wait for authentication to fully propagate
    await page.waitForLoadState('networkidle');

    // Save authenticated state for other tests to reuse
    await context.storageState({ path: '../.auth/storage-state.json' });
    console.log('✅ Storage state saved - other tests can now skip login!');

  } catch (error) {
    console.error('Test failed during execution:', error);
    throw error;
  }
});