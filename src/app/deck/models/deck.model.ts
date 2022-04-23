export class Deck {
  deckId: string = '';
  ownerId: string = '';
  languageISOCode: string = '';
  name: string = '';
  description: string = '';
  creationDate: number = Date.now();
  lastUpdated: number = Date.now();

  constructor() {}
}
