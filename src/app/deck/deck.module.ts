import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent],
  imports: [CommonModule],
})
export class DeckModule {}
