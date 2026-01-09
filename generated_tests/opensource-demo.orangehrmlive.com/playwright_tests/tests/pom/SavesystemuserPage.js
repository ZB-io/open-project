import { BasePage } from './BasePage.js';

/**
 * @class SavesystemuserPage
 * @description Represents the 'Add User' page within the Admin section.
 */
class SavesystemuserPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // --- Form Field Locators ---

    // User Role Dropdown
    // Alternative selectors:
    // - page.getByText('-- Select --') >> nth=0
    // - page.locator('div.oxd-select-text-input').first()
    this.userRoleDropdown = page.getByText('-- Select --').first();

    // Employee Name Autocomplete Input
    // Alternative selectors:
    // - page.getByPlaceholder('Type for hints...')
    // - page.locator('input[data-v-75e744cd]')
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });

    // Status Dropdown
    // NOTE: This selector from the source data is ambiguous if multiple '-- Select --' texts are present.
    // It assumes context (like the first dropdown being filled) makes this selector unique at runtime.
    // Alternative selectors:
    // - page.locator('div.oxd-select-text-input').nth(1)
    this.statusDropdown = page.getByText('-- Select --');

    // Username Input
    // Alternative selectors:
    // - page.locator('input[data-v-1f99f73c]').nth(1)
    // - page.locator('.oxd-input--active').nth(1)
    this.usernameInput = page.getByRole('textbox').nth(2);

    // Password Input
    // Alternative selectors:
    // - page.locator('input[type="password"]').first()
    this.passwordInput = page.getByRole('textbox').nth(3);

    // Confirm Password Input
    // Alternative selectors:
    // - page.locator('input[type="password"]').nth(1)
    this.confirmPasswordInput = page.getByRole('textbox').nth(4);

    // --- Action Locators ---

    // Save Button
    // Alternative selectors:
    // - page.locator('button.orangehrm-left-space')
    // - page.getByText('Save')
    this.saveButton = page.getByRole('button', { name: 'Save' });

    // --- Validation Locators ---

    // NOTE: This selector is inferred from the test case description as it was not provided in the captured steps.
    this.usernameExistsError = page.locator('span').filter({ hasText: 'Already exists' });
  }

  /**
   * Selects a user role from the dropdown.
   * @param {string} role - The role to select (e.g., 'Admin').
   * @returns {Promise<this>}
   */
  async selectUserRole(role) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
    return this;
  }

  /**
   * Enters the employee's name and selects the first suggestion from the autocomplete list.
   * @param {string} name - The name of the employee.
   * @returns {Promise<this>}
   */
  async enterEmployeeName(name) {
    await this.employeeNameInput.fill(name);
    await this.page.getByRole('option', { name }).first().click();
    return this;
  }

  /**
   * Selects a status from the dropdown.
   * @param {string} status - The status to select (e.g., 'Enabled').
   * @returns {Promise<this>}
   */
  async selectStatus(status) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    return this;
  }

  /**
   * Enters the username.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the password.
   * @param {string} password - The password to enter.
   * @returns {Promise<this>}
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Enters the password confirmation.
   * @param {string} password - The password to confirm.
   * @returns {Promise<this>}
   */
  async enterConfirmPassword(password) {
    await this.confirmPasswordInput.fill(password);
    return this;
  }

  /**
   * Clicks the save button, expecting to remain on the page due to a validation error.
   * @returns {Promise<this>}
   */
  async clickSaveExpectingError() {
    await this.saveButton.click();
    return this;
  }

  /**
   * A comprehensive service method to fill out the Add User form and submit it.
   * @param {object} userData - The user data.
   * @param {string} userData.role - The user's role.
   * @param {string} userData.employeeName - The employee's name.
   * @param {string} userData.status - The user's status.
   * @param {string} userData.username - The username.
   * @param {string} userData.password - The password.
   * @returns {Promise<this>}
   */
  async attemptToAddUser(userData) {
    await this.selectUserRole(userData.role);
    await this.enterEmployeeName(userData.employeeName);
    await this.selectStatus(userData.status);
    await this.enterUsername(userData.username);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.password);
    return this.clickSaveExpectingError();
  }

  /**
   * Gets the text content of the username exists error message.
   * @returns {Promise<string>} The error message text.
   */
  async getUsernameExistsErrorText() {
    await this.usernameExistsError.waitFor({ state: 'visible' });
    const text = await this.usernameExistsError.textContent();
    return text || '';
  }
}

export { SavesystemuserPage };