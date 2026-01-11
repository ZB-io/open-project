/**
 * @class BasePage
 * @description Represents the base page object with common functionalities shared across all pages.
 * This class should be extended by all other page object classes.
 */
class BasePage {
  /**
   * @constructor
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a specified URL.
   * @param {string} url - The URL to navigate to.
   * @returns {Promise<void>}
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Waits for the page to be fully loaded, specifically waiting for network activity to be idle.
   * @returns {Promise<void>}
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} The page title.
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Retrieves the URL of the current page.
   * @returns {string} The current page URL.
   */
  getCurrentUrl() {
    return this.page.url();
  }
}

export { BasePage };