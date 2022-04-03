export interface Flashcard {
  frontSide: FlashcardSide;
  backside: FlashcardSide;
}

export enum FlashcardOrientation {
  VERTICAL,
  HORIZONTAL,
}

export interface FlashcardSide {
  orientation: FlashcardOrientation;
  imageLink: string;
}
