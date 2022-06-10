import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashMEMOAuthGuard } from 'src/app/shared/guards/auth.guard';
import { NewsRepositoryResolverService } from 'src/app/shared/resolvers/generic-repository.resolver';
import { NewsDetailComponent } from '../components/news-detail/news-detail.component';
import { NewsComponent } from '../components/news-list/news-list.component';

const routes: Routes = [
  { path: 'list', component: NewsComponent },
  {
    path: 'create',
    component: NewsDetailComponent,
    canActivate: [FlashMEMOAuthGuard],
  },
  {
    path: ':id',
    component: NewsDetailComponent,
    resolve: { news: NewsRepositoryResolverService },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
