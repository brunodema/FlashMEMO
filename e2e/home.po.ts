import { browser, by, element, promise } from 'protractor';

export class HomePage {
  async navigateTo(): Promise<unknown> {
    return browser.driver.get(browser.baseUrl);
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }

  getLoginButton() {
    return element(by.id('login-btn'));
  }

  getRegisterButton() {
    return element(by.id('register-btn'));
  }
}
