import 'dotenv/config';
import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OrangeHRM login page.
    await page.goto(process.env.LOGIN_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Step 2: Enter the username into the username field.
    // Captured selectors:
    //   1. page.locator('input[name="username"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   2. page.getByPlaceholder('Username') (confidence: 85%, strategy: placeholder, unique: true)
    //   3. page.locator('input.oxd-input') (confidence: 78%, strategy: css_stable_class, unique: false)
    //   4. page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[1]/div/div[2]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('input[name="username"]').fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the password into the password field.
    // Captured selectors:
    //   1. page.locator('input[type="password"][name="password"]') (confidence: 89%, strategy: css_combined, unique: true)
    //   2. page.locator('input[type="password"]') (confidence: 88%, strategy: input_type, unique: true)
    //   3. page.locator('input[name="password"]') (confidence: 87%, strategy: name_attribute, unique: true)
    //   4. page.getByPlaceholder('Password') (confidence: 85%, strategy: placeholder, unique: true)
    //   5. page.locator('input.oxd-input') (confidence: 78%, strategy: css_stable_class, unique: false)
    //   6. page.locator('xpath=html/body/div/div[1]/div/div[1]/div/div[2]/div[2]/form/div[2]/div/div[2]/input') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('input[type="password"][name="password"]').fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the Login button to submit credentials.
    // Captured selectors:
    //   1. page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' }) (confidence: 97%, strategy: form_action_role, unique: true)
    //   2. page.getByRole('button', { name: 'Login' }) (confidence: 95%, strategy: role_name, unique: true)
    //   3. page.locator('#app').getByRole('button', { name: 'Login' }) (confidence: 82%, strategy: parent_id_role, unique: true)
    //   4. page.locator('button.oxd-button.orangehrm-login-button') (confidence: 80%, strategy: css_combined_classes, unique: true)
    //   5. page.locator('button.oxd-button') (confidence: 78%, strategy: css_stable_class, unique: true)
    //   6. page.locator('xpath=html/body/div[1]/div[1]/div/div[1]/div/div[2]/div[2]/form/div[3]/button') (confidence: 50%, strategy: xpath, unique: true)
    await page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' }).click();

    // Step 5: Verify successful login by checking for navigation to the dashboard.
    const expectedUrl = `${process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com'}/web/index.php/dashboard/index`;
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