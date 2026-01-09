import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);
    await expect(page).toHaveURL(new RegExp(process.env.LOGIN_URL));

    // Step 2: Enter the username into the username field.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'Username' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[data-v-1f99f73c]') (confidence: 90%, strategy: data_attr_v-1f99f73c_presence, unique: false)
    //   3. page.locator('input[name="username"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   4. page.getByPlaceholder('Username') (confidence: 85%, strategy: placeholder, unique: true)
    //   5. page.locator('input.oxd-input') (confidence: 78%, strategy: css_stable_class, unique: false)
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the password into the password field.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'Password' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[data-v-1f99f73c]') (confidence: 90%, strategy: data_attr_v-1f99f73c_presence, unique: false)
    //   3. page.locator('input[type="password"][name="password"]') (confidence: 89%, strategy: css_combined, unique: true)
    //   4. page.locator('input[type="password"]') (confidence: 88%, strategy: input_type, unique: true)
    //   5. page.locator('input[name="password"]') (confidence: 87%, strategy: name_attribute, unique: true)
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the login button to submit credentials.
    // Captured selectors:
    //   1. page.getByRole('button', { name: 'Login' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' }) (confidence: 97%, strategy: form_action_role, unique: true)
    //   3. page.getByRole('button', { name: 'Login' }) (confidence: 95%, strategy: role_name, unique: true)
    //   4. page.locator('button[data-v-10d463b7]') (confidence: 90%, strategy: data_attr_v-10d463b7_presence, unique: true)
    //   5. page.locator('button[data-v-0af708be]') (confidence: 90%, strategy: data_attr_v-0af708be_presence, unique: true)
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify successful login by checking for navigation to the dashboard.
    const expectedUrl = `${process.env.BASE_HOST_URL}/web/index.php/dashboard/index`;
    await page.waitForURL(new RegExp(expectedUrl));
    await expect(page).toHaveURL(new RegExp(expectedUrl));

    // Wait for authentication to fully propagate
    await page.waitForLoadState('networkidle');
    
    // Save authenticated state for other tests to reuse
    await context.storageState({ path: '../.auth/storage-state.json' });
    console.log('✅ Storage state saved - other tests can now skip login!');

  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
});