import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(process.env.LOGIN_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Step 2: Enter username.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'username' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[data-v-1f99f73c]') (confidence: 90%, strategy: data_attr_v-1f99f73c_presence, unique: false)
    //   3. page.locator('input[name="username"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   4. page.getByPlaceholder('username') (confidence: 85%, strategy: placeholder, unique: true)
    //   5. page.locator('input.oxd-input') (confidence: 78%, strategy: css_stable_class, unique: false)
    //   6. page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.getByRole('textbox', { name: 'username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter password.
    // Captured selectors:
    //   1. page.getByRole('textbox', { name: 'password' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('input[data-v-1f99f73c]') (confidence: 90%, strategy: data_attr_v-1f99f73c_presence, unique: false)
    //   3. page.locator('input[type="password"][name="password"]') (confidence: 89%, strategy: css_combined, unique: true)
    //   4. page.locator('input[type="password"]') (confidence: 88%, strategy: input_type, unique: true)
    //   5. page.locator('input[name="password"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   6. page.getByPlaceholder('password') (confidence: 85%, strategy: placeholder, unique: true)
    //   7. page.locator('input.oxd-input') (confidence: 78%, strategy: css_stable_class, unique: false)
    //   8. page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.getByRole('textbox', { name: 'password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the login button.
    // Captured selectors:
    //   1. page.getByRole('button', { name: 'Login' }) (confidence: 99%, strategy: roost_primary, unique: true)
    //   2. page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' }) (confidence: 97%, strategy: form_action_role, unique: true)
    //   3. page.getByRole('button', { name: 'Login' }) (confidence: 95%, strategy: role_name, unique: true)
    //   4. page.locator('button[data-v-10d463b7]') (confidence: 90%, strategy: data_attr_v-10d463b7_presence, unique: true)
    //   5. page.locator('button[data-v-0af708be]') (confidence: 90%, strategy: data_attr_v-0af708be_presence, unique: true)
    //   6. page.getByText('Login') (confidence: 88%, strategy: text, unique: false)
    //   7. page.locator('#app').getByRole('button', { name: 'Login' }) (confidence: 82%, strategy: parent_id_role, unique: true)
    //   8. page.locator('button.oxd-button.orangehrm-login-button') (confidence: 80%, strategy: css_combined_classes, unique: true)
    //   9. page.locator('button.oxd-button') (confidence: 78%, strategy: css_stable_class, unique: true)
    //   10. page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button') (confidence: 50%, strategy: xpath, unique: true)
    await page.getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify successful login and navigation to the dashboard.
    const expectedUrl = `${process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com'}/web/index.php/dashboard/index`;
    await page.waitForURL(/\/dashboard\/index/);
    await expect(page).toHaveURL(expectedUrl);

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