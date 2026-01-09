import { BasePage } from './BasePage.js';

/**
 * @class SaveSystemUserPage
 * @description Represents the 'Add User' / 'Edit User' form page.
 * It encapsulates all form fields and actions for creating or updating a system user.
 */
class SaveSystemUserPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Save System User page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the User Role dropdown.
     * Alternative selectors:
     * - page.locator('div.oxd-select-text-input').first()
     * - page.locator('form div:has-text("User Role") >> div.oxd-select-wrapper')
     */
    this.userRoleDropdown = page.getByText('-- Select --').first();

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Employee Name auto-complete input field.
     * Alternative selectors:
     * - page.getByPlaceholder('Type for hints...')
     * - page.locator('form div:has-text("Employee Name") >> input')
     */
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Status dropdown. Note: This selector can be ambiguous.
     * Alternative selectors:
     * - page.locator('form div:has-text("Status") >> div.oxd-select-wrapper')
     * - page.locator('div.oxd-select-text-input').filter({ hasText: '-- Select --' }).nth(1)
     */
    this.statusDropdown = page.getByText('-- Select --');

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Username input field. Note: nth-based selectors are brittle.
     * Alternative selectors:
     * - page.locator('form div:has-text("Username") >> input')
     * - page.locator('input.oxd-input').nth(1)
     */
    this.usernameInput = page.getByRole('textbox').nth(2);

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Password input field. Note: nth-based selectors are brittle.
     * Alternative selectors:
     * - page.locator('form div:has-text("Password") >> input[type="password"]')
     * - page.locator('input[type="password"]').first()
     */
    this.passwordInput = page.getByRole('textbox').nth(3);

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Confirm Password input field. Note: nth-based selectors are brittle.
     * Alternative selectors:
     * - page.locator('form div:has-text("Confirm Password") >> input[type="password"]')
     * - page.locator('input[type="password"]').nth(1)
     */
    this.confirmPasswordInput = page.getByRole('textbox').nth(4);

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the Save button.
     * Alternative selectors:
     * - page.locator('button.oxd-button.orangehrm-left-space')
     * - page.getByText('Save')
     */
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  /**
   * Selects a role from the User Role dropdown.
   * @param {'Admin' | 'ESS'} role - The role to select.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async selectUserRole(role) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
    return this;
  }

  /**
   * Enters an employee name into the auto-complete field.
   * @param {string} name - The employee name to enter.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async enterEmployeeName(name) {
    await this.employeeNameInput.fill(name);
    // In a real scenario, you might need to wait for and click the suggestion.
    return this;
  }

  /**
   * Selects a status from the Status dropdown.
   * @param {'Enabled' | 'Disabled'} status - The status to select.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async selectStatus(status) {
    // This targets the second '-- Select --' dropdown on the page.
    await this.statusDropdown.last().click();
    await this.page.getByRole('option', { name: status }).click();
    return this;
  }

  /**
   * Enters a username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters a password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Enters a password into the confirm password field.
   * @param {string} password - The password to confirm.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async enterConfirmPassword(password) {
    await this.confirmPasswordInput.fill(password);
    return this;
  }

  /**
   * Clicks the save button to submit the form.
   * This method is suitable for scenarios where an error is expected and no navigation occurs.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async clickSaveAndExpectError() {
    await this.saveButton.click();
    return this;
  }

  /**
   * A comprehensive method to fill the entire 'Add User' form.
   * @param {object} userData - An object containing user details.
   * @param {string} userData.role - The user's role (e.g., 'Admin').
   * @param {string} userData.employeeName - The employee's name.
   * @param {string} userData.status - The account status (e.g., 'Enabled').
   * @param {string} userData.username - The desired username.
   * @param {string} userData.password - The desired password.
   * @returns {Promise<SaveSystemUserPage>} The instance of the SaveSystemUserPage for chaining.
   */
  async fillAddUserForm(userData) {
    await this.selectUserRole(userData.role);
    await this.enterEmployeeName(userData.employeeName);
    await this.selectStatus(userData.status);
    await this.enterUsername(userData.username);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.password);
    return this;
  }
}

export { SaveSystemUserPage };