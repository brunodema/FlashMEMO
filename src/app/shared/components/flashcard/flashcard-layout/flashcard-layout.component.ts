import { Component, Input, OnInit } from '@angular/core';
import {
  IFlashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';

@Component({
  selector: 'app-flashcard-layout',
  host: {
    class: 'h-100',
  },
  templateUrl: './flashcard-layout.component.html',
  styleUrls: ['./flashcard-layout.component.css'],
})
export class FlashcardLayoutComponent implements OnInit {
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;

  @Input() flashcard: IFlashcard;
  @Input() isFlashcardFront: boolean;

  constructor() {}

  ngOnInit(): void {}
}
