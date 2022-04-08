import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckListComponent } from './components/deck-list/deck-list.component';
import { DeckDetailComponent } from './components/deck-detail/deck-detail.component';
import { DeckRoutingModule } from './routing/deck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeckListComponent, DeckDetailComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    DeckRoutingModule,
    SharedModule,
  ],
})
export class DeckModule {}
