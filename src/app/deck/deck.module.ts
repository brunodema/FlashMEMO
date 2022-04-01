import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { DeckRoutingModule } from './deck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent],
  imports: [CommonModule, NgbModule, DeckRoutingModule, SharedModule],
})
export class DeckModule {}
