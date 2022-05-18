import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IFlashcard } from 'src/app/shared/models/flashcard-models';
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
  host: { class: 'container d-flex flex-column h-100' },
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

  constructor(private hostElement: ElementRef) {
    this.startImg = new StudySessionImageTools().pickRandomImage();
    this.endImg = new StudySessionImageTools().pickRandomImage();
  }

  startSession() {
    this.currentStep = StudySessionStep.STUDY;
    this.activeFlashcard = this.flashcardList[this.activeFlashcardIndex];
    this.hostElement.nativeElement.classList.remove('flex-column'); // Hell yeah, another fuckin' random line that does magic... if I leave the 'flex-column' directive from the host element of this component (this is declared above), the calculation for the heights of the individual content blocks gets fucked (ex: returns things such as '2px' or '4px'). B U T, if I remove this directive first, it works like usual. FML 🤪
  }

  goToNextFlashcard() {
    console.log('going to next flashcard!');
    ++this.activeFlashcardIndex;
    this.activeFlashcard = this.flashcardList[this.activeFlashcardIndex];
  }

  processFlashcardAnswer(args: FlashcardReviewStatus) {
    console.log('processing flashcard answer...');
    this.goToNextFlashcard();
  }
}
