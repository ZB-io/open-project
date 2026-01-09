import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pom/DashboardPage.js';
import { ViewsystemusersPage } from './pom/ViewsystemusersPage.js';
import { SavesystemuserPage } from './pom/SavesystemuserPage.js';
// Environment variables
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const BASE_HOST_URL = process.env.BASE_HOST_URL || 'https://opensource-demo.orangehrmlive.com';
const UI_SITE_PASSWORD = process.env.UI_SITE_PASSWORD;

// Screenshot capture hook (MANDATORY)

test('Attempt to Add a User with a Non-Unique Username', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(BASE_URL);

  const dashboardPage = new DashboardPage(page);

  // Step 2: Navigate to the Admin section
  const viewsystemusersPage = await dashboardPage.navigateToAdminPage();
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/viewSystemUsers`);

  // Step 3: Click the 'Add' button to open the new user form
  const savesystemuserPage = await viewsystemusersPage.navigateToAddUserPage();
  await expect(page).toHaveURL(`${BASE_HOST_URL}/web/index.php/admin/saveSystemUser`);

  // Steps 4-12: Fill out the form with a duplicate username and attempt to save
  // The POM provides a high-level service method to encapsulate these steps
  const duplicateUserData = {
    role: 'Admin',
    // NOTE: Using a known valid employee name from the demo site to ensure the autocomplete works.
    // The scenario's "John Doe" is not a real employee in the demo data.
    employeeName: 'Peter Mac Anderson', 
    status: 'Enabled',
    username: 'Admin', // This is the non-unique username to trigger the error
    password: UI_SITE_PASSWORD,
  };

  await savesystemuserPage.attemptToAddUser(duplicateUserData);

  // Step 13: Verify that an error message 'Already exists' is displayed
  const errorMessage = await savesystemuserPage.getUsernameExistsErrorText();
  expect(errorMessage).toContain('Already exists');

  // Final Verification: Ensure the user remains on the 'Add User' page
  await expect(page).toHaveURL(/.*saveSystemUser/);
});