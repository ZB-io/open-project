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
    this.url = '/web/index.php/auth/login';

    // --- Locators ---
    // Primary: page.getByRole('textbox', { name: 'Username' })
    // Alt 1: page.locator('input[name="username"]')
    // Alt 2: page.getByPlaceholder('Username')
    // Alt 3: page.locator('input.oxd-input').first()
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });

    // Primary: page.getByRole('textbox', { name: 'Password' })
    // Alt 1: page.locator('input[type="password"]')
    // Alt 2: page.getByPlaceholder('Password')
    // Alt 3: page.locator('input[name="password"]')
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });

    // Primary: page.getByRole('button', { name: 'Login' })
    // Alt 1: page.locator('form[action*="validate"]').getByRole('button', { name: 'Login' })
    // Alt 2: page.locator('button.oxd-button.orangehrm-login-button')
    // Alt 3: page.locator('button[type="submit"]')
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigates to the login page.
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
   * Clicks the login button and waits for navigation to the dashboard.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async clickLogin() {
    // FIX: The original 'click' did not wait for navigation.
    // Using Promise.all ensures we wait for the URL to change to the dashboard
    // right after the click action is performed, preventing a race condition.
    await Promise.all([
      this.page.waitForURL('**/dashboard/index'),
      this.loginButton.click(),
    ]);
    // The action causes navigation, so we import and return the next page object.
    const { DashboardPage } = await import('./DashboardPage.js');
    return new DashboardPage(this.page);
  }

  /**
   * A comprehensive service method to log in with a username and password.
   * This encapsulates the entire login flow on this page.
   * @param {string} username - The username to log in with.
   * @param {string} password - The password to log in with.
   * @returns {Promise<import('./DashboardPage.js').DashboardPage>} A new DashboardPage instance.
   */
  async loginAs(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    return this.clickLogin();
  }
}

export { LoginPage };