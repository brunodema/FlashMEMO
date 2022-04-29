import { Component, OnInit } from '@angular/core';
import { FlashcardLayout } from 'src/app/shared/models/flashcard';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent implements OnInit {
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleLayouts = Object.values(FlashcardLayout).filter(
    (f) => typeof f === 'string'
  );
  flashcardLayout: FlashcardLayout = FlashcardLayout.SINGLE_BLOCK;

  constructor() {}

  ngOnInit(): void {}
}
