import { BasePage } from './BasePage.js';

/**
 * @class LoginPage
 * @description Represents the OrangeHRM Login Page. It encapsulates all the elements and actions
 * that can be performed on this page, such as entering credentials and submitting the login form.
 */
class LoginPage extends BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    super(page);

    // Selectors for the Login page
    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the username input field.
     * Alternative selectors:
     * - page.locator('input[name="username"]')
     * - page.getByPlaceholder('Username')
     * - page.locator('input.oxd-input')
     */
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the password input field.
     * Alternative selectors:
     * - page.locator('input[type="password"][name="password"]')
     * - page.getByPlaceholder('Password')
     * - page.locator('input.oxd-input')
     */
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    /**
     * @private
     * @type {import('@playwright/test').Locator}
     * @description Locator for the login button.
     * Alternative selectors:
     * - page.locator('button.oxd-button.orangehrm-login-button')
     * - page.getByText('Login')
     * - page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
     */
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Enters the given username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<LoginPage>} The instance of the LoginPage for chaining.
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the given password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<LoginPage>} The instance of the LoginPage for chaining.
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Clicks the login button and waits for navigation to the dashboard.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new instance of the DashboardPage.
   */
  async submitLogin() {
    await this.loginButton.click();
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A comprehensive login method that fills credentials and submits the form.
   * @param {string} username - The username for login.
   * @param {string} password - The password for login.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new instance of the DashboardPage.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.submitLogin();
  }
}

export { LoginPage };