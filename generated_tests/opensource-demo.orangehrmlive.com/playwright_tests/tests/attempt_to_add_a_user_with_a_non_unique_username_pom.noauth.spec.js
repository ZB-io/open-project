/*
 * ⚠️ TEST FAILED AFTER 5 ITERATIONS
 * Test: attempt_to_add_a_user_with_a_non-unique_username
 *
 * Errors are captured in test_iteration_errors_attempt_to_add_a_user_with_a_non_unique_username.md
 * Please review and fix manually.
 */

import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // As authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. From the dashboard, navigate to the Admin page
  const dashboardPage = new DashboardPage(page);
  const systemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // 2. On the System Users page, click the 'Add' button
  const addUserPage = await systemUsersPage.clickAddUser();
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // 3. Fill out the 'Add User' form with an existing username
  // The composite method 'fillNewUserDetails' handles multiple steps efficiently.
  await addUserPage.fillNewUserDetails({
    role: 'Admin',
    employeeName: 'Peter Mac Anderson', // A name likely to exist in the demo data
    status: 'Enabled',
    username: 'Admin', // This username is guaranteed to exist
    password: 'AComplexPassword!123'
  });

  // 4. Click the 'Save' button to submit the form
  await addUserPage.clickSave();

  // 5. Verify that the 'Username already exists' error message is displayed
  // This confirms the system prevents duplicate usernames.
  const isErrorVisible = await addUserPage.isUsernameExistsErrorVisible();
  expect(isErrorVisible).toBe(true);

  const errorText = await addUserPage.getUsernameExistsErrorText();
  expect(errorText).toBe('Already exists');
});