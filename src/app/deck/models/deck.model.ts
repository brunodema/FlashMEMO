export class Deck {
  deckId: string = '';
  ownerId: string = '';
  languageISOCode: string = '';
  name: string = '';
  description: string = '';
  creationDate: string = new Date().toISOString();
  lastUpdated: string = new Date().toISOString();

  public constructor(init?: Partial<Deck>) {
    Object.assign(this, init);
  }
}
