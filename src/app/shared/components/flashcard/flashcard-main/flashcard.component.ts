import { AfterViewInit, Component, Input } from '@angular/core';
import {
  IFlashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';
import { flashcardLayoutDisplayName } from 'src/app/shared/models/flashcard-models';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent implements AfterViewInit {
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleLayouts = Object.values(FlashcardLayout).filter(
    (f) => typeof f === 'string'
  );
  readonly layoutDisplayNames = flashcardLayoutDisplayName;

  @Input() flashcard: IFlashcard;

  constructor() {}
  ngAfterViewInit(): void {
    console.log(this.flashcard);
  }
}
