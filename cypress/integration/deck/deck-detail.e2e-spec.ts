// used this to setup tests: https://testing-angular.com/introduction/#introduction
// shout-outs to protractor, that got deprecated by Angular itself, and cost 1-2 days of my life

import deckJson from 'src/assets/test_assets/Decks.json';

class DeckDetailPageObject {
  visitDeckDetail(id?: string) {
    if (id) cy.visit(`deck/${id}`);
    else cy.visit('deck/create');
  }

  getSaveDeckButton() {
    cy.get('data-testid="save-deck-btn"');
  }

  getStudySessionButton() {
    cy.get('data-testid="study-session-btn"');
  }

  logCurrentURL() {
    cy.url().then((url) => cy.task('log', url));
  }
}

describe('Access deck-detail and find stuff', () => {
  let page: DeckDetailPageObject = new DeckDetailPageObject();

  it('Goes to the fucking page (via "create")', () => {
    page.visitDeckDetail();
  });

  it('Goes to the fucking page (via "deckId")', () => {
    page.visitDeckDetail(deckJson[0].deckId);
  });

  it('Goes to the fucking page (with wrong id?)', () => {
    page.visitDeckDetail('shenanigans');
    cy.url().should('contain', 'home');
    cy.url().should('not.contain', 'deck');

    page.logCurrentURL()
  });
});
