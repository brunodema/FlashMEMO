// used this to setup tests: https://testing-angular.com/introduction/#introduction
// shout-outs to protractor, that got deprecated by Angular itself, and cost 1-2 days of my life
// official docs: https://docs.cypress.io/
// info on 'each': https://www.webtips.dev/webtips/cypress/how-to-get-multiple-elements-in-cypress
// 'lte' and 'gte': https://stackoverflow.com/questions/62072822/cypress-assertion-equal-and-greater-than

import deckJson from 'src/assets/test_assets/Decks.json';
import flashcardJson from 'src/assets/test_assets/Flashcards.json';

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

  checkContentHeightsOnView() {
    // do the height check
    cy.get('app-flashcard-content-options-block').each((parentEl) => {
      // not sure why, but I'm having to call 'cy.wrap()' directly, instead of naming an aux variable to hold the value. Otherwise, it says that the 'find()' method below requires a DOM object (???)
      let parentHeight: number;
      cy.wrap(parentEl)
        .invoke('height')
        .then((val) => {
          parentHeight = val!;
        });

      cy.wrap(parentEl)
        .find('[data-testid="flashcard-block-actual-content"]')
        .then((contentEl) => {
          let content = cy.wrap(contentEl);

          let contentHeight: number;
          content
            .should('be.visible')
            .invoke('height')
            .then((val) => {
              contentHeight = val!;

              if (contentHeight === 0)
                throw new Error("This shouldn't happen! :/");

              expect(Math.ceil(contentHeight)).to.be.lte(
                Math.ceil(parentHeight)!
              );
            });
        });
    });
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
    // check heights for all flashcards on DataTable

    // page.getAllEditbuttonsFromDataTable().each((item) => {
    //   cy.wrap(item).trigger('click'); // opens modal
    //   page.checkContentHeightsOnView(); // checks front
    //   cy.get('button').contains('Next').trigger('click');
    //   page.checkContentHeightsOnView(); // checks back
    //   cy.get('button[aria-label="Close"]').trigger('click'); // closes modal
    // });

    // check heights for study session
    page.getStudySessionButton().trigger('click');
    // start study session
    cy.get('a').contains('Start').should('be.visible').trigger('click');

    // proceed depending on visibility of a 'Next' button
    var genArr = Array.from({
      length:
        flashcardJson.filter((f) => f.deckId == deckJson[0].deckId).length - 2,
    });
    cy.wrap(genArr).each((el, index, list) => {
      console.log(index, list.length);
      cy.get('.modal-body').then((modal) => {
        if (
          modal.find('input[data-testid="flashcard-study-session-input"]')
            .length > 0
        ) {
          page.checkContentHeightsOnView(); // checks front
          cy.get('input[data-testid="flashcard-study-session-input"]').type(
            'a'
          );
          cy.get('button').contains('Next').trigger('click');
          page.checkContentHeightsOnView(); // checks back
          cy.get('button').contains('Proceed').trigger('click');
          return false;
        } else if (
          modal.find('a[data-testid="study-session-close-btn"]').length > 0
        ) {
          cy.get('a[data-testid="study-session-close-btn"]').trigger('click');
          return false;
        } else {
          page.checkContentHeightsOnView(); // checks front
          cy.get('button').contains('Next').trigger('click');
          page.checkContentHeightsOnView(); // checks back
          cy.get('button').contains('Correct').trigger('click');
          return false;
        }
      });
    });
  });
});
