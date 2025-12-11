import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure

test.setTimeout(120000);

test('Discovered Bug: Work Package Creation Flow is Blocked After Selecting Type', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // The test starts at the project dashboard, authentication is handled by storage state.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project`);

  // Step 2: Navigate to the 'Work packages' section
  // Captured selectors:
  //   1. page.locator('#main-menu-work-packages-wrapper').getByRole('link', { name: 'Work packages' }) (confidence: 82%, strategy: parent_id_role)
  //   2. page.getByRole('link', { name: /Work packages/ }) (confidence: 80%, strategy: role_name_regex)
  //   3. page.locator('a.work-packages-menu-item.selected') (confidence: 80%, strategy: css_combined_classes)
  await page.locator('#main-menu-work-packages-wrapper').getByRole('link', { name: 'Work packages' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages`);

  // Step 3: Click the 'Create' button to open the dropdown menu
  // Captured selectors:
  //   1. page.getByRole('button', { name: /Create new work package/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.getByRole('button', { name: /Create new work package/ }) (confidence: 95%, strategy: role_name_regex)
  //   3. page.locator('#content-body').getByRole('button', { name: 'Create new work package' }) (confidence: 82%, strategy: parent_id_role)
  // Using the most stable selector with the highest confidence.
  await page.getByRole('button', { name: /Create new work package/ }).first().click();

  // Step 4: Select 'Tasks' from the creation dropdown
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Tasks' }) (confidence: 95%, strategy: role_name)
  //   2. page.locator('#work_packages_sidemenu').getByRole('link', { name: 'Tasks' }) (confidence: 82%, strategy: parent_id_role)
  //   3. page.locator('xpath=html/body/div[2]/div[1]/div[1]/div/ul/li[2]/ul/li/turbo-frame/div/div[2]/div[2]/ul/li[2]/a') (confidence: 50%, strategy: xpath)
  // This click is expected to trigger the bug.
  await page.getByRole('link', { name: 'Tasks' }).click();

  // Verification: Confirm the bug by checking that the page navigates but the creation form does not appear.
  // The URL changes, indicating a navigation event occurred.
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/work_packages?query_id=3`);
  
  // The core of the bug is that the creation form is missing.
  // We verify this by asserting that a key input field, like 'Subject', is NOT visible.
  await expect(page.getByLabel('Subject')).not.toBeVisible();
});