// This will be eventually moved to its own module. I'll leave this here at the root folder for now.

export interface Flashcard {
  frontSide: FlashcardSide;
  backside: FlashcardSide;
}

export enum FlashcardLayout {
  SINGLE_BLOCK = 'Single Block',
  VERTICAL_SPLIT = 'Vertical Split',
  TRIPLE_BLOCK = 'Triple Stacked',
  HORIZONTAL_SPLIT = 'Horizontal Split',
  FULL_CARD = 'Card Layout',
}

export interface FlashcardSide {
  layout: FlashcardLayout;
  imageLink: string;
}
