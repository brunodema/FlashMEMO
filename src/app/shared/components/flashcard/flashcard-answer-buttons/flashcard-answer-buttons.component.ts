import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export enum FlashcardReviewStatus {
  CORRECT,
  AGAIN,
  WRONG,
}

@Component({
  selector: 'app-flashcard-answer-buttons',
  templateUrl: './flashcard-answer-buttons.component.html',
  styleUrls: ['./flashcard-answer-buttons.component.css'],
  host: { class: 'd-flex flex-row w-100 h-100 justify-content-around' },
})
export class FlashcardAnswerButtonsComponent implements OnInit {
  @Output()
  answerClick: EventEmitter<FlashcardReviewStatus> = new EventEmitter();
  flashcardReviewStatusEnum = FlashcardReviewStatus;

  constructor() {}

  ngOnInit(): void {}
}
