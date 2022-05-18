import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFlashcard } from 'src/app/shared/models/flashcard-models';

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
  host: { class: 'd-flex flex-column h-100' },
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
   * Flashcard being currently reviewed
   */
  activeFlashcard: IFlashcard;

  constructor() {
    this.startImg = new StudySessionImageTools().pickRandomImage();
    this.endImg = new StudySessionImageTools().pickRandomImage();
  }

  startSession() {
    this.currentStep = StudySessionStep.STUDY;
  }
}
