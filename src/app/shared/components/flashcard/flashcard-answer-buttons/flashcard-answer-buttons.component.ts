import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flashcard-answer-buttons',
  templateUrl: './flashcard-answer-buttons.component.html',
  styleUrls: ['./flashcard-answer-buttons.component.css'],
  host: { class: 'd-flex flex-row h-100 justify-content-around' },
})
export class FlashcardAnswerButtonsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
