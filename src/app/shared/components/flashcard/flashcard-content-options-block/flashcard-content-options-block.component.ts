import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* TIL about the 'host'property

Apparently we can use this property to set things related to the wrapper element that Angular will add to the DOM after compiling the app. 
In this case, I add all those classes so the layout of the rows/columns is the way I want. */

@Component({
  selector: 'app-flashcard-content-options-block',
  host: { class: 'd-flex flex-fill align-items-center justify-content-center' },
  templateUrl: './flashcard-content-options-block.component.html',
  styleUrls: ['./flashcard-content-options-block.component.css'],
})
export class FlashcardContentOptionsBlock implements OnInit {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
}
