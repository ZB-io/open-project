import { BasePage } from './BasePage.js';

/**
 * Represents the Add/Edit User page.
 * This page contains the form for creating or updating a system user.
 */
class SaveSystemUserPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Locators for the Save System User Page
    // Selector for the 'User Role' dropdown.
    // Optional selectors:
    // - page.getByText('-- Select --')
    // - page.getByText('Select')
    // - page.locator('div.oxd-select-text-input')
    // - page.locator('div[data-v-67d2aedf]')
    this.userRoleDropdown = page.getByText('-- Select --').first();

    // Selector for the 'Status' dropdown.
    // Optional selectors:
    // - page.getByText('-- Select --')
    // - page.getByText('Select')
    // - page.locator('div[data-v-13cf171c]')
    // - page.locator('div.oxd-select-text')
    this.statusDropdown = page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2);

    // Selector for the 'Employee Name' auto-suggest input field.
    // Optional selectors:
    // - page.locator('input[data-v-75e744cd]')
    // - page.getByPlaceholder('Type for hints...')
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' });

    // Selector for the 'Username' input field.
    // Optional selectors:
    // - page.locator('input[data-v-1f99f73c]')
    // - page.locator('input.oxd-input--active')
    // - page.locator('.oxd-input--active')
    // - page.locator('input.oxd-input')
    this.usernameInput = page.getByRole('textbox').nth(2);

    // Selector for the 'Password' input field.
    // Optional selectors:
    // - page.locator('input[type="password"]')
    // - page.locator('input[data-v-1f99f73c]')
    // - page.locator('input.oxd-input--active')
    // - page.locator('.oxd-input--active')
    this.passwordInput = page.getByRole('textbox').nth(3);

    // Selector for the 'Confirm Password' input field.
    // Optional selectors:
    // - page.locator('input[type="password"]')
    // - page.locator('input[data-v-1f99f73c]')
    // - page.locator('input.oxd-input--active')
    // - page.locator('.oxd-input--active')
    this.confirmPasswordInput = page.getByRole('textbox').nth(4);

    // Selector for the 'Save' button to submit the form.
    // Optional selectors:
    // - page.getByRole('button', { name: 'Save' })
    // - page.locator('button[data-v-10d463b7]')
    // - page.getByText('Save')
    // - page.locator('button.oxd-button.orangehrm-left-space')
    this.saveButton = page.getByRole('button', { name: 'Save' });
    
    // Selector for the error message when a username already exists.
    this.usernameExistsError = page.getByText('Already exists');
  }

  /**
   * Selects a user role from the dropdown.
   * @param {string} role The role to select (e.g., 'Admin', 'ESS').
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async selectUserRole(role) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: role }).click();
    return this;
  }

  /**
   * Selects a status from the dropdown.
   * @param {string} status The status to select (e.g., 'Enabled', 'Disabled').
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async selectStatus(status) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
    return this;
  }

  /**
   * Enters the employee's name into the auto-suggest field.
   * @param {string} name The name of the employee.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async enterEmployeeName(name) {
    await this.employeeNameInput.fill(name);
    // Wait for and click the suggestion to ensure it's selected
    await this.page.getByRole('option', { name }).click();
    return this;
  }

  /**
   * Enters the username.
   * @param {string} username The username for the new user.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the password.
   * @param {string} password The password for the new user.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Confirms the password.
   * @param {string} password The password to confirm.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async enterConfirmPassword(password) {
    await this.confirmPasswordInput.fill(password);
    return this;
  }

  /**
   * Clicks the 'Save' button, expecting a validation error to occur.
   * The page state is expected to remain on the form.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async clickSaveExpectingError() {
    await this.saveButton.click();
    return this;
  }

  /**
   * Clicks the 'Save' button, expecting a successful user creation.
   * @returns {Promise<import('./ViewSystemUsersPage.js').ViewSystemUsersPage>} An instance of the ViewSystemUsersPage.
   */
  async clickSaveExpectingSuccess() {
    await this.saveButton.click();
    const { ViewSystemUsersPage } = await import('./ViewSystemUsersPage.js');
    return new ViewSystemUsersPage(this.page);
  }

  /**
   * A high-level service method to fill out the entire user form and submit it, expecting an error.
   * @param {object} userData The user data to fill the form with.
   * @param {string} userData.userRole The user's role.
   * @param {string} userData.status The user's status.
   * @param {string} userData.employeeName The employee's name.
   * @param {string} userData.username The desired username.
   * @param {string} userData.password The password.
   * @returns {Promise<this>} The current instance of the SaveSystemUserPage for chaining.
   */
  async addUserExpectingError(userData) {
    await this.selectUserRole(userData.userRole);
    await this.enterEmployeeName(userData.employeeName);
    await this.selectStatus(userData.status);
    await this.enterUsername(userData.username);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.password);
    return this.clickSaveExpectingError();
  }
  
  /**
   * Retrieves the text content of the username exists error message.
   * @returns {Promise<string>} The error message text.
   */
  async getUsernameExistsErrorText() {
    await this.usernameExistsError.waitFor({ state: 'visible' });
    return await this.usernameExistsError.textContent();
  }
}

export { SaveSystemUserPage };