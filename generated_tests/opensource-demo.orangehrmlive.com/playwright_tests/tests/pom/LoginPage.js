import { BasePage } from './BasePage.js';

/**
 * @class LoginPage
 * @description Represents the OrangeHRM Login Page and its interactions.
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
     * @description Username input field.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('textbox', { name: 'Username' })
     * // page.locator('input[name="username"]')
     * // page.getByPlaceholder('Username')
     * // page.locator('input.oxd-input')
     * // page.locator('xpath=//input[@name="username"]')
     */
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    /**
     * @private
     * @description Password input field.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('textbox', { name: 'Password' })
     * // page.locator('input[name="password"]')
     * // page.getByPlaceholder('Password')
     * // page.locator('input[type="password"]')
     * // page.locator('xpath=//input[@name="password"]')
     */
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    /**
     * @private
     * @description Login button.
     * @type {import('@playwright/test').Locator}
     * @example
     * // page.getByRole('button', { name: 'Login' })
     * // page.locator('button[type="submit"]')
     * // page.getByText('Login')
     * // page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
     * // page.locator('xpath=//button[@type="submit"]')
     */
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigates to the login page.
   * @param {string} baseUrl - The base URL of the application.
   * @returns {Promise<this>}
   */
  async navigateTo(baseUrl) {
    await this.navigate(`${baseUrl}/web/index.php/auth/login`);
    return this;
  }

  /**
   * Enters the username into the username field.
   * @param {string} username - The username to enter.
   * @returns {Promise<this>}
   */
  async enterUsername(username) {
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the password into the password field.
   * @param {string} password - The password to enter.
   * @returns {Promise<this>}
   */
  async enterPassword(password) {
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Clicks the login button and waits for navigation to the dashboard.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async clickLogin() {
    await this.loginButton.click();
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A composite method to perform a full login action.
   * @param {string} username - The username to login with.
   * @param {string} password - The password to login with.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.clickLogin();
  }
}

export { LoginPage };