import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import { ViewSystemUsersPage } from './pom/ViewSystemUsersPage.js';
import { SaveSystemUserPage } from './pom/SaveSystemUserPage.js';
// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';

// Screenshot capture hook (MANDATORY)

test('Error Validation: Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // 1. Navigate to starting point
  await page.goto(BASE_URL);
  const dashboardPage = new DashboardPage(page);
  await expect(page).toHaveURL(BASE_URL);

  // 2. Navigate to Admin -> User Management page
  const viewSystemUsersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // 3. Click 'Add' to open the user creation form
  const saveSystemUserPage = await viewSystemUsersPage.clickAddUser();
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);

  // 4. Fill out the form with data that will cause a validation error.
  // The scenario specifies using a username 'Admin' which already exists.
  // Note: The employee name 'John Doe' is used as specified in the scenario.
  // This may fail if the demo data does not contain this exact name in the autocomplete suggestions.
  const userData = {
    userRole: 'Admin',
    employeeName: 'John Doe',
    status: 'Enabled',
    username: 'Admin',
    password: 'admin123'
  };

  // Use the high-level POM method to fill the form and submit, expecting an error
  await saveSystemUserPage.addUserExpectingError(userData);

  // 5. Final verification
  // Verify the error message for an existing username is visible
  await expect(saveSystemUserPage.usernameExistsError).toBeVisible();
  
  // Verify the error message text is correct
  expect(await saveSystemUserPage.getUsernameExistsErrorText()).toBe('Already exists');

  // Verify the user remains on the 'Add User' page after the failed submission
  await expect(page).toHaveURL(/.*\/admin\/saveSystemUser/);
});