import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailComponent } from '../components/deck-detail/deck-detail.component';
import { DeckListComponent } from '../components/deck-list/deck-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: DeckListComponent },
  { path: ':id', component: DeckDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeckRoutingModule {}
