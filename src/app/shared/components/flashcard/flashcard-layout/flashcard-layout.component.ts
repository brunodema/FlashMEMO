import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IFlashcard,
  FlashcardLayout,
} from 'src/app/shared/models/flashcard-models';
import { FlashcardContentOptionsBlockContentSaveEventArgs } from '../flashcard-content-options-block/flashcard-content-options-block.component';

/**
 * This class is used to show which section of a flashcard side was changed. For instance, in a SINGLE_BLOCK flashcard, only the FIRST section will have content. I know that this is somewhat of janky design, but who cares - well, I do :(
 */
export enum FlashcardLayoutSection {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

export class FlashcardLayoutContentChangeEventArgs {
  contentValue: string;
  sectionChanged: FlashcardLayoutSection;
}

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
  layoutSectionEnum: typeof FlashcardLayoutSection = FlashcardLayoutSection;

  @Input() layout: string;
  @Input() contents: string[];
  @Input() defaultLanguageISOCode: string;
  /**
   * Passes value to internal components to alter content rendering if a study session is taking place.
   */
  @Input() isStudySession: boolean = false;

  @Output() contentChange: EventEmitter<FlashcardLayoutContentChangeEventArgs> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  relayContentChange(
    args: FlashcardContentOptionsBlockContentSaveEventArgs,
    sectionChanged: FlashcardLayoutSection
  ) {
    this.contentChange.emit({
      contentValue: args.contentValue,
      sectionChanged: sectionChanged,
    });
  }
}
