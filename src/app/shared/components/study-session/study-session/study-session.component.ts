import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IFlashcard } from 'src/app/shared/models/flashcard-models';
import { GenericFlashcardService } from 'src/app/shared/services/flashcard.service';
import { FlashcardReviewStatus } from '../../flashcard/flashcard-answer-buttons/flashcard-answer-buttons.component';

export enum StudySessionStep {
  START,
  STUDY,
  END,
}

export class StudySessionImageTools {
  studySessionImages = [
    'assets\\study_session\\study-session-1.jpg',
    'assets\\study_session\\study-session-2.jpg',
    'assets\\study_session\\study-session-3.jpg',
  ];

  pickRandomImage(): string {
    return this.studySessionImages[
      Math.floor(Math.random() * this.studySessionImages.length)
    ];
  }
}

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.css'],
})
export class StudySessionComponent {
  /**
   * Simply holds a reference to the Enum type (otherwise HTML bindings for the type do not work).
   */
  StudySessionStepEnum = StudySessionStep;
  /**
   * Represents the current stage of the Study Session. Ex: 'START' represents the initial screen, allowing the user to either start or cancel the session.
   */
  currentStep: StudySessionStep = StudySessionStep.START;

  /**
   * Path to image shown at the 'START' screen.
   */
  startImg: string;
  /**
   * Path to image shown at the 'END' screen.
   */
  endImg: string;

  /**
   * Informs the parent that the user wants to abort the ONGOIG study session.
   */
  @Output()
  abortSession: EventEmitter<void> = new EventEmitter();
  /**
   * Informs the parent that the user wants to close the component BEFORE/AFTER the study session.
   */
  @Output()
  stopSession: EventEmitter<void> = new EventEmitter();

  /**
   * Due flashcards to be reviewed during the session.
   */
  @Input()
  flashcardList: Array<IFlashcard>;
  /**
   * Flashcard being currently reviewed.
   */
  activeFlashcard: IFlashcard;
  /**
   * Index of active flashcard, so I can control the flow of reviewed flashcards.
   */
  activeFlashcardIndex: number = 0;
  /**
   * Number of correctly guessed flashcards.
   */
  correctCount: number = 0;
  /**
   * Number of flashcards set to remain at the current level.
   */
  againCount: number = 0;
  /**
   * Number of incorrectly guessed flashcards.
   */
  wrongCount: number = 0;

  constructor(
    private hostElement: ElementRef,
    private flashcardService: GenericFlashcardService
  ) {
    this.startImg = new StudySessionImageTools().pickRandomImage();
    this.endImg = new StudySessionImageTools().pickRandomImage();
  }

  startSession() {
    this.currentStep = StudySessionStep.STUDY;
    this.activeFlashcard = this.flashcardList[this.activeFlashcardIndex];
    // this.hostElement.nativeElement.classList.remove('flex-column'); // Hell yeah, another fuckin' random line that does magic... if I leave the 'flex-column' directive from the host element of this component (this is declared above), the calculation for the heights of the individual content blocks gets fucked (ex: returns things such as '2px' or '4px'). B U T, if I remove this directive first, it works like usual. FML 🤪
  }

  goToNextFlashcard() {
    ++this.activeFlashcardIndex;
    if (this.activeFlashcardIndex >= this.flashcardList.length) {
      return this.triggerEndScreen();
    }
    this.activeFlashcard = this.flashcardList[this.activeFlashcardIndex];
  }

  /**
   * Individual function just in case I need to add some more complex logic to this step in the future.
   */
  triggerEndScreen() {
    this.currentStep = StudySessionStep.END;
    // this.hostElement.nativeElement.classList.add('flex-column'); // gotta add the magical class back :)
  }

  processFlashcardAnswer(args: FlashcardReviewStatus) {
    switch (args) {
      case FlashcardReviewStatus.CORRECT:
        let newLevel = this.activeFlashcard.level + 1;
        this.flashcardService.advanceToNextLevel(
          this.activeFlashcard,
          newLevel
        );
        ++this.correctCount;
        break;

      case FlashcardReviewStatus.AGAIN:
        this.flashcardService.advanceToNextLevel(
          this.activeFlashcard,
          this.activeFlashcard.level
        );
        ++this.againCount;
        break;

      case FlashcardReviewStatus.WRONG:
        this.flashcardService.advanceToNextLevel(this.activeFlashcard, 0);
        ++this.wrongCount;
        break;

      default:
        throw Error('Invalid FlashcardReviewStatus specified.');
    }

    this.flashcardService
      .update(this.activeFlashcard.flashcardId, this.activeFlashcard)
      .subscribe(() => {
        this.goToNextFlashcard();
      });
  }
}
