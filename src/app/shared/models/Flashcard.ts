export interface Flashcard {
  frontSide: FlashcardSide;
  backside: FlashcardSide;
}

export enum FlashcardLayout {
  SINGLE_BLOCK,
  VERTICAL_SPLIT,
  TRIPLE_BLOCK,
  HORIZONTAL_SPLIT,
  FULL_CARD,
}

export interface FlashcardSide {
  layout: FlashcardLayout;
  imageLink: string;
}
