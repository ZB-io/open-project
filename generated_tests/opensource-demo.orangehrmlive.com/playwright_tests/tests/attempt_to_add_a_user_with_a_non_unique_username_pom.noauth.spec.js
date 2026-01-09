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
  // Since authentication is handled by storage state, we start at the dashboard.
  await page.goto(BASE_URL);

  // 1. Navigate from Dashboard to Admin page
  const dashboardPage = new DashboardPage(page);
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);

  // 2. Navigate to the Add User form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 3. Fill out the form with data, using an existing username
  await saveSystemUserPage.selectUserRole('Admin');
  await saveSystemUserPage.enterEmployeeName('John Doe');
  await saveSystemUserPage.selectStatus('Enabled');
  await saveSystemUserPage.enterUsername('Admin'); // Using a known existing username
  await saveSystemUserPage.enterPassword('Password123!');
  await saveSystemUserPage.enterConfirmPassword('Password123!');

  // 4. Attempt to save the form
  await saveSystemUserPage.clickSaveAndExpectError();

  // 5. Verify that the submission was blocked and an error is shown
  // The user should remain on the 'Add User' page
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // A specific error message for the duplicate username should be visible.
  // Note: While POMs handle actions, assertions often need specific locators for verification.
  // This is an acceptable use of a locator directly in the test for validation purposes.
  await expect(page.getByText('Already exists')).toBeVisible();
});