import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsRepositoryResolverService } from 'src/app/shared/resolvers/generic-repository.resolver';
import { NewsCreateComponent } from '../components/create/news-create.component';
import { NewsDetailComponent } from '../components/news-detail/news-detail.component';
import { NewsComponent } from '../components/news-list/news-list.component';

const routes: Routes = [
  { path: 'list', component: NewsComponent },
  { path: 'create', component: NewsCreateComponent },
    {
    path: ':id',
    component: NewsDetailComponent,
    resolve: { deck: NewsRepositoryResolverService },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
