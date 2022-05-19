import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DeckService } from 'src/app/deck/services/deck.service';
import {
  IFlashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';
import { flashcardLayoutDisplayName } from 'src/app/shared/models/flashcard-models';
import { GenericNotificationService } from 'src/app/shared/services/notification/notification.service';
import { FlashcardReviewStatus } from '../flashcard-answer-buttons/flashcard-answer-buttons.component';
import {
  FlashcardLayoutContentChangeEventArgs,
  FlashcardLayoutSection,
} from '../flashcard-layout/flashcard-layout.component';

export type ProceedStudySessionEventArgs = {
  flashcard: IFlashcard;
  status: FlashcardReviewStatus;
};

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
  host: { class: 'container h-100 d-flex flex-column' },
})
export class FlashcardComponent implements OnChanges {
  // auxiliary variables for Flashcard handling
  isFlashcardFront: boolean = true;
  layoutEnum = FlashcardLayout;
  flashcardReviewStatusEnum = FlashcardReviewStatus;
  // implementation stolen from: https://stackoverflow.com/questions/56036446/typescript-enum-values-as-array
  possibleLayouts = Object.values(FlashcardLayout).filter(
    (f) => typeof f === 'string'
  );
  readonly layoutDisplayNames = flashcardLayoutDisplayName;

  /**
   * Reference to input element where the user can input an answer to the flashcard. Can be accessed to alter its visuals for correct/wrong answer.
   */
  @ViewChild('answerInput', { static: false })
  answerInput: ElementRef<HTMLInputElement>;
  /**
   * Same reference as the one for the HTMLInputElement, but this one is used to manually control the tooltip associated with the component.
   */
  @ViewChild('answerInput', { static: false, read: NgbTooltip })
  answerInputTooltip: NgbTooltip;

  @Input() flashcard: IFlashcard;
  @Input() defaultLanguageISOCode: string;
  /**
   * Determines if all editing tools should be rendered (edit mode) or if the content should be locked for study mode.
   */
  @Input() isStudySession: boolean = false;

  @Output() save: EventEmitter<any> = new EventEmitter();
  /**
   * Informs parent that the current flashcard has finished being reviewed.
   */
  @Output() proceedStudySession: EventEmitter<ProceedStudySessionEventArgs> =
    new EventEmitter();
  /**
   * Relays the study session answer event to the parent component.
   */
  @Output() relayStudySessionAnswer: EventEmitter<FlashcardReviewStatus> =
    new EventEmitter();

  /**
   * Variable used during a study session, to track the answer given by the user.
   */
  userAnswer: string = '';

  constructor(private notificationService: GenericNotificationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isFlashcardFront = true;
    this.userAnswer = '';
  }

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
  }

  flashcardHasAnyContentOn(frontSide: boolean): boolean {
    // this is not checking content appropriatelly... FIX THIS
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
    // check first for empty answer, if applicable
    if (this.isStudySession && this.flashcard.answer.length > 0) {
      if (this.userAnswer.length === 0) {
        this.answerInputTooltip.open(); // shows tooltip saying that input is empty
        return;
      }

      // check if answer is correct
      if (this.IsAnswerCorrect())
        this.answerInput.nativeElement.classList.add('fw-bold', 'text-success');
      else
        this.answerInput.nativeElement.classList.add('fw-bold', 'text-danger');
    } else {
      if (this.checkForEmptyContent()) return;
    }

    this.isFlashcardFront = false;
  }

  IsAnswerCorrect(): boolean {
    return (
      this.flashcard.answer.toLowerCase() === this.userAnswer.toLowerCase()
    );
  }

  saveFlashcard(flashcard: IFlashcard) {
    if (this.checkForEmptyContent()) return;
    this.save.emit();
  }

  checkForEmptyContent(): boolean {
    if (!this.flashcardHasAnyContentOn(this.isFlashcardFront)) {
      this.notificationService.showWarning(
        'Your Flashcard still has empty content on this side! Please fill it with something 😢'
      );
      return true;
    }
    return false;
  }

  proceedToNextFlashcard(status: FlashcardReviewStatus) {
    this.proceedStudySession.emit({ flashcard: this.flashcard, status }); // WIP
  }

  relayStudySessionAnswerDependingOnUserInput() {
    if (this.userAnswer === this.flashcard.answer) {
      this.relayStudySessionAnswer.emit(FlashcardReviewStatus.CORRECT);
    }
    this.relayStudySessionAnswer.emit(FlashcardReviewStatus.WRONG);
  }
}
function checkForEmptyContent() {
  throw new Error('Function not implemented.');
}
