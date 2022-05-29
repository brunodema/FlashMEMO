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

              this.alertHeightProblem(contentHeight, parentHeight);
            });
        });
    });
  }

  advanceStudySession() {
    // get modal so we can look for elements within it
    cy.get('.modal-body').then((modal) => {
      // check if there is the answer input element
      if (
        modal.find('input[data-testid="flashcard-study-session-input"]')
          .length > 0
      ) {
        this.checkContentHeightsOnView(); // checks front
        cy.get('input[data-testid="flashcard-study-session-input"]').type('a');
        cy.get('button').contains('Next').trigger('click');
        this.checkContentHeightsOnView(); // checks back
        cy.get('button').contains('Proceed').trigger('click');
        this.advanceStudySession();
      } else if (
        // checks if the close button is on the screen (means that the session is finished)
        modal.find('a[data-testid="study-session-close-btn"]').length > 0
      ) {
        cy.get('a[data-testid="study-session-close-btn"]').trigger('click');
        return;
      } else {
        // proceeds assuming that there is no answer for the flashcard (wrong/again/correct)
        this.checkContentHeightsOnView(); // checks front
        cy.get('button').contains('Next').trigger('click');
        this.checkContentHeightsOnView(); // checks back
        cy.get('button').contains('Correct').trigger('click');
        this.advanceStudySession();
      }
    });
  }

  // the goal in this weird calculation is to avoid failed assertions such as '175.0000001 is bigger than 175'. In this case, there's a 1px margin of error.
  alertHeightProblem(contentHeight: number, parentHeight: number) {
    let value = contentHeight - parentHeight;

    // if (value > 1)
    //   cy.log(
    //     `contentHeight is ${contentHeight} and parentHeight is ${parentHeight}. Mismatch of '${value}'.`
    //   );
    expect(value).to.be.lte(
      1,
      `contentHeight is ${contentHeight} and parentHeight is ${parentHeight}`
    );
  }

  logCurrentURL() {
    cy.url().then((url) => cy.task('log', url));
  }
}

describe('Access deck-detail and find stuff', () => {
  let page: DeckDetailPageObject = new DeckDetailPageObject();

  beforeEach(() => {
    // run these tests as if in a desktop
    // browser with a 720p monitor
    cy.viewport(1280, 720);
    cy.task('log', 'setting viewport to 720p...');
  });

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

  deckJson.forEach((deck, index, list) => {
    it(`Should test flashcard editor for content overflows ('${
      deck.name
    }' ---> ${index + 1} of ${list.length})`, () => {
      // go to the page
      page.visitDeckDetail(deck.deckId);
      // ensure eveything is there
      page.getEverythingToGuaranteeImOnThePage();
      // find flashcard accordion
      page.ensureAccordionIsExpanded();
      // find data-table inside it
      page.getFlashcardDataTable();
      // change visualization to show 25 flashcards per page
      page.selectMaxPageSizeFromFlashcardDataTable();
      // check heights for all flashcards on DataTable
      page.getAllEditbuttonsFromDataTable().each((item) => {
        cy.wrap(item).trigger('click'); // opens modal
        page.checkContentHeightsOnView(); // checks front
        cy.get('button').contains('Next').trigger('click'); // goes to back
        page.checkContentHeightsOnView(); // checks back
        cy.get('button[aria-label="Close"]').trigger('click'); // closes modal
      });
    });

    it(`Should test study session wizard for content overflows ('${
      deck.name
    }' ---> ${index + 1} of ${list.length})`, () => {
      // go to the page
      page.visitDeckDetail(deck.deckId);
      // ensure eveything is there
      page.getEverythingToGuaranteeImOnThePage();
      // open study session modal
      page.getStudySessionButton().trigger('click');
      // start study session
      cy.get('a').contains('Start').should('be.visible').trigger('click');
      // go through the study session until it ends (runs out of flashcards) ---> PS: this function uses recursion, WHICH IS A FUCKING HORNET'S NEST. However, this seems to the accepted approach to deal with Cypress' async nature. I tried using an approach with a dummy array + 'each()', but that didn't work, as the code was having trouble reaching the final page + clicking the 'Close' button.
      page.advanceStudySession();
    });
  });
});

// ¹This is super weird, but apparently since everything is async within Cypress, using normal 'while' will not work at all here. According to some link I found, using tools inside Cypress seem to do the trick, even though it looks scuffed.
