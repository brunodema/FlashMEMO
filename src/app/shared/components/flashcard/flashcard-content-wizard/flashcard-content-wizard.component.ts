import { Component, OnInit } from '@angular/core';

/* TIL about the 'host'property

Apparently we can use this property to set things related to the wrapper element that Angular will add to the DOM after compiling the app. 
In this case, I add all those classes so the layout of the rows/columns is the way I want. */

@Component({
  selector: 'app-flashcard-content-wizard',
  host: { class: 'd-flex flex-fill align-items-center justify-content-center' },
  templateUrl: './flashcard-content-wizard.component.html',
  styleUrls: ['./flashcard-content-wizard.component.css'],
})
export class FlashcardContentWizardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
