// pokemon.e2e-spec.ts
import { browser } from 'protractor';
import { HomePage } from '../../home.po';

describe('test login', function () {
  let page: HomePage;
  let redirectPage = 'news';
  let errorLevel = 900;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should find the login button', () => {
    page.navigateTo();
    expect(page.getLoginButton().isPresent);
  });

  it('should find the login register', () => {
    page.navigateTo();
    expect(page.getRegisterButton().isPresent);
  });

  it('should succcessfully login after clicking the login button', () => {
    // this one is just a prototype. Once login page is implemented, this can be corrected
    page.navigateTo();
    page.getLoginButton().click();

    return expect(
      browser
        .wait(browser.ExpectedConditions.urlContains('news'), 10000)
        .catch(() => {
          return false;
        })
    ).toBeTruthy(`Url match could not succced`);
  });
});
