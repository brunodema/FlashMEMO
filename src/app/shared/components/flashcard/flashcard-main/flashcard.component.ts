import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DeckService } from 'src/app/deck/services/deck.service';
import {
  IFlashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';
import { flashcardLayoutDisplayName } from 'src/app/shared/models/flashcard-models';
import { IDataResponse } from 'src/app/shared/models/http/http-response-types';
import { GenericFlashcardService } from 'src/app/shared/services/flashcard.service';
import {
  FlashcardLayoutContentChangeEventArgs,
  FlashcardLayoutSection,
} from '../flashcard-layout/flashcard-layout.component';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent {
  // auxiliary variables for Flashcard handling
  isFlashcardFront: boolean = true;
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleLayouts = Object.values(FlashcardLayout).filter(
    (f) => typeof f === 'string'
  );
  readonly layoutDisplayNames = flashcardLayoutDisplayName;

  @Input() flashcard: IFlashcard;
  @Input() defaultLanguageISOCode: string;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private flashcardService: GenericFlashcardService) {}

  private updateFlashcardContent(
    isFlashcardFront: boolean,
    args: FlashcardLayoutContentChangeEventArgs
  ) {
    switch (args.sectionChanged) {
      case FlashcardLayoutSection.FIRST:
        if (this.isFlashcardFront) this.flashcard.content1 = args.contentValue;
        else this.flashcard.content4 = args.contentValue;
        break;
      case FlashcardLayoutSection.SECOND:
        if (this.isFlashcardFront) this.flashcard.content2 = args.contentValue;
        else this.flashcard.content5 = args.contentValue;
        break;
      case FlashcardLayoutSection.THIRD:
        if (this.isFlashcardFront) this.flashcard.content3 = args.contentValue;
        else this.flashcard.content6 = args.contentValue;
        break;
      default:
        throw new Error("The provided 'FlashcardLayoutSection' does not exist");
    }
  }

  onContentChange(args: FlashcardLayoutContentChangeEventArgs) {
    this.updateFlashcardContent(this.isFlashcardFront, args);
    this.flashcard.lastUpdated = new Date().toISOString();
    console.log(
      'the flashcard was changed from the inside! wow: ',
      this.flashcard
    );
  }

  flashcardHasAnyContentOn(frontSide: boolean): boolean {
    if (frontSide)
      return (
        this.flashcard.content1.trim().length > 0 ||
        this.flashcard.content2.trim().length > 0 ||
        this.flashcard.content3.trim().length > 0
      );
    return (
      this.flashcard.content4.trim().length > 0 ||
      this.flashcard.content5.trim().length > 0 ||
      this.flashcard.content6.trim().length > 0
    );
  }

  showFlashcardBack() {
    if (!this.flashcardHasAnyContentOn(this.isFlashcardFront)) {
      console.log(
        'Your Flashcard has no content on this side! Please fill it with something 😢'
      );
      return;
    }
    this.isFlashcardFront = false;
  }

  saveFlashcard(flashcard: IFlashcard) {
    if (!this.flashcardHasAnyContentOn(this.isFlashcardFront)) {
      console.log(
        'Your Flashcard has no content on this side! Please fill it with something 😢'
      );
      return;
    }
    let response: Observable<IDataResponse<string>>;
    if (flashcard.flashcardId === '')
      response = this.flashcardService.create(flashcard);
    else
      response = this.flashcardService.update(flashcard.flashcardId, flashcard);

    response.subscribe(
      (r) => {
        if (r.status === '200') console.log(r.message);
        this.save.emit();
      },
      (error) => console.log('an error ocurred:' + error)
    );
  }
}
