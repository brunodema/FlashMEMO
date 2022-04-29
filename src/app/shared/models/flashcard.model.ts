// This will be eventually moved to its own module. I'll leave this here at the root folder for now.

export interface IFlashcard {
  flashcardId: string;
  deckId: string;
  level: number;
  contentLayout: string;
  content1: string;
  content2: string;
  content3: string;
  creationDate: string;
  lastUpdated: string;
  dueDate: string;
  answer: string;
}

export class Flashcard implements IFlashcard {
  flashcardId: string = '';
  deckId: string = '';
  level: number = 0;
  contentLayout: string = FlashcardLayout.SINGLE_BLOCK;
  content1: string = '';
  content2: string = '';
  content3: string = '';
  creationDate: string = new Date().toISOString();
  lastUpdated: string = new Date().toISOString();
  dueDate: string = new Date().toISOString();
  answer: string = '';
}

export enum FlashcardLayout {
  SINGLE_BLOCK = 'SINGLE_BLOCK',
  VERTICAL_SPLIT = 'VERTICAL_SPLIT',
  TRIPLE_BLOCK = 'TRIPLE_BLOCK',
  HORIZONTAL_SPLIT = 'HORIZONTAL_SPLIT',
  FULL_CARD = 'FULL_CARD',
}
