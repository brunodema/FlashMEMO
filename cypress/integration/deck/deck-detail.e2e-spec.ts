// used this to setup tests: https://testing-angular.com/introduction/#introduction
// shout-outs to protractor, that got deprecated by Angular itself, and cost 1-2 days of my life

import deckJson from 'src/assets/test_assets/Decks.json';

class DeckDetailPageObject {
  visitDeckDetail(id?: string) {
    if (id) cy.visit(`deck/${id}`);
    else cy.visit('deck/create');
  }

  getEverythingToGuaranteeImOnThePage() {
    this.getSaveDeckButton();
    this.getStudySessionButton();
    this.getFlashcardAccordion();
  }

  getSaveDeckButton(): Cypress.Chainable<JQuery<Element>> {
    return cy.get('[data-testid="save-deck-btn"]');
  }

  getStudySessionButton(): Cypress.Chainable<JQuery<Element>> {
    return cy.get('[data-testid="study-session-btn"]');
  }

  getFlashcardAccordion(): Cypress.Chainable<JQuery<Element>> {
    return cy.get('[data-testid="flashcard-accordion"]');
  }

  ensureAccordionIsExpanded(): Cypress.Chainable<JQuery<Element>> {
    return this.getFlashcardAccordion().find('button[aria-expanded="true"]');
    // return cy.get('button[aria-expanded="true"]');
  }

  logCurrentURL() {
    cy.url().then((url) => cy.task('log', url));
  }
}

describe('Access deck-detail and find stuff', () => {
  let page: DeckDetailPageObject = new DeckDetailPageObject();

  it('Should go to the fucking page (via "create")', () => {
    page.visitDeckDetail();
    page.getEverythingToGuaranteeImOnThePage();
  });

  it('Should go to the fucking page (via "deckId")', () => {
    page.visitDeckDetail(deckJson[0].deckId);
    page.getEverythingToGuaranteeImOnThePage();
  });

  it('Should go to the fucking page (with wrong id?)', () => {
    page.visitDeckDetail('shenanigans');
    cy.url().should('contain', 'home');
    cy.url().should('not.contain', 'deck');
  });

  it('Should test flashcard editor for content overflows (beta)', () => {
    // go to the page
    page.visitDeckDetail(deckJson[0].deckId);
    // ensure eveything is there
    page.getEverythingToGuaranteeImOnThePage();
    // find flashcard accordion
    page.ensureAccordionIsExpanded();
    // find data-table inside it
    // change visualization to show 25 flashcards per page
    // select first flashcard from data-table
    // click to open flashcard editor
  });
});
