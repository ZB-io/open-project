import { BasePage } from './BasePage.js';

/**
 * @class SavesystemuserPage
 * @description Represents the 'Add User' / 'Save System User' form page.
 */
class SavesystemuserPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Add User form
    /** @private */
    this.userRoleDropdown = page.locator('div.oxd-form-row:first-child .oxd-select-wrapper');
    
    /** @private */
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });
    
    /** @private */
    this.statusDropdown = page.locator('div.oxd-form-row').filter({ hasText: 'Status' }).locator('.oxd-select-wrapper');
    
    /** @private */
    this.usernameInput = page.locator('div.oxd-form-row').filter({ hasText: 'Username' }).getByRole('textbox');
    
    /** @private */
    this.passwordInput = page.locator('div.oxd-form-row').filter({ hasText: 'Password' }).getByRole('textbox').first();
    
    /** @private */
    this.confirmPasswordInput = page.locator('div.oxd-form-row').filter({ hasText: 'Confirm Password' }).getByRole('textbox');
    
    /**
     * @private
     * @description Save button to submit the form.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('button', { name: 'Save' })
     * // page.locator('button[type="submit"]')
     * // page.getByText('Save')
     * // page.locator('button.oxd-button--secondary')
     * // page.locator('xpath=//button[@type="submit"]')
     */
    this.saveButton = page.getByRole('button', { name: 'Save' });

    /**
     * @private
     * @description Error message for an existing username.
     * @type {import('@playwright/test').Locator}
     */
    this.usernameExistsError = page.getByText('Already exists');
  }

  /**
   * Selects a user role from the dropdown.
   * @param {'Admin' | 'ESS'} role - The role to select.
   * @returns {Promise<this>}
   */
  async selectUserRole(role) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
    return this;
  }

  /**
   * Enters an employee name and selects the first suggestion.
   * @param {string} name - The employee name to type.
   * @returns {Promise<this>}
   */
  async enterEmployeeName(name) {
    await this.employeeNameInput.fill(name);
    // Wait for autocomplete options and select the first one
    await this.page.getByRole('option').first().click();
    return this;
  }

  /**
   * Selects a status from the dropdown.
   * @param {'Enabled' | 'Disabled'} status - The status to select.
   * @returns {Promise<this>}
   */
  async selectStatus(status) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    return this;
  }

  /**
   * Enters the username for the new user.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the password for the new user.
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
   * Clicks the 'Save' button to submit the form.
   * In an error scenario, this is expected to stay on the same page.
   * @returns {Promise<this>}
   */
  async clickSave() {
    await this.saveButton.click();
    return this;
  }

  /**
   * A composite method to fill out the entire 'Add User' form.
   * @param {object} userDetails - The details of the user to add.
   * @param {'Admin' | 'ESS'} userDetails.role
   * @param {string} userDetails.employeeName
   * @param {'Enabled' | 'Disabled'} userDetails.status
   * @param {string} userDetails.username
   * @param {string} userDetails.password
   * @returns {Promise<this>}
   */
  async fillNewUserDetails({ role, employeeName, status, username, password }) {
    await this.selectUserRole(role);
    await this.enterEmployeeName(employeeName);
    await this.selectStatus(status);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
    return this;
  }

  /**
   * Checks if the 'Username already exists' error message is visible.
   * @returns {Promise<boolean>}
   */
  async isUsernameExistsErrorVisible() {
    return await this.usernameExistsError.isVisible();
  }

  /**
   * Gets the text content of the 'Username already exists' error message.
   * @returns {Promise<string|null>}
   */
  async getUsernameExistsErrorText() {
    return await this.usernameExistsError.textContent();
  }
}

export { SavesystemuserPage };