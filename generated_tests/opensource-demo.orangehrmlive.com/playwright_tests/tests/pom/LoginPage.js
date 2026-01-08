import { BasePage } from './BasePage.js';

/**
 * @class LoginPage
 * @description Represents the OrangeHRM Login Page and its interactions.
 * @extends BasePage
 */
class LoginPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);
    this.url = '/web/index.php/auth/login';

    // Selectors for the Login Page
    // ---
    // Primary: page.getByRole('textbox', { name: 'Username' })
    // Alt 1: page.locator('input[name="username"]')
    // Alt 2: page.getByPlaceholder('Username')
    // Alt 3: page.locator('input.oxd-input').first()
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    // Primary: page.getByRole('textbox', { name: 'Password' })
    // Alt 1: page.locator('input[name="password"]')
    // Alt 2: page.getByPlaceholder('Password')
    // Alt 3: page.locator('input[type="password"]')
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Primary: page.getByRole('button', { name: 'Login' })
    // Alt 1: page.locator('button.orangehrm-login-button')
    // Alt 2: page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
    // Alt 3: page.locator('button[type="submit"]')
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigates directly to the login page.
   * @returns {Promise<this>}
   */
  async navigateTo() {
    await this.navigate(this.url);
    return this;
  }

  /**
   * Enters the given username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the given password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<this>}
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Clicks the login button to submit the form.
   * This action is expected to navigate to the Dashboard page on success.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async clickLogin() {
    await this.loginButton.click();
    // Use dynamic import to avoid circular dependency issues if DashboardPage ever needs to link back to LoginPage.
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A comprehensive service method to perform a full login action.
   * @param {string} username - The username for login.
   * @param {string} password - The password for login.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance after successful login.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.clickLogin();
  }
}

export { LoginPage };