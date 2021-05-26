// pokemon.e2e-spec.ts
import { browser, by } from 'protractor';
import { HomePage } from './home.po';

describe('test login', function () {
  let page: HomePage;

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

  //   it('should succcessfully login after clicking the login button', () => {
  //     page.navigateTo();
  //     page.getRegisterButton().click();
  //     // must create mock for this (does not make sense to contact back-end)
  //   });
});
