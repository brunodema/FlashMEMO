import cypress from 'cypress';

describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('FlashMEMO');

    cy.url().then((url) =>
      cy.task('log', url)
    );
  });
});
