import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { DeckRoutingModule } from './deck-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent],
  imports: [CommonModule, DeckRoutingModule, SharedModule],
})
export class DeckModule {}
