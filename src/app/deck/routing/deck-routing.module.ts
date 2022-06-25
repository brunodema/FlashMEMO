import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashMEMOAuthGuard } from 'src/app/shared/guards/auth.guard';
import {
  DeckRepositoryResolverService,
  GenericRepositoryResolverService,
} from 'src/app/shared/resolvers/generic-repository.resolver';
import { DeckDetailComponent } from '../components/deck-detail/deck-detail.component';
import { DeckListComponent } from '../components/deck-list/deck-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: DeckListComponent,
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: 'create',
    component: DeckDetailComponent,
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: ':id',
    component: DeckDetailComponent,
    resolve: {
      deck: DeckRepositoryResolverService,
      canActivate: [FlashMEMOAuthGuard],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeckRoutingModule {}
