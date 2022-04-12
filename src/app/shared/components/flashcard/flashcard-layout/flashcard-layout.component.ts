import { Component, Input, OnInit } from '@angular/core';
import { FlashcardLayout } from 'src/app/shared/models/flashcard';

@Component({
  selector: 'app-flashcard-layout',
  host: {
    class: 'h-100',
  },
  templateUrl: './flashcard-layout.component.html',
  styleUrls: ['./flashcard-layout.component.css'],
})
export class FlashcardLayoutComponent implements OnInit {
  @Input() layout: FlashcardLayout = FlashcardLayout.SINGLE_BLOCK;
  layoutEnum: typeof FlashcardLayout = FlashcardLayout;

  constructor() {}

  ngOnInit(): void {}
}
