export class Deck {
  deckId: string = '';
  ownerId: string = '';
  languageISOCode: string = '';
  name: string = '';
  description: string = '';
  creationDate: string = Date.now().toString();
  lastUpdated: string = Date.now().toString();

  constructor() {}
}
