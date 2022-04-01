import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { DeckListComponent } from './deck-list/deck-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  { path: 'list', component: DeckListComponent },
  { path: ':id', component: DeckDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeckRoutingModule {}
