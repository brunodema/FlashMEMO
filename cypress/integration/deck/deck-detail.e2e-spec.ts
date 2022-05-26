// used this to setup tests: https://testing-angular.com/introduction/#introduction
// shout-outs to protractor, that got deprecated by Angular itself, and cost 1-2 days of my life
// official docs: https://docs.cypress.io/
// info on 'each': https://www.webtips.dev/webtips/cypress/how-to-get-multiple-elements-in-cypress
// 'lte' and 'gte': https://stackoverflow.com/questions/62072822/cypress-assertion-equal-and-greater-than

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

  getFlashcardDataTable(): Cypress.Chainable<JQuery<Element>> {
    return cy.get('app-data-table');
  }

  selectMaxPageSizeFromFlashcardDataTable() {
    this.getFlashcardDataTable()
      .find('mat-select')
      .click()
      .get('mat-option')
      .contains('25')
      .click();
  }

  getAllEditbuttonsFromDataTable(): Cypress.Chainable<JQuery<Element>> {
    return this.getFlashcardDataTable().find('[data-testid="row-edit-btn"]');
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
    page.getFlashcardDataTable();
    // change visualization to show 25 flashcards per page
    page.selectMaxPageSizeFromFlashcardDataTable();
    // select first flashcard from data-table
    page.getAllEditbuttonsFromDataTable().each((item, index, list) => {
      cy.wrap(item).trigger('click');

      // do the height check
      cy.get('app-flashcard-layout').then((layoutEl) => {
        const layoutHeight = layoutEl.height();
        cy.get('app-flashcard-content-options-block').then((contentEl) => {
          const contentHeight = contentEl.height();
          expect(contentHeight).to.be.lte(layoutHeight!);
        });
      });

      cy.get('button').contains('Next').trigger('click');

      // do the height check
      cy.get('app-flashcard-layout').then((layoutEl) => {
        const layoutHeight = layoutEl.height();
        cy.get('app-flashcard-content-options-block').then((contentEl) => {
          const contentHeight = contentEl.height();
          expect(contentHeight).to.be.lte(layoutHeight!);
        });
      });

      cy.get('button[aria-label="Close"]').trigger('click');
    });

    // click to open flashcard editor
  });
});
