import { expect } from '@playwright/test';

/**
 * Represents the base page object for all pages.
 * It contains common functionalities that can be shared across different page objects.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page The Playwright page object.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url The URL to navigate to.
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Waits for the page to be in a stable state, typically after an action that triggers network activity.
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} The title of the page.
   */
  async getPageTitle() {
    return await this.page.title();
  }
}

export { BasePage };