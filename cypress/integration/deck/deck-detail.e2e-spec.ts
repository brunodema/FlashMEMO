// used this to setup tests: https://testing-angular.com/introduction/#introduction

describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('FlashMEMO');

    cy.url().then((url) =>
      cy.task('log', url)
    );
  });
});

describe('Will we finally access deck-detail?', () => {
  it('Goes to the fucking page', () => {
    cy.visit('deck/create');
    cy.url().then((url) =>
      cy.task('log', url)
    );

    cy.get('[data-testid="study-session-btn"]');
  });

  it('There is no study button on this page', () => {
    cy.visit('deck/list');
    cy.url().then((url) =>
      cy.task('log', url)
    );

    cy.get('[data-testid="study-session-btn"]').should('not.exist');
    // cy.get('[data-testid="study-session-btn"]').should('exist')
  });
});
