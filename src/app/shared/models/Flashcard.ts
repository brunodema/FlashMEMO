// This will be eventually moved to its own module. I'll leave this here at the root folder for now.

export interface Flashcard {
  flashcardId: string;
  deckId: string;
  level: number;
  contentLayout: number;
  content1: string;
  content2: string;
  content3: string;
  creationDate: string;
  lastUpdated: string;
  dueDate: string;
  answer: string;
}

export enum FlashcardLayout {
  SINGLE_BLOCK = 'Single Block',
  VERTICAL_SPLIT = 'Vertical Split',
  TRIPLE_BLOCK = 'Triple Stacked',
  HORIZONTAL_SPLIT = 'Horizontal Split',
  FULL_CARD = 'Card Layout',
}
