export class Deck {
  deckId: string = '';
  ownerId: string = '';
  languageISOCode: string = '';
  name: string = '';
  description: string = '';
  creationDate: string = new Date().toISOString();
  lastUpdated: string = new Date().toISOString();
  lastStudySession?: string = undefined;

  public constructor(init?: Partial<Deck>) {
    Object.assign(this, init);
  }
}

/**
 * Model that represents the data shown in the 'list' view, which includes the number of total and due flashcards.
 */
export class ExtendedDeckInfoDTO extends Deck {
  flashcardCount: number;
  dueFlashcardCount: number;
}
