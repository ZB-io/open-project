import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_a_new_project_board.test-data.json';
import fs from 'fs';
import path from 'path';

const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    try {
      const accessibilityTree = await page.accessibility.snapshot();
      
      const domSnapshot = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   parseFloat(style.opacity) > 0.05;
          })
          .map(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              classes: el.className || null,
              text: (el.innerText || el.textContent || '').trim().substring(0, 100),
              value: el.value || null,
              role: el.getAttribute('role') || null,
              ariaLabel: el.getAttribute('aria-label') || null,
              type: el.type || null,
              href: el.href || null,
              cursor: style.cursor,
              display: style.display,
              hasOnclick: !!el.onclick || el.hasAttribute('onclick'),
              parent: {
                tag: el.parentElement?.tagName?.toLowerCase(),
                classes: el.parentElement?.className || null
              },
              position: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            };
          });
      });
      
      const fileName = path.basename(testInfo.file)
        .replace('.auth.spec.js', '')
        .replace('.noauth.spec.js', '')
        .replace('.spec.js', '');
      const stateFile = path.join(__dirname, `../.accessibility_state_${fileName}.json`);
      fs.writeFileSync(stateFile, JSON.stringify({ 
        accessibility_tree: accessibilityTree, 
        dom_snapshot: domSnapshot, 
        element_count: domSnapshot.length, 
        url: page.url() 
      }, null, 2));
    } catch (e) {}
  }
});

test.setTimeout(120000);

const testDataVariation = testData.variations[0];
const boardName = `${testDataVariation.boardName} ${Date.now()}`;

test('Create a new project board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  // Authentication is handled by storage state, so we navigate directly to the starting URL.
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');

  // Step 7: Navigate to the Boards section using the main sidebar menu.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Boards', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  //   3. page.locator('a.boards-menu-item') (confidence: 78%, strategy: css_stable_class, unique: true)
  await page.getByRole('link', { name: 'Boards', exact: true }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 8: Click the 'Create new board' button to start the board creation process.
  // Captured selectors:
  //   1. page.getByRole('link', { name: 'Create new board' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex, unique: true)
  //   3. page.locator('#add-board-button') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('link', { name: 'Create new board' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/boards/new`));

  // Step 9: Enter the name for the new board into the title field.
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Title*' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByLabel('Title') (confidence: 90%, strategy: label, unique: true)
  //   3. page.locator('#boards_grid_name') (confidence: 75%, strategy: id, unique: true)
  await page.getByRole('textbox', { name: 'Title*' }).fill(boardName);

  // Step 10: Enter project name into the project search field to associate the board with a project.
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role, unique: true)
  await page.getByRole('combobox', { name: 'Search', exact: true }).fill(testDataVariation.projectName);

  // Step 11: Select the project from the populated dropdown list.
  // Captured selectors:
  //   1. page.locator('div.ng-option-label') (confidence: 84%, strategy: css_tag_semantic_empty, unique: false)
  await page.locator('div.ng-option-label').first().click();

  // Step 12: Click the 'Create' button to submit the form and create the new board.
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Create' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role, unique: true)
  //   3. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes, unique: true)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/`));

  // Step 13: Return to the main Boards page to verify the new board is listed.
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 99%, strategy: roost_primary, unique: true)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name, unique: true)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text, unique: false)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Final Verification: Check if the newly created board is visible on the boards list page.
  await expect(page.getByText(boardName).first()).toBeVisible();
});